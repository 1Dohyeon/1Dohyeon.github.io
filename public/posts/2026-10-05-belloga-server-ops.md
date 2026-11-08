---
tags: [Project, Infra]
---

# Belloga 서버 운영: 직접 호출 차단, RLS, 대상을 강제하는 마이그레이션

Belloga의 API 서버(belloga-api)는 혼자 만들고 혼자 운영합니다. 혼자 운영하면 실수를 잡아 줄 사람이 없어서, "실수해도 사고가 나지 않게" 하는 장치를 서버와 스크립트에 직접 넣었습니다. 이 글은 그중 네 가지를 정리합니다.

구성은 이렇습니다. Cloudflare Worker가 도메인을 받아 Cloud Run 서비스로 넘기고, DB는 Supabase Postgres입니다. QA와 PROD 환경을 나눠 `develop`은 QA로, `main`은 PROD로 GitHub Actions가 배포합니다.

---

## 1. Cloud Run 주소로 들어오는 직접 호출 막기

Cloud Run 서비스에는 `*.run.app` 공개 주소가 생깁니다. 도메인 앞에 Cloudflare를 두어도, 이 주소를 알면 Cloudflare를 건너뛰고 서버를 직접 부를 수 있습니다. Cloudflare에 건 규칙이 모두 무력해집니다.

그래서 Worker가 넘기는 요청에만 비밀 헤더(`X-Origin-Secret`)를 붙이고, 서버는 모든 경로에서 이 값을 확인합니다. 값이 다르면 `403`입니다.

### 비교는 상수 시간으로

```ts
// 해시로 길이를 맞춰 비교해서, 길이가 다르다는 사실도 비교 시간으로 드러나지 않게 한다.
export function isOriginAllowed(received: string | string[] | undefined, expected: string): boolean {
  if (typeof received !== 'string') return false;
  return timingSafeEqual(sha256(received), sha256(expected));
}
```

- 문자열을 `===`로 비교하면 앞에서부터 다른 글자를 만나는 순간 멈춥니다. 응답 시간을 재면 몇 번째 글자까지 맞았는지 추측할 여지가 생깁니다.
- `timingSafeEqual`은 길이가 다르면 예외를 던집니다. 그래서 바로 넣지 않고, 양쪽을 SHA-256으로 바꿔 길이를 32바이트로 맞춘 뒤 비교합니다. 길이가 다르다는 사실도 시간으로 드러나지 않습니다.
- 거부한 요청은 로그를 남기지 않습니다. 직접 호출이 반복되면 로그가 불어나기 때문입니다.

### 설정이 빠지면 아예 뜨지 않게

```ts
// K_SERVICE는 Cloud Run이 모든 컨테이너에 넣는 변수라 Cloud Run에서 도는지 판정하는 데 쓴다.
export function resolveOriginGuard(env: Record<string, string | undefined>): OriginGuard {
  const secret = env.ORIGIN_SECRET?.trim();
  if (secret) return { enabled: true, secret };
  if (env.K_SERVICE?.trim()) {
    throw new OriginGuardConfigError('ORIGIN_SECRET 환경변수가 없습니다');
  }
  return { enabled: false };
}
```

비밀값이 없을 때 검사를 조용히 끄면, 배포 설정에서 환경 변수 하나를 빠뜨린 것만으로 서버가 활짝 열립니다. 그래서 Cloud Run에서 도는데(`K_SERVICE`가 있는데) 비밀값이 없으면 기동 자체를 실패시켰습니다. 배포가 실패하는 편이 열린 채 도는 것보다 낫습니다. 로컬에서는 검사를 꺼서 개발을 막지 않습니다.

---

## 2. Supabase의 모든 테이블에 RLS 켜기

Supabase는 `public` 스키마의 모든 테이블을 Data API(PostgREST)로 노출합니다. 이 서비스는 Data API를 쓰지 않지만, 노출 자체는 기본값입니다. 새 테이블을 만들고 행 수준 보안(RLS)을 켜지 않으면 공개 키만으로 테이블을 읽을 수 있는 경로가 생깁니다.

- 새 테이블에는 모두 RLS를 켜고, 정책은 두지 않습니다. 정책이 없으면 Data API로는 아무 행도 보이지 않습니다.
- Prisma의 `migrate diff`는 RLS 문을 만들지 않으므로, `migration.sql` 끝에 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`를 손으로 더하는 것을 저장소 규칙으로 적어 두었습니다.
- 서버는 테이블 소유자로 접속해 RLS를 우회합니다. 그래서 사용자별 접근 제한은 RLS가 아니라 서비스 쿼리의 `userId` 조건으로 합니다. 동기화 객체 키를 사용자 ID로만 만드는 것도 같은 생각입니다.

---

## 3. 대상 DB를 반드시 고르게 하는 마이그레이션 명령

`.env`에 QA와 PROD 접속 정보를 함께 두면, 어느 쪽을 가리키는지 헷갈린 채 마이그레이션을 돌리는 사고가 생길 수 있습니다. 그래서 마이그레이션 명령은 대상을 플래그로 반드시 고르게 했습니다.

```js
const TARGETS = {
  '--qa': { name: 'QA', prefix: 'QA_' },
  '--main': { name: 'PROD', prefix: 'PROD_' },
};

function targetFromArgs() {
  const flags = Object.keys(TARGETS).filter((flag) => process.argv.includes(flag));
  if (flags.length !== 1) {
    throw new Error('대상을 --qa 또는 --main 중 하나로 정하세요. 예: pnpm migrate --qa');
  }
  return TARGETS[flags[0]];
}
```

- 플래그가 없거나 둘 다 있으면 DB에 접속하기 전에 끝납니다. "기본 대상"을 두지 않은 것이 핵심입니다. 기본값이 있으면 깜빡한 순간 그 기본값으로 실행됩니다.
- 실행하면 먼저 `대상: PROD (host/db)`처럼 어디에 붙는지 출력합니다.
- 고른 대상의 접두어(`QA_`, `PROD_`)가 붙은 변수만 읽고, 하나라도 비면 어떤 변수가 없는지 알리고 멈춥니다.

### 되돌리기는 두 번 확인한다

되돌리기(`down.sql`)는 데이터를 지울 수 있는 명령이라 한 번 더 막았습니다.

- 마지막으로 적용된 마이그레이션과 그 `down.sql`이 있는지 먼저 확인하고, 무엇을 되돌릴지 출력합니다.
- `--yes`가 없으면 "아무것도 하지 않았습니다. --yes를 붙여 다시 실행하세요."를 출력하고 끝납니다. 처음 실행은 늘 미리보기가 됩니다.
- `down.sql` 실행과 이력 행 삭제를 한 트랜잭션으로 묶어, 중간에 실패하면 둘 다 롤백합니다.

---

## 4. 세션 토큰은 해시로만, 갱신은 필요할 때만

앱은 GitHub 로그인 뒤 Belloga 세션 토큰을 받습니다.

- **토큰 원문은 저장하지 않습니다.** DB에는 SHA-256 해시만 두고, 요청이 오면 받은 토큰을 해시해서 찾습니다. DB가 유출되어도 토큰을 그대로 쓸 수 없습니다.
- **만료는 90일이고, 남은 기간이 45일보다 짧을 때만 늘립니다.** 요청마다 만료를 늘리면 모든 요청이 DB 쓰기를 하나씩 달고 다닙니다. 절반이 지났을 때만 늘려서, 자주 쓰는 사용자는 끊기지 않으면서 쓰기는 드물게 했습니다.
- **허용 계정 목록과 탈퇴 상태는 토큰을 쓸 때마다 다시 확인합니다.** 로그인 때만 확인하면, 탈퇴했거나 허용 목록에서 빠진 계정의 토큰이 만료까지 살아 있습니다. 탈퇴는 행을 지우지 않는 soft delete라 같은 GitHub 계정으로 다시 가입하는 것도 막습니다.

```ts
async authenticate(token: string, now: Date): Promise<UserRecord | null> {
  const session = await this.store.findSessionByTokenHash(hashSessionToken(token));
  if (!session || isSessionExpired(session.expiresAt, now)) return null;
  if (session.user.deletedAt) return null;
  if (!this.isAllowed(session.user.provider, session.user.providerAccountId)) return null;
  if (shouldExtendSession(session.expiresAt, now)) {
    await this.store.extendSession(session.sessionId, sessionExpiresAt(now));
  }
  return session.user;
}
```

---

## 정리

네 장치에는 공통점이 있습니다. "설정을 빠뜨리거나 깜빡했을 때 어느 쪽으로 넘어지는가"를 정한 것입니다.

- 비밀값이 없으면 열린 채 도는 대신 기동을 실패시킵니다.
- 새 테이블은 정책 없는 RLS로 기본이 닫혀 있습니다.
- 마이그레이션은 기본 대상이 없고, 되돌리기는 기본이 미리보기입니다.
- 세션은 쓸 때마다 탈퇴와 허용 여부를 다시 확인합니다.

혼자 운영하는 서버일수록, 실수가 사고가 아니라 실패한 명령으로 끝나게 만드는 것이 가장 싼 안전장치였습니다.
