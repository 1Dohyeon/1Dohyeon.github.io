# Claude 3.7 Sonnet과 Extended Thinking

Anthropic이 [Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet)을 출시했습니다. 가장 주목할 점은 **Extended Thinking** 기능입니다.

---

## Extended Thinking이란

모델이 답변하기 전에 내부 추론 과정을 사용자에게 보여주는 기능입니다. OpenAI o1처럼 "생각하는 AI"인데, Claude는 그 생각 과정을 직접 볼 수 있게 했습니다.

```
[Thinking]
이 문제를 풀려면 A와 B 두 가지 접근이 가능합니다.
A 방식은 ~한 한계가 있고...
B 방식은 ~한 장점이 있어서 B를 선택하겠습니다.
[/Thinking]

→ 최종 답변: ...
```

추론 과정이 보이니 어디서 잘못 생각하는지, 어떤 가정을 전제로 하는지 파악하기 훨씬 쉬웠습니다.

---

## 언제 쓰면 좋은가

단순한 질문에는 오버킬입니다. 복잡한 알고리즘 설계나 버그의 원인 추적처럼 단계적 사고가 필요한 문제에서 차이가 납니다.

Extended Thinking을 켜면 응답 시간이 길어지고 토큰도 많이 씁니다. API에서는 `thinking` 파라미터로 활성화할 수 있습니다.

```python
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # 추론에 쓸 최대 토큰
    },
    messages=[{"role": "user", "content": "..."}]
)
```

---

## o1과 다른 점

o1은 추론 과정이 내부적으로만 진행되고 결과만 보여줍니다. Claude 3.7은 추론 과정 자체를 응답에 포함시킵니다. 어느 쪽이 좋다기보다 용도가 다릅니다. 추론 과정을 디버깅하거나 학습 목적으로 보고 싶을 때는 Claude 3.7이 유용합니다.

AI가 어떻게 생각하는지 들여다볼 수 있다는 게 신기했습니다. 틀린 답을 내더라도 어디서 잘못된 방향으로 갔는지 추론 과정에서 확인할 수 있습니다.
