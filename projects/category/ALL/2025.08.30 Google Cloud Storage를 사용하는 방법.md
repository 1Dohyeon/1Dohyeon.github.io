# NestJS에서 Google Cloud Storage 사용법

웹 애플리케이션을 개발하다 보면 사용자가 업로드한 파일을 저장해야 하는 경우가 자주 있습니다. 특히 프로필 이미지나 컨텐츠 이미지 등을 다룰 때는 안정적이고 확장 가능한 저장소가 필요합니다.

Google Cloud Storage(GCS)는 이런 요구사항을 만족시켜주는 훌륭한 클라우드 저장소 서비스입니다. 이번 글에서는 NestJS에서 Google Cloud Storage를 활용해 파일 업로드 기능을 구현하는 방법을 정리해보겠습니다.

## Google Cloud Storage란 무엇인가?

Google Cloud Storage는 구글에서 제공하는 객체 저장소 서비스입니다. 다음과 같은 장점들이 있습니다:

-   **확장성**: 용량 제한 없이 파일을 저장할 수 있습니다.
-   **내구성**: 99.999999999%(11개의 9) 내구성을 제공합니다.
-   **전 세계 CDN**: 전 세계 어디서든 빠른 접근이 가능합니다.
-   **비용 효율성**: 사용한 만큼만 비용을 지불합니다.

## 환경 설정하기

### 1. Google Cloud 프로젝트 설정

먼저 Google Cloud Console에서 프로젝트를 생성하고 Cloud Storage API를 활성화해야 합니다.

### 2. 서비스 계정 키 생성

Google Cloud Console에서 서비스 계정을 생성하고 JSON 키 파일을 다운로드합니다. 이 키 파일은 인증에 사용됩니다.

### 3. 필요한 패키지 설치

```bash
npm install @google-cloud/storage
npm install @nestjs/config
npm install @nestjs/platform-express
```

### 4. 환경 변수 설정

`.env` 파일에 Google Cloud Storage 관련 설정을 추가합니다:

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...} # JSON 키 내용 직접 입력도 가능
GOOGLE_STORAGE_BUCKET=your-bucket-name
```

## Storage Service 구현

Google Cloud Storage와 상호작용하는 서비스를 만들어보겠습니다.

```typescript
import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
    private storage: Storage;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        // Google Cloud Storage 초기화
        const keyFilename = this.configService.get<string>("GOOGLE_APPLICATION_CREDENTIALS");
        const serviceAccountKey = this.configService.get<string>("GOOGLE_SERVICE_ACCOUNT_KEY");

        const storageOptions: { [key: string]: unknown } = {};

        if (serviceAccountKey) {
            // JSON 키 내용이 환경 변수에 있는 경우
            try {
                storageOptions.credentials = JSON.parse(serviceAccountKey);
            } catch (error) {
                console.error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON:", error);
            }
        } else if (keyFilename) {
            // 키 파일 경로가 있는 경우
            storageOptions.keyFilename = keyFilename;
        }

        this.storage = new Storage(storageOptions);

        // 버킷 이름은 환경 변수에서 가져오거나 기본값 사용
        this.bucketName = this.configService.get<string>("GOOGLE_STORAGE_BUCKET", "your-bucket-name");
    }

    /**
     * 파일을 Google Cloud Storage에 업로드
     * @param file 업로드할 파일
     * @param folder 저장할 폴더 (user-avatar 등)
     * @returns 업로드된 파일의 공개 URL
     */
    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileName = this.generateFileName(file.originalname);
        const filePath = `${folder}/${fileName}`;

        const bucket = this.storage.bucket(this.bucketName);
        const fileUpload = bucket.file(filePath);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => {
                reject(error);
            });

            blobStream.on("finish", () => {
                // 공개 URL 생성 (버킷이 공개라고 가정)
                const publicUrl = this.getPublicUrl(filePath);
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }

    /**
     * 기존 파일을 삭제
     * @param filePath 삭제할 파일의 경로
     */
    async deleteFile(filePath: string): Promise<void> {
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(filePath);

        await file.delete();
    }

    /**
     * 고유한 파일명 생성
     * @param originalName 원본 파일명
     * @returns 고유한 파일명
     */
    private generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1e9);
        const extension = originalName.split(".").pop();
        return `${timestamp}-${randomSuffix}.${extension}`;
    }

    /**
     * 공개 URL 생성
     * @param filePath 파일 경로
     * @returns 공개 URL
     */
    private getPublicUrl(filePath: string): string {
        return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
    }

    /**
     * URL에서 파일 경로 추출
     * @param url 파일 URL
     * @returns 파일 경로
     */
    extractFilePathFromUrl(url: string): string | null {
        const baseUrl = `https://storage.googleapis.com/${this.bucketName}/`;
        if (url.startsWith(baseUrl)) {
            return url.replace(baseUrl, "");
        }
        return null;
    }
}
```

## File Controller 구현

파일 업로드를 처리하는 컨트롤러를 만들어보겠습니다.

```typescript
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Query,
    InternalServerErrorException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { StorageService } from "../storage/storage.service";

@Controller("files")
export class FileController {
    constructor(private readonly storageService: StorageService) {}

    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB 제한
            },
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(new BadRequestException("Only image files are allowed!"), false);
                }
                callback(null, true);
            },
        })
    )
    async upload(@UploadedFile() file: Express.Multer.File, @Query("type") type: string) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }

        try {
            let folder = "user-avatar";

            const fileUrl = await this.storageService.uploadFile(file, folder);
            return { url: fileUrl };
        } catch (error) {
            console.error("File upload error:", error);
            throw new InternalServerErrorException("Failed to upload file");
        }
    }
}
```

## 주요 구현 포인트

### 1. 인증 방식

Google Cloud Storage에 접근하기 위해서는 두 가지 인증 방식을 지원합니다:

-   **키 파일 경로**: `GOOGLE_APPLICATION_CREDENTIALS` 환경 변수로 JSON 키 파일 경로 지정
-   **키 내용 직접 입력**: `GOOGLE_SERVICE_ACCOUNT_KEY` 환경 변수에 JSON 키 내용을 문자열로 입력

서버 환경에 따라 적합한 방식을 선택할 수 있습니다.

### 2. 파일 검증

컨트롤러에서는 다음과 같은 검증을 수행합니다:

-   **파일 크기 제한**: 5MB로 제한
-   **파일 타입 검증**: 이미지 파일만 허용
-   **업로드 여부 확인**: 파일이 실제로 업로드되었는지 확인

### 3. 고유한 파일명 생성

동일한 이름의 파일이 업로드되어도 충돌하지 않도록 타임스탬프와 랜덤 값을 조합해 고유한 파일명을 생성합니다.

### 4. 폴더 구조

파일을 용도별로 구분해서 저장할 수 있도록 폴더 구조를 지원합니다. 사용자 프로필 이미지는 `user-avatar` 폴더에 저장됩니다.

## 실제 사용 예시

프론트엔드에서는 다음과 같이 파일을 업로드할 수 있습니다:

```javascript
const formData = new FormData();
formData.append("file", selectedFile);

fetch("/files/upload?type=avatar", {
    method: "POST",
    body: formData,
})
    .then((response) => response.json())
    .then((data) => {
        console.log("File uploaded:", data.url);
    });
```

## 주의사항

### 1. 버킷 권한 설정

Google Cloud Storage 버킷이 공개 읽기 권한을 가져야 업로드된 파일에 공개 URL로 접근할 수 있습니다.

### 2. 에러 처리

업로드 과정에서 발생할 수 있는 다양한 에러들을 적절히 처리해야 합니다:

-   네트워크 오류
-   권한 오류
-   저장 공간 부족

### 3. 보안 고려사항

-   업로드할 수 있는 파일 타입을 제한해야 합니다.
-   파일 크기를 적절히 제한해야 합니다.
-   업로드된 파일의 스캔을 고려해볼 수 있습니다.

## 마무리

Google Cloud Storage를 NestJS와 함께 사용하면 안정적이고 확장 가능한 파일 저장 시스템을 구축할 수 있습니다. 특히 사용자 프로필 이미지와 같은 정적 파일들을 관리하는데 매우 유용합니다.

실제 프로덕션 환경에서는 CDN 설정, 이미지 최적화, 캐싱 전략 등을 추가로 고려해야 하지만, 이번 글에서 다룬 기본 구현만으로도 충분히 실용적인 파일 업로드 시스템을 만들 수 있었습니다.

앞으로 더 많은 파일 타입이나 고급 기능들이 필요해지면 이 기본 구조를 확장해나갈 수 있을 것 같습니다.
