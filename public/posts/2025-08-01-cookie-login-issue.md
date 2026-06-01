# 로그인 후 브라우저 쿠키에 userInfo가 저장되어 있던 문제

프로젝트에서 소셜 로그인을 구현하고 나서 코드를 다시 보다가 보안 문제를 발견했습니다. 로그인 후 브라우저 쿠키에 `userInfo`가 그대로 저장되고 있었습니다.

---

## 문제: userInfo를 쿠키에 저장하면 안 되는 이유

```ts
// auth.service.ts (기존 코드)
res.cookie('accessToken', accessToken, { httpOnly: true, ... });
res.cookie('refreshToken', refreshToken, { httpOnly: true, ... });
res.cookie('userInfo', JSON.stringify(user), {
    httpOnly: false, // JavaScript에서 접근 가능
    secure: true,
    sameSite: 'strict',
});
```

겉으로는 잘 동작하지만, 두 가지 보안 문제가 있습니다.

**XSS 취약점**
`httpOnly: false`로 설정된 쿠키는 JavaScript에서 접근이 가능합니다. XSS 공격으로 악성 스크립트가 삽입되면 쿠키에 저장된 사용자 정보가 그대로 탈취됩니다.

**개인정보 노출**
`userInfo`에는 이메일, 이름, 프로필 이미지 등 개인 식별 정보(PII)가 포함됩니다. DevTools에서 쿠키를 열면 누구나 볼 수 있는 상태였습니다.

---

## 해결

**백엔드: userInfo 쿠키 제거**

```ts
// auth.service.ts (수정 후)
res.cookie('accessToken', accessToken, { httpOnly: true, ... });
res.cookie('refreshToken', refreshToken, { httpOnly: true, ... });
// userInfo 쿠키 제거
```

**프론트엔드: 로그인 후 API로 사용자 정보 요청**

```ts
const fetchUserInfo = async () => {
    const res = await axios.get("/auth/me");
    setUser(res.data);
};
```

인증은 `accessToken`, `refreshToken` 쿠키로 처리하고, 사용자 정보는 쿠키가 아닌 API 호출로 가져오도록 구조를 분리했습니다.

---

## 정리

인증 토큰과 사용자 정보는 역할이 다릅니다.

- **인증 토큰**: `httpOnly` 쿠키에 저장 - JavaScript 접근 차단
- **사용자 정보**: 쿠키 저장 금지 - 로그인 후 API로 요청

편리함 때문에 쿠키에 사용자 정보를 담고 싶어지는 경우가 있지만, 정보의 민감도에 따라 저장 위치를 명확히 구분해야 합니다. 쿠키와 localStorage는 각각 XSS, CSRF의 대상이 될 수 있어 보안 처리가 필수입니다.
