# LangChain과 RAG 패턴: 왜 이 조합인가

LLM 기반 애플리케이션을 공부하다 보면 두 단어를 피할 수 없습니다. **LangChain**과 **RAG**입니다. [LangChain 0.1.0](https://blog.langchain.dev/langchain-v0-1-0/)이 출시되면서 API가 안정화됐고, 직접 써보기 훨씬 수월해졌습니다. 이 두 가지가 왜 함께 언급되는지, 그리고 실제로 어떤 문제를 해결하는지 정리합니다.

---

## RAG란 무엇인가

RAG는 **Retrieval-Augmented Generation**의 약자입니다. 직역하면 "검색으로 보강된 생성"입니다.

LLM은 학습 데이터의 지식만 알고 있습니다. 학습 이후에 생긴 정보나, 사내 문서처럼 공개되지 않은 데이터는 모릅니다. 이 한계를 해결하는 가장 현실적인 방법이 RAG입니다.

동작 방식은 간단합니다.

```
(1) 질문이 들어오면
(2) 관련 문서를 외부 저장소에서 검색해서 꺼내고
(3) 그 문서를 컨텍스트로 함께 LLM에 전달해서
(4) 답변을 생성하게 한다
```

LLM 자체를 수정하지 않고도 최신 정보나 공개되지 않은 문서를 활용할 수 있습니다.

---

## 파인튜닝으로 해결하면 안 되나?

RAG의 대안으로 자주 거론되는 것이 **파인튜닝(Fine-tuning)** 입니다. 모델 자체에 새로운 지식을 학습시키는 방법입니다. 하지만 몇 가지 이유로 RAG가 더 실용적인 경우가 많습니다.

| | RAG | 파인튜닝 |
|---|---|---|
| 비용 | 상대적으로 저렴 | GPU 학습 비용 필요 |
| 데이터 업데이트 | 즉시 반영 가능 | 재학습 필요 |
| 출처 추적 | 어떤 문서에서 답했는지 확인 가능 | 어렵다 |
| 적합한 상황 | 최신 정보, 공개되지 않은 문서 | 특정 말투·형식 학습 |

---

## RAG 파이프라인의 구성 요소

RAG 시스템은 크게 두 단계로 나뉩니다.

**인덱싱 단계** (오프라인)

```
문서 로드 → 청킹(분할) → 임베딩 생성 → 벡터 DB 저장
```

**검색-생성 단계** (실시간)

```
질문 → 질문 임베딩 → 유사도 검색 → 관련 청크 추출 → 프롬프트 구성 → LLM 응답
```

여기서 **청킹 전략**이 중요합니다. 문서를 너무 작게 자르면 맥락이 사라지고, 너무 크게 자르면 관련 없는 내용이 섞입니다. 문단 경계를 기준으로 자르고 일부를 겹치게(overlap) 하는 방식이 일반적입니다.

---

## LangChain은 왜 필요한가

RAG 파이프라인을 직접 구현하려면 OpenAI API, 벡터 DB 클라이언트, 문서 파서, 임베딩 모델 등을 각각 연결해야 합니다. LangChain은 이 과정을 추상화한 프레임워크입니다.

0.1.0부터 패키지가 분리됐습니다. 기존에는 `langchain` 하나에 다 들어 있었지만, 이제는 쓰는 것만 설치합니다.

```bash
pip install langchain-core langchain-openai langchain-chroma
```

코드도 **LCEL(LangChain Expression Language)** 문법으로 체인을 `|` 연산자로 연결합니다. 가독성이 높아지고 스트리밍, 비동기 처리도 자연스럽게 지원됩니다.

```python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 인덱싱
loader = PyPDFLoader("document.pdf")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

# LCEL 체인 구성
prompt = ChatPromptTemplate.from_template("""
다음 문서를 참고해서 질문에 답하세요.
문서: {context}
질문: {question}
""")

chain = (
    {"context": retriever, "question": lambda x: x}
    | prompt
    | ChatOpenAI()
    | StrOutputParser()
)

answer = chain.invoke("문서에서 찾고 싶은 내용")
```

---

## 여전히 고려해야 할 것들

LangChain이 편리하고 안정화됐지만, 여전히 유의할 점이 있습니다.

추상화 레이어가 두텁기 때문에 **내부 동작을 파악하기 어렵습니다.** 에러가 발생했을 때 어느 단계에서 문제가 생겼는지 추적하려면 LangChain의 구조를 어느 정도 알아야 합니다. 간단한 파이프라인이라면 LangChain 없이 직접 구현하는 편이 더 명확할 수 있습니다.

RAG 자체도 만능이 아닙니다. 검색된 문서가 질문과 관련 없으면 오히려 노이즈가 됩니다. 청킹 전략, 임베딩 모델 선택, 검색 파라미터 튜닝이 품질을 결정합니다.
