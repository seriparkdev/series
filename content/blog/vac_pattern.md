---
title: 뷰와 로직을 분리해주는 VAC 패턴
date: 2024-11-10
description: 컴포넌트의 관심사를 분리하자
tags: [React]
---

## 시작하며

요즘 리팩토링을 할 일이 많아서 어떻게 하면 컴포넌트를 체계적으로 관리할 수 있을까에 대해 고민하던 차에 VAC 패턴이라는 것을 알게 되었고, 컴포넌트 내부에 얽히게 되는 관심사를 잘 분리해줄 수 있을 것 같아 공부해봤다.

<br/>


## Normal React 패턴


Normal React 패턴의 흐름은 그림과 같이 UI에서 이벤트가 발생하면 비즈니스 로직을 호출하여 Props나 State를 업데이트 하고, Props나 State가 변경되면 리렌더링이 발생하여 JSX, Style, Child Components와 같은 직접적인 화면 요소를 다시 그리게 된다.

직접 코드를 본다면 흐름은 다음과 같다.

<br/>

```javascript
const UserComponent = () => {
  // 1. UI Functionality → Business Logic
  const handleClick = () => {  // UI에서 이벤트 발생
    updateUser();             // 비즈니스 로직 직접 호출
  };

  // 2. Business Logic → Props, State
  const updateUser = async () => {
    const data = await api.updateUser();  // 비즈니스 로직 실행
    setUser(data);                        // State 직접 업데이트
  };

  // 3. Props, State → JSX/Style/Components
  return (
    <div style={{ padding: '20px' }}>      {/* Style */}
      <h1>{user.name}</h1>                 {/* JSX */}
      <UserDetails user={user} />          {/* Child Component */}
    </div>
  );
};
```

<br/>

새로운 패턴이 등장했다는 것은 기존의 패턴에 대한 어떤 단점을 극복하기 위해 나오게 되었을 텐데 이 구조에 대한 단점은 무엇일까? 이는 컴포넌트 내에 UI와 상태를 다루는 기능쪽 로직이 강결합 되어 있다는 문제점이 있다. 기존 애플리케이션에서 이슈가 발생하면 디자인만 수정하는 부분인데도 컴포넌트 내에 관심사가 뒤섞여 있기 때문에 디자인 이상의 로직을 같이 보고 있는 경우가 있다. 또 비즈니스 로직만 보면 되는 경우에도 컴포넌트 내부 코드들을 왔다갔다하며 필요 이상으로 많은 코드를 봐야할 때가 있다.

관심사의 분리에 대한 필요성 외에도 이 비즈니스 로직이 다른 컴포넌트에도 동일하게 쓰인다면, 그 로직을 테스트 해야 한다면 따로 분리를 해두는 것이 재사용성을 높이고 깔끔하게 테스트를 할 수 있는 방향일 것이라 생각된다.

<br/>


## VAC 패턴

<br/>

![](https://velog.velcdn.com/images/parkseridev/post/1837f33f-7582-4c63-a60d-08126fab273c/image.png)

<br/>

앞서 말한 문제점을 개선해줄 수 있는 방법 중 하나가 VAC 패턴이다. 기존 패턴과 같이 UI 기능과 비즈니스 로직은 Props와 State를 통해 연결되어 있으나, Props Object라는 계층이 하나 추가되어 VAC 컴포넌트 사이에 중간 다리를 만들어주는 것을 그림에서 볼 수 있다. VAC 컴포넌트란 View Asset Component로 오직 UI를 그리는 데 필요한 JSX, Style만을 다루는 컴포넌트를 말한다. VAC 컴포넌트는 Props Object를 통해 뷰 관련 로직을 외부로부터 받아와 사용하기만 하고 직접 관여하여 제어하지는 않는다. 따라서 컴포넌트 자체는 상태를 다루지 않기 stateless 컴포넌트라고 부르기도 한다. 오직 반복적 생성, 조건부 노출, 스타일 제어 등 렌더링 관련 로직에만 관여하여 컴포넌트의 재사용성도 높아진다.

<br/>

VAC Component
: VAC 컴포넌트에는 상태, 핸들러 등을 모두 외부에서 받아와 순수하게 렌더링 관련 코드만 존재한다.

<br/>

```javascript
const CounterView = ({
  count,
  onIncrease,
  onDecrease,
}: CounterViewProps) => (
  <div>
    <h1>{count}</h1>
    <div>
      <button onClick={onDecrease}>-</button>
      <button onClick={onIncrease}>+</button>
    </div>
  </div>
);
```

<br/>

View Component
: 기능 관련 로직을 관리하며 VAC component에서 필요한 상태와 핸들러를 props로 전달한다.

<br/>

```javascript
const Counter = () => {
  const [count, setCount] = useState(0);

  const props = {
    count,
    onDecrease: () => setCount(count - 1),
    onIncrease: () => setCount(count + 1),
  };

  // return VAC Component
  return <CounterView {...props} />;
};
```

<br/>

## VAC 패턴 사용 시 주의할 점

콜백 함수를 컴포넌트의 element 이벤트에 바인딩할 때는 추가적인 처리를 수행하면 안된다. VAC 컴포넌트는 오직 props를 통해서만 제어되며 스스로의 상태를 관리하거나 변경하지 않아야 한다라는 규칙을 지키기 위해 관련 로직은 전부 외부에서 처리하도록 위임해야 한다.

<br/>

```javascript
const CounterView = ({
  count,
  onIncrease,
  onDecrease,
}: CounterViewProps) => (
  <div>
    <h1>{count}</h1>
    <div>
      <button onClick={() => {
      console.log('감소 버튼 클릭');
      onDecrease();
      }}>-</button>
      <button onClick={() => {
      console.log('증가 버튼 클릭');
      onIncrease();
      }}>+</button>
    </div>
  </div>
);
```

<br/>

## VAC 컴포넌트 명명 규칙
VAC 컴포넌트의 관심사는 오직 UI이기 때문에 데이터 중점적으로 네이밍하기 보다는 렌더링과 관련된 맥락에 맞출 필요가 있다.

<br/>

> Use `disabledDecrease` and `disabledIncrease` instead of `isMax` and `isMin`.
> Use `showEditButton`: `isLogin` && `isOwner` instead of passing `isLogin` and `isOwner` separately and checking `isLogin` && `isOwner` in the VAC.

<br/>

## Presentation-Container와 VAC의 차이

결국 VAC 패턴도 뷰 로직을 컨테이너 컴포넌트에 위임하는 방식을 따르기 때문에 Presentation-Container 패턴의 한 종류라고 볼 수 있다. 그러나 VAC 패턴이 가지는 큰 차이점은 UI 기능 로직 및 상태 관리 로직을 모두 외부에 위임한다는 점에 있다. 따라서 Presentation-Container이 View단의 컴포넌트에 좀 더 많은 책임을 담당하게 한다.

<br/>

## VAC 컴포넌트의 장단점

### 장점

1. 관심사의 분리

- UI 렌더링과 비즈니스 로직이 명확하게 분리
- 각 부분의 역할이 명확해져 코드의 가독성 향상

<br/>


2. 재사용성 향상

- 순수한 UI 컴포넌트이므로 다양한 상황에서 재사용 가능

<br/>


3. 테스트 용이성

- UI와 로직이 분리되어 있어 각각을 독립적으로 테스트할 수 있음
- props만 전달하면 되므로 테스트 코드 작성이 간단

<br/>


4. 유지보수성 향상

- 변경 사항이 발생했을 때 영향 범위를 최소화할 수 있음
- UI 변경과 로직 변경을 독립적으로 수행할 수 있음


<br/>

### 단점

1. Props Drilling 가능성

- 컴포넌트 계층이 깊어질 경우 props 전달이 복잡해질 수 있음
- 상태 관리 라이브러리 사용을 고려해야 할 수 있음

<br/>


2. 간단한 컴포넌트에서의 오버엔지니어링

- 로직이 거의 없는 단순한 컴포넌트에서는 불필요한 분리가 될 수 있음
- 개발 시간과 복잡성이 증가할 수 있음


<br/>

## 맺으며

VAC 패턴을 응용하여 VAC Component에 Props Object를 전달하는 역할을 해주는 컴포넌트 형식의 View Component 대신 Custom hook로 관리하면 상태나 로직을 좀 더 깔끔하게 재사용하고 테스트하기 좋아질 것 같다. 리팩토링을 하면서 컴포넌트 내부에 많은 관심사로 인해 고민이 많았는데 이를 개선할 방법으로 해당 패턴을 응용해볼 수 있을 거 같다!


<br/>