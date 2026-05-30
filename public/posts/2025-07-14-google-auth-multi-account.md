# Google OAuth 다중 계정 로그인 문제 해결

프로젝트를 진행하면서 Google OAuth를 구현해놓고 테스트를 하던 중, 다른 Google 계정으로 로그인을 시도해도 계속 이전 계정의 정보가 나오는 문제를 발견하였습니다.

## 어떤 문제였을까?

사용자가 Google 계정 A로 로그인한 후 로그아웃을 하고, 다른 Google 계정 B로 로그인을 시도해도 계속 계정 A의 정보가 반환되는 상황이었습니다.

처음에는 프론트의 문제라고 생각했습니다. 하지만 자세히 살펴보니 프론트엔드의 AuthContext와 Cookie는 정상적으로 초기화되고 있었습니다. 문제는 백엔드의 Google OAuth 세션 관리에 있었습니다.

## 해결하기 위해 시도한 것들

### 첫 번째 시도: 프론트엔드에서 더 확실하게 초기화해보자

우선 프론트엔드에서 로그아웃 로직을 더 강화해보기로 했습니다.

```typescript
// AuthContext.tsx에서 로그아웃 시 완전한 세션 초기화
const logout = useCallback(async () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    // Google 로그아웃 시도
    window.location.href = "https://accounts.google.com/logout";
}, []);
```

결과는... 효과 없음이었습니다. 백엔드에서 여전히 동일한 사용자가 반환되더라고요.

### 두 번째 시도: Google OAuth에 강제 계정 선택 옵션 추가

Google OAuth Strategy에 `prompt` 파라미터를 추가해보기로 했습니다.

```typescript
// google.strategy.ts
super({
    clientID: configService.get<string>("GOOGLE_CLIENT_ID") || "",
    clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") || "",
    callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL") || "",
    scope: ["email", "profile"],
    prompt: "consent select_account", // 타입 오류 발생
});
```

하지만 TypeScript 타입 오류가 발생해서 실패했습니다.

### 세 번째 시도: 직접 Google OAuth URL 만들기

AuthController에서 직접 Google OAuth URL을 생성해보기로 했습니다.

```typescript
// auth.controller.ts
@Get('google')
googleAuth(@Res() res: Response) {
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${callbackUrl}&` +
    `scope=${scope}&` +
    `response_type=code&` +
    `prompt=consent select_account`;

  res.redirect(googleAuthUrl);
}
```

이것도 실패했습니다. Google Strategy와 충돌해서 validate 함수가 두 번 호출되는 문제가 발생했습니다.

## 진짜 원인을 찾기 위한 디버깅

이쯤 되니 답답해서 제대로 로그를 찍어보기로 했습니다. Google Strategy와 AuthController 곳곳에 상세한 로그를 추가했습니다.

```typescript
// google.strategy.ts
console.log("Google Strategy - 전체 프로필 객체:", JSON.stringify(profile, null, 2));
console.log("Google Strategy - 받은 프로필:", { id, email, name });
console.log("Google Strategy - 변환된 사용자:", googleUser);

// auth.service.ts
console.log("AuthService - validateGoogleUser 호출됨:", { id, email, firstName, lastName });
console.log("AuthService - findByGoogleId 결과:", user?.email || "없음");
```

### 발견한 문제점

1. **Google Strategy의 validate 함수가 두 번 호출되고 있었습니다**

    - 첫 번째: 정상적인 Google 프로필 데이터 수신
    - 두 번째: 모든 값이 undefined로 호출됨

2. **AuthController에서 validateGoogleUser를 중복으로 호출하고 있었습니다**
    - Google Strategy에서 이미 validateGoogleUser를 호출
    - AuthController의 googleAuthRedirect에서 다시 validateGoogleUser 호출
    - 두 번째 호출에서 잘못된 데이터 때문에 기본 사용자가 반환됨

결론은 중복 호출이 문제였습니다.

## 해결 방법

문제를 찾았으니 해결은 간단했습니다. AuthController에서 중복 호출을 제거하고, Google Strategy에서 이미 검증된 결과를 그대로 사용하도록 수정했습니다.

```typescript
// 수정 전 - 문제가 있던 코드
interface AuthenticatedRequest extends Request {
  user: GoogleUser; // 문제: GoogleUser 타입
}

async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
  const authResult: AuthResult = await this.authService.validateGoogleUser(req.user); // 중복 호출!
  const { accessToken, user } = authResult;
  // ...
}
```

```typescript
// 수정 후 - 깔끔하게 해결된 코드
interface AuthenticatedRequest extends Request {
  user: AuthResult; // 해결: AuthResult 타입으로 변경
}

googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
  const { accessToken, user } = req.user; // 이미 검증된 결과 사용
  console.log('AuthController - 콜백에서 받은 사용자:', user.email);
  // ...
}
```

```ts
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

### 핵심 변경사항

1. **AuthenticatedRequest 인터페이스 타입 변경**: `GoogleUser` → `AuthResult`
2. **validateGoogleUser 중복 호출 제거**: AuthController에서 재호출하지 않음
3. **Google Strategy 결과 직접 사용**: 이미 검증된 AuthResult를 그대로 활용
4. **불필요한 async/await 제거**: 비동기 처리가 필요 없어짐

## 결과 확인

수정 후 테스트해보니 완벽하게 해결되었습니다.

-   Google Strategy의 validate 함수가 한 번만 호출됨
-   다른 Google 계정으로 로그인 시 올바른 사용자 정보 반환
-   UI 헤더에 새로운 사용자 프로필 정상 표시
-   로그아웃 후 다른 계정으로 로그인 정상 작동

### 해결 후 로그 예시

```
Google Strategy - 받은 프로필: {
  id: '123456789012345678901',
  email: 'user2@example.com',
  name: '홍길동'
}
AuthService - validateGoogleUser 호출됨: {
  id: '123456789012345678901',
  email: 'user2@example.com',
  firstName: '길동',
  lastName: '홍'
}
AuthService - findByGoogleId 결과: user2@example.com
AuthController - 콜백에서 받은 사용자: user2@example.com
```

## 이번 경험에서 배운 것들

### 깨달은 점

1. **Passport Strategy와 Controller의 역할을 명확히 구분해야 한다**

    - Strategy는 인증 처리만 담당
    - Controller는 인증된 결과를 활용만 해야 함

2. **같은 로직을 여러 곳에서 호출하면 위험하다**

    - 동일한 비즈니스 로직을 여러 곳에서 호출하면 예상치 못한 부작용이 발생할 수 있음
    - 단일 책임 원칙의 중요성을 다시 한번 느꼈습니다

3. **추측보다는 실제 데이터를 확인하자**
    - 상세한 로그를 통해 정확한 문제 지점을 파악할 수 있었음
    - "아마 이것 때문일 거야"라고 추측하기보다는 실제 데이터 흐름을 확인하는 것이 중요

### 앞으로 개선할 점

1. **테스트 코드 작성**: OAuth 플로우에 대한 통합 테스트를 추가해야겠습니다
2. **에러 핸들링 강화**: OAuth 실패 시나리오에 대한 처리 로직을 더 탄탄하게 만들어야겠어요
3. **로깅 시스템 개선**: 개발 환경에서는 상세한 로그를, 프로덕션 환경에서는 적절한 로그 레벨을 설정해야겠습니다

---

## 마무리

이번 문제를 해결하면서 디버깅의 중요성을 다시 한번 느꼈습니다. 처음에는 복잡한 OAuth 설정 문제인 줄 알았는데, 알고 보니 단순한 중복 호출 문제였습니다.
