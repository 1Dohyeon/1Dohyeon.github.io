# 비동기 함수(async function)와 Promise

서버 개발을 시작하면 `async`, `await`, `Promise`를 금방 마주치게 됩니다. 처음엔 "백그라운드에서 실행된다" 정도로 넘어가기 쉽지만, 비동기의 작동 방식을 제대로 이해하지 못하면 코드가 예상과 다른 순서로 실행되거나, 에러가 어디서 났는지 추적하기 어려운 상황을 겪게 됩니다.

비동기 처리는 콜백 → Promise → async/await 순서로 발전해 왔습니다. 각 방식이 이전 방식의 어떤 단점을 해결했는지, 그 흐름대로 설명합니다.

---

## 동기(Synchronous): 한 번에 하나씩

동기 방식은 코드가 위에서 아래로, 순서대로 실행됩니다. 하나가 끝나야 다음이 시작됩니다.

```js
console.log("(1) 유저 조회 시작");
// DB 조회... 1초 걸린다고 가정
console.log("(2) 유저 조회 완료");
console.log("(3) 다음 작업");
```

순서는 보장되지만, DB 조회가 끝날 때까지 서버 전체가 멈춥니다. 그 1초 동안 다른 사용자의 요청은 모두 대기 상태가 됩니다. 사용자가 많아질수록 치명적입니다.

---

## 비동기(Asynchronous): 기다리지 않고 다음으로

비동기 방식은 작업이 끝날 때까지 기다리지 않고, 일단 다음 코드를 실행합니다.

```js
console.log("(1) 시작");

setTimeout(function () {
  console.log("(2) 2초 후 실행");
}, 2000);

console.log("(3) 즉시 실행");
```

실행 결과는 `(1) → (3) → (2)` 순서입니다. `setTimeout`이 2초를 기다리는 동안, 나머지 코드가 먼저 실행됩니다.

서버에 적용하면, DB 조회가 진행되는 동안 다른 요청을 처리할 수 있습니다. Node.js / NestJS가 적은 리소스로 높은 동시성을 처리할 수 있는 이유입니다.

---

## 문제: 콜백 헬(Callback Hell)

비동기 처리의 순서를 보장하려면 "이게 끝나면 이걸 실행해"라는 콜백 함수를 넘겨야 합니다. 그런데 단계가 쌓이면 이렇게 됩니다.

실제 서버에서 흔히 볼 수 있는 흐름을 콜백으로 작성하면:

```js
// 로그인 처리: 유저 조회 → 비밀번호 확인 → 권한 조회 → 토큰 발급
db.findUser(email, function (err, user) {
  if (err) return handleError(err);

  auth.checkPassword(user, password, function (err, isValid) {
    if (err) return handleError(err);

    db.getPermissions(user.id, function (err, permissions) {
      if (err) return handleError(err);

      token.generate(user, permissions, function (err, token) {
        if (err) return handleError(err);

        res.send({ token }); // 4단계를 거쳐서야 응답
      });
    });
  });
});
```

단계가 4개뿐인데 코드가 오른쪽으로 계속 밀려납니다. 에러 처리도 각 단계마다 반복해야 하고, 어디서 에러가 났는지 추적하기도 어렵습니다. 이게 **콜백 헬**입니다.

---

## 해결 1: Promise

Promise는 "나중에 값을 돌려줄게"라는 약속을 객체로 표현합니다. 콜백을 중첩하는 대신, `.then()`으로 수평하게 연결합니다.

Promise는 세 가지 상태를 가집니다.

- `pending`: 아직 결과가 없는 상태 (대기 중)
- `fulfilled`: 성공적으로 완료 → `resolve()` 호출
- `rejected`: 실패 → `reject()` 호출

```javascript
const promise = new Promise((resolve, reject) => {
  db.findUser(email, (err, user) => {
    if (err) reject(err);
    else resolve(user);
  });
});
```

위 콜백 헬 코드를 Promise 체이닝으로 바꾸면:

```js
db.findUser(email)
  .then((user) => auth.checkPassword(user, password))
  .then((isValid) => db.getPermissions(user.id))
  .then((permissions) => token.generate(user, permissions))
  .then((token) => res.send({ token }))
  .catch((err) => handleError(err)); // 에러 처리는 한 곳에서
```

중첩이 사라지고, 에러 처리도 맨 끝 `.catch()` 하나로 통합됩니다. 훨씬 읽기 쉬워졌습니다.

---

## 해결 2: async/await

`.then()` 체이닝도 단계가 많아지면 길어집니다. async/await는 Promise를 마치 동기 코드처럼 쓸 수 있게 해주는 문법입니다.

`async` 함수 안에서 `await`를 쓰면, Promise가 처리될 때까지 기다린 뒤 결과값을 바로 받아옵니다.

```js
const login = async (email, password) => {
  try {
    const user = await db.findUser(email); // (1) 완료될 때까지 대기
    const isValid = await auth.checkPassword(user, password); // (2) 대기
    const permissions = await db.getPermissions(user.id); // (3) 대기
    const token = await token.generate(user, permissions); // (4) 대기

    return { token };
  } catch (err) {
    handleError(err);
  }
};
```

내부적으로는 여전히 비동기로 동작하지만, 코드는 동기처럼 읽힙니다. NestJS에서 DB 조회나 외부 API 호출에 async/await가 사실상 표준인 이유입니다.

```ts
// NestJS Repository 예시
async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
}
```

---

## 정리

콜백 → Promise → async/await, 세 가지 모두 비동기 처리를 위한 방법입니다. 등장 순서가 곧 단점을 보완해온 역사입니다.

|           | 콜백        | Promise          | async/await       |
| --------- | ----------- | ---------------- | ----------------- |
| 가독성    | ✗ 중첩 구조 | △ 체이닝         | ✓ 선형 코드       |
| 에러 처리 | 각 단계마다 | `.catch()` 한 곳 | `try/catch` 한 곳 |
| 직관성    | ✗           | △                | ✓                 |

현재 Node.js / NestJS 생태계에서는 async/await가 표준입니다. 다만 `Promise.all()`처럼 여러 비동기 작업을 **병렬로** 실행할 때는 Promise를 직접 다루는 경우가 여전히 남아 있습니다.
