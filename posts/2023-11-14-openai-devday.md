# OpenAI DevDay: GPT-4 Turbo와 Assistants API

2023년 11월 6일, OpenAI의 첫 개발자 컨퍼런스 DevDay가 열렸습니다. [공식 발표 내용](https://openai.com/blog/new-models-and-developer-products-announced-at-devday)을 바탕으로, 실제 개발에 영향을 줄 것들 위주로 정리합니다.

---

## GPT-4 Turbo: 무엇이 달라졌나

기존 GPT-4의 가장 큰 불만은 두 가지였습니다. 컨텍스트 윈도우가 좁고(8K 또는 32K), 가격이 비싸다는 것입니다. GPT-4 Turbo는 이 두 가지를 모두 개선했습니다.

**컨텍스트 윈도우 128K**
기존 GPT-4(8K 기준)의 16배입니다. 긴 문서, 대화 내역, 코드 전체를 한 번에 넣어서 처리할 수 있습니다. 128K 토큰은 약 300페이지 분량의 텍스트에 해당합니다.

**가격 인하**
GPT-4 대비 입력 토큰 3배, 출력 토큰 2배 저렴해졌습니다. API를 써보고 싶어도 GPT-4 비용이 걸림돌이었는데, 이번 인하로 시도해볼 만해졌습니다.

**지식 컷오프 업데이트**
기존 GPT-4의 학습 데이터는 2021년 9월까지였습니다. GPT-4 Turbo는 2023년 4월까지 업데이트됩니다.

---

## Assistants API: 상태 관리를 OpenAI에 위임한다

기존 Chat Completions API는 무상태(stateless)입니다. 대화 히스토리를 클라이언트에서 직접 관리하고 매 요청마다 전부 전달해야 했습니다. 대화가 길어질수록 토큰 비용도 같이 늘었습니다.

Assistants API는 이 구조를 바꿉니다. 대화 상태를 OpenAI 서버가 관리합니다.

핵심 개념은 세 가지입니다.

- **Assistant**: 어떤 모델을 쓰고, 어떤 도구(코드 실행, 파일 검색 등)를 사용할지 설정한 에이전트
- **Thread**: 사용자와의 대화 세션. 메시지 히스토리가 여기에 쌓임
- **Run**: Thread에서 Assistant를 실행하는 단위

```
Thread 생성 → 메시지 추가 → Run 실행 → 응답 조회
```

```python
# Assistants API 기본 흐름
thread = client.beta.threads.create()

client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Python으로 피보나치 수열을 작성해줘"
)

run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)
```

기존 방식에 비해 클라이언트 코드가 훨씬 단순해집니다. 대신 대화 데이터를 OpenAI 서버에 저장하는 구조이므로 데이터 보안 정책을 확인해야 합니다.

---

## 추가로 주목할 것들

**JSON 모드**
응답을 반드시 유효한 JSON으로 반환하도록 강제할 수 있습니다. 기존에는 프롬프트로 JSON 형식을 요청했는데 간혹 깨지는 경우가 있었습니다.

**재현 가능한 출력 (seed 파라미터)**
동일한 `seed` 값을 넘기면 같은 입력에 대해 동일한 결과를 반환하도록 시도합니다. 테스트와 디버깅에 유용합니다.

**Function Calling 개선**
여러 함수를 한 번에 병렬로 호출할 수 있게 됐습니다. 기존에는 한 번에 하나씩만 호출 가능했습니다.

---

## 정리

DevDay의 핵심은 **GPT-4를 더 쓸 만하게** 만든 것입니다. 컨텍스트가 길어지고 가격이 내려갔으며, Assistants API로 대화 상태 관리 구현이 훨씬 간단해졌습니다. 개인적으로 LLM을 공부하면서 API 비용이 부담스러웠는데, 이번 발표가 그 걱정을 많이 덜어줬습니다.

Assistants API는 아직 베타 단계입니다. Thread 데이터가 어떻게 보관되는지, 비용 구조는 어떤지 먼저 파악하고 쓰는 게 좋을 것 같습니다.
