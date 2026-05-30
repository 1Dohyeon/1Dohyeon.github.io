# 반복 일정의 복잡한 업데이트: 삭제 후 생성 vs 직접 업데이트

플래너 앱을 개발하면서 가장 복잡했던 기능 중 하나가 바로 반복 일정 업데이트였습니다. Google Calendar나 Outlook을 사용해보신 분들이라면 익숙하실 "이 일정만", "이 일정 이후부터", "관련된 모든 일정"과 같은 선택지들을 구현하는 과정에서 많은 고민과 시행착오를 겪었습니다.

이번 글에서는 일정 시스템에서 Create, Delete, Update 각각에 필요한 API 설계부터 복잡한 반복 일정 업데이트 로직까지 차근차근 정리해보겠습니다.

## 기본적인 일정 API 설계

### Create API - 새로운 일정 생성

가장 기본적인 일정 생성 API부터 살펴보겠습니다.

```typescript
POST / events;
```

단일 일정과 반복 일정 모두 같은 엔드포인트를 사용합니다. 요청 바디에 `recurring` 필드가 있으면 반복 일정으로, 없으면 단일 일정으로 생성됩니다.

```javascript
// 단일 일정 생성
{
  "title": "팀 미팅",
  "startTime": "2024-09-06 10:00",
  "endTime": "2024-09-06 11:00",
  "description": "주간 팀 미팅"
}

// 반복 일정 생성
{
  "title": "주간 회의",
  "startTime": "2024-09-06 10:00",
  "endTime": "2024-09-06 11:00",
  "recurring": {
    "rule": "FREQ=WEEKLY;INTERVAL=1;BYDAY=FR",
    "startDate": "2024-09-06",
    "endDate": "2024-12-06"
  }
}
```

반복 일정의 경우 RRULE(Recurrence Rule) 형식을 사용하여 반복 패턴을 정의합니다. 백엔드에서는 이 규칙에 따라 개별 일정들을 생성하고, 모든 일정에 동일한 `recurringEventId`를 할당합니다.

### Delete API - 일정 삭제

일정 삭제 기능을 구현하면서 가장 먼저 고민한 것은 사용자 경험이었습니다. Google Calendar나 Apple Calendar를 사용해보면, 반복 일정을 삭제할 때 항상 선택지가 나타납니다. "이 일정만 삭제", "이 일정 이후 모두 삭제", "관련된 모든 일정을 삭제"

이런 선택지들이 존재하는 이유는 반복 일정의 특성 때문입니다. 매주 반복되는 회의가 있다고 할 때, 사용자가 한 번의 회의를 삭제하려는 의도는 다양할 수 있습니다:

-   **이번 주만 회의가 취소됨** → "이 일정만 삭제"
-   **이번 주부터 회의가 영구 취소됨** → "이 일정 이후 모두 삭제"
-   **회의 자체가 완전히 없어짐** → "관련된 모든 일정 삭제"

이런 다양한 시나리오를 지원하기 위해 단일 일정과 반복 일정의 특성에 따라 3가지 삭제 API로 분할하였습니다.

```typescript
DELETE / events / { id } / single; // 단일 일정 또는 반복 일정 중 하나만 삭제
DELETE / events / { id } / recurring; // 관련된 모든 반복 일정 삭제
DELETE / events / { id } / from - this; // 이 일정 이후의 반복 일정들만 삭제
```

`DELETE /events/{id}/from-this`는 기존 반복 일정의 종료 날짜를 선택된 일정의 이전 날로 수정하여 반복 일정을 "쪼개는" 방식으로 동작합니다.(반복일정 종료 날짜를 앞당김)

### Update API - 가장 복잡한 부분

처음에는 단순하게 생각했습니다. "업데이트니까 `PATCH` 요청 하나면 되겠지?" 하지만 반복 일정의 업데이트는 생각보다 훨씬 복잡했습니다.

결국 다음과 같은 API만 구현하게 되었습니다:

```typescript
PATCH / events / { id } / single; // 단일 일정 수정 또는 반복 일정을 단일로 분리
```

"반복 일정 전체를 업데이트하는 API는 왜 없나요?"라고 물으실 수 있습니다. 그 이유는 다음 섹션에서 자세히 설명드리겠습니다.

## 왜 삭제 후 생성을 선택했을까?

사용자 정보 수정과 같은 일반적인 경우에는 업데이트가 효율적입니다. 하지만 반복 일정의 경우는 다릅니다.

반복 일정의 시작 날짜나 종료 날짜, 또는 반복 규칙이 변경되면 어떤 일이 벌어질까요?

예를 들어, 매주 금요일 10시에 있던 회의를 매주 화요일 14시로 변경한다고 해보겠습니다. 기존에 생성된 금요일 10시 일정들은 모두 삭제되어야 하고, 새로운 화요일 14시 일정들이 생성되어야 합니다.

이런 상황에서 개별 일정들을 하나씩 업데이트하는 것보다는, 기존 반복 일정들을 모두 삭제하고 새로운 규칙에 따라 재생성하는 것이 훨씬 간단하고 확실합니다.

```javascript
// 비효율적인 방법: 개별 업데이트
for (const event of relatedEvents) {
    await updateEvent(event.id, newEventData);
}

// 효율적인 방법: 삭제 후 재생성
await deleteRecurringEvents(eventId);
await createEvent(newRecurringEventData);
```

## 복잡한 업데이트 케이스들

실제 구현에서는 단일 일정과 반복 일정 간의 변환, 그리고 반복 일정의 부분 수정 등 다양한 케이스를 고려해야 했습니다.

### Case 1: 단일 → 단일

가장 간단한 경우입니다. 기존 일정의 내용만 수정하면 됩니다.

```javascript
// 프론트엔드에서
const updateEventDto = buildUpdateEventDto();
await eventApi.updateSingleEvent(event.id, updateEventDto);
```

### Case 2: 단일 → 반복

단일 일정에 반복 설정을 추가하는 경우입니다. 기존 단일 일정을 삭제하고 반복 일정을 새로 생성합니다.

```javascript
// 기존 단일 일정 삭제
await eventApi.deleteSingleEvent(event.id);
// 새로운 반복 일정 생성
const createEventDto = buildCreateEventDto();
await eventApi.createEvent(createEventDto);
```

여기서 중요한 것은 시작 날짜 처리입니다. 사용자가 9월 27일 단일 일정을 9월 6일부터 시작하는 반복 일정으로 변경할 수 있기 때문에, 폼에서 입력된 날짜가 더 이른 경우 그 날짜를 사용해야 합니다.

### Case 3: 반복 → 단일

모든 반복 일정을 삭제하고 단일 일정을 새로 생성합니다.

```javascript
await eventApi.deleteRecurringEvents(event.id);
const createEventDto = buildCreateEventDto(); // recurring 필드 없음
await eventApi.createEvent(createEventDto);
```

### Case 4: 반복 → 반복 (가장 복잡한 케이스)

반복 일정을 반복 일정으로 수정하는 경우가 가장 복잡합니다. 여기서 중요한 것은 **무엇이 변경되었는지**에 따라 사용자에게 다른 선택지를 제공해야 한다는 점입니다.

**4-1. 반복 설정이 변경되지 않은 경우** (제목, 시간, 설명 등 기본 정보만 수정):

-   "이 일정만 수정" ✅
-   "관련 일정 모두 수정" ✅
-   "이 일정 이후 수정" ✅
-   → **3가지 선택지 모두 제공**

**4-2. 반복 설정이 변경된 경우** (RRULE, 반복 종료 날짜가 변경):

-   "이 일정만 수정" ❌ (반복 패턴이 바뀌면 의미가 없음)
-   "관련 일정 모두 수정" ✅
-   "이 일정 이후 수정" ✅
-   → **2가지 선택지만 제공**

구체적인 예시로 설명해보겠습니다:

**시나리오 1: 매주 금요일 10시 회의 → 11시로 시간만 변경**

-   반복 패턴(매주 금요일)은 그대로, 시간만 변경
-   "이번 주만 11시로" 선택 가능 ✅
-   3가지 선택지 모두 제공

**시나리오 2: 매주 금요일 회의 → 매주 화요일로 요일 변경**

-   반복 패턴 자체가 변경됨
-   "이번 주만 화요일로"는 불가능 ❌
-   2가지 선택지만 제공 (모두 수정 / 이후 수정)
-   "이번 주만 화요일로"의 경우는 recurringEvent 테이블 값 변경이 아닌, event 테이블의 startTime, endTime을 화요일로 변경하는 것이므로 시나리오 1과 같은 경우입니다. 시나리오 3에서 간결하게 설명합니다.

**시나리오 3: 매주 금요일 회의 → 이번 주만 화요일로 예외적으로 변경**

-   이것은 반복 패턴 변경이 아니라 특정 일정의 날짜 변경
-   반복 설정은 그대로 두고 개별 일정만 수정
-   "이 일정만 수정" 선택 가능 ✅
-   3가지 선택지 모두 제공

즉, **반복 규칙 자체를 바꾸는 것**과 **개별 일정의 날짜를 바꾸는 것**은 완전히 다른 개념입니다.

이런 로직을 `hasRecurringChanged()` 함수로 구현했습니다:

```javascript
const hasRecurringChanged = () => {
    return (
        recurring.rule !== recurringEventData.rule ||
        recurring.startDate !== recurringEventData.startDate ||
        recurring.endDate !== (recurringEventData.endDate || undefined)
    );
};
```

#### "이 일정만 수정"

선택된 일정 하나만 반복 그룹에서 분리하여 독립적인 단일 일정으로 만듭니다.

```javascript
const updateEventDto = buildUpdateEventDto();
await eventApi.updateSingleEvent(event.id, updateEventDto);
// 백엔드에서 recurringEventId를 null로 설정
```

#### "관련 일정 모두 수정"

모든 반복 일정을 삭제하고 새로운 설정으로 재생성합니다. 이때 중요한 것은 기존 반복 일정의 시작 날짜가 더 이른 경우 그 날짜를 보존해야 한다는 점입니다.

```javascript
// 프론트엔드에서 시작 날짜 보존 로직
let startDate = recurringData.startDate;
if (recurring && recurring.startDate && new Date(recurring.startDate) < new Date(recurringData.startDate)) {
    startDate = recurring.startDate; // 기존이 더 이른 경우 유지
}
```

#### "이 일정 이후 수정"

가장 복잡한 케이스입니다. 선택된 일정 이후의 반복 일정들만 삭제하고, 새로운 설정으로 재생성합니다.

```javascript
await eventApi.deleteEventsFromThis(event.id);
const [startDateStr] = event.startTime.split(" ");
const createEventDto = buildCreateEventDto(startDateStr); // 현재 일정 날짜 강제 적용
await eventApi.createEvent(createEventDto);
```

## 프론트엔드에서의 복잡한 상태 관리

백엔드 API는 상대적으로 단순하지만, 프론트엔드에서는 사용자 경험을 위해 복잡한 로직이 필요했습니다.

### 언제 선택 모달을 보여줄까?

모든 업데이트에서 "이 일정만", "관련 일정 모두", "이 일정 이후" 선택지를 보여주면 사용자가 혼란스러워합니다. 따라서 상황에 따라 적절한 옵션만 제공해야 합니다.

```javascript
const getUpdateOptions = () => {
    const wasRecurring = !!event?.recurringEventId;
    const willBeRecurring = !!recurring && !!recurring.rule && !!recurring.startDate;

    // 단일 → 단일, 단일 → 반복, 반복 → 단일: 모달 없이 직접 처리
    if (!wasRecurring || !willBeRecurring) {
        return { shouldShowModal: false };
    }

    // 반복 → 반복: 반복 설정 변경 여부에 따라 옵션 결정
    const recurringChanged = hasRecurringChanged();
    if (!recurringChanged) {
        // 반복 설정 변경 없음: 모든 옵션 제공
        return {
            shouldShowModal: true,
            showSingleOption: true,
            showRecurringOption: true,
            showFromThisOption: true,
        };
    } else {
        // 반복 설정 변경됨: "이 일정만 변경" 제외
        return {
            shouldShowModal: true,
            showSingleOption: false,
            showRecurringOption: true,
            showFromThisOption: true,
        };
    }
};
```

## 배운 점들

### 1. 복잡한 비즈니스 로직에서는 단순하게 접근하는 방법도 생각하자

처음에는 모든 경우를 하나의 업데이트 API로 처리하려고 했습니다. 하지만 결국 삭제 후 생성하는 방식이 더 단순하고 안정적이었습니다.

### 2. 사용자 경험이 코드 복잡성을 결정한다

백엔드 API는 단순하지만, 프론트엔드에서 사용자에게 적절한 선택지만 제공하기 위해 복잡한 로직이 필요했습니다. 좋은 사용자 경험을 위해서는 이런 복잡성을 감수하고 많은 테스트를 시도해야 했습니다.

### 3. 상태 관리의 어려움

React의 상태 업데이트 비동기성, 여러 상태 간의 의존성 등 프론트엔드 상태 관리의 복잡함을 다시 한번 느꼈습니다. 상태보다는 파라미터로 데이터를 전달하는 것이 때로는 더 안전할 수 있습니다.

## 마무리

반복 일정 업데이트 기능을 구현하면서 단순해 보이는 기능도 실제로는 많은 고려사항이 있다는 것을 배웠습니다. 사용자 입장에서는 "일정 수정"이라는 하나의 기능이지만, 개발하는 입장에서는 7가지 다른 케이스를 모두 고려해야 했습니다.

앞으로 비슷한 복잡한 기능을 구현할 때는 처음부터 모든 케이스를 정리하고, 각 케이스별로 최적의 처리 방식을 선택하는 것이 중요할 것 같습니다. 그리고 복잡한 로직일수록 더욱 철저한 문서화가 필요하다는 점도 깨닫게 되었습니다.
