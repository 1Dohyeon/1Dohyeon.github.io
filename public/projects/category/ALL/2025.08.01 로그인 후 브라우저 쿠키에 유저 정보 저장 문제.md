# 로그인 후 브라우저 쿠키에 `userInfo`가 저장되어 있던 문제 해결

이번 글에서는 TULOG 프로젝트에서 로그인 후 브라우저 쿠키에 `userInfo`가 저장되어 있었던 문제를 어떻게 해결했는지, 그리고 **왜 사용자 정보를 쿠키에 저장하면 안 되는지**에 대해 정리해보려고 합니다.

---

## 어떤 문제가 발생했나요?

TULOG에서는 소셜 로그인(OAuth)을 통해 사용자가 로그인하면, 백엔드에서 `accessToken`, `refreshToken`, 그리고 사용자 정보(`userInfo`)를 응답으로 내려주는 구조였습니다. 문제는 이 중 `userInfo`가 클라이언트의 **브라우저 쿠키에 그대로 저장되고 있었다는 점**입니다.

```ts
// auth.service.ts (기존 코드)
res.cookie('accessToken', accessToken, { ... });
res.cookie('refreshToken', refreshToken, { ... });
res.cookie('userInfo', JSON.stringify(user), {
  httpOnly: false,
  secure: true,
  sameSite: 'strict',
});
```

처음에는 별다른 이상 없이 잘 작동하는 것처럼 보였지만, 보안 측면에서 꽤 치명적인 구조였습니다.

---

## 사용자 정보를 쿠키에 저장하면 왜 안 되나요?

여기에는 크게 두 가지 이유가 있습니다.

### 1. XSS(크로스사이트 스크립팅) 취약성

`userInfo` 쿠키가 `HttpOnly: false`로 설정되어 있다면, **자바스크립트에서 접근이 가능합니다**. 악성 스크립트가 삽입되었을 때 사용자 정보를 탈취당할 수 있는 매우 심각한 보안 취약점입니다.

### 2. 민감 정보가 노출될 수 있음

사용자 정보에는 이메일, 이름, 프로필 이미지 등 **개인 식별이 가능한 정보(Personal Identifiable Information, PII)** 가 포함됩니다. 이런 정보를 클라이언트 측 쿠키에 그대로 노출하면, **누군가 쿠키를 탈취하거나 DevTools에서 접근만 해도 사용자 정보가 쉽게 드러납니다.**

---

## 어떻게 해결했나요?

문제를 인지한 후, 가장 먼저 `auth.service.ts`의 `setAuthCookies` 메서드에서 `userInfo` 쿠키 설정 부분을 삭제하였습니다.

```ts
// auth.service.ts (수정 후)
res.cookie('accessToken', accessToken, { ... });
res.cookie('refreshToken', refreshToken, { ... });
// userInfo 제거
```

그리고 프론트엔드에서는 로그인 이후 사용자 정보를 별도로 요청하여 가져오도록 흐름을 바꾸었습니다.

```ts
// frontend 예시 코드 (로그인 직후 사용자 정보 요청)
const fetchUserInfo = async () => {
    const res = await axios.get("/auth/me");
    setUser(res.data);
};
```

결과적으로, 인증은 여전히 `accessToken`, `refreshToken`으로 처리되며, 사용자 정보는 쿠키가 아닌 **API 호출을 통해 안전하게 가져오도록** 구조를 분리하였습니다.

---

## 얻은 교훈

처음에는 사용자 정보를 쿠키에 담아두면 프론트에서 바로 접근할 수 있어서 편하겠다고 생각했습니다. 하지만 인증 정보와 사용자 정보는 **철저히 분리**해서 다루는 것이 안전하고 확장성 있는 구조임을 다시 한 번 느꼈습니다.

특히 쿠키와 로컬스토리지는 보안 처리 방식에 따라 XSS나 CSRF의 대상이 될 수 있기 때문에, **정보의 민감도에 따라 어디에 저장할지를 명확하게 구분**해야 한다고 생각합니다.

앞으로도 인증이나 사용자 정보를 다룰 때는 "편리함"보다 "보안"을 먼저 고려하려고 합니다. 이건 진짜 피하지 말고 꼭 정리하고 넘어가야 할 문제라는 걸 몸소 체감했습니다.
