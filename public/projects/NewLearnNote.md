# NewLearn Note

## 핵심 기능

### 프로젝트 순환 구조
1. 사용자는 앱을 사용하여 로컬 경로와 연결하여 md 파일을 작성하며 공부 및 작업을 진행할 수 있습니다.
2. 로컬에만 저장된다면 obsidian을 쓰면 된다. NewLearn Note는 동기화 클라이언트를 지원합니다. 이를 **Library**라고 부릅니다.
3. GitHub에서 Repository에 코드를 push/pull하듯, NewLearn Note에서는 **Library**에 push/pull 하여 언제든 내 노트를 업로드하고, 다운받을 수 있습니다.
	- **Library 구조**: 각 Library는 `private`과 `published` 브랜치로 구성
	- **동기화**: 로컬 폴더와 Library 간 push/pull로 노트 동기화 (private 브랜치에 저장)
4. Library에 올린 노트라면 로컬에서 Publish 버튼이 보입니다. 해당 클릭 시, 해당 노트와 백링크(`[[ ]]` 문법)로 연결된 노트들이 published 브랜치에 복제됩니다.
5. 다른 사용자가 공개된 노트를 자신의 노트에서 link로 참조하면, DB의 `note-network` 테이블에 관계가 저장되어 집단지성 네트워크 형성됩니다. 본인 또한 다른 사용자의 공개 노트 link를 참조하면 `note-network` 테이블에 관계가 저장됩니다.

## 프로젝트 개발 동기

**옵시디언에서 공부하고, 블로그에 공유하고, 구글링으로 자료 찾으면서 공부할 때마다 여러 페이지를 왔다갔다하는 게 너무 귀찮았습니다.**

이 불편함을 해결하기 위해 NewLearn Note를 기획했습니다. 노트 작성, 공유, 다른 사용자의 학습 자료 참고를 하나의 앱에서 해결하는 것이 목표입니다. 향후 "이 파일 참고해서 필기해줘"와 같은 AI 어시스턴트 기능도 계획 중이며, 해당 프로토타입은 [Nura](https://1dohyeon.github.io/projects/nura)에서 개발했습니다.


## 개발 내용

**Backend:**
- RESTful API 서버 아키텍처 설계 및 PostgreSQL DB 모델링
- Google OAuth 2.0 소셜 로그인 연동 JWT 인증/인가 시스템 구현
- 모듈 간 느슨한 결합을 위해 이벤트 패턴 구현
- 노트 CRUD 및 버전 관리 시스템 구현
- Signed URL을 통한 안전한 GCS 파일 접근 권한 관리 및 노트 퍼블리싱 파이프라인 구축
- GCP 기반 클라우드 인프라 구축 및 배포

**Frontend:**
- Next.js 기반, Electron.js 기반 데스크톱 앱 개발

### 1. RESTful API 서버 아키텍처 설계 및 PostgreSQL DB 모델링

**아키텍처 설계:**
- NestJS 기반 모듈형 아키텍처 구성으로 도메인별 관심사 분리
- Repository 패턴을 통한 데이터 접근 계층 추상화
- 도메인 이벤트 패턴 적용으로 모듈 간 느슨한 결합 구현

**데이터베이스 설계:**
- Library, Note, User 등 핵심 엔티티 간 관계 모델링
- `note-network` 테이블 설계로 노트 간 참조 관계를 그래프 구조로 저장
- 인덱스 최적화를 통한 쿼리 성능 향상

#### 핵심 코드: Prisma 스키마 - Note Network 모델

```typescript
// 노트 간 연결 관계를 표현하는 그래프 구조 모델
enum noteNetworkType {
  linked  // 일반 링크
  embed   // 임베드 링크
}

model NoteNetwork {
    id       String             @id @default(ulid()) @db.VarChar(255)
    type     noteNetworkType    @default(linked)

    // 관계 필드 - 자기 참조를 통한 노트 간 연결
    linkingNoteId     String           @db.VarChar(255)
    linkedNoteId      String           @db.VarChar(255)
    linkingNote       Note             @relation("linkingNote", fields: [linkingNoteId], references: [id])
    linkedNote        Note             @relation("linkedNote", fields: [linkedNoteId], references: [id])

    @@map("note_network")
}
```

### 2. Google OAuth 2.0 소셜 로그인 연동 JWT 인증/인가 시스템 구현

**OAuth 플로우 구현:**
- Passport.js를 활용한 Google OAuth 2.0 인증 파이프라인 구축
- 사용자 정보 자동 동기화 및 신규 사용자 자동 생성 로직 구현

#### 핵심 코드: Google OAuth Strategy

```typescript
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;
      const googleUser = {
        id,
        email: emails[0]?.value || '',
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        picture: photos[0]?.value || '',
      };

      // 사용자 검증 및 자동 생성
      const result = await this.authService.validateGoogleUser(googleUser);
      done(null, result);
    } catch (error: any) {
      done(error, false);
    }
  }
}
```

#### 핵심 코드: Google 사용자 검증 및 자동 생성

```typescript
async validateGoogleUser(googleUser: GoogleUser): Promise<AuthResult> {
  // OAuth ID로 사용자 존재 여부 확인
  let user = await this.authRepository.findUserByOauthId(
    googleUser.id,
    'google',
  );

  if (!user) {
    user = await this.authRepository.findUserByEmail(googleUser.email);
    if (user) {
      throw new Error('User Email already exists');
    } else {
      // 신규 사용자 자동 생성
      const createUserDto: CreateGoogleUserDto = {
        oauthId: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.firstName || 'User',
        lastName: googleUser.lastName || Math.floor(100000 + Math.random() * 900000).toString(),
      };

  

      const createProfileDto: CreateProfileDto = {

        nickname: `${googleUser.firstName}${Math.floor(100000 + Math.random() * 900000).toString()}`.toLowerCase(),

        avatarUrl: googleUser.picture || process.env.AVATAR_DEFAULT_URL || '',

      };

  

      // 닉네임 중복 확인 (최대 5번 재시도)

      let isExisting = false;

      for (let i = 0; i < 5; i++) {

        isExisting = await this.userService.isExistingNickname(createProfileDto.nickname);

        if (!isExisting) break;

        createProfileDto.nickname = `${createProfileDto.nickname}${Math.floor(100000 + Math.random() * 900000)}`;

      }

  

      user = await this.authRepository.createGoogleUser(createUserDto, createProfileDto);

    }

  }

  

  return this.generateAuthResult(user);

}

```

#### 핵심 코드: JWT Strategy - 쿠키/헤더 멀티 플랫폼 지원

```typescript
// 웹(쿠키)과 데스크톱(헤더) 모두 지원하는 추출 함수
const cookieOrHeaderExtractor = (req: Request): string | null => {
  let token: string | null = null;

  // 1. 쿠키 확인 (웹)
  if (req && req.cookies) {
    token = req.cookies['accessToken'] || null;
  }

  // 2. 헤더 확인 (데스크톱 앱)
  const authHeader = req.headers['authorization'] as string | undefined;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  return token;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(JwtStrategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; jti?: string }) {
    // JTI 기반 토큰 블랙리스트 검증
    if (!payload.jti) {
      throw new UnauthorizedException('Invalid token format - missing JTI');
    }

    const isBlacklisted = await this.authService.isTokenBlacklisted(payload.jti);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const user = await this.authService.findUserBySub(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
```

### 3. 모듈 간 느슨한 결합을 위해 이벤트 패턴 구현

**도메인 이벤트 패턴:**
- 이벤트 기반 아키텍처로 모듈 간 의존성 최소화
- 노트 생성/수정/삭제 시 관련 서비스에 이벤트 전파


#### 핵심 코드: 도메인 이벤트 패턴

```typescript
// 이벤트 정의
export class LibraryDeletedEvent implements IDomainEvent {
  readonly occurredAt: Date;
  readonly eventType: string;
  readonly payload: LibraryDeletedPayload;

  constructor(payload: LibraryDeletedPayload) {
    this.occurredAt = new Date();
    this.eventType = EVENT_TYPES.LIBRARY.DELETED;
    this.payload = payload;
  }
}

// 이벤트 발행 (Library Service)
async deleteLibrary(userId: string, libraryId: string): Promise<void> {
  // ... 라이브러리 삭제 로직 ...
  // 도메인 이벤트 발행
  const event = new LibraryDeletedEvent({
    libraryId,
    userId,
    libraryName: library.name,
  });
  this.eventEmitter.emit(EVENT_TYPES.LIBRARY.DELETED, event);
}

// 이벤트 리스너 (Note Service)
@Injectable()
export class LibraryDeletedListener {
  constructor(private readonly noteService: NoteService) {}

  @OnEvent(EVENT_TYPES.LIBRARY.DELETED)
  async handleLibraryDeleted(event: LibraryDeletedEvent): Promise<void> {
    const { libraryId } = event.payload;
    // 해당 라이브러리의 모든 노트 자동 삭제
    await this.noteService.deleteNotesByLibraryId(libraryId);
  }
}
```

### 4. 노트 CRUD 및 버전 관리 시스템 구현

**노트 동기화 시스템:**
- GitHub처럼 Library에 노트를 push/pull하는 동기화 메커니즘 구현
- private/published 브랜치 개념으로 공개 범위 제어

**버전 관리:**
- 노트 변경 이력 추적 및 버전별 복원 기능
- 백링크(`[[ ]]` 문법) 자동 감지 및 관계 저장

#### 핵심 코드: Push/Pull 동기화 시스템

```typescript
@Controller('desktop-app/libraries')
export class LibraryAppController {
  /**
   * 라이브러리 Push - 로컬 파일을 서버로 업로드
   * GitHub의 push와 유사한 동작
   */
  @Post(':libraryId/push')
  @UseGuards(LibraryOwnerGuard)
  @UseInterceptors(FilesInterceptor('files', 1000, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  }))
  async pushProjects(
    @Request() req: { user: ResponseUserDto },
    @UploadedFiles() files: Express.Multer.File[],
    @Body() pushLibraryDto: PushLibraryDto,
  ): Promise<LibraryMetadata> {
    return await this.libraryPrivateService.pushLibrary(
      req.user.id,
      files,
      pushLibraryDto.libraryId,
      pushLibraryDto.deletedFiles,
    );
  }
  
  /**
   * 라이브러리 Pull - 서버에서 로컬로 다운로드
   * ZIP 스트림으로 압축하여 전송
   */
  @Post(':libraryId/pull')
  @UseGuards(LibraryOwnerGuard)
  async pullProject(
    @Request() req: { user: ResponseUserDto },
    @Body() pullDto: PullLibraryDto,
    @Res() response: Response,
  ): Promise<void> {
    const { libraryId, libraryName } = pullDto;

    // ZIP 스트림 생성
    const zipStream = await this.libraryPrivateService.pullLibraryAsStream(
      req.user.id,
      libraryId,
    );

    // 한글 파일명 지원 (RFC 5987)
    const encodedFilename = encodeURIComponent(libraryName);
    response.setHeader('Content-Type', 'application/zip');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${libraryName.replace(/[^\x00-\x7F]/g, '_')}.zip"; filename*=UTF-8''${encodedFilename}.zip`,
    );
    zipStream.pipe(response);
  }
}
```

#### 핵심 코드: 노트 Publish 시스템

```typescript
/**
 * Private 파일을 Published로 발행하여 노트 생성
 * Publish 버튼 클릭 시 실행
 */
@Post('publish')
@UseGuards(JwtAuthGuard)
async publishFileAsNote(
  @Request() req: { user: ResponseUserDto },
  @Query('libraryId') libraryId: string,
  @Query('filePath') filePath: string,
  @Body() createNoteDto: CreateNoteDto,
): Promise<NoteDetail> {
  return await this.noteService.publishFileAsNote(
    req.user.id,
    libraryId,
    filePath,
    createNoteDto,
  );
}

// Service Layer
async publishFileAsNote(
  userId: string,
  libraryId: string,
  filePath: string,
  createNoteDto: CreateNoteDto,
): Promise<NoteDetail> {
  const fullPrivateFilePath = `user- libraries/${userId}/${libraryId}/private/${filePath}

  // 1. 소스 파일 존재 확인
  try {
    await this.storageService.getFileSignedUrl(fullPrivateFilePath);
  } catch (error) {
    throw new BadRequestException('You should push file to private library first.');
  }

  // 2. published 경로 구성
  const destinationPath = `user-libraries/${userId}/${libraryId}/published/${filePath}`;

  // 3. 파일 복사 (private → published)
  await this.storageService.copyFile(fullPrivateFilePath, destinationPath);

  // 4. Note 엔터티 Upsert (있으면 업데이트, 없으면 생성)
  try {
    const note = await this.upsertNote(userId, libraryId, destinationPath, createNoteDto);
    return await this.getNoteWithTagsById(note.id);
  } catch (error) {
    console.error(`Note upsert failed for file: ${destinationPath}. File preserved for retry.`, error);
    throw error;
  }
}
```

### 5. Signed URL을 통한 안전한 GCS 파일 접근 권한 관리 및 노트 퍼블리싱 파이프라인 구축

**Signed URL 전략:**
- GCS에 저장된 파일에 대한 임시 접근 권한 부여
- 만료 시간 기반 보안으로 무단 접근 방지
- 서버 부하 없이 클라이언트가 직접 GCS와 통신

**노트 퍼블리싱 파이프라인:**
- 마크다운 노트를 정적 HTML로 변환
- 백링크로 연결된 관련 노트들을 자동으로 public 브랜치에 복제
- SEO 최적화를 위한 메타 태그 및 사이트맵 자동 생성
- GCS에 배포하여 별도의 웹 서버 없이 공개 노트 제공

#### 핵심 코드: GCS Signed URL 생성

```typescript
/**
 * GCS 파일에 대한 Signed URL 생성
 * 클라이언트가 직접 GCS에서 파일을 다운로드하도록 허용
 */
async getFileSignedUrl(
  gcpPath: string,
  expiresInMinutes: number = 15,
): Promise<{
  signedUrl: string;
  expiresAt: string;
  fileName: string;
  contentType: string;
}> {
  const bucket = this.storage.bucket(this.bucketName);
  const file = bucket.file(gcpPath);

  // 파일 존재 여부 확인
  const [exists] = await file.exists();
  if (!exists) {
    throw new Error('File not found');
  }

  // 파일 메타데이터 조회
  const [metadata] = await file.getMetadata();
  const contentType = metadata.contentType || 'application/octet-stream';

  // Signed URL 생성 (읽기 전용, 15분 유효)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: expiresAt,
  });

  const fileName = gcpPath.split('/').pop() || 'unknown';

  return {
    signedUrl,
    expiresAt: expiresAt.toISOString(),
    fileName,
    contentType,
  };
}
```

#### 핵심 코드: 파일 접근 권한 관리

```typescript
/**
 * Published 파일의 Signed URL 조회 (공개)
 * 누구나 접근 가능
 */
@Get(':libraryId/published/file')
async getPublishedFileSignedUrl(
  @Query('filePath') filePath: string,
  @Param('libraryId') libraryId: string,
): Promise<ResponseSignedUrl> {
  if (!filePath) {
    throw new BadRequestException('filePath query parameter is required');
  }
  
  // GCS 경로 구성
  const fullPath = `user-libraries/${library.userId}/${libraryId}/published/${filePath};
  return await this.storageService.getFileSignedUrl(fullPath);
}

/**
 * Private 파일의 Signed URL 조회 (비공개)
 * 라이브러리 소유자만 접근 가능 (Guard로 검증)
 */

@Get(':libraryId/private/file')
@UseGuards(LibraryOwnerGuard)
async getPrivateFileSignedUrl(
  @Request() req: { user: ResponseUserDto },
  @Query('filePath') filePath: string,
  @Param('libraryId') libraryId: string,
): Promise<ResponseSignedUrl> {
  const userId = req.user.id;
  // GCS 경로 구성 (보안: 서버에서만 경로 구성)
  const fullPath = `user-libraries/${userId}/${libraryId}/private/${filePath};
  return await this.storageService.getFileSignedUrl(fullPath);

}

```

### 6. GCP 기반 클라우드 인프라 구축 및 배포

**직접 관리 vs 관리형 서비스:**

초기 배포 시 Cloud SQL 대신 비용을 아끼고자 VM에 PostgreSQL을 직접 구축하는 방식을 선택했습니다.

**구현 내용:**
- **컨테이너 기반 배포**: Docker를 활용한 NestJS 백엔드 컨테이너화로 개발/운영 환경 일관성 확보
- **데이터베이스 직접 관리**: GCP Compute Engine VM 내 PostgreSQL 직접 설치 및 설정, 스키마 모델링부터 쿼리 최적화까지 제어권 확보
- **정적 리소스 분리**: GCS를 활용한 이미지, 영상 등 정적 파일 저장으로 서버 스토리지 부하 감소

### 7. Next.js 기반, Electron.js 기반 데스크톱 앱 개발

**웹 애플리케이션 (Next.js):**
- SSR과 CSR을 혼합한 최적의 렌더링 전략
- 반응형 UI로 다양한 화면 크기 지원

**데스크톱 앱 (Electron.js):**
- **프로세스 분리**: `main` 프로세스에서 파일 시스템 접근, `renderer` 프로세스에서 React 기반 UI 제공
- **IPC 통신**: `ipcHandlers.ts`를 통해 파일 CRUD, 프로젝트 관리 등 핵심 로직을 안전하게 처리
- **복잡한 상태 관리**: 멀티 탭/에디터 기능 구현, 파일 트리와 탭 상태 동기화

## 프로젝트를 통해 배운 점

이 프로젝트를 통해 기획부터 개발, 배포, 운영까지 서비스의 전반적인 라이프사이클을 경험했습니다. 특히 크로스 플랫폼 환경에서 사용자 로그인 상태를 어떻게 관리할지 깊게 고민하는 계기가 되었습니다. JWT 기반 인증을 웹과 데스크톱 모두에 적용하되, 데스크톱에서는 안전한 로컬 스토리지를 활용한 자동 로그인으로 각 플랫폼의 특성에 맞는 사용자 경험을 제공하면서, 보안성과 편의성을 모두 고려한 시스템 설계의 중요성을 깨달았습니다.