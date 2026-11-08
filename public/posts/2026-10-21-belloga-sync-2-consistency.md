---
tags: [Project, Backend, Infra]
---

# Belloga 동기화 (2) 쓰기 판정, 사용자별 직렬화, 그리고 GCS와 Postgres의 일관성

[1편](/blog/2026-10-21-belloga-sync-1-design)에서 계획 문서의 내용은 GCS에 해시 주소로, Postgres에는 문서마다 "지금 가리키는 해시" 하나만 두기로 했습니다. 이번 글은 그 포인터를 바꾸는 쓰기 API를 다룹니다. 주제는 세 가지입니다. 다른 기기가 먼저 고친 내용을 덮어쓰지 않으려면 어떻게 판정하는지, 같은 사용자의 요청이 겹치면 어떻게 순서를 세우는지, 하나의 트랜잭션으로 묶을 수 없는 GCS와 Postgres를 어떻게 어긋나지 않게 하는지입니다.

---

## 1. 쓰기 판정: 기준 해시 하나로 세 가지 결과

앱은 파일마다 해시 두 개를 보냅니다. `base`는 이 기기가 그 계정으로 마지막으로 서버와 맞춘 해시이고, `hash`는 새 내용의 해시(지움이면 NULL)입니다. 서버의 현재 해시를 `current`라 하면, 판정은 이 세 값만 보는 순수 함수 하나입니다.

```ts
export function judgeWrite(
  current: string | null,
  base: string | null,
  next: string | null,
): WriteStatus {
  if (next === current) return 'unchanged';
  if (base === current) return 'applied';
  return 'conflict';
}
```

세 줄이지만 조건을 보는 순서에 결정이 들어 있습니다.

- **`next === current`를 가장 먼저 봅니다.** 응답이 유실되면 앱은 같은 쓰기를 다시 보냅니다. 첫 요청은 이미 반영되어 `current`가 `next`와 같아졌고, 앱의 `base`는 아직 옛 값입니다. 이때 `base === current`를 먼저 보면 같은 쓰기를 두 번 보냈을 뿐인데 `conflict`가 됩니다. 순서를 바꿔 두면 `unchanged`가 되어 **쓰기가 멱등**해집니다.
- **`base === current`면 반영합니다.** 기기가 마지막으로 본 상태에서 서버가 바뀌지 않았다는 뜻입니다. 새 파일(`current`와 `base`가 모두 NULL)과 지움(`next`가 NULL)도 같은 규칙으로 처리되어 따로 분기할 필요가 없습니다.
- **나머지는 `conflict`입니다.** 서버는 어느 쪽도 고치지 않고 현재 해시만 돌려주고, 푸는 것은 앱의 몫입니다(1편).

```ts
expect(judgeWrite(A, B, A)).toBe('unchanged');         // 이미 같은 내용
expect(judgeWrite(null, null, null)).toBe('unchanged'); // 없는 파일 지움
expect(judgeWrite(A, A, B)).toBe('applied');           // 기준이 맞는 수정
expect(judgeWrite(null, null, A)).toBe('applied');     // 새 파일
expect(judgeWrite(A, A, null)).toBe('applied');        // 지움
expect(judgeWrite(A, B, C)).toBe('conflict');          // 서로 다르게 바뀜
expect(judgeWrite(A, null, B)).toBe('conflict');       // 처음 켠 기기가 다른 내용을 올림
```

한 요청에 파일을 최대 50개 담을 수 있고, 결과는 파일마다 따로 나옵니다.

---

## 2. 사용자별 직렬화

### 읽고, 비교하고, 쓰는 사이의 틈

판정은 "현재 해시를 읽고, 비교하고, 쓰는" 순서입니다. 같은 사용자의 두 기기가 같은 파일을 거의 동시에 올리면 이렇게 됩니다.

```
기기 1: current = A 읽음 → base A와 같음 → applied → B로 씀
기기 2: current = A 읽음 → base A와 같음 → applied → C로 씀
```

둘 다 `applied`를 받고, 나중에 쓴 C가 B를 조용히 덮습니다. 판정부터 쓰기까지를 한 번에 하나씩만 실행해야 합니다.

### 사용자별 행을 잠근다

쓰기 트랜잭션을 시작하면 먼저 그 사용자의 `plan_sync_states` 행을 잠그고, 판정, 객체 쓰기, 행 쓰기를 모두 그 잠금 안에서 처리합니다.

```ts
return this.db.getPlansClient().$transaction(
  async (tx) => {
    const [state] = await tx.$queryRaw<{ revision: bigint }[]>`
      INSERT INTO "plan_sync_states" ("userId", "revision")
      VALUES (${userId}::uuid, 0)
      ON CONFLICT ("userId") DO UPDATE SET "revision" = "plan_sync_states"."revision"
      RETURNING "revision"`;
    return fn(new PrismaLockedPlans(tx, userId, Number(state.revision)));
  },
  { timeout: LOCK_TIMEOUT_MS },
);
```

- **`SELECT ... FOR UPDATE`가 아닌 이유**: 처음 동기화하는 사용자는 아직 행이 없고, 없는 행은 잠글 수 없습니다. 처음 쓰는 두 요청이 동시에 오면 둘 다 잠금 없이 지나갑니다. `INSERT ... ON CONFLICT DO UPDATE`는 행이 없으면 만들고, 있으면 그 행을 갱신하면서 잠급니다. 값은 그대로 두고 잠금만 얻는 용도입니다.
- **사용자 단위인 이유**: 파일 단위로 잠그면 동시성은 높지만, 한 요청이 여러 파일을 다루므로 잠금 순서와 교착을 신경 써야 합니다. 한 사람이 기기를 바꿔 쓰는 용도라 한 사용자의 쓰기가 몰리는 일이 드물고, 사용자 단위면 서로 다른 사용자는 서로를 막지 않습니다.

### 잠금이 준 덤: revision 순서가 곧 커밋 순서

다른 기기는 `GET /plans/changes?since=`로 변경을 받아 갑니다. 이 커서가 행을 건너뛰지 않으려면 revision 순서와 커밋 순서가 같아야 합니다. 번호를 DB 시퀀스로 붙였다면 번호 11을 받은 트랜잭션이 10보다 먼저 커밋될 수 있고, 그 사이 다른 기기가 `since=11`까지 받아 가면 나중에 커밋된 10은 영영 보이지 않습니다.

여기서는 revision을 잠금 안에서 직접 붙입니다.

```ts
let revision = locked.revision;
const changes = applied.map(({ write }) => ({
  path: write.path,
  hash: write.hash,
  revision: ++revision,
  // ...
}));
```

같은 사용자의 쓰기는 직렬화되어 있으므로, 앞 트랜잭션이 커밋되기 전에는 다음 트랜잭션이 번호를 받을 수 없습니다. 직렬화를 위해 넣은 잠금이 커서의 정확성까지 보장해 준 셈입니다. 변경 목록은 `limit + 1`개를 읽어 다음 페이지가 있는지를 쿼리 한 번으로 알고, `since = 0`이면 tombstone을 빼고 살아 있는 파일만 돌려줍니다.

### 잠금 대기가 다른 기능을 막지 않게

잠금을 기다리는 쿼리는 앞 요청의 GCS 쓰기가 끝날 때까지 걸려서 기본 타임아웃 3초로는 부족했습니다. 그렇다고 기본 풀의 타임아웃을 늘리면 잠금을 기다리는 쿼리가 커넥션을 오래 붙잡아 검색이나 인증 쿼리가 막힐 수 있습니다. 그래서 plans 쿼리만 쓰는 풀을 따로 두고 그 풀과 트랜잭션의 타임아웃만 30초로 맞췄습니다(bulkhead).

```ts
getClient(): PrismaClient {
  this.client ??= this.createClient(3000);
  return this.client;
}

getPlansClient(): PrismaClient {
  this.plansClient ??= this.createClient(30000);
  return this.plansClient;
}
```

---

## 3. 트랜잭션으로 묶을 수 없는 GCS와 Postgres

위 트랜잭션은 Postgres의 것이라 GCS 쓰기와 지우기는 그 안에 들어가지 않습니다. 두 저장소가 어긋나는 방향은 두 가지입니다.

| 어긋남 | 결과 | 허용 여부 |
| ---- | ---- | ---- |
| 행이 가리키는 객체가 GCS에 없음 | 다른 기기가 내용을 받지 못함. **문서 유실** | 절대 안 됨 |
| 어느 행도 가리키지 않는 객체가 GCS에 남음 | 저장 공간 낭비(고아 객체) | 받아들임 |

분산 트랜잭션 없이 두 쪽을 항상 맞출 수는 없습니다. 그래서 목표를 "항상 일치"가 아니라 **"어긋나더라도 고아 객체 쪽으로만 어긋나게"**로 잡고, 다섯 규칙을 정했습니다.

### 규칙 1. 객체를 먼저 쓰고, 행은 그다음에 쓴다

순서를 반대로 하면 행을 쓴 뒤 객체 쓰기가 실패했을 때 행이 없는 객체를 가리킵니다. 객체를 먼저 쓰면, 객체 쓰기가 실패해도 예외가 트랜잭션을 롤백해 DB는 바뀌지 않습니다(응답은 `503 storage_unavailable`). 객체를 쓴 뒤 행 쓰기가 실패하면 객체가 고아로 남는데, 이는 허용한 방향입니다.

### 규칙 2. 지울 객체는 커밋 뒤에 지운다

쓰기로 포인터가 바뀌면 이전 해시의 객체는 쓸모가 없어질 수 있습니다. 이 삭제를 트랜잭션 안에서 하면, 지운 뒤 롤백되었을 때 행은 옛 해시를 가리키는데 객체는 이미 없습니다. 그래서 지울 목록만 트랜잭션 안에서 정하고 실제 삭제는 커밋 뒤에 합니다.

```ts
const { results, stale } = await this.store.withUserLock(userId, async (locked) => {
  // 판정, 객체 쓰기, 행 쓰기
  const unreferenced = await locked.unreferenced(previousHashes);
  return { results, stale: await this.readGenerations(userId, unreferenced) };
});
await this.deleteStale(userId, stale); // 커밋 뒤
```

### 규칙 3. 지울 때 GCS 세대(generation) 조건을 건다

커밋 뒤에 지우면 새로운 틈이 생깁니다. 커밋과 삭제 사이에는 잠금이 풀려 있어서, 다른 요청이 같은 내용을 다시 참조할 수 있습니다.

```
요청 1: 경로 a를 X → Y로 바꿈. X는 이제 참조 없음 → 커밋
요청 2: 경로 b를 내용 X로 저장 (객체 X 다시 씀, 행이 X를 가리킴) → 커밋
요청 1: 커밋 뒤 X 삭제
→ 경로 b의 행이 가리키는 X가 사라짐
```

해시가 같으면 객체 키도 같아서 이름만으로는 "지우려던 X"와 "방금 다시 저장된 X"를 구분할 수 없습니다. 여기에 GCS의 세대 번호를 썼습니다. GCS는 객체를 쓸 때마다 세대를 새로 매기고, 삭제에 `ifGenerationMatch`를 걸면 세대가 다를 때 `412`로 거절합니다. 잠금 안에서 지울 객체의 세대를 읽어 두고, 커밋 뒤에 그 세대를 조건으로 지웁니다.

```ts
// 세대가 바뀌었으면(412) 다른 요청이 다시 참조한 것이고, 없으면(404) 이미 지워진 것이라 둘 다 넘어간다.
async deleteIfGeneration(userId: string, hash: string, generation: string) {
  try {
    await this.file(userId, hash).delete({ ifGenerationMatch: generation });
  } catch (error) {
    const code = errorCode(error);
    if (code === 412 || code === 404) return;
    throw error;
  }
}
```

세대를 잠금 안에서 읽는 것도 중요합니다. 잠금 밖에서 읽으면 이미 다시 저장된 객체의 새 세대를 읽어, 살아 있는 객체를 조건에 맞게 지워 버릴 수 있습니다.

### 규칙 4. 같은 내용의 객체도 쓸 때마다 다시 쓴다

내용 주소 저장이라면 "이미 있는 해시면 쓰지 않는다"가 자연스러운 최적화입니다. 그런데 그러면 규칙 3이 무너집니다. 위 시나리오에서 요청 2가 쓰기를 건너뛰면 세대가 그대로라서 요청 1의 조건부 삭제가 성공합니다. 파일 하나가 1MB 이하라 다시 쓰는 비용은 작아서, 쓰기 한 번을 아끼는 대신 삭제 경쟁을 막는 쪽을 골랐습니다.

### 규칙 5. 지우기가 실패해도 쓰기 응답은 바뀌지 않는다

세대를 읽지 못한 객체는 지우지 않고 남기고, 조건부 삭제가 실패해도 로그만 남깁니다. 이 시점에 사용자의 쓰기는 이미 커밋되었고, 지우기 실패는 고아 객체를 남길 뿐 데이터를 잃지 않기 때문입니다.

### 다섯 규칙을 한눈에

| 실패 지점 | DB | GCS | 결과 |
| ---- | ---- | ---- | ---- |
| 객체 쓰기 | 롤백 | 일부만 써졌을 수 있음 | 503, 고아 객체 가능 |
| 행 쓰기 | 롤백 | 새 객체 남음 | 고아 객체 |
| 커밋과 삭제 사이에 같은 내용 재저장 | 커밋됨 | 세대 바뀜 | 삭제가 412로 거절, 문서 안전 |
| 세대 읽기, 삭제 | 커밋됨 | 옛 객체 남음 | 응답은 성공, 고아 객체 |

어느 실패든 결과는 "아무 일도 없었음" 아니면 "고아 객체"이고, "행이 없는 객체를 가리킴"으로 끝나는 칸은 없습니다. GCS 요청은 `p-limit`으로 동시 8개로 제한해, 50개 묶음이 GCS를 한꺼번에 몰아 쓰지 않게 했습니다.

---

## 한계와 검증하지 못한 것

- **사용자 잠금을 쥔 채 GCS에 씁니다.** 한 사용자의 쓰기 처리량이 GCS 지연에 묶입니다. 여러 사람이 같은 계획을 고치게 되면 바꿔야 할 부분입니다.
- **잠금 안에서 행을 하나씩 upsert합니다.** 50개 묶음이면 잠금 시간 안에 DB 왕복이 50번 생깁니다. 다중 행 쓰기 한 번으로 줄일 수 있습니다.
- **고아 객체를 정리하는 정책이 아직 없습니다.** 행이 가리키지 않는 객체를 주기적으로 훑어 지우는 작업이 후속 과제이고, 이때도 같은 세대 조건이 필요합니다.
- **실제 인프라 위의 동시성은 자동으로 검증하지 못했습니다.** e2e는 Postgres와 GCS를 메모리 구현으로 바꾸고 잠금을 "요청을 차례로 실행"하는 것으로 흉내 냅니다. 같은 사용자의 동시 쓰기에서 한쪽만 `applied`인지, 객체 삭제가 실패해도 응답이 성공인지는 시나리오로 확인했습니다. 하지만 실제 Postgres의 행 잠금과 GCS의 세대 조건이 동시 요청에서 동작하는지는 이 테스트로 확인하지 못합니다.

---

## 정리

- 판정은 `current`, `base`, `next` 세 해시만 보는 순수 함수이고, `next === current`를 먼저 봐서 재시도에 멱등합니다.
- 같은 사용자의 판정부터 쓰기까지를 `INSERT ... ON CONFLICT DO UPDATE`로 얻은 행 잠금 안에서 처리하고, revision을 잠금 안에서 붙여 `since` 커서가 행을 건너뛰지 않게 했습니다.
- GCS와 Postgres는 항상 맞추는 대신 고아 객체 쪽으로만 어긋나게 순서를 정했고, 커밋 뒤 삭제의 경쟁은 GCS 세대 조건으로 막았습니다.

동기화 API 전체 구조는 [Belloga 프로젝트 페이지](/projects/belloga)에 정리되어 있습니다.
