---
title: Redux에 대해서
date: 2022-12-01
description: 예측 가능한 상태 관리
tags: [JavaScript]
---

# Context API의 한계점

전역 상태 관리가 필요할 때 Context API를 사용할 수도 있으나, 이는 상황에 따라 적절치 않다. 다음과 같은 단점이 있기 때문에 이를 고려해서 사용해야 한다.

**1. complex setup / management**

- 상태관리, 설정이 복잡해짐

- 대형 애플리케이션에서는 지저분한 코드가 됨

- 유지 관리 어려워짐

- 컨텍스트 하나가 많은 일을 함

**2. performance**

- 데이터가 자주 변경되는 앱에 좋지 않음

그래서 규모가 큰 프로젝트나 데이터가 자주 변경되는 앱에는 Context API를 사용하지 않는 것이 좋다. 그래서 이와 같은 경우는 다른 라이브러리를 사용하자. Redux와 비교해보자면, Context API는 react-redux처럼 re-render에 대한 최적화는 되어 있지 않다. 그래서 전역 상태 관리를 하려고 하면 성능 이슈가 발생할 수 있기 때문에 이는 전역 상태 관리에 사용하지 않는 게 좋다.

<br>

# Redux란?

MVC 패턴의 양방향성으로인해 애플리케이션의 흐름을 예측할 수 없게 되어 Flux라는 패턴이 등장했고, 이에 맞춰 나온 라이브러리가 Redux다. 여기서 Flux란 다음과 같은 디자인 패턴이다.

<br>

![](https://velog.velcdn.com/images/seripark/post/cf3e4a3f-c15f-4f86-89d9-8938a7923199/image.png)

<br>

애플리케이션이 단방향으로 흐르는 구조이기 때문에 **변화가 단순하고, 예측 가능하다.**

`Action`: 변화에 필요한 데이터를 포함하고 있는 객체이며 type 프로퍼티로 구분한다. action은 대부분 사용자가 view에서 발생시킨다.

`Dispatcher`: action을 받아 모든 store에 전달한다.

`Store`: 받은 action에 따라 데이터를 수정한다.

`View`: view는 store의 데이터로 ui에 표현한다. 사용자가 action을 발생시키기도 한다.

## three principles

redux에는 [세 가지 원칙](https://redux.js.org/understanding/thinking-in-redux/three-principles)이 있다.

- **Single source of truth**
  모든 상태가 하나의 store 객체 트리에서 관리된다.

- **State is read-only**
  state는 오직 dispatch를 통해 변경 가능하다.

- **Changes are made with pure functions**
  state를 변경할 땐 reducer라는 순수 함수를 이용한다. 만약 비동기 로직, 다른 값을 리턴할 가능성이 있는 값, 부수 효과가 존재하는 함수일 경우 redux에서 사용할 수 없다. 이는 미들웨어에서 처리해준다.

  - 순수함수: A를 넣으면 항상 B라는 값이 나오는, 사이드 이펙트가 없는 함수.

</br>

그렇다면 이러한 Redux는 언제 사용할까?
전역 상태 관리가 필요할 때, props drilling을 피하고 싶을 때 사용할 수 있다. 그러나 Redux는 무겁다는 평가를 많이 받고 있어 규모가 작은 프로젝트를 할 땐 Context API를 사용하는 편이 낫긴 하다.

<br>

# Reducer / Action

## Reducer

Reducer는 기존 상태(old state)와 액션(dispatched action)을 파라미터로 받으며 항상 새로운 상태의 객체를 리턴한다. 단, 항상 예측할 수 있는 새로운 상태 객체를 리턴할 수 있도록 **순수 함수로 작성되어야 한다.** 오로지 기존 상태와 action을 통해서만 새로운 상태 객체를 만들어야 한다.

또한, reducer는 기존 상태(old state)를 직접적으로 변경하는 다음과 같은 행위를 해서는 안된다.

```jsx
 reducers: {
        increment(state) {
        	state.counter++;
        }
  }
```

이는 예측 불가능한 오류가 발생하고, 디버깅이 어려워진다. 그래서 다음과 같이 기존 상태를 복사해서 변경시킨 후 새로운 값을 return 하는 방법으로 코드를 작성한다.

```jsx
 reducers: {
        increment(state) {
        	state.counter = state.counter + 1;
        }
  }
```

예외로 redux toolkit과 createSlice 함수를 사용하면 기존의 상태를 절대 변경할 수 없기 때문에 불변성을 신경 쓰지 않아도 된다. immer라는 패키지가 기존의 상태를 변경하는 코드를 감지해 자동으로 기존의 상태를 복제해서 오버라이드한다.

<br>

## Action

action은 변화를 설명하는 객체다. 주로 type과 payload를 갖는데, type은 변화를 짧게 설명해주는 string이며 `user/getUser`와 같이 작성한다. payload는 추가적으로 전달 해야 할 데이터가 있을 때 같이 전달한다. 단순히 말해, 이러한 정보를 바탕으로 변화를 시켜달라 요청하는 주문서 같은 것이다.

<br>

**참고 문서**

[flux에 관한 내용](https://haruair.github.io/flux/docs/overview.html)

[redux 개념들에 관한 내용](https://redux.js.org/)
