# 반복 일정 업데이트: 삭제 후 재생성을 선택한 이유

Google Calendar나 Outlook에서 반복 일정을 수정하면 선택지가 나타납니다. "이 일정만", "이 일정 이후부터", "관련된 모든 일정". 단순해 보이는 선택지 뒤에는 꽤 복잡한 설계가 필요합니다.

플래너 앱을 개발하면서 반복 일정 업데이트를 구현했고, API 설계부터 케이스별 처리 로직까지 정리합니다.

---

## API 설계

### 생성 API

단일 일정과 반복 일정 모두 같은 엔드포인트를 사용합니다. `recurring` 필드가 있으면 반복 일정으로 처리합니다.

```typescript
POST /events
```

```javascript
// 단일 일정
{
    "title": "팀 미팅",
    "startTime": "2024-09-06 10:00",
    "endTime": "2024-09-06 11:00"
}

// 반복 일정
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

반복 패턴은 RRULE 형식으로 정의합니다. 백엔드에서 이 규칙에 따라 개별 일정들을 생성하고, 같은 반복 그룹에 동일한 `recurringEventId`를 부여합니다.

### 삭제 API

반복 일정 삭제는 세 가지 경우를 지원합니다.

```typescript
DELETE /events/{id}/single      // 이 일정 하나만 삭제
DELETE /events/{id}/recurring   // 연관된 모든 반복 일정 삭제
DELETE /events/{id}/from-this   // 이 일정부터 이후 모두 삭제
```

`from-this`는 해당 일정 이전 날로 반복 종료 날짜를 앞당기는 방식으로 구현됩니다.

### 수정 API

```typescript
PATCH /events/{id}/single  // 단일 일정 수정 또는 반복 그룹에서 분리
```

반복 일정 전체를 수정하는 별도 API를 두지 않은 이유는 다음 섹션에서 설명합니다.

---

## 왜 직접 업데이트 대신 삭제 후 재생성을 선택했을까?

반복 일정의 규칙 자체가 바뀌는 경우를 생각해보겠습니다. 매주 금요일 10시 회의를 매주 화요일 14시로 변경한다면, 기존 금요일 일정들은 전부 삭제되어야 하고 화요일 일정들이 새로 생성되어야 합니다.

이 상황에서 개별 일정을 하나씩 업데이트하는 것보다, 기존 반복 일정을 전부 삭제하고 새 규칙으로 재생성하는 것이 훨씬 단순하고 안전합니다.

```javascript
// 비효율적인 방법: 개별 업데이트
for (const event of relatedEvents) {
    await updateEvent(event.id, newEventData);
}

// 선택한 방법: 삭제 후 재생성
await deleteRecurringEvents(eventId);
await createEvent(newRecurringEventData);
```

---

## 수정 케이스별 처리

### Case 1: 단일 → 단일

기존 일정의 내용만 수정합니다.

```javascript
await eventApi.updateSingleEvent(event.id, updateEventDto);
```

### Case 2: 단일 → 반복

기존 단일 일정을 삭제하고 반복 일정을 새로 생성합니다.

```javascript
await eventApi.deleteSingleEvent(event.id);
await eventApi.createEvent(createEventDto);
```

시작 날짜 처리에 주의가 필요합니다. 9월 27일 단일 일정을 9월 6일부터 반복 일정으로 변경할 수 있기 때문에, 폼에서 입력된 날짜가 기존보다 이른 경우 그 날짜를 우선합니다.

### Case 3: 반복 → 단일

모든 반복 일정을 삭제하고 단일 일정을 새로 생성합니다.

```javascript
await eventApi.deleteRecurringEvents(event.id);
await eventApi.createEvent(createEventDto); // recurring 필드 없음
```

### Case 4: 반복 → 반복

가장 복잡한 케이스입니다. **무엇이 바뀌었는지**에 따라 사용자에게 다른 선택지를 제공합니다.

**반복 규칙이 변경되지 않은 경우** (제목, 시간, 설명 등 기본 정보만 수정)
- "이 일정만 수정" / "이후 모두 수정" / "관련 일정 전체 수정" - 3가지 모두 제공

**반복 규칙이 변경된 경우** (RRULE, 종료 날짜 변경)
- "이 일정만 수정" 불가 - 패턴이 바뀌면 단일 예외를 만드는 것이 의미 없음
- "이후 모두 수정" / "관련 일정 전체 수정" - 2가지만 제공

```javascript
const hasRecurringChanged = () => {
    return (
        recurring.rule !== recurringEventData.rule ||
        recurring.startDate !== recurringEventData.startDate ||
        recurring.endDate !== (recurringEventData.endDate || undefined)
    );
};
```

---

## 프론트엔드 선택지 결정 로직

```javascript
const getUpdateOptions = () => {
    const wasRecurring = !!event?.recurringEventId;
    const willBeRecurring = !!recurring?.rule && !!recurring?.startDate;

    // 단일 ↔ 반복 전환은 모달 없이 직접 처리
    if (!wasRecurring || !willBeRecurring) {
        return { shouldShowModal: false };
    }

    // 반복 → 반복: 규칙 변경 여부에 따라 옵션 결정
    const recurringChanged = hasRecurringChanged();
    return {
        shouldShowModal: true,
        showSingleOption: !recurringChanged,
        showRecurringOption: true,
        showFromThisOption: true,
    };
};
```

---

## 정리

반복 일정 업데이트에서 핵심은 두 가지를 구분하는 것입니다.

- **반복 규칙 자체가 바뀌는 것**: 기존 일정 전체 삭제 후 재생성
- **개별 일정의 내용이 바뀌는 것**: 해당 일정만 그룹에서 분리해 수정

복잡한 로직일수록 단순한 접근이 더 안전합니다. 반복 일정 전체 업데이트를 "삭제 후 재생성"으로 단순화한 덕분에 엣지 케이스 처리가 훨씬 명확해졌습니다.
