# TypeScript 핵심 개념: 리터럴 타입, 타입 추론, 제네릭

TypeScript를 처음 접하거나 공식 문서를 읽다 보면 "리터럴 타입", "타입 추론", "제네릭"이라는 단어가 자주 등장합니다. 개념을 모른 채 넘어가면 나중에 코드를 읽거나 에러 메시지를 해석할 때 막히게 됩니다. 예제 중심으로 정리합니다.

---

## 타입이란?

TypeScript의 타입은 "이 변수에 어떤 종류의 값이 들어올 수 있는가"를 미리 정의하는 것입니다.

```typescript
let name: string = "홍길동";  // 문자열만 허용
let age: number = 20;           // 숫자만 허용
let isAdmin: boolean = false;   // true/false만 허용
```

타입을 지정해두면 엉뚱한 값을 넣었을 때 코드를 실행하기 전에 에러를 잡을 수 있습니다.

```typescript
let age: number = 20;
age = "스물"; // 오류: string을 number에 넣을 수 없음
```

---

## 리터럴 타입(Literal Type)

`string`은 "모든 문자열"을 의미합니다. 반면 리터럴 타입은 **특정 값 자체**가 타입이 됩니다.

```typescript
let status: "success" | "error" | "loading";

status = "success"; // 가능
status = "done";    // 오류: "done"은 허용된 값이 아님
```

`"success" | "error" | "loading"` 이렇게 허용할 값을 직접 나열하는 방식입니다. `|`는 "또는"을 의미합니다.

리터럴 타입이 유용한 이유는 값의 범위를 좁혀서 실수를 방지할 수 있기 때문입니다. API 응답 상태, 방향(up/down/left/right), 역할(admin/user) 같은 경우에 많이 씁니다.

```typescript
function move(direction: "up" | "down" | "left" | "right") {
    // direction은 반드시 네 가지 중 하나
}

move("up");    // 가능
move("north"); // 오류
```

---

## 타입 추론(Type Inference)

TypeScript는 타입을 직접 적지 않아도 **알아서 파악**합니다.

```typescript
let message = "안녕하세요"; // 따로 : string 안 써도 string으로 추론됨
let count = 10;             // number로 추론됨
```

이를 타입 추론이라고 합니다. TypeScript가 초깃값을 보고 타입을 결정합니다.

추론이 어려운 상황도 있습니다. 초깃값이 없거나, 여러 타입이 섞이는 경우입니다.

```typescript
let value;          // any로 추론 (위험)
value = "문자열";
value = 123;        // 아무 타입이나 들어올 수 있어서 타입 안전성이 없어짐
```

이런 경우에는 명시적으로 타입을 적어주는 것이 좋습니다.

```typescript
let value: string;  // 처음부터 string으로 제한
```

---

## 제네릭(Generic)

같은 로직인데 타입만 다른 함수를 여러 개 만들어야 한다면 어떻게 할까요?

```typescript
function getFirstString(arr: string[]): string {
    return arr[0];
}

function getFirstNumber(arr: number[]): number {
    return arr[0];
}
```

로직은 똑같은데 타입만 달라서 함수를 두 개 만들었습니다. 제네릭을 쓰면 하나로 합칠 수 있습니다.

```typescript
function getFirst<T>(arr: T[]): T {
    return arr[0];
}
```

`T`는 "타입 파라미터"입니다. 함수를 호출할 때 어떤 타입인지 결정됩니다.

```typescript
getFirst<string>(["a", "b", "c"]); // T = string, 반환값도 string
getFirst<number>([1, 2, 3]);       // T = number, 반환값도 number

// 타입 추론 덕분에 이렇게 생략도 가능
getFirst(["a", "b", "c"]); // TypeScript가 string[]을 보고 T = string으로 추론
```

제네릭의 핵심은 **타입을 나중에 정한다**는 것입니다. 함수를 작성할 때는 `T`라는 자리표시자를 두고, 실제 호출할 때 타입이 채워집니다.

---

## 정리

| 개념 | 한 줄 요약 |
|---|---|
| 리터럴 타입 | `string` 대신 `"success"` 처럼 특정 값 자체가 타입 |
| 타입 추론 | 초깃값을 보고 TypeScript가 타입을 자동으로 결정 |
| 제네릭 | 호출 시점에 타입이 결정되는 유연한 함수·클래스 |

세 개념 모두 TypeScript의 핵심 목표인 "런타임 에러를 컴파일 타임에 잡는다"를 위한 도구입니다.
