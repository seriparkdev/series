---
title: React Developer Tools 사용법에 대해 알아보기
date: 2025-03-16
description: 작업 효율성을 향상 시켜줄 도구
tags: [React]
---

# React Developer Tools
React Developer Tools는 React로 만든 웹사이트를 디버깅할 수 있는 브라우저 확장 프로그램이며 컴포넌트를 트리 구조로 탐색할 수 있고, props와 state를 모니터링하거나 성능 병목 현상의 원인을 추적할 수 있게 도와주는 도구이다.

Chrome, Firefox, Edge 브라우저에서 사용 가능하고, 이 외의 브라우저의 경우 npm 패키지로 설치할 수도 있다.

```
# Yarn
yarn global add react-devtools

# npm
npm install -g react-devtools
```

확장 프로그램으로 React Developer Tools를 추가하게 되면 개발자 도구를 열었을 때 `Components`, `Profiler` 탭이 활성화 되어있는 것을 확인할 수 있다.
![](https://velog.velcdn.com/images/parkseridev/post/86286660-c7fa-489e-ad07-8ec5d6163dbe/image.jpeg)

단, React로 개발되지 않은 어플리케이션에서 확인했을 때는 해당 페이지는 React가 사용되지 않았다는 경고 문구가 뜨며 제공하는 기능을 사용할 수 없다.


# ⚛️ Component
`Component` 탭에서는 `Elements` 탭과는 다르게 HTML element가 아닌 React의 컴포넌트의 구조를 나타내고 있다. 그리고 계층 구조를 나타내는 트리 구조로 나타내고 있기 때문에 컴포넌트의 부모, 형제, 자식 관계를 쉽게 파악할 수 있다.

컴포넌트를 클릭하게 되면 컴포넌트로 전달되는 props, 내부에서 사용되는 hooks, 컴포넌트의 렌더링을 야기하는 요인 등을 상세하게 확인할 수 있다. 앱과 상호작용하는 동안 실시간으로 값이 업데이트 되기 때문에 상태와 관련되어 발생하는 오류들을 쉽게 디버깅 가능하다.
![](https://velog.velcdn.com/images/parkseridev/post/6da218e7-753c-40d4-9575-80950ca73513/image.png)



## tools

![](https://velog.velcdn.com/images/parkseridev/post/d08afbb3-ecd6-466d-9490-5da500f025f1/image.png)
오른쪽 패널 상단에 위치한 아이콘들이 어떤 역할을 하는지 알아보자.

**1. ⚠️**
<br/>
React의 `ErrorBoundary`는 컴포넌트 트리에서 발생하는 에러를 처리하고, 오류가 발생했을 때 fallback 컴포넌트를 표출하는데 이를 테스트 할 수 있게 컴포넌트를 error 상태로 강제로 전환한다.

따라서 클릭했을 때 Fallback 컴포넌트로 등록해둔 `Error!`라는 텍스트가 표출되는 것을 확인할 수 있다.



![](https://velog.velcdn.com/images/parkseridev/post/20ed7af1-15a3-4fff-ab97-9d3efc762831/image.png)
또 콘솔창에서는 `RenderErrorBoundary` 컴포넌트에서 에러가 발생했으며, DevTools에서 시뮬레이션된 오류가 발생했음을 알리는 메시지가 띄워지고 있다.
![](https://velog.velcdn.com/images/parkseridev/post/0b6ba7fe-b9a8-4c38-a091-74b74e97d001/image.png)


**2. ⏱**
<br/>
Lazy 컴포넌트가 로드되는 동안 `Suspense`는 fallback 컴포넌트를 표출해주는데, 이를 테스트할 수 있게 loading 상태로 전환한다. 따라서 클릭했을 때 fallback 컴포넌트로 등록해놓은 `loading...` 텍스트가 표출되는 것을 확인할 수 있다.
![](https://velog.velcdn.com/images/parkseridev/post/ef707073-f959-41f6-a34e-eae6ec8292d9/image.png)

**3. 👁**
<br/>
선택된 컴포넌트의 DOM 노드를 강조 표시하고 뷰포트에서 DOM 노드가 보일 수 있게 스크롤 되며 Elements 탭으로 이동해 해당 컴포넌트의 element를 highlight 해준다.
![](https://velog.velcdn.com/images/parkseridev/post/f98ff221-959c-4173-8252-9542c2c9c8ff/image.png)

**4. 🐛**
<br/>
컴포넌트와 관련된 데이터를 조금 더 상세하게 확인할 수 있게 콘솔에 기록해준다.![](https://velog.velcdn.com/images/parkseridev/post/fb1dfd83-0541-48af-904c-bac8bc33ed7a/image.png)


## 이 외 사용법
![](https://velog.velcdn.com/images/parkseridev/post/19753b5d-838a-4495-b5cc-3cf820e98f32/image.jpeg)

1. 상단에 마우스 포인터가 있는 아이콘을 클릭한 뒤 관찰하고 싶은 컴포넌트 UI에 마우스를 가져다대면 쉽게 컴포넌트에 접근할 수 있다.
2. 코드 상에서 값을 변경하지 않아도 컴포넌트를 선택하면 오른쪽 패널에서 값을 직접 편집할 수도 있다.
3. 톱니바퀴 아이콘(⚙️)을 클릭하면 뜨는 창에서 Component 탭과 관련된 설정을 해줄 수 있다. 컴포넌트 이름을 정규식으로 필터링하거나, type별(suspense, context, memo 등) 컴포넌트나, 고차함수 컴포넌트를 숨길 수도 있다.


![](https://velog.velcdn.com/images/parkseridev/post/d9120806-20c2-4ca2-8668-b76988e06f09/image.png)


# ⚛️ Profiler

Profiler 탭은 렌더링된 각 컴포넌트에 대한 성능 데이터를 기록하고 측정할 수 있기에 애플리케이션의 느린 부분을 식별하여 성능 개선을 하는데 도움을 준다.


## 측정 방법
프로파일링을 시작하기 위해서는 기록 버튼(🔵)을 클릭한 뒤 성능을 측정하고자 하는 시나리오를 이행한 후 기록 중지 버튼 (🔴)을 클릭한다.

![](https://velog.velcdn.com/images/parkseridev/post/cf3c2203-3f28-4364-94d1-5777734ca1a2/image.png)

## 결과 분석


### Rendering

프로파일링의 결과로 커밋 차트를 확인할 수 있는데 우선 React의 작동 방식과 커밋에 대한 이해가 필요하다. React는 `랜더`와 `커밋` 단계를 통해 동작하고 있다.

`렌더 단계`는 UI를 정의하는 메서드인 `render`를 호출한다. `render`는 클래스형 컴포넌트에서 사용하는 메서드이고 다음과 같이 사용한다.
```
class MyComponent extends React.Component {
  render() {
    return <div>Hello, World!</div>;
  }
}
```
클래스형 컴포넌트를 자주 사용하지 않기 때문에 함수형 컴포넌트 기준으로 정의해보자면, 항수형 컴포넌트는 `render`와 같은 메서드는 사용하지 않는다. 단지 이렇게 작성함으로써 UI를 정의하고 컴포넌트를 실행한다.

```
function MyComponent() {
  return <div>Hello, World!</div>;
}
```

컴포넌트가 실행되면 반환된 JSX를 React element tree(Virtual DOM)로 변환하고 이전 Virtual DOM tree 결과와 비교하여 실제 DOM에 어떤 변경이 필요한지를 계산한다.

`커밋 단계`는 렌더 단계에서 계산된 변경사항들을 실제 DOM에 적용하는 단계다. DOM 노드를 삽입하거나 업데이트하고 제거하며 생명주기를 다루는 훅들을 호출한다.

### Commit Chart
![](https://velog.velcdn.com/images/parkseridev/post/c83b090b-3b4a-4dfb-b12a-18501a713d4d/image.png)

`Profiler`탭에서 상단바의 오른쪽에 막대차트가 존재하는데 이는 성능 정보를 커밋별로 그룹화한 커밋 차트다. 렌더링되는 시간에 따라 막대의 높이가 결정된다.

현재 커밋은 파란색 막대로 표시되며 화살표 버튼으로 커밋을 하나씩 확인할 수 있다. 우측 패널에서는 커밋에 대한 정보를 확인할 수 있는데 이 커밋이 왜 발생했는지, 언제 발생했는지, 얼마나 걸렸는지 등을 확인할 수 있다.


### Flamegraph Chart

플레임그래프 차트는 각 커밋별로 애플리케이션의 상태를 확인할 수 있다. 차트의 각 막대는 React의 컴포넌트를 나타내며 막대의 길이와 색상은 컴포넌트와 그 자식 컴포넌트를 렌더링하는 데 걸린 시간을 나타낸다.

노란색이 렌더링에 가장 많은 시간이 소요되었음을 뜻하고, 초록색은 렌더링에 짧은 시간이 소요되었음을 뜻한다. 회색의 경우에는 해당 커밋에서 컴포넌트가 렌더링 되지 않았음을 뜻한다.

막대를 클릭하면 우측 패널에서 렌더링 관련 정보를 확인할 수 있다. 해당 컴포넌트가 왜 렌더링 되었는지, 언제 렌더링이 일어났는지 알 수 있다.
![](https://velog.velcdn.com/images/parkseridev/post/7937c3ac-f624-4920-9774-402f3115d0bb/image.png)

### Ranked Chart

Ranked Chart는 커밋 내에서 렌더링에 가장 많은 소요시간이 걸린 순으로 막대를 정렬해준다. 해당 차트는 현재 커밋에서 렌더링되지 않았던 회색의 막대들은 필터링하고 보여준다. 따라서 커밋 내에 실제로 렌더링이 일어났던 컴포넌트만 확인할 수 있다.

상위 컴포넌트는 하위 컴포넌트의 렌더링 시간을 포함하기 때문에 일반적으로 상위 컴포넌트들이 랭킹 최상위를 차지하게 된다.


![](https://velog.velcdn.com/images/parkseridev/post/46da7cb6-5125-4844-9816-738a59edce86/image.png)


## 설정
`Profiler`도 톱니바퀴 아이콘을 통해 컴포넌트가 왜 렌더링 됐는지를 기록할 여부를 결정하거나, 특정 ms 이하의 커밋들은 숨김처리를 할 수 있다.

![](https://velog.velcdn.com/images/parkseridev/post/a8f52453-3321-47c7-94f3-5f949e679d60/image.png)

