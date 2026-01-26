# Nura

## 핵심 기능

### RAG 파이프라인 기반 문서 질의응답
1. 사용자는 PDF, Markdown, Text 파일을 앱에 업로드하여 문서 라이브러리를 구축할 수 있습니다.
2. 업로드된 문서는 자동으로 파싱, 청킹, 임베딩되어 ChromaDB 벡터 데이터베이스에 저장됩니다.
3. 사용자가 질문을 입력하면 벡터 유사도 검색으로 관련 문서 청크를 찾아 GPT-4o-mini가 답변을 생성합니다.
4. 이전 대화 히스토리를 참고하여 맥락 있는 연속 대화가 가능합니다.

### 비동기 문서 처리
- 대용량 PDF 파일(100페이지 논문) 업로드 시, 백그라운드에서 파싱 및 임베딩 처리
- 사용자는 업로드 즉시 다른 작업을 계속할 수 있으며, 문서 준비 완료 시 알림
- GCS(Google Cloud Storage)를 활용한 영속적 문서 저장으로 서버 재배포 시에도 데이터 보존

## 프로젝트 개발 동기

**메인 프로젝트 [NewLearn Note](https://1dohyeon.github.io/projects/newlearnnote)에 AI 문서 분석 기능을 통합하기 전에, RAG 파이프라인을 먼저 검증하고 싶었습니다.**

NewLearn Note의 핵심 기능 중 하나는 사용자가 작성한 노트를 AI가 분석하고 질문에 답변하는 것입니다. 하지만 메인 프로젝트에 바로 AI 기능을 통합하기에는 다음과 같은 우려가 있었습니다:

- **기술적 불확실성**: RAG 파이프라인의 각 단계(문서 파싱, 청킹, 임베딩, 검색, 생성)를 처음 다뤄보는 것이라 어떤 문제가 생길지 예측하기 어려웠습니다.
- **성능 검증 필요**: 문서 크기에 따른 응답 속도, 청킹 전략에 따른 답변 정확도 등을 미리 테스트해야 했습니다.
- **독립적인 실험 환경**: 메인 프로젝트에 영향을 주지 않고 자유롭게 실험하고 싶었습니다.

이러한 이유로 Nura를 독립 프로토타입으로 개발하여 RAG 파이프라인을 먼저 검증하고, 이후 [NewLearn Note](https://1dohyeon.github.io/projects/newlearnnote)에 안정적으로 통합하는 전략을 선택했습니다.

## 개발 내용

**Backend:**
- FastAPI 기반 RESTful API 서버 아키텍처 설계 및 PostgreSQL DB 모델링
- RAG(Retrieval-Augmented Generation) 파이프라인 아키텍처 설계 및 구현
- LangChain을 활용한 문서 처리 및 임베딩 생성
- ChromaDB 벡터 데이터베이스 통합 및 유사도 검색 구현
- OpenAI GPT-4o-mini API 통합 및 프롬프트 엔지니어링
- PDF 문서 파싱 및 청킹 알고리즘 최적화
- 비동기 문서 처리 및 성능 최적화
- GCS를 활용한 문서 저장 및 관리

**Frontend:**
- Next.js 기반 웹 애플리케이션 개발
- 채팅 인터페이스 및 파일 업로드 UI 구현
- Markdown 렌더링

### 1. FastAPI 기반 RESTful API 서버 아키텍처 설계 및 PostgreSQL DB 모델링

**프레임워크 선택:**

백엔드 프레임워크로 두 가지 옵션을 고려했습니다:
- **Option A**: NestJS - 메인 프로젝트와 동일한 스택, 하지만 Python AI 라이브러리 연동 복잡
- **Option B**: FastAPI - Python 네이티브 지원, AI 라이브러리 생태계 활용 용이

**선택 이유:**
- **Python AI 생태계 활용**: LangChain, ChromaDB, OpenAI API 등이 모두 Python 기반
- **빠른 개발 속도**: 프로토타입 검증이 목적이므로 개발 속도 우선
- **비동기 처리 지원**: FastAPI의 네이티브 async/await로 문서 처리 성능 향상
- **자동 문서화**: Pydantic 기반 요청/응답 검증 및 Swagger 자동 생성

**데이터베이스 설계:**
- Document, Chat, Message, Category 등 핵심 엔티티 간 관계 모델링
- `chat_document`, `message_document` 중간 테이블로 다대다 관계 표현
- 문서 상태 관리 (processing → completed → failed) 및 청크 카운트 추적

#### 핵심 코드: FastAPI 앱 설정 및 CORS
```python
# server/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app: FastAPI = FastAPI(
    title="Nura Server",
    description="RAG 파이프라인 기반 AI 문서 분석 및 질의응답 시스템",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 미들웨어 설정 - Next.js 프론트엔드와 통신
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(categories.router)
app.include_router(chats.router)
app.include_router(documents.router)
app.include_router(messages.router)
```

#### 핵심 코드: 데이터베이스 모델 - Document & Message
```python
# server/app/models/document.py
from sqlalchemy import Column, String, Integer, Enum, DateTime
from sqlalchemy.orm import relationship

class DocumentStatus(str, Enum):
    PROCESSING = "processing"  # 파싱 중
    COMPLETED = "completed"    # 완료
    FAILED = "failed"          # 실패

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(26), primary_key=True, default=generate_ulid)
    userId = Column(String(255), nullable=False, index=True)
    filename = Column(String(500), nullable=False)
    filePath = Column(String(1000), nullable=False)  # GCS URL
    fileType = Column(Enum(FileType), nullable=False)
    fileSize = Column(Integer, nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PROCESSING)
    chunkCount = Column(Integer, default=0)  # 생성된 청크 개수
    
    # 관계: 문서가 연결된 채팅들
    chat_documents = relationship("ChatDocument", back_populates="document")
```

### 2. RAG(Retrieval-Augmented Generation) 파이프라인 아키텍처 설계 및 구현

**RAG 파이프라인 구조:**

```
사용자 문서 업로드
    ↓
GCS에 파일 저장
    ↓
백그라운드에서 파싱 (PDF/MD/TXT)
    ↓
청킹 (RecursiveCharacterTextSplitter)
    ↓
임베딩 (OpenAI text-embedding-3-small)
    ↓
ChromaDB 저장
    ↓
사용자 질문 입력
    ↓
질문 임베딩
    ↓
유사도 검색 (Top-K)
    ↓
관련 문서 청크 추출
    ↓
프롬프트 생성 (대화 히스토리 + 컨텍스트)
    ↓
GPT-4o-mini API 호출
    ↓
답변 반환
```

**핵심 설계 원칙:**
- **모듈화**: 각 단계를 독립적인 서비스로 분리 (DocumentService, RAGService)
- **에러 핸들링**: 문서 처리 실패 시 상태 업데이트 및 재시도 가능
- **성능 최적화**: 임베딩 모델 싱글톤 패턴으로 초기화 비용 절감

#### 핵심 코드: RAG 설정 관리
```python
# server/app/config.py
class Settings(BaseSettings):
    # OpenAI API
    OPENAI_API_KEY: str
    
    # ChromaDB
    CHROMA_DB_PATH: str = "./chroma"
    
    # RAG Settings
    CHUNK_SIZE: int = 1000          # 청크 크기
    CHUNK_OVERLAP: int = 200        # 청크 간 중복
    TOP_K_RESULTS: int = 4          # 검색할 청크 개수
    
    # LLM Settings
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_TEMPERATURE: float = 0.0    # 결정적 답변
    LLM_MAX_TOKENS: int = 1000      # 토큰 제한
    
    # Conversation
    MAX_CONVERSATION_HISTORY: int = 10  # 대화 히스토리 개수
```

### 3. LangChain을 활용한 문서 처리 및 임베딩 생성

**LangChain 도입 이유:**
- RAG 파이프라인의 각 컴포넌트를 직접 구현하려면 문서 로더, 텍스트 스플리터, 임베딩 생성, 벡터 저장소 연동 등을 각각 구현해야 합니다.
- LangChain은 이러한 컴포넌트를 표준화된 인터페이스로 제공하여 코드 복잡도를 크게 줄이고, 프로토타입을 빠르게 검증할 수 있습니다.

**문서 처리 파이프라인:**
- PDF, Markdown, Text 파일 형식 자동 감지 및 파싱
- 문서 메타데이터 추출 및 저장
- 전처리된 문서를 벡터 임베딩으로 변환

#### 핵심 코드: 문서 청킹 및 임베딩
```python
# server/app/services/rag_service.py
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document as LangchainDocument

class RAGService:
    # 싱글톤 인스턴스
    _embeddings: Optional[OpenAIEmbeddings] = None
    _vectorstore: Optional[Chroma] = None
    _llm: Optional[ChatOpenAI] = None

    @classmethod
    def get_embeddings(cls) -> OpenAIEmbeddings:
        """OpenAI 임베딩 모델 가져오기 (싱글톤)"""
        if cls._embeddings is None:
            cls._embeddings = OpenAIEmbeddings(
                openai_api_key=cls.OPENAI_API_KEY,
                model=cls.EMBEDDING_MODEL
            )
        return cls._embeddings

    @staticmethod
    def split_text(text: str) -> list[str]:
        """문서를 의미 단위로 청킹"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=RAGService.CHUNK_SIZE,
            chunk_overlap=RAGService.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]  # 문단, 줄바꿈 우선
        )
        chunks = text_splitter.split_text(text)
        return chunks

    @staticmethod
    async def add_document_to_vectorstore(
        document_id: str,
        text: str,
        metadata: dict
    ) -> int:
        """문서를 ChromaDB 벡터스토어에 저장"""
        # 1. 텍스트 청킹
        chunks = RAGService.split_text(text)

        # 2. LangChain Document 객체로 변환
        documents = [
            LangchainDocument(
                page_content=chunk,
                metadata={
                    **metadata,
                    "document_id": document_id,
                    "chunk_index": i
                }
            )
            for i, chunk in enumerate(chunks)
        ]

        # 3. 벡터 임베딩 후 ChromaDB에 저장
        vectorstore = RAGService.get_vectorstore()
        vectorstore.add_documents(documents)

        return len(chunks)
```

### 4. ChromaDB 벡터 데이터베이스 통합 및 유사도 검색 구현

**ChromaDB 선택 이유:**
- **경량화**: 별도 서버 없이 Python 라이브러리로 사용 가능
- **로컬 실행**: 외부 서비스 의존 없이 프로토타입 검증
- **빠른 개발**: LangChain과 네이티브 통합
- **충분한 성능**: HNSW 알고리즘으로 수천~수만 문서까지 처리 가능

**벡터 검색 시스템:**
- 문서 청크를 임베딩하여 벡터로 변환 후 저장
- 사용자 질문도 임베딩하여 유사도 기반 검색
- 메타데이터 필터링으로 특정 문서만 검색 (채팅에 연결된 문서만)

#### 핵심 코드: 유사도 검색
```python
# server/app/services/rag_service.py
@staticmethod
async def search_similar_chunks(
    query: str,
    document_ids: Optional[list[str]] = None,
    k: Optional[int] = None
) -> list[dict]:
    """벡터 유사도 기반 관련 문서 청크 검색"""
    vectorstore = RAGService.get_vectorstore()
    k = k or RAGService.TOP_K_RESULTS

    # 문서 ID 필터링 (채팅에 연결된 문서만 검색)
    if document_ids:
        results = vectorstore.similarity_search(
            query,
            k=k,
            filter={"document_id": {"$in": document_ids}}
        )
    else:
        results = vectorstore.similarity_search(query, k=k)

    # 결과를 딕셔너리로 변환
    return [
        {
            "content": doc.page_content,
            "metadata": doc.metadata
        }
        for doc in results
    ]
```

### 5. OpenAI GPT-4o-mini API 통합 및 프롬프트 엔지니어링

**프롬프트 전략 개선 과정:**

**초기 프롬프트:**
```
이 문서를 읽고 질문에 답해줘.
```
- **문제점**: 문서와 무관한 질문(예: "오늘 날씨는?")에도 문서 내용을 억지로 끼워 맞춰 답변

**개선된 프롬프트:**
- 이전 대화 히스토리 제공 (최근 10개 메시지)
- 문서 내용 제공 (검색된 청크)
- 명확한 지시: "문서 관련 질문이면 문서 우선 참고, 일반 질문이면 AI 지식으로 유연하게 답변"

**목표:**
문서 기반 답변과 일반 대화를 자연스럽게 전환할 수 있는 유연한 AI 어시스턴트 구현

#### 핵심 코드: RAG 응답 생성
```python
# server/app/services/rag_service.py
@staticmethod
async def generate_response(
    query: str,
    context_chunks: list[dict],
    conversation_history: list[dict] = None
) -> str:
    """RAG 기반 응답 생성 (대화 히스토리 포함)"""
    llm = RAGService.get_llm()

    # 1. 대화 히스토리 포맷팅
    history_text = ""
    if conversation_history and len(conversation_history) > 0:
        history_text = "\n\n이전 대화 내용:\n"
        for msg in conversation_history:
            role_name = "사용자" if msg["role"] == "user" else "어시스턴트"
            content = msg["content"]
            if len(content) > 500:
                content = content[:500] + "..."
            history_text += f"{role_name}: {content}\n"

    # 2. 문서 컨텍스트 구성
    if context_chunks:
        context = "\n\n".join([
            f"[문서: {chunk['metadata'].get('filename', 'Unknown')}]\n{chunk['content']}"
            for chunk in context_chunks
        ])

        # 프롬프트 (문서 기반)
        prompt = f"""당신은 친절한 AI 어시스턴트입니다. 사용자가 업로드한 문서 내용을 참고하여 답변할 수 있습니다.
{history_text}

참고 문서 내용:

{context}

사용자 질문: {query}

답변 시 주의사항:
1. 위 대화 히스토리를 참고하여 맥락을 이해하세요.
2. 문서 내용이 질문과 관련이 있다면 우선적으로 참고하여 답변하세요.
3. 문서 내용을 사용했다면 어떤 문서를 참고했는지 간단히 언급하세요.
4. 문서 내용이 질문과 관련이 없다면, 일반 지식을 바탕으로 친절하게 답변하세요.
5. 한국어로 답변하세요.

답변:"""
    else:
        # 프롬프트 (일반 대화)
        prompt = f"""당신은 친절한 AI 어시스턴트입니다.
{history_text}

사용자 질문: {query}

답변 시 주의사항:
1. 위 대화 히스토리를 참고하여 맥락을 이해하세요.
2. 친절하고 정확하게 답변하세요.
3. 한국어로 답변하세요.
4. 모르는 내용은 모른다고 솔직히 말하세요.

답변:"""

    # 3. LLM 호출
    response = await llm.ainvoke(prompt)
    return response.content
```

### 6. PDF 문서 파싱 및 청킹 알고리즘 최적화

**청킹 전략 개선 과정:**

**초기 전략:**
- 고정 길이 500자로 청킹
- **문제점**: 문장이 중간에 잘려 맥락이 손실되는 문제 발생

**개선된 전략:**
- `RecursiveCharacterTextSplitter` 사용: 문단(`\n\n`), 줄바꿈(`\n`), 공백 순서로 자연스럽게 분할
- **chunk_size: 1000자**: 충분한 맥락 보존, 너무 크지 않아 검색 정확도 유지
- **chunk_overlap: 200자**: 청크 경계에서 맥락이 끊기지 않도록 20% 중복 설정

**실험 결과:**
논문 PDF에서 특정 섹션 내용을 질문했을 때 정확히 해당 부분을 찾아 답변하는 것을 확인

#### 핵심 코드: PDF 파싱 및 텍스트 추출
```python
# server/app/services/document_service.py
from pypdf import PdfReader
import io

@staticmethod
async def _extract_text_from_file(file_path: str, file_type: FileType) -> str:
    """파일에서 텍스트 추출"""
    # 1. GCS에서 파일 다운로드
    from google.cloud import storage
    bucket_name = settings.GCP_BUCKET_NAME
    blob_name = file_path.split(f"{bucket_name}/")[-1]
    
    client = storage.Client.from_service_account_json(
        settings.GOOGLE_APPLICATION_CREDENTIALS
    )
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    file_content = blob.download_as_bytes()

    # 2. 파일 타입별 텍스트 추출
    if file_type == FileType.PDF:
        # PDF 파일 처리
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()

    elif file_type == FileType.MARKDOWN or file_type == FileType.TEXT:
        # Markdown 또는 Text 파일 처리
        return file_content.decode("utf-8")

    else:
        raise ValueError(f"Unsupported file type: {file_type}")
```

### 7. 비동기 문서 처리 및 성능 최적화

**비동기 처리 도입 배경:**
- **문제**: 100페이지 논문 PDF를 업로드하면 파싱과 임베딩 생성에 약 30초가 걸려 사용자가 대기해야 하는 문제 발생
- **해결**: FastAPI의 `BackgroundTasks` 활용

**구현 방식:**
1. 파일 업로드 즉시 문서 메타데이터만 DB에 저장하고 상태를 `processing`으로 설정
2. 사용자에게 문서 ID와 함께 즉시 응답 반환 (업로드 완료)
3. 백그라운드 태스크에서 PDF 파싱 → 청킹 → 임베딩 → ChromaDB 저장 진행
4. 완료 시 상태를 `completed`로 업데이트

**에러 처리:**
- 비동기 작업 실패 시 상태를 `failed`로 업데이트
- 실패한 문서는 재업로드 또는 재시도 가능

**데이터 영속성:**
- GCS (Google Cloud Storage)를 활용한 문서 저장
- 서버 재시작이나 재배포 시에도 문서 보존
- [NewLearn Note](https://1dohyeon.github.io/projects/newlearnnote) 프로젝트와 통합 용이

#### 핵심 코드: 백그라운드 문서 처리
```python
# server/app/services/document_service.py
from fastapi import BackgroundTasks

@staticmethod
async def _process_document_background(document_id: str, db_url: str):
    """백그라운드에서 문서 처리 (텍스트 추출, 청킹, 임베딩, ChromaDB 저장)"""
    # 새로운 DB 세션 생성 (백그라운드 태스크용)
    async_db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")
    engine = create_async_engine(async_db_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            # 1. 문서 조회
            doc_query = select(Document).where(Document.id == document_id)
            result = await session.execute(doc_query)
            document = result.scalar_one_or_none()

            if not document:
                print(f"[ERROR] Document {document_id} not found")
                return

            # 2. 텍스트 추출
            print(f"[INFO] Extracting text from document {document_id}...")
            text = await DocumentService._extract_text_from_file(
                document.filePath,
                document.fileType
            )

            if not text.strip():
                raise ValueError("Extracted text is empty")

            # 3. ChromaDB에 저장 (청킹 및 임베딩은 RAGService에서 자동 처리)
            print(f"[INFO] Adding document {document_id} to vectorstore...")
            chunk_count = await RAGService.add_document_to_vectorstore(
                document_id=document_id,
                text=text,
                metadata={
                    "filename": document.filename,
                    "fileType": document.fileType.value
                }
            )

            # 4. 문서 상태 업데이트
            document.status = DocumentStatus.COMPLETED
            document.chunkCount = chunk_count
            await session.commit()

            print(f"[SUCCESS] Document {document_id} processed successfully ({chunk_count} chunks)")

        except Exception as e:
            print(f"[ERROR] Failed to process document {document_id}: {str(e)}")
            # 실패 시 상태 업데이트
            if document:
                document.status = DocumentStatus.FAILED
                await session.commit()
        finally:
            await engine.dispose()

@staticmethod
async def upload_document(
    db: AsyncSession,
    file: UploadFile,
    user_id: str,
    background_tasks: Optional[BackgroundTasks] = None
) -> DocumentUploadResponse:
    """문서 업로드 및 처리 시작"""
    # ... 파일 검증 로직 ...

    # 1. Document 레코드 생성 (status: processing)
    new_document = Document(
        userId=user_id,
        filename=file.filename,
        filePath="",
        fileType=FileType(file_extension),
        fileSize=file_size,
        status=DocumentStatus.PROCESSING,
        chunkCount=0
    )
    db.add(new_document)
    await db.commit()
    await db.refresh(new_document)

    try:
        # 2. GCS에 업로드
        gcs_url = await gcs_uploader.upload_document(
            file=file,
            document_id=new_document.id,
            file_extension=file_extension
        )
        new_document.filePath = gcs_url
        await db.commit()
        await db.refresh(new_document)

        # 3. 백그라운드 태스크로 문서 처리 시작
        if background_tasks:
            db_url = settings.DATABASE_URL
            background_tasks.add_task(
                DocumentService._process_document_background,
                document_id=new_document.id,
                db_url=db_url
            )
            print(f"[INFO] Background task scheduled for document {new_document.id}")

        return DocumentUploadResponse(
            id=new_document.id,
            filename=new_document.filename,
            status=new_document.status.value,
            created_at=new_document.createdAt
        )

    except Exception as e:
        # GCS 업로드 실패 시 Document 레코드 삭제
        await db.delete(new_document)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}"
        )
```

### 8. GCS(Google Cloud Storage)를 활용한 문서 저장 및 관리

**GCS 도입 이유:**
- **영속성**: 초기에는 로컬 파일시스템에 문서를 저장했는데, 서버 재배포 시 파일이 삭제되는 문제가 있었습니다.
- **확장성**: 스토리지 용량 제한 없음
- **통합 용이**: 향후 메인 프로젝트(NewLearn Note)와 동일한 인프라 사용
- **공개 URL**: 클라이언트에서 직접 파일 다운로드 가능

**구현 내용:**
- 서비스 계정 키로 인증하여 Python SDK로 업로드/다운로드 구현
- 문서 경로 구조: `user-documents/{document_id}.{extension}`
- 파일 메타데이터와 DB 레코드 동기화

#### 핵심 코드: GCS 업로드
```python
# server/app/utils/gcs_upload.py
from google.cloud import storage
from fastapi import UploadFile

class GCSUploader:
    def __init__(self):
        self.client = storage.Client.from_service_account_json(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
        self.bucket = self.client.bucket(settings.GCP_BUCKET_NAME)
    
    async def upload_document(
        self,
        file: UploadFile,
        document_id: str,
        file_extension: str
    ) -> str:
        """문서를 GCS에 업로드하고 공개 URL 반환"""
        blob_name = f"user-documents/{document_id}.{file_extension}"
        blob = self.bucket.blob(blob_name)
        
        # 파일 업로드
        file_content = await file.read()
        blob.upload_from_string(
            file_content,
            content_type=file.content_type or 'application/octet-stream'
        )
        
        # 공개 URL 반환
        return f"https://storage.googleapis.com/{settings.GCP_BUCKET_NAME}/{blob_name}"
```

### 9. Next.js 기반 웹 애플리케이션 개발

**웹 애플리케이션 (Next.js):**
- SSR과 CSR을 혼합한 최적의 렌더링 전략
- 반응형 UI로 다양한 화면 크기 지원
- TypeScript로 타입 안정성 확보

**주요 기능:**
- 채팅 인터페이스: 파일 첨부, 메시지 전송, 실시간 응답
- Markdown 렌더링: AI 응답을 코드 하이라이팅과 함께 표시
- 낙관적 업데이트: 사용자 메시지 즉시 표시 후 서버 응답 대기

#### 핵심 코드: 파일 업로드 및 채팅 UI
```typescript
// web/components/ChatArea.tsx
export default function ChatArea({ chatId, onChatCreated }: ChatAreaProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter((file) => {
            const ext = file.name.split(".").pop()?.toLowerCase();
            return ext === "pdf" || ext === "md" || ext === "txt";
        });

        if (validFiles.length === 0) return;

        try {
            // 파일 업로드 (백그라운드 처리 시작)
            const uploadPromises = validFiles.map((file) => 
                api.uploadDocument(file)
            );
            const uploadedDocs = await Promise.all(uploadPromises);
            const docIds = uploadedDocs.map((doc) => doc.id);

            setFiles((prev) => [...prev, ...validFiles]);
            setUploadedDocIds((prev) => [...prev, ...docIds]);
        } catch (error) {
            console.error("Failed to upload files:", error);
            alert("파일 업로드에 실패했습니다.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userInput = input.trim();
        setInput("");
        setLoading(true);

        // 낙관적 업데이트: 사용자 메시지 즉시 표시
        const tempUserMessage = {
            id: `temp-${Date.now()}`,
            chatId: chatId || "",
            role: "user" as const,
            content: userInput,
            attachedDocuments: files.map((file, index) => ({
                id: uploadedDocIds[index],
                filename: file.name,
            })),
            sources: null,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempUserMessage]);

        // AI 로딩 메시지 추가
        const tempLoadingMessage = {
            id: `loading-${Date.now()}`,
            chatId: chatId || "",
            role: "assistant" as const,
            content: "...",
            attachedDocuments: [],
            sources: null,
            createdAt: new Date().toISOString(),
            isLoading: true,
        };

        setMessages((prev) => [...prev, tempLoadingMessage]);

        try {
            // AI 응답 요청 (RAG 파이프라인 실행)
            const response = await api.createMessage({
                content: userInput,
                chatId: chatId,
                documentIds: uploadedDocIds.length > 0 ? uploadedDocIds : [],
            });

            // 새 채팅 생성된 경우
            if (response.chat && !chatId) {
                onChatCreated(response.chat.id);
            }

            // 임시 메시지 제거 후 실제 메시지로 교체
            setMessages((prev) => [
                ...prev.filter((msg) => 
                    msg.id !== tempUserMessage.id && 
                    msg.id !== tempLoadingMessage.id
                ),
                response.userMessage,
                response.assistantMessage,
            ]);

            // 파일 초기화
            setFiles([]);
            setUploadedDocIds([]);
        } catch (error) {
            console.error("Failed to send message:", error);
            // 에러 시 임시 메시지 제거
            setMessages((prev) => prev.filter((msg) => 
                msg.id !== tempUserMessage.id && 
                msg.id !== tempLoadingMessage.id
            ));
            // 입력 복원
            setInput(userInput);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.chatArea}>
            {/* 메시지 표시 영역 */}
            <div className={styles.messagesContainer}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.message}>
                        <div className={styles.messageRole}>
                            {message.role === "user" ? "사용자" : "AI"}
                        </div>
                        <MarkdownRenderer content={message.content} />
                        {message.attachedDocuments?.length > 0 && (
                            <div className={styles.attachments}>
                                {message.attachedDocuments.map((doc) => (
                                    <span key={doc.id}>{doc.filename}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                    type="file"
                    multiple
                    accept=".pdf,.md,.txt"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                    📎 파일 첨부
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문을 입력하세요..."
                />
                <button type="submit" disabled={loading}>
                    전송
                </button>
            </form>
        </div>
    );
}
```

## 프로젝트를 통해 배운 점

이 프로젝트를 통해 RAG 시스템의 작동 원리를 깊이 이해하고 실용적인 AI 서비스를 만드는 방법을 배웠습니다. 특히 문서 청킹 전략이 전체 시스템 성능에 큰 영향을 미친다는 점을 깨달았으며, 프롬프트 엔지니어링이 AI 시스템의 품질을 결정한다는 것을 경험했습니다.

프로토타입 우선 접근 방식을 통해 메인 프로젝트에 바로 통합하지 않고 독립적으로 검증함으로써 실패 비용을 낮추고 빠르게 학습할 수 있었습니다. 또한 익숙한 NestJS 대신 프로젝트에 적합한 FastAPI를 선택하면서, 도구는 목적에 맞게 선택해야 한다는 교훈을 얻었습니다.

기술적으로는 비동기 처리의 중요성을 깊이 이해하게 되었습니다. 대용량 문서 처리 시 사용자를 기다리게 하지 않고 즉시 응답을 반환한 뒤 백그라운드에서 처리하는 방식은, 사용자 경험과 시스템 효율성 모두를 고려한 설계의 중요성을 보여주었습니다.

향후 Nura에서 검증한 RAG 파이프라인을 [NewLearn Note](https://1dohyeon.github.io/projects/newlearnnote)에 통합하여, Next.js 웹/Electron 데스크톱 앱에서 AI 어시스턴스 UI를 구현할 예정입니다.
