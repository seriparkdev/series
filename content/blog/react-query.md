---
title: React-Query의 핵심 개념 살펴보기
date: 2022-09-14
description: 단순 공식 문서 번역글입니다.
tags: [React-Query]
---

# 서론

TanStack Query를 프로젝트에 적용하게 되었는데, 공식 문서가 한글로 번역되어 있지 않아 더 어렵게 느껴졌다. 평소에도 영어로 된 기술 문서를 읽는 데 어려움을 느껴서 연습하고자 번역 글을 작성하게 되었다. 이 글은 단순 번역 글이며 매끄럽지 않을 수 있다.

<br>

# TanStack Query의 핵심 개념

공식 문서에서 TanStack Query의 핵심 개념을 다음과 같이 세 가지로 소개하고 있다. 이 핵심 개념을 깊이 파보려고 한다.

- **Queries**
- **Mutations**
- **Query Invalidation**
  <br>

## 📌 Queries

쿼리는 **서버에서 데이터를 가져오기 위해** 프로미스 기반의 메서드(GET, POST...) 와 사용될 수 있다. (데이터를 서버에서 수정하기 위해서는 `Mutations`을 사용한다.)

컴포넌트나, 커스텀 훅에서 쿼리를 구독하기 위해서는 `useQuery`라는 훅을 사용한다. `useQuery`를 사용하기 위해서는 **쿼리의 고유 키**, **프로미스를 반환하는 함수**(Resolves the data, Throws an error)가 필요하다.

### ✏️ useQuery 사용법

**useQuery(고유 키, 함수)**

```javascript
import { useQuery } from "@tanstack/react-query";

function App() {
  const info = useQuery(["todos"], fetchTodoList);
}
```

고유 키는 내부적으로 애플리케이션 전체에서 **refetching, caching, sharing**할 때 사용된다. `useQuery`의 결과 값은 템플릿 및 데이터 사용에 필요한 쿼리에 대한 모든 정보를 가지고 있다.

```javascript
const result = useQuery(["todos"], fetchTodoList);
```

`result` 객체는 상태들을 담고 있다. 쿼리가 가질 수 있는 상태들은 다음과 같다. 이 중 한 가지만 상태로 가진다.

- `isLoading` or `status === loading`

  쿼리에 아직 데이터가 없을 때

- `isError` or `status === error`

  쿼리에 오류가 발생했을 때

- `isSuccess` or `status === success`

  쿼리가 성공적인 상태이며 데이터를 사용할 수 있는 상태
  <br>

이런 기본 상태 외에도 쿼리 상태에 따라 더 많은 정보를 얻을 수 있다.

- `error`

  쿼리가 `isError` 상태인 경우, 에러는 `error` 프로퍼티를 통해 접근 가능하다.

- `data`

  쿼리 상태가 `success`인 경우, 데이터는 `data` 프로퍼티를 통해 접근 가능하다.
  <br>

**쿼리 상태의 활용**

```javascript
function Todos() {
  const { isLoading, isError, data, error } = useQuery(
    ["todos"],
    fetchTodoList
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // 다음으로 오는 코드의 상태는 `isSuccess === true` 라고 가정할 수 있다.
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

위와 같은 코드는 다음과 같이 쓸 수도 있다. 코드만 조금 다를 뿐 같은 기능을 한다.

```javascript
function Todos() {
  const { status, data, error } = useQuery(["todos"], fetchTodoList);

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

**fetchStatus**

- `fetchStatus === fetching`

  쿼리가 fetching 상태

- `fetchStatus === paused`

  fetch를 하려고 했으나, 멈춘 상태

- `fetchStatus === idle`

  쿼리가 아무 일도 하고 있지 않을 때
  <br>

**그렇다면 `status`와 `fetchStatus`의 차이는 무엇일까?**

`status`가 success인 상태면 `fetchStatus`는 보통 idle 상태가 된다. 그러나 background refetch가 일어나고 있다면 `fetching` 상태가 될 수도 있다.

혹은 쿼리가 마운트 되고 있거나, 데이터가 없으면 보통 `loading`이나 `fetching` 상태가 되지만, 네트워크 연결이 되지 않아서 `paused` 상태가 되기도 한다.

이런 상황이 생길 수 있기 때문에 경우에 따라 상태를 잘 사용해야 한다.

<br>

### ✏️ Query keys

TanStack Query는 쿼리 키를 기반으로 쿼리 캐싱을 관리한다. 쿼리 키가 **직렬화** 될 수 있고, 쿼리의 데이터에 대해서 **고유하다면** 그 키를 사용할 수 있다. 키는 가져오는 **데이터를 고유하게 식별하기 위해서** 쓰인다.

쿼리가 데이터에 대해서 많은 설명을 더 필요로 할 때, 문자 혹은 객체를 사용할 수도 있다.

```javascript
// An individual todo
useQuery(['todo', 5], ...)

// An individual todo in a "preview" format
useQuery(['todo', 5, { preview: true }], ...)

// A list of todos that are "done"
useQuery(['todos', { type: 'done' }], ...)
```

그리고 쿼리가 변수에 의존하고 있다면, 해당 변수를 같이 적어줘야 한다.

```javascript
function Todos({ todoId }) {
  const result = useQuery(["todos", todoId], () => fetchTodoById(todoId));
}
```

<br>

## 📌 Mutations

`Mutaion`은 CRUD 중 **Create, Update, Delete**의 기능을 구현하고 싶을 때 사용한다. Read는 앞서 말했던 것과 같이 `useQuery`로 구현할 수 있다. 그리고 `Mutation`은 **서버 사이드 이펙트**를 일으킬 때도 사용할 수 있다. 이를 위해서는 `useMutation` 훅을 사용한다.
<br>

**mutaion으로 서버에 새로운 투두를 올리는 예시**

```javascript
function App() {
  const mutation = useMutation((newTodo) => {
    return axios.post("/todos", newTodo);
  });

  return (
    <div>
      {mutation.isLoading ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Do Laundry" });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

<br>

### ✏️ mutation 상태

useQuery와 같이 mutation도 상태를 관리할 수 있다.

- `isIdle` or `status === idle`

  idle or fresh / reset(mutation 상태 clean)

- `isLoading` or `status === loading`

  running

- `isError `or `status === error`

- `isSuccess` or `status === success`

  success / data is available

이 주요 상태 외에도 mutation의 상태에 따라 더 많은 정보를 이용할 수 있다.

- `error`
  쿼리가 `isError` 상태인 경우, 에러는 `error` 프로퍼티를 통해 접근 가능하다.
- `data`
  쿼리 상태가 `success`인 경우, 데이터는 `data` 프로퍼티를 통해 접근 가능하다.

  <br>

### ✏️ Mutation 상태 초기화

mutation의 `error`나 `data`를 초기화해야 할 때 `reset` 함수를 사용하면 된다.

```javascript
const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const mutation = useMutation(createTodo);

  const onCreateTodo = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  );
};
```

<br>

### ✏️ mutation 부수 효과

`useMutation`은 mutation의 lifecycle 동안 부수 효과를 어느 단계에서든지 일으킬 수 있는 옵션을 제공한다. 이는 mutation 후 쿼리를 **invalidating(무효화)하거나 refetching** 하는 데에 유용하다.

```javascript
useMutation(addTodo, {
  onMutate: (variables) => {
    // A mutation is about to happen!

    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, context) => {
    // Error or success... doesn't matter!
  },
});
```

<br>

`useMutation`으로 전달된 `mutationFn`은 비동기적이라는 것을 잊지 말아야 한다. 이 때문에 mutation 함수 호출의 순서와 mutations들이 실행되는 순서는 다를 수 있다.

```javascript
useMutation(addTodo, {
  onSuccess: (data, error, variables, context) => {
    // Will be called 3 times
  },
})[("Todo 1", "Todo 2", "Todo 3")].forEach((todo) => {
  mutate(todo, {
    onSuccess: (data, error, variables, context) => {
      // Will execute only once, for the last mutation (Todo 3),
      // regardless which mutation resolves first
    },
  });
});
```

`mutate` 대신 `mutateAsync`를 사용해서 resolve on success 또는 throw on an error하는 프로미스를 얻을 수 있다.

그리고 이는 사이드 이펙트를 구성하는데 사용될 수 있다.

```javascript
const mutation = useMutation(addTodo);

try {
  const todo = await mutation.mutateAsync(todo);
  console.log(todo);
} catch (error) {
  console.error(error);
} finally {
  console.log("done");
}
```

## 📌 Query Invalidation

쿼리를 다시 가져오기 전에, 마냥 쿼리가 오래된 상태가 되길 기다리는 것은 옳지 않다. 특히 사용자가 어떠한 일을 수행해서 쿼리의 데이터가 이제 out of data라는 것을 알고 있을 때는 더욱 그렇다. 이를 위해서 `queryClient`는 `invalidataQueries`라는 메서드를 갖고 있다. 이는 쿼리가 **오래된 것**이라고 알려주고, 잠재적으로 **refetch** 할 수 있다.

```javascript
// Invalidate every query in the cache
queryClient.invalidateQueries();
// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries(["todos"]);
```

`invalidateQueries`로 쿼리가 invalidated 된다면 다음과 같은 일이 발생한다.

- 오래된 것이라 표시. 이러한 stale 상태는 `useQuery`나 관련 훅에서 사용 되고 있는 `staleTime`(얼마의 시간이 흐른 후 데이터를 stale 취급할 것인지 설정한 것) 설정을 재정의한다.
- 만약 쿼리가 현재 `useQuery`나 관련 훅에 의해 렌더링 되고 있는 중이라면, 백그라운드에서 refetched 될 것이다.

다음 코드를 예를 들어, `todos` prefix로 쿼리 키에서 `todos`로 시작하는 쿼리들을 invalidate 할 수 있다.

```javascript
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Get QueryClient from the context
const queryClient = useQueryClient();

queryClient.invalidateQueries(["todos"]);

// Both queries below will be invalidated
const todoListQuery = useQuery(["todos"], fetchTodoList);
const todoListQuery = useQuery(["todos", { page: 1 }], fetchTodoList);
```

<br>

**참고 문서**

[TanStack Query 공식 문서](https://tanstack.com/)
