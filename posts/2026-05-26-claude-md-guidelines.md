# 많은 사람들에게 star를 받은 CLAUDE.md를 읽고

GitHub에서 [엄청난 수의 star를 받은 CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)를 발견했습니다. AI에게 코딩 실수를 줄이는 행동 지침을 적어둔 파일입니다. 읽으면서 공감되는 부분이 많았습니다.

---

## CLAUDE.md가 뭔가

Claude Code(또는 다른 LLM 코딩 도구)에 프로젝트 루트에 넣어두면 AI가 참고하는 지침 파일입니다. 이 파일은 프로젝트별 설명 대신, AI가 코딩할 때 범하는 전형적인 실수를 줄이기 위한 행동 원칙을 담고 있습니다.

네 가지로 구성됩니다.

1. **Think Before Coding**: 가정하지 말고, 모호하면 물어라
2. **Simplicity First**: 요청받은 것만 짜라. 투기성 기능 없이
3. **Surgical Changes**: 건드려야 할 것만 건드려라
4. **Goal-Driven Execution**: 성공 기준을 먼저 정의하라

---

## 공감됐던 이유

이 지침들에 공감됐던 건 전부 맞는 말이기 때문입니다.

AI로 코드를 작성하다 보면 분명히 50줄이면 될 걸 200줄로 만들어 오는 경험을 합니다. 묻지 않고 "이게 더 좋을 것 같아서" 기능을 추가해 오거나, 건드리지 말아야 할 주변 코드까지 **개선**해버리기도 합니다. 요청하지 않은 에러 핸들링을 잔뜩 붙여 오는 것도 마찬가지입니다.

이 지침들이 이렇게 많이 공유됐다는 건, 이 불편함이 나만 겪는 게 아니라는 뜻입니다.

---

## 가장 와닿은 문장

> "If you write 200 lines and it could be 50, rewrite it."

그리고:

> "The test: Every changed line should trace directly to the user's request."

두 번째 문장이 특히 강렬했습니다. AI가 만든 diff를 볼 때 "이 줄은 왜 바뀐 거지?"라는 의문이 드는 순간이 있습니다. 그 의문이 생기면 이미 이 원칙을 어긴 것입니다.

---

## Vibe Coding과의 충돌

1년전 [Vibe Coding에 대한 글](/blog/2025-05-28-vibe-coding)을 썼습니다. 그때부터 AI가 다 짜준다는 방향이 개발 트렌드처럼 느껴졌습니다. 그런데 이 CLAUDE.md는 정반대의 메시지를 담고 있습니다.

> "Think Before Coding. Don't assume. Surface tradeoffs."

빠르게 짜주는 것보다, 먼저 물어보고 명확히 하는 게 낫다는 겁니다. Vibe Coding이 속도를 강조한다면, 이 지침은 속도보다 정확성을 강조합니다. 파일 첫 줄에도 이렇게 써 있습니다.

> "Tradeoff: These guidelines bias toward caution over speed."

---

## 느낀 것

AI 도구에 지침을 주는 게 이렇게 많이 공유될 수 있다는 것 자체가 흥미로웠습니다. AI가 코드를 잘 짜게 만들기 위해 사람이 글을 써야 한다는 역설도 그렇고, 그 글이 수많은 star를 받는다는 것도 그렇습니다.

결국 AI를 잘 쓰는 것도 실력인 것 같습니다. 어떤 질문을 해야 하는지, 어디서 멈추고 확인해야 하는지, 생성된 코드의 어떤 부분을 의심해야 하는지. 이 지침을 읽고 나서, AI에게 요청을 넣기 전에 한 번 더 생각하게 됐습니다.
