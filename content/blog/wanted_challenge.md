---
title: "[원티드 프리온보딩 챌린지] TODO 프로젝트 리팩토링하기"
date: 2022-08-23
description: 리팩토링 재밌다!
tags: [refactoring]
---

# 서론

**원티드 프리온보딩 챌린지**에 참여하게 되었다. 이 글엔 2주간 4번의 강의를 듣고 사전 과제로 제작했던 TODO 프로젝트를 리팩토링 한 과정을 담았다.

이 프로젝트는 [GitHub](#https://github.com/seriparkdev/wanted-pre-onboarding-challenge-fe-1)에서 확인할 수 있다.

# 📌 package.json에서부터 발견한 문제점

강의 중 강사님께서 dependencies와 devDependencies를 유심히 보시는 것을 보고 이에 대해 찾아봤다.

**dependencies와 devDependencies의 차이점**

[문서](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)를 보면 알 수 있듯이 이 둘의 차이점은 다음과 같다.

- **dependencies**

  Packages required by your application in production.

- **devDependencies**

  Packages that are only needed for local development and testing.

환경설정을 할 땐 이 둘의 차이점을 구분해야 한다. 예를 들어 `@types/...`는 타입 추론을 위한 라이브러리인데, 개발하는 동안이나 테스트하는 동안 필요할 뿐 **런타임에서 필요하지는 않다**.

> 런타임 : 컴파일 과정을 마친 응용 프로그래밍이 사용자에 의해서 실행되는 때

나는 개발 도중 테스트하는 용도로 `@types/...`가 필요했기 때문에 `dependencies`에 속해 있었던 코드를 `devDependencies`로 옮겨주었다.

## +) 그러나,

나는 이렇게 짚고 넘어간 후에 항상 프로젝트 할 일이 생기면 이렇게 의존성을 관리해주었다. (CRA를 하면 types는 항상 `dependencies`에 속했기에) 근데 **원티드 프리온보딩 코스**(글을 적고 있는 챌린지와는 다른 교육이다)를 하면서 팀원 분들이 이러한 타입을 `devDependencies`에 관리하지 않아서 이에 관해 질문했다. 한 팀원 분께서 이렇게 하면 빌드 시에 문제가 있을 수도 있지 않을까요?라는 답변을 주셔서 이에 관해 검색을 해봤다. [
create-react-app
Issue](#https://github.com/facebook/create-react-app/issues/6180)에서 이에 관한 해답을 얻을 수 있었다.

> It doesn't matter in practice. Put them wherever you like. :-)

- 노드 앱은 실제로 런타임으로 배포되기 때문에 이러한 구분이 의미가 있다.

- 그러나 **CRA의 최종 결과는 정적 번들**이기 때문에 모든 종속성은 개발 종속성이라고 할 수 있다.

- 모든 것을 빌드 종속성에 넣으면 서버에서 초기 빌드를 수행하는 일부 **배포 스크립트가 손상**될 수 있기 때문에, 일반 종속성에 넣는 것을 추천한다.

dependencies에 있어도 문제가 없었던 것!

> issue를 보니 dependencies는 비개발 종속성이라 취급되고 최종 빌드 파일에 포함되며, devDependencies는 개발 종속성이라 부르고 빌드 파일에 포함되지 않는 것이라 여겨지는 것 같다. (이 또한 답변과 같이 케이스 바이 케이스라 상황에 따라 잘 고려해야 하는 것 같음)

# 📌 선언형 프로그래밍 / 추상화

이 리팩토링을 위해서는 강의와 [토스ㅣSLASH 21 - 실무에서 바로 쓰는 Frontend Clean Code](#https://www.youtube.com/watch?v=edWbHp_k_9Y)라는 영상을 참고했다.

**선언형 프로그래밍?**

- `무엇(what)`을 하는 것인지 빠르게 파악 가능
- 세부 구현은 `내부`에 숨겨 둠
- 무엇(what)의 자리만 바꾸어 `재사용` 가능

**=> 읽고, 디버깅하고, 재사용하기 쉬워짐**
<br>

## 🧐 리팩토링 전 api 코드

```javascript
export function signUp(email: string, pwd: string) {
  return axios.post("http://localhost:8080/users/create", {
    email: email,
    password: pwd,
  });
}
```

api 관련 함수 6개 모두 이런 형식으로 작성했다. 그치만 코드가 **불필요하게 계속 중복**된다는 느낌을 이 코드를 적으면서도 느꼈다. **가독성이 좋지 않으며**, 이런 형식의 코드는 **어떤 기능을 하는지 빠르게 파악하기 어려워** 유지보수할 때 시간이 많이 소요될 것 같다고 생각했다.
<br>

## 👷리팩토링 후 api 코드

```javascript
const signUp = ({ email, password }: authFormInput) => {
  const response = api.post("/users/create", {
    email,
    password,
  });
  return response;
};
```

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080",
});
```

- 더 가독성이 좋다고 여겨지는 **arrow function**으로 바꿨다.
- 단축 속성명으로 수정했다.
- API 주소(`http://localhost:8080`) 가 불필요하게 반복되어 api로 숨김

<br>

```javascript
export interface authFormInput {
  email: string;
  password: string;
}
```

매개변수로 `email`, `password`의 이름과 타입을 반복해서 적어줘야 했었는데, 타입을 따로 빼서 관리하기로 했음

여기서 interface와 type의 차이를 명확히 알지 못해 [문서](https://www.typescriptlang.org/play?#code/PTAEBUAsFMCdtAQ3qALgdwPagLaIJYB2ammANgM4mgAm0AxmcgqjKBZIgA4KYBmSQgFgAUCFCYARgCsGqAFygiqOH0T1oVRIRpoAnjyRl8iCpoB0okFbBRoepCgBucBxXw58TWABpBuvkxYNDYcTApUUHpMHDDielNNGyR6SNYECkQcaEsRUVQDBAAhfFgacELQAF5QAG9RUFB0IgBzCkUAJgBuUQBfHryRZVV1YtKaAElCFVg1DTqGptb20G6+0VFowgjQSXGARkUSsorDGtqlwjbO0H7NzG3IvbKOo-GpmbmEc8vr1duBskigxEABXMwQQoAZXosHwXEi+C07FQsFBqVBsEQZH0hgoegi0BwPmS+FQAHIqFxwu5JGQWNhhrBPAAPELQUqgcEMzC5e6PXbjADMbzKHxG8xqzxo+0BYlsMAckkwrHYoK41NgkWgLJUOlaEnSwSZXy0OlxFmSpwQ2JMZioNGwrCRoCcJiU0zgZlS+AeFoofnQkC80FJntmoyonBcSFAAGt7FgynyRAVDAB5dA4n6ETAY2CEbGKVGghC9UAAMlAx3KhQGaYQACUpERqnVQLn84WyIo1JQy5Xq+9w185SbRqAAArQdR5uOgHV6mhUGvWhYiRrRMiYTF8UE9tBo6ADRp8YyaXvYswDXqicfzADCwfoCeIi+gOhXw8+E-qG6i5A7rM+6Xv2J6gGe+AXhBV7Husgz0pEmBZoombZu2zRXCsHR+J2qCYt2xZHgCoiIVEz6vooT74C+H5thcmF-DhAHbruIEwf2fiQdBfYQncgziFAiCRJk+A0IGCDwNEsQfroeg7lyEL3poEguMEDbJLaiQUOYoBQjw9D4HwNHYmQeh+JIILcqA8mgksZA4i00BPM5MwLrAsBBMk2QUJkTk6aAEwCLZoCQJgamqXA7IQeQ26Me5nmwAGNkKQkwjyuw0AIGF6CQjwMJwgiUTaKAXCeW6dBoF6UXaLoYQoIE9DcjQ3maH5KlBnRSZxgazSqspVDGAmoDUbRhApsh6H0BRH4DNNNGvm2k1yuI6aEAgeDSEEtBGXwcAfvMlkYFlxANkYdoqU4VADZpKCsMJHo-hoWgoJgPDELVFrndpjgIIw4TQDQuSCcGVDZNoVAhWlC66rJgiPRKCCSA4dCMMgBpkppmVbLoqAeDkGxDCOE4ANJknq66NFwmJJYoyrkDOhA3oTymgGTqAU3+m6AZiigRHCVzMwJYBTNFKowMECQQogX1pbmLnkdoTm6DuqDuJV-CkmrtAMN4wm+uNhNnZO6pcA45yLFuQR86irQ3nKxum+blMkASiiEKCOCWbA9uE+IAAi0DvTQBp+rZwQtJgV5+M6Dq7fthDzNE+66JZSDJNS7h4zG20y+tLT6y4ukABLIdAEWBME1N0jRZkw5ngPJA2yVkpSsZHW5CQOdQeDDekODw8pKaretEgCOkuyaJE8AUEBz0xcEZgclcRg4vw0WA05yRSypyA7uazeutdxPPTHoMouo87haocVN5A8CILoLoy5HmC6FwTDzKg2ARMgCh+2ASAHMuDtBAL-F819ZhxXMNJYAABHUsEQDYUGAEKAA7B0IU6ChQAFZgDN1hPCVAABaAaxCrrEObsAHBHQABsAAODoTCAAMABiGhDCmEdGYaIIAA)를 보고 공부했다.

**🧐 문서를 본 후 결론: interface를 쓰자**

reason 1) error messge가 간결하다

reason 2) 타입을 확장하기 더 쉽다 (extends keyword, 두 번 선언 가능)

나름 짧은 코드를 만들기 위해 적었던 `pwd`도 `password`로 바꿔주었다. 가독성을 위해 짧게 적었으나, `pwd`보다는 `password`가 더 직관적이지 않을까라는 생각을 했다. 같이 일하는 동료가 `pwd`를 `password`라고 바로 알아들을 수 없다면 의미가 없을 것 같다. 그리고 이런 줄임말보다는 길지만 명확하게 알아들을 수 있는 코드를 선호하게 됐다(개인적인 취향).

`const response`로 api의 결과를 넣어 return 했다. 이 api 코드의 결과값을 직관적으로 눈에 볼 수 있어서 가독성을 높여준다고 생각했다.

아까의 api(axios instance)를 **authApi**, **todoApi**로 나눴다. todo와 관련된 api는 `headers의 Authorization`이 기본적으로 필요했기에 다음과 같이 나눠주었다.

```javascript
const authApi = axios.create({
  baseURL: "http://localhost:8080",
});

const todoApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Authorization: `Bearer ${userToken}`,
  },
});
```

<br>

## 🔨 다시 api 리팩토링 (2차)

> 클린 코드를 봤을 때는 **글을 읽는다**는 느낌이 들었는데, 내가 리팩토링을 한 코드는 아직도 **코드를 읽는다**는 느낌이 강했다. 그래서 다시 시도했다.

**> Auth Api 리팩토링**

```javascript
const signUp = ({ email, password }: authFormInput) => {
  return getUserToken("/user/create", { email, password });
};
```

- **세부 구현을 숨김**

  ```javascript
  const getUserToken = (url: string, { email, password }: authFormInput) => {
    const response = authApi.post(url, {
      email,
      password,
    });
    return response;
  };
  ```

- **함수명 짓는 게 어렵다**

  `getUserTokenTrough`라는 함수명도 고민해봤는데, 이 코드를 처음 보게 되는 사람의 입장에서 바로 와닿지 않을 거라 생각했다.

- **지식의 부족을 느낌**

  interface, extends, class 같은 것을 자유자재로 사용하지 못해서 다양한 아이디어를 생각해내지 못하고, 함수를 통해서만 리팩토링을 하게 됐다.

    <br>

**> Todo Api 리팩토링**

```javascript
const getTodos = () => {
  const response = todoApi.get("/todos");
  return response;
};

const getTodoById = (id: string) => {
  const response = todoApi.get(`/todos/${id}`);
  return response;
};

const createTodo = (title: string, content: string) => {
  const response = todoApi.post("/todos", {
    title,
    content,
  });
  return response;
};

const updateTodo = (newTitle: string, newContent: string, id: string) => {
  const response = todoApi.put(`/todos/${id}`, {
    title: newTitle,
    content: newContent,
  });
  return response;
};

const deleteTodo = (id: string) => {
  const response = todoApi.delete(`/todos/${id}`);
  return response;
};

export { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
```

todo api 경우는 **method, 매개변수** 각각 다 **달랐고**, 이미 **함수명**에서 코드 내용을 **충분히 설명**하고 있기 때문에 더 세부적으로 나누기 어려워서 그대로 두었다. 세부 구현을 숨기려 **더 분리하게 된다면**, **재사용이 떨어지는 함수**만 생산하게 될 것 같았다. (작은 프로젝트이기에)

+) 오랜만에 글을 보게 되어서 덧붙인다. 이와 같은 로직은 추상화를 하기보다는 그대로 두는 것이 코드를 파악하기 좋은 것 같다. 유지/보수가 힘들만큼 긴 코드가 아니기에 그대로 두어도 괜찮기 때문이다. 그리고 하나의 파일에서 몇 줄만 확인하면 되는 코드를 이렇게 세부 구현을 숨기고 추상화 해두면 확인해야 하는 파일이 많아지고 더 복잡해진다.

# 📌 type 추론

**[타입 추론이 일어나는 경우](https://joshua1988.github.io/ts/guide/type-inference.html#%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0%EC%9D%98-%EA%B8%B0%EB%B3%B8)**

- 변수 선언, 초기화
- 변수, 속성, 인자의 기본 값, 함수의 반환 등의 설정

그동안 타입스크립트를 쓰면서 타입을 적을 수 있는 **모든 곳**에 타입을 기입했다. 그러나 타입 추론이 일어나기 때문에 적지 않아도 될 곳은 안 적는 게 좋다.

**예시 코드**

```javascript
const [password, setPassword] = useState < string > "";
const [isOpenModal, setIsOpenModal] = useState < boolean > false;
```

useState의 기본 값을 적고, 타입까지 적어주고 있다. 그러나 타입을 적어주지 않아도 기본 값을 참조해 타입 추론을 한다.

이렇게만 적어줘도 됨!

```javascript
const [password, setPassword] = useState("");
const [isOpenModal, setIsOpenModal] = useState(false);
```

여기서 useState에 마우스를 hover하면 다음과 같은 메모가 뜬다.

> (alias) useState`<string>`(initialState: string | (() => string)): [string, React.Dispatch`<React.SetStateAction<string>>`] (+1 overload)

위와 같은 타입추론이 가능한 이유는 useState는 아래와 같은 제네릭을 가지기 때문이다.

```javascript
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
```

useState는 타입이 `S`거나 `()=> S`인 인자를 받아 `S, Dispatch<SetStateAction<S>>`인 타입을 리턴하는 것이다.
<br>

**✔️ 예외**

```javascript
const [todoList, setTodoList] = useState<Todo[]>([]);
```

여기서는 기본값도 설정해주고 타입도 선언해줘야 한다. Todo는 다음과 같은 **interface**다.

```javascript
interface Todo {
  content: string;
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
}
```

이러한 정보를 주지 않으면 `todo.content`에 접근하려 했을 때 에러를 낸다. 객체에 대한 정보가 전혀 없기 때문이다. 다음과 같은 경우에는 타입을 적어줘야 한다.

# 📌 any를 없애자

`any`를 사용하지 말아야 하는 경우는 다음 [문서](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#any)에서 확인할 수 있다. `any`는 **타입 추론을 하지 말라**는 것과 같은데, 이를 남용하면 JavaScript 대신 TypeScript를 쓰는 이유가 없어진다.

그래서 다음 코드에서 `any`를 없앨 것이다. error에 어떤 타입을 줘야할지 모르겠어서 일단 `any`를 적고 차후에 수정하려고 했었다.

## 🧐 리팩토링 전

```javascript
  const joinHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp({ email, password }).then((res) => {
        if (res.data.token) {
          navigate("/login");
        }
      });
    } catch (error: any) {
      alert(error.response.data.details);
    }
  };
```

## 👷 리팩토링 후

```javascript
const joinHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await signUp({ email, password }).then((res) => {
      if (res.data.token) {
        navigate("/login");
      }
    });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      alert(error.response?.data.details);
    } else {
      alert("로그인에 실패했습니다.");
    }
  }
};
```

axios github의 [issues](https://github.com/axios/axios/issues/3612)를 참고해서 해결했다. error 타입에 `any`를 안 적으려고 한참 헤맸었는데, `AxiosError` 타입이 따로 있는지 처음 알아서 너무 반가웠다. 에러가 발생했을 때 `AxiosError`인지, `error.response`가 있는지 확인하도록 만들었다. `error.response`가 아닌 `error.request` 같은 다른 에러가 떴을 때 `undefined`가 뜰 것 같다는 걱정에 이렇게 처리해줬다. 이 외에 에러가 발생했을 땐 로그인에 실패했다는 문구로 전부 처리했다.

# 📌 localStorage 추상화

## 🧐 리팩토링 전

```javascript
localStorage.removeItem("token");
localStorage.setItem("token", userToken);
```

위와 같이 로컬 스토리지를 관리하는 코드를 반복해서 작성하게 됐다. 한 줄 짜리기도 하고 많이 사용되지는 않아서 유지 보수하기에 편리한 쪽으로 작성하는 것을 고려하지 않았다. 그러나 강의 자료에서 이 부분이 추상화가 된 것을 보고 직접 해보고 연습하고 싶다는 생각에 리팩토링을 하게 됐다.

```javascript
const storage = localStorage;

const Storage = {
  set(key: string, value: string) {
    return storage.setItem(key, value);
  },
  get(key: string) {
    return storage.getItem(key);
  },
  remove(key: string) {
    return storage.removeItem(key);
  },
};
```

**storage를 변수로 만들어 localStorage를 저장한 이유**

현재 데이터를 보존하기 위해 `localStorage`를 쓰고 있는데 `localStorage`에서 `sessionStorage`로 변경할 하게 될 경우를 고려했다. 그래서 그런 상황이 왔을 때 storage라는 변수에 `localStorage`나 `sessionStorage`를 선택적으로 넣어 좀 더 간편하게 변경할 수 있게 했다. 내가 알고 있는 지식 선에서는 또 다른 경우를 떠올리기 어려웠기에 더 추상화하기 어려웠다.

## 👷 리팩토링 후

```javascript
Storage.set("token", res.data.token);
```

유지보수하기 좀 더 좋은 형태의 코드로 변한 것 같다!

# 📌 redirect와 useEffect

> 어떤 경우든 토큰이 유효하지 않다면 사용자에게 알리고 로그인 페이지로 리다이렉트 시켜주세요

위와 같은 조건을 만족시키기 위해서 나는 잘못된 접근을 했다. 다음은 내가 잘못 적은 코드다.

## 🧐 리팩토링 전

```javascript
useEffect(() => {
  if (!Storage.get("token")) {
    navigate("/login");
  }
});
```

이는 요구사항과 같이 의도한대로 작동 되는 것처럼 보였기에 문제를 알아차리지 못했다. 그러나 세션에서 이는 잘못된 접근이라는 것을 알게 되었다.

요구사항은 사용자가 유효한 토큰을 가지고 있지 않을 때 어떠한 페이지에 접근하지 못하게 해달라는 뜻이다. 그러나 나는 위와 같은 코드를 **접근하면 안되는 페이지에 렌더링이 되는 컴포넌트에다가 적었다.** 이러한 방식의 문제점은, **결국 그 페이지에 사용자가 머무르게 된다는 것**과 **`useEffect`는 렌더링이 다 된 후에야 실행이 된다는 것**이다.

그래서 이 [문서](https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx)를 참고해서 리팩토링했다.

## 👷 리팩토링 후

**> 라우터**

```javascript
<Routes>
  <Route
    path="/*"
    element={
      <RequireAuth>
        <Home />
      </RequireAuth>
    }
  />
  <Route path="/login" element={<Login />} />
  <Route path="/join" element={<Join />} />
</Routes>
```

**> RequireAuth 파일**

```javascript
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const hasToken = Storage.get("token");
  const location = useLocation();

  if (!hasToken) {
    alert("로그인 해주세요.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
```

로그인이 되지 않았다면 로그인 페이지로 리다이렉트 시켜주고, 로그인이 되었다면 `<Home />`을 렌더링하고 있는 루트 페이지로 이동한다. 이렇게 하면 로그인 하지 않은 사용자가 접근해선 안 되는 `<Home />`를 완전히 보호해줄 수 있다.

# 📌 컴포넌트 분리

## 🧐 리팩토링 전

```
├─public
└─src
    ├─components
    ├─pages
    └─store

```

리팩토링 전 프로젝트 구조다. 이렇게 컴포넌트를 나눴던 이유는 내가 컴포넌트를 나누는 기준이 **재사용하지 않으면 컴포넌트를 분리하지 않아도 된다**이기 때문이었다. 오히려 컴포넌트를 많이 나눌 수록 **props 전달에 있어서 불편함**만을 느꼈기 때문에 이렇게 간단해진 것이다. 그리고 여태 만들었던 프로젝트는 작았기 때문에 관리함에 있어서 어려움을 느끼지 못했다.

그러나 삼항 연산자와 `map` 함수 같은 것들을 사용할 때 점점 **구조를 파악하기 어렵다**는 느낌을 받았다. 이러한 구조는 프로젝트가 커질 수록 난감한 상황이 벌어지고 하나의 기능을 수정하더라도 전체 코드를 읽어내야 해서 **시간이 많이 소요**된다.

재사용하지 않을 컴포넌트라고 **무조건 분리하지 않으면** 나의 코드와 같이 **높은 응집도**를 가지나, **유지와 보수**를 하기 어려워진다. 반면, 분리할 필요가 없는 컴포넌트를 **많이 분리하게 된다면** **관심사의 분리**가 잘 될 수가 있으나, **`props drilling`** 현상이 일어난다. 그리고 오히려 **결합도**가 높아질 수도 있다. 그래서 적절히 상황에 맞게 잘 분리하는 것이 필요하다.

- 관심사의 분리
- 응집도, 결합도
- 유지, 보수
- 추상화

리팩토링을 하면서 위의 목록을 메모장에 적고 고민이 될 때마다 들여다봤다.

## 👷 리팩토링 후

```
├─public
└─src
	├─api
    ├─components
    │  ├─auth
    │  └─todo
    ├─hooks
    │  ├─auth
    │  └─todo
    ├─pages
    ├─store
    ├─types
    └─utils
```

이렇게 나누게 된 이유는 다음과 같다.

- 관심사에 따른 분리
- 유지, 보수 쉽게 하기

관심사에 따라서 분리를 하는 것이 유지 보수 시에 시간을 절약하고, 코드를 이해할 때 시간을 단축 시켜주기 때문에 이를 기준으로 분리해봤다.

그리고 큰 기능이 두 가지기에 이를 기준으로 폴더 안에서 또 `auth`와 `todo`로 분리 했다. 개인적으로는 이렇게 분리한 게 편했고, 코드를 찾아가기 좋았다.

api는 `api.tsx`로 그냥 파일로만 관리하고 있었는데, 이 또한 한 파일에서 관리하는 것이 아닌 관심사에 따라 분리하는 것이 나중에 코드를 읽고 수정하기 더 쉽겠다는 생각이 들어 폴더 안에서 따로 분리해 관리하게 되었다.

그리고 인터페이스, 타입 같은 것들은 재사용성이 높아서 어느 곳에서든지 가져와 사용하기 쉬워야 한다. 따로 분리하면 응집도는 떨어지겠지만, 필요한 타입이 어딨는지, 어떤 타입들이 있는지 파악하기 쉽기 때문에 따로 관리하는 것이 더 좋겠다는 생각에 `types`라는 폴더를 만들어 관리하게 됐다.

# 📌 중복 코드 줄이기

login 페이지와 join 페이지는 거의 코드가 동일하다. 두 페이지 모두 form을 만드는 태그가 대부분을 차지하는데, 이는 불필요한 중복성이라고 생각이 돼서 줄였다. 리팩토링 후 컴포넌트 구조와 같이 `components/auth` 경로를 만들어서 `AuthForm`이라는 파일을 만들었다. login과 join 컴포넌트에서 폼 타입을 `AuthForm`에 전달하면 타입에 맞는 폼이 그려진다. 폼 타입은 다음과 같은 인터페이스로 만들어진다.

```javascript
export interface AuthFormType {
  formType: "회원가입" | "로그인";
}
```

이 `formType` 변수를 통해서 컴포넌트를 재사용할 수 있게 만들고 전보다 유지, 보수도 쉽게 할 수 있게 되었다.

# 맺으면서

일기장 다음으로 처음 만들었던 구현물이 이 TODO였다. 그동안 프로젝트를 하면서 기능 구현에만 집중했었고, 유지/보수나 코드 품질에 관해서 고려해야 한다는 것을 몰랐었다. 챌린지를 하면서 4번의 강의였지만 정말 많이 배웠다. 처음 냈던 과제의 코드를 볼 때 문제점이 보인다는 것이 많이 성장했다는 증거가 아닐까 싶다. 리팩토링을 잘 했는지는 파악하기는 어렵지만 많이 배울 수 있었고 재밌는 과정이었다.
