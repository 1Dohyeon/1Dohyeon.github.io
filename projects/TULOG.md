# TULOG: 개인 및 팀 블로그

## 프로젝트 개요

**PROJECT_OVERVIEW_START**

-   **개발 기간**: 2025.07 ~ 진행중
-   **기술 스택**:
    -   Next.js, NestJS, PostgreSQL, Docker, EC2, RDS, S3
-   **프로젝트 유형**: 개인 및 팀 블로그3인 프로젝트
-   **개발 인원**: 3인 프로젝트
-   **맡은 역할**:
    -   API 및 ERD 설계
    -   사용자 구글 로그인/토큰 관리
    -   프론트엔드 전체
    -   백엔드(유저,팔로우,블로그 모듈 위주)

**PROJECT_OVERVIEW_IMAGE**
![tulog-main-image](https://github.com/1Dohyeon/1Dohyeon.github.io/blob/main/public/tulogMainImage.png?raw=true)

**PROJECT_OVERVIEW_END**

> **GitHub Repository & Project Information URL**
>
> -   [SERVER Repository](https://github.com/DOforTU/tulog-server)
> -   [UI Repository](https://github.com/DOforTU/tulog-ui)
> -   [프로젝트 기능 설명](https://github.com/DOforTU/tulog)
> -   [프로젝트 블로그](https://1dohyeon.github.io/#/blogs/category/TULOG)

해당 프로젝트의 **기능 설명**은 [이곳](https://github.com/DOforTU/tulog) 에서 자세히 확인할 수 있습니다. 이 글은 아키텍처 구조, 개발 흐름, 기술적 고민을 기록한 **일기 형식의 회고**에 가깝습니다.

또한 이 프로젝트를 개발하면서 겪은 기술적 문제, 학습한 내용 등을 외부 블로그에 꾸준히 정리하고 있습니다. 실시간 개발 흐름과 고민 과정을 기록한 글은 [프로젝트 블로그](https://1dohyeon.github.io/#/blogs/category/TULOG)에서 확인하실 수 있습니다.

## 왜 블로그라는 주제를 선택했는가?

저는 취미로 토이 프로젝트를 진행하는 것을 좋아하고, 프로젝트를 진행하면서 경험한 문제 해결 과정, 공부한 기술 내용 등을 정리하는 것을 좋아합니다. 이러한 이유로 처음에는 외부 블로그 플랫폼을 사용하여 공부한 내용을 공유하였습니다.

그러다 문득 직접 블로그 플랫폼을 개발하여 다양한 기술 스택을 적용해보면 좋은 경험이 될 수 있겠다는 생각이 들었습니다. 따라서 제가 직접 사용하고, 다른 사람들도 편리하게 이용할 수 있도록 배포와 운영까지 고려한 프로젝트를 시작하게 되었습니다.

또한 혼자만 글을 쓰는 블로그는 개인적으로 흔하다고 생각했고, 다양한 예외 상황을 처리하며 더 많은 기술을 다뤄보고 싶었기 때문에, 팀 블로그 기능과 검색 기능까지 포함하는 것을 목표로 기획하였습니다.

## 왜 Next.js와 NestJS를 선택했는가?

**프론트엔드** 프레임워크는 처음에는 Vue.js로 시작했지만, 배포 후 운영을 목표로 하다 보니 SEO, SSR, 정적 사이트 생성(SSG) 등 다양한 부분을 고려해야 했습니다.

**Next.js**는 이러한 요구에 딱 맞는 프레임워크였습니다. 가장 먼저 고려한 건 SEO와 초기 렌더링 속도였고, 이를 위해 서버 사이드 렌더링(SSR) 기능을 적극 활용했습니다.

그리고 **백엔드**를 처음 설계할 때 가장 중요하게 고려한 요소는 유지보수성과 확장성이었습니다. 단순한 CRUD를 넘어서, 기능이 많아지더라도 구조적으로 관리 가능해야 했기 때문에, **모듈 시스템과 의존성 주입(DI)** 을 기본으로 제공하는 NestJS를 선택했습니다. 실제로 서비스, 컨트롤러, 모듈을 분리하여 구조화하는 과정에서 NestJS의 아키텍처가 큰 도움이 되었습니다.

또한 TypeScript 기반이라는 점도 중요한 선택 이유였습니다. 프론트엔드(Next.js)와의 타입 통일 덕분에 DTO, 인터페이스 등을 일관되게 관리할 수 있었고, IDE 자동완성과 타입 안전성 확보에도 유리했습니다.

## 개인 블로그와 팀 블로그의 차이는 어떻게 구현했는가?

![init_user_blog_relation](https://github.com/1Dohyeon/1Dohyeon.github.io/blob/main/public/projects/imgs/init_user_blog_relation.png?raw=true)

처음에는 유저와 블로그의 관계는 위와 같이 `OneToMany`로 구현하였습니다. 사용자는 여러 글을 작성할 수 있었죠. 하지만 팀 블로그를 선택한 경우 해당 팀원도 블로그 작성에 동참할 수 있게 구현하고 싶었습니다.

따라서 아래 이미지와 같이 블로그가 팀 ID를 참조할 수 있게 하였고, 블로그-사용자 간의 중간 테이블(`editor`)을 두어, `ManyToMany` 관계로 확장하였습니다.

![modified_user_blog_relation](https://github.com/1Dohyeon/1Dohyeon.github.io/blob/main/public/projects/imgs/modified_user_blog_relation.png?raw=true)

추가로 `isCreator` 컬럼을 통해 처음 블로그 글을 생성한 사용자인지 아닌지 분류를 하게 하였습니다. `permission`를 통해 수정 권한 등을 제한할 수 있지만, 아직은 팀원이라면 블로그 작성을 허용하도록 하였습니다.

만약 개인 블로그라면 블로그의 `teamId`는 `NULL`값이 될 것이고, 작성자 테이블은 `OneToOne`으로 작동하게 됩니다. 이렇게 하면 나중에 자신의 블로그 글을 팀 소속으로 변경할 수 있게 확장도 가능할 것이라 생각되었습니다.

하지만 이런 블로그를 작성하고, 팀에 참여하기 위해서는 회원가입과 로그인이 선행되어야 합니다.

이 프로젝트에서는 사용자 인증을 **OAuth(Google)**와 로컬 이메일 인증 두 가지 방식으로 제공하고 있으며, 이후 주제에서는 이러한 로그인/회원가입 기능을 어떤 방식으로 구현했는지 정리해보려 합니다.

## 왜 OAuth를 선택했고, 어떻게 구현했을까?

이 프로젝트에서는 처음부터 소셜 로그인 기능이 필요하다고 판단하였습니다.
회원가입 절차에서 발생할 수 있는 진입 장벽을 줄이면서도, 인증의 안정성과 확장성을 확보하는 것이 중요했기 때문입니다.

그중에서도 Google 계정은 대부분의 사용자가 보유하고 있고, OAuth를 통해 이메일, 이름, 프로필 이미지 등의 사용자 정보를 쉽게 받아올 수 있다는 점에서 적합하다고 판단하였습니다.

또한, 추후 로컬에서 이메일 로그인 방식으로 확장할 계획입니다.

백엔드에서는 NestJS의 `@nestjs/passport`와 `passport-google-oauth20`을 활용하여 OAuth 인증을 처리하였고, 프론트엔드에서는 `accessToken`과 `refreshToken` 기반의 인증 흐름을 구현하였습니다.

아래 시퀀스 다이어그램은 Google 로그인이 어떤 흐름으로 동작하는지 설명하는 구조입니다.

![login_logic](https://raw.githubusercontent.com/DOforTU/tulog/7944ffb2b0353fab4db63f3bfa59ef0f1e20df82/logic/login_logic.drawio.svg)

1. 사용자가 Google 로그인을 시도하면 `/auth/google` 경로를 통해 Google 인증 페이지로 리디렉션됩니다.

2. 인증이 완료되면 `/auth/google/callback` 경로로 사용자 정보가 전달되고, 서버는 해당 정보를 기반으로 로그인 또는 회원가입 처리를 진행합니다.

3. 서버는 `accessToken`과 `refreshToken`을 발급한 후, 이를 `HttpOnly` 쿠키로 클라이언트에 전달합니다. 사용자 정보는 응답 본문에 포함되지 않으며, 이는 XSS를 방지하기 위함입니다.

4. 이후 클라이언트에서는 GET `/users/me/info` API를 통해 사용자 정보를 조회하고, 전역 상태에 저장하여 로그인 상태를 유지합니다.

5. `accessToken`은 약 15분 후 만료되며, 만료 이후에는 POST `/auth/refresh` 요청을 통해 `refreshToken`을 사용해 새로운 `accessToken`을 재발급받습니다.

해당 구조를 구현하면서 다음과 같은 부분에 중점을 두었습니다.

-   HttpOnly, Secure, SameSite 속성을 활용한 쿠키 기반의 보안 처리
-   사용자 정보를 응답 본문에 포함하지 않도록 설계하여 클라이언트 측 노출을 최소화
-   accessToken의 짧은 유효기간과 refreshToken 기반 재발급 구조를 통한 보안 강화
-   프론트엔드에서는 Axios Interceptor를 활용하여 accessToken의 만료를 감지하고 자동으로 재요청이 가능하도록 구현

결과적으로 OAuth 방식은 사용자 경험을 해치지 않으면서도 안정적인 인증 시스템을 구축하는 데 큰 도움이 되었습니다. 특히 토큰 발급 및 재발급 구조를 설계하고 구현하는 과정에서 많은 고민을 했고, 이는 좋은 경험이었다고 생각합니다.

또한 가장 많은 고민을 했던 부분은 바로 **예외 처리**였습니다. 사용자 활성화/비활성화, 팀 초대 상태, 블로그 작성 권한 등 다양한 상태 조건을 다루면서, 단순한 예외 대응을 넘어서 **의도된 흐름과 의도되지 않은 상황**을 명확히 나누는 작업이 매우 중요하다는 것을 느꼈습니다.

다음 주제에서는 이 프로젝트를 진행하면서 마주했던 **대표적인 예외 상황들과 그것들을 어떻게 처리했는지**에 대해 정리해보려고 합니다.
