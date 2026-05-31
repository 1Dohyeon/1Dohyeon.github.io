# Google OAuth 다중 계정 로그인 문제 해결

Google OAuth를 구현하고 테스트하던 중 이상한 현상을 발견했습니다. 계정 A로 로그인한 뒤 로그아웃하고, 계정 B로 로그인을 시도해도 계속 계정 A의 정보가 반환되는 문제였습니다.

---

## 문제 상황

계정 A로 로그인 → 로그아웃 → 계정 B로 로그인 시도 → 계정 A 정보 반환.

처음에는 프론트엔드 문제라고 생각했습니다. 하지만 `AuthContext`와 쿠키는 정상적으로 초기화되고 있었습니다. 문제는 백엔드의 Google OAuth 처리 로직에 있었습니다.

---

## 해결 시도들

### 첫 번째 시도: 프론트엔드 로그아웃 강화

```typescript
const logout = useCallback(async () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = "https://accounts.google.com/logout";
}, []);
```

효과 없음. 백엔드에서 여전히 동일한 사용자가 반환됐습니다.

### 두 번째 시도: Google OAuth Strategy에 prompt 파라미터 추가

```typescript
super({
    clientID: configService.get<string>("GOOGLE_CLIENT_ID") || "",
    clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") || "",
    callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL") || "",
    scope: ["email", "profile"],
    prompt: "consent select_account", // TypeScript 타입 오류 발생
});
```

타입 오류로 실패.

### 세 번째 시도: Google OAuth URL 직접 생성

```typescript
@Get('google')
googleAuth(@Res() res: Response) {
    const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${callbackUrl}&` +
        `response_type=code&` +
        `prompt=consent select_account`;

    res.redirect(googleAuthUrl);
}
```

Google Strategy와 충돌해서 `validate` 함수가 두 번 호출되는 문제가 발생했습니다.

---

## 원인 파악: 로그로 데이터 흐름 추적

세 번의 시도가 모두 실패하자, 로그를 상세히 찍어 실제 데이터 흐름을 확인했습니다.

```typescript
// google.strategy.ts
console.log("Strategy - 프로필:", JSON.stringify(profile, null, 2));

// auth.service.ts
console.log("AuthService - validateGoogleUser 호출:", { id, email });
console.log("AuthService - findByGoogleId 결과:", user?.email || "없음");
```

로그를 통해 두 가지 문제를 발견했습니다.

**(1) `validate` 함수가 두 번 호출됨**
- 첫 번째 호출: 정상적인 Google 프로필 데이터 수신
- 두 번째 호출: 모든 값이 `undefined`로 호출됨

**(2) `validateGoogleUser`가 중복 호출됨**
- Google Strategy의 `validate`에서 이미 `validateGoogleUser` 호출
- `AuthController`의 `googleAuthRedirect`에서 다시 `validateGoogleUser` 호출
- 두 번째 호출 시 잘못된 데이터가 들어와 기본 사용자가 반환됨

---

## 해결

`AuthController`에서 중복 호출을 제거하고, Strategy에서 이미 검증된 결과를 그대로 사용하도록 수정했습니다.

```typescript
// 수정 전
interface AuthenticatedRequest extends Request {
    user: GoogleUser; // Strategy 결과가 GoogleUser 타입
}

async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const authResult = await this.authService.validateGoogleUser(req.user); // 중복 호출
    const { accessToken, user } = authResult;
}
```

```typescript
// 수정 후
interface AuthenticatedRequest extends Request {
    user: AuthResult; // Strategy에서 이미 AuthResult를 반환하도록 변경
}

googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const { accessToken, user } = req.user; // 검증된 결과 바로 사용
}
```

```typescript
interface GoogleUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthResult {
    accessToken: string;
    user: UserEntity;
}
```

**핵심 변경사항**
- `AuthenticatedRequest`의 `user` 타입을 `GoogleUser` → `AuthResult`로 변경
- `AuthController`에서 `validateGoogleUser` 재호출 제거
- `async/await` 불필요해져 제거

---

## 결과

수정 후 로그를 다시 확인했습니다.

```
Strategy - 받은 프로필: { id: '123...', email: 'user2@example.com' }
AuthService - validateGoogleUser 호출: { id: '123...', email: 'user2@example.com' }
AuthService - findByGoogleId 결과: user2@example.com
AuthController - 콜백 사용자: user2@example.com
```

`validate` 함수가 한 번만 호출되고, 다른 계정으로 로그인 시 올바른 사용자 정보가 반환됩니다.

---

## 정리

Passport Strategy와 Controller의 역할 분리가 핵심이었습니다.

- **Strategy**: 인증 처리 및 사용자 검증 담당
- **Controller**: 검증된 결과를 활용하기만 함

같은 비즈니스 로직을 여러 곳에서 호출하면 예상치 못한 부작용이 생깁니다. 추측보다 실제 데이터 흐름을 로그로 확인하는 것이 문제를 빠르게 파악하는 방법입니다.
