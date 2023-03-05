---
title: Recoil의 핵심 개념
date: 2022-09-12
description: Atom과 Selector
tags: [Recoil]
---

# 서론

팀 프로젝트를 하면서 Recoil을 사용하게 되었는데 한 번도 접해보지 않아서 간단하게 파악하고 훑어보고자 정리 글을 작성하게 되었다.

<br>

# Redux에 대해서

## Redux 잘 쓰고 있나요?

전에 Redux를 공부하고 나서 간단한 기능을 구현해봤는데 꽤 복잡하다고 생각을 했다. Redux 공식 문서의 [When should I use Redux?](https://redux.js.org/faq/general#when-should-i-use-redux) 부분을 읽어보면 Redux의 단점은 학습해야 할 개념이 많고, 짧은 시간 내에 코드를 작성하기 어렵다고 말한다. 작은 프로젝트에 Redux를 쓰고 있다 보면, 정말 무겁긴 무겁게 느껴진다.

나 같이 느끼는 사람들이 많아 Redux의 개발자들은 다음과 같이 말했다.

> You'll know when you need Flux. If you aren't sure if you need it, you don't need it.

> I would like to amend this: don't use Redux until you have problems with vanilla React.

과감하게 정말 Redux가 필요하다는 생각이 들지 않으면 필요한 것이 아니라고 말한다. 나도 그동안 필요하지 않은데 사용한 것이 아닐까? 라는 생각이 강하게 들었다.

Redux의 단점을 보완해서 Redux-Toolkit이 등장했는데, 아직도 상태 업데이트를 하거나 구독을 하기 위해서는 여전히 많은 boilerplate 코드가 필요하다.

<br>

## Redux가 필요한 때

그렇다면 Redux를 사용해야 하는 경우는 언제일까?

공식 문서에서 Redux를 사용해야 하는 경우는 다음과 같다고 말한다.

- You have large amounts of application state that are needed in many places in the app

- The app state is updated frequently

- The logic to update that state may be complex

- The app has a medium or large-sized codebase, and might be worked on by many people

- You need to see how that state is being updated over time

그리고 Redux 개발자인 dan abramov의 [you might not need redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)를 읽어보면 리덕스를 사용했을 때의 장점도 알 수 있다.

핵심적으로 Redux를 사용하면 전역 상태를 수정하기 위해서 반드시 액션을 선언해서 수행해야 해서 **데이터 흐름을 쉽게 예측**할 수 있으며, Redux Toolkit을 사용했을 경우 Reducer를 통해 데이터를 업데이트하면 Immer를 사용해서 **불변성을 지켜준다**.

라이브러리를 잘 사용하려면 여러 라이브러리에 대해 공부해보고 더 적합한 라이브러리를 찾아가는 과정이 필요하다. 라이브러리의 특징과 장단점을 비교하고 고민을 해야 한다. 그래서 Redux 외에도 다른 라이브러리를 공부해서 사용해보고 싶었는데 이번에 좋은 기회가 되었다.

<br>

# Recoil

<img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*sSipKsU1hXNld8zDAytoIg.png">

<br>

Recoil은 Redux처럼 단방향 데이터 흐름을 가지는, **React**를 위한 **상태 관리 라이브러리**이다. Recoil은 React 밖에 state를 저장하는 저장소를 두기 때문에 사용자가 UI를 통해 state를 변경했을 때 업데이트 해야 하는 컴포넌트만 업데이트 할 수 있다.

<br>

## Recoil의 차별점

그렇다면 Recoil는 다른 라이브러리와 어떤 차별점이 있을까?

**💡 1. 배우기 쉽다**

Recoil을 처음 배울 때 Recoil처럼 학습이 많이 필요하지 않고, 많은 보일러 플레이트를 작성하지 않아도 된다. 그리고 API는 단순하며, Recoil 상태를 사용하기 위해서는 루트 컴포넌트에 `RecoilRoot`만 넣어주면 된다. 특히 hook을 사용해봤으면, Recoil을 사용하기 쉽다. `useRecoilState`라는 훅은 `useState`와 매우 유사하다.

**💡 2. 컴포넌트가 필요로 하는 데이터만 구독해 사용할 수 있으며, 비동기 데이터를 위한 솔루션을 제공한다.**

**💡 3. React를 위해 만들어진 상태 관리 라이브러리인 만큼 React처럼 행동하고 작동한다.**

<br>

## 핵심 개념

### Atom

Atom은 **상태**를 나타내며, 모든 컴포넌트에서 Atom을 읽고 쓰는 것이 가능하다. **atom이 업데이트**가 되면 **atom을 구독한 컴포넌트**는 새로운 값으로 **리렌더링** 된다. 만약 같은 atom을 여러 컴포넌트에 사용하는 경우, 이 컴포넌트들은 해당 state를 공유할 수 있다.

atom 함수를 통해서 atom을 생성할 수 있다. 그리고 atom을 생성하기 위해서는 다음과 같이 고유한 키와 기본값을 지정해줘야 한다. 다른 atom이 동일한 키를 가지지 않도록 유의해서 작성해야 한다.

```javascript
const fontSizeState = atom({
  key: "fontSizeState",
  default: 14,
});
```

<br>

`useRecoilState`

컴포넌트에서 atom을 읽고 쓰려면, `useRecoilState`라는 훅을 사용한다. `useState`와 비슷하지만, 차이점이 존재한다. `useRecoilState`의 state는 컴포넌트 사이에서 공유된다는 것이다.

```javascript
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button
      onClick={() => setFontSize((size) => size + 1)}
      style={{ fontSize }}
    >
      Click to Enlarge
    </button>
  );
}
```

이렇게 코드를 작성해주고 click to Enlarge라는 버튼을 클릭하면 상태를 공유하고 있는 모든 컴포넌트가 같은 폰트 사이즈를 가지게 된다.

<br>

`useRecoilValue`

아톰의 값만 얻고 싶을 때는 `useRecoilValue` 훅을 사용하면 된다. 아래와 같이 단순하게 사용할 수 있다.

```javascript
const todoList = useRecoilValue(todoListState);
```

<br>

`useSetRecoilState`

setter 함수만 얻고 싶을 때는 `useSetRecoilState` 훅을 사용한다.

```javascript
const setTodoList = useSetRecoilState(todoListState);
```

<br>

이를 `useState`로 바꿔보면 이해가 더 쉽다.

```javascript
const [todoList, setTodoList] = useState(todoListState);
```

<br>

<br>

### Selector

selector는 이해하기 조금 어려웠는데, 간단히 말해 **atom의 상태값을 동기나 비동기 방식으로 변환하는 역할**을 한다. 단, seletor는 읽기 전용 값만 반환하기 때문에 수정할 수 있는 값을 원하면 atom을 사용해야 한다.

selector는 atom이나 다른 selector를 받는 순수함수다.atom이나 selector가 업데이트 되면 selector 함수는 re-evaluated가 된다. 컴포넌트들은 selector를 atom처럼 구독할 수 있고, selector가 변경되면 리렌더링된다.

selector는 비동기 통신을 할 때 값을 캐싱한다. 그래서 한 번 비동기 통신을 했다면 다시 API 호출을 하지 않고 캐싱된 값을 추적해 사용한다.

<br>

#### get

get을 이용해서 atom, selector의 값을 얻을 수 있다. get에서 atom이나 selector에 접근할 때마다 종속 관계가 형성이 되기 때문에 atom이나 selector가 업데이트 되면, get은 다시 계산을 한다.

```javascript
const fontSizeLabelState = selector({
  key: "fontSizeLabelState",
  get: ({ get }) => {
    const fontSize = get(fontSizeState);
    const unit = "px";

    return `${fontSize}${unit}`;
  },
});
```

이렇게 하면 `fontSizeLabelState`라는 selector는 아까 설명했던 것처럼 `fontSizeState`라는 atom에 의존성을 갖게 된다.

<br>

#### setter

```jsx
set: ({ set }, newPost) => {
  set(posts, newPost);
};
```

set을 이용해서 atom의 값을 변경해줄 수도 있다. set의 첫 매개변수로 변경할 atom을 넣고, 두 번째로 변경해줄 값을 넣어주면 된다.

<br>

**참고 자료**

[Recoil 공식문서](https://recoiljs.org/ko/)

[Recoil — Another React State Management Library?](https://medium.com/swlh/recoil-another-react-state-management-library-97fc979a8d2b)

[Recoil을 이용한 손쉬운 상태관리](https://techblog.yogiyo.co.kr/recoil%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%86%90%EC%89%AC%EC%9A%B4-%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC-b70b32650582)
