# NestJS에서 Google Cloud Storage로 파일 업로드 구현하기

프로필 이미지나 콘텐츠 이미지를 서버 로컬에 저장하면 서버가 재시작되거나 교체될 때 파일이 사라집니다. 클라우드 스토리지를 사용하면 파일을 영구적으로 보관하고 URL로 어디서든 접근할 수 있습니다.

Google Cloud Storage(GCS)를 NestJS에 연동해 파일 업로드 기능을 구현하는 방법을 정리합니다.

---

## 환경 설정

### GCP 프로젝트 및 버킷 생성

Google Cloud Console에서 프로젝트를 생성하고 Cloud Storage API를 활성화합니다. 이후 버킷을 생성하고, 서비스 계정을 만들어 JSON 키 파일을 다운로드합니다.

### 패키지 설치

```bash
npm install @google-cloud/storage
```

### 환경 변수 설정

```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_STORAGE_BUCKET=your-bucket-name
```

서비스 계정 키는 파일 경로 대신 JSON 내용을 환경 변수에 직접 담는 방식을 권장합니다. CI/CD 환경에서 파일 경로 관리가 번거롭기 때문입니다.

---

## StorageService 구현

```typescript
import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
    private storage: Storage;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const serviceAccountKey = this.configService.get<string>("GOOGLE_SERVICE_ACCOUNT_KEY");

        this.storage = new Storage({
            credentials: JSON.parse(serviceAccountKey),
        });

        this.bucketName = this.configService.get<string>("GOOGLE_STORAGE_BUCKET");
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileName = this.generateFileName(file.originalname);
        const filePath = `${folder}/${fileName}`;

        const bucket = this.storage.bucket(this.bucketName);
        const fileUpload = bucket.file(filePath);

        const blobStream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype },
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", reject);
            blobStream.on("finish", () => resolve(this.getPublicUrl(filePath)));
            blobStream.end(file.buffer);
        });
    }

    async deleteFile(filePath: string): Promise<void> {
        await this.storage.bucket(this.bucketName).file(filePath).delete();
    }

    private generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1e9);
        const extension = originalName.split(".").pop();
        return `${timestamp}-${randomSuffix}.${extension}`;
    }

    private getPublicUrl(filePath: string): string {
        return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
    }

    extractFilePathFromUrl(url: string): string | null {
        const baseUrl = `https://storage.googleapis.com/${this.bucketName}/`;
        return url.startsWith(baseUrl) ? url.replace(baseUrl, "") : null;
    }
}
```

---

## FileController 구현

```typescript
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "../storage/storage.service";

@Controller("files")
export class FileController {
    constructor(private readonly storageService: StorageService) {}

    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(new BadRequestException("이미지 파일만 업로드 가능합니다."), false);
                }
                callback(null, true);
            },
        })
    )
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException("파일이 없습니다.");

        try {
            const fileUrl = await this.storageService.uploadFile(file, "user-avatar");
            return { url: fileUrl };
        } catch (error) {
            throw new InternalServerErrorException("파일 업로드에 실패했습니다.");
        }
    }
}
```

---

## 주요 구현 포인트

**파일명 충돌 방지**
동일한 파일명이 업로드되어도 충돌하지 않도록 타임스탬프와 랜덤 값을 조합해 고유한 파일명을 생성합니다.

**파일 검증은 컨트롤러에서**
파일 크기(5MB)와 타입(이미지만 허용) 검증을 `FileInterceptor`의 `fileFilter`에서 처리합니다. 잘못된 파일이 스토리지까지 도달하기 전에 걸러냅니다.

**버킷 권한 설정**
업로드된 파일에 공개 URL로 접근하려면 GCS 버킷에 공개 읽기 권한(`allUsers: roles/storage.objectViewer`)이 필요합니다. 비공개 파일이라면 Signed URL을 사용하는 방식으로 전환합니다.

---

## 프론트엔드 업로드 예시

```javascript
const formData = new FormData();
formData.append("file", selectedFile);

const response = await fetch("/files/upload", {
    method: "POST",
    body: formData,
});

const { url } = await response.json();
console.log("업로드된 URL:", url);
```

---

## 정리

| 항목 | 로컬 저장 | GCS |
|---|---|---|
| 영속성 | 서버 재시작 시 소멸 가능 | 영구 보관 |
| 접근 방식 | 서버 경유 | 공개 URL 직접 접근 |
| 확장성 | 서버 용량에 의존 | 제한 없음 |
| 비용 | 서버 스토리지 비용 | 사용량 기반 |
