# Next.js App Router: Pages Router와 무엇이 다른가

Next.js 13부터 등장한 App Router가 Next.js 14에서 안정화됐습니다. [공식 문서](https://nextjs.org/docs/app)를 보면서 기존 Pages Router와 어떻게 다른지 정리해봤습니다.

---

## 가장 큰 변화: React Server Components가 기본값

App Router에서 모든 컴포넌트는 기본적으로 서버 컴포넌트(RSC)입니다. 클라이언트에서 실행이 필요한 경우에만 파일 상단에 `'use client'`를 선언합니다.

```tsx
// 서버 컴포넌트 (기본값, 별도 선언 불필요)
async function UserList() {
    const users = await fetchUsers(); // 서버에서 직접 DB 조회 가능
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// 클라이언트 컴포넌트
'use client';
function Counter() {
    const [count, setCount] = useState(0); // useState는 클라이언트에서만
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

처음에 헷갈렸는데, `useState`, `useEffect`, 이벤트 핸들러가 필요하면 클라이언트 컴포넌트라고 기억하면 됩니다.

---

## 데이터 페칭 방식 변화

Pages Router에서는 `getServerSideProps`, `getStaticProps`를 쓰는 특수한 함수가 따로 있었습니다. App Router에서는 컴포넌트가 서버 컴포넌트이기 때문에 그냥 `async/await`로 직접 데이터를 가져옵니다.

```tsx
// Pages Router (기존)
export async function getServerSideProps() {
    const data = await fetchData();
    return { props: { data } };
}

// App Router
async function Page() {
    const data = await fetchData(); // 컴포넌트 안에서 직접
    return <div>{data.title}</div>;
}
```

---

## 파일 구조 변화

`app/` 디렉토리 안에서 특수 파일들로 역할을 나눕니다.

| 파일 | 역할 |
|---|---|
| `page.tsx` | 라우트 페이지 |
| `layout.tsx` | 공통 레이아웃 (중첩 가능) |
| `loading.tsx` | 로딩 상태 UI |
| `error.tsx` | 에러 처리 UI |
| `not-found.tsx` | 404 페이지 |

레이아웃이 중첩된다는 게 특히 편합니다. `/dashboard`와 `/dashboard/settings`가 공통 사이드바를 공유할 때, 예전엔 직접 컴포넌트를 불러와야 했는데 이제는 `layout.tsx` 하나로 자동 적용됩니다.

---

## 아직 적응 중인 부분

서버 컴포넌트와 클라이언트 컴포넌트를 섞어 쓸 때 어디서 어디까지 클라이언트로 내려야 하는지 판단이 아직 어렵습니다. 서버 컴포넌트 안에 클라이언트 컴포넌트를 넣을 수는 있지만, 반대로 클라이언트 컴포넌트 안에 서버 컴포넌트를 직접 import하는 건 안 됩니다.
