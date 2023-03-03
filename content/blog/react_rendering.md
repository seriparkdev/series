---
title: React의 리렌더링은 언제 일어날까?
date: 2023-01-30
description: 중심은 state
tags: [React]
---

그동안 React에서 리렌더링은 state 때문에 일어난다는 말을 많이 들어왔습니다. 왜 state 때문에 리렌더링을 할까요?

**React의 main job은 application의 UI에 React state를 반영**하는 것입니다. 가장 최신 상태의 state를 UI를 통해서 사용자에게 보여줘야 하는데, 이미 지나간 state를 보여줄 수는 없는 것이죠. state가 변경됐을 때 리렌더링 하지 않으면 아무리 `열기`라는 버튼을 100번 눌러도 사용자는 아무 것도 볼 수 없어요. 비록 실제로는 열기라는 상태로 변했음에도 말이죠. 이와 관련된 자세한 설명은 [React 공식 문서](https://beta.reactjs.org/learn/state-a-components-memory#when-a-regular-variable-isnt-enough)에서 볼 수 있습니다.

그럼 이제 리렌더링이 왜 필요한가에 대해 이해할 수 있습니다. 그렇다면 리렌더링은 언제 일어날까요? 앞서 state 때문에 리렌더링이 발생한다고 했는데요. 정확히 **state가 변할 때** 리렌더링이 일어납니다. 그렇지만 여기서 명확히 짚고 넘어가야 합니다. **state가 변하면 모든 컴포넌트가 리렌더링 될까요? 어느 컴포넌트가 리렌더링 대상이 될까요?**

<br>

📌 App.js

```javascript
import Counter from "./Counter";

function App() {
  return <Counter />;
}

export default App;
```

📌 Counter.js

```javascript
import { useState } from "react";
import Description from "./Description";
import Number from "./Number";

export default function Counter() {
  const [count, setCount] = useState(0);

  const countHandler = () => {
    setCount(count + 1);
  };

  return (
    <main>
      <Description />
      <button onClick={countHandler}>click me</button>
      <Number count={count} />
    </main>
  );
}
```

📌 Description.js

```javascript
export default function Description() {
  return <div>숫자를 카운트 할 수 있는 카운터입니다. 버튼을 클릭해보세요!</div>;
}
```

📌 Number.js

```javascript
export default function Number({ count }) {
  return <div>Count: {count}</div>;
}
```

<br>

![](https://velog.velcdn.com/images/seripark/post/a845fba0-53c5-44fe-9aec-81d413279f26/image.png)

<br>

예시로 카운터를 만들어봤습니다. `Counter`라는 컴포넌트는 `Description`, `Number`라는 컴포넌트를 자식 컴포넌트로 가지고 있습니다. 여기서 예측해봅시다. `Counter`라는 컴포넌트에 있는 `click me` 버튼을 누르면 어떤 일이 발생할까요? `App` 컴포넌트는 리렌더링이 될까요?

<br>

> 컴포넌트의 state가 변하면 해당 컴포넌트와 하위 컴포넌트는 모두 리렌더링됩니다.

`App` 컴포넌트는 리렌더링 되지 않아요. 종종 App이 리렌더링 된다고 오해하는 경우가 있는데, state를 가진 컴포넌트, 그리고 그 컴포넌트의 하위 컴포넌트만 리렌더링됩니다. 여기서 state를 가진 컴포넌트란 `Counter` 컴포넌트를 말하고, 하위 컴포넌트는 `Description`과 `Number`라는 컴포넌트를 가리킵니다.

React의 확장 프로그램으로 봤을 때 `Description`, `Number` 컴포넌트가 `Counter`, `App`에 의해 리렌더된다는 것을 확인할 수 있습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/a0ecb391-86ad-47e4-b9e5-1e0f3f3402cc/image.png)

<br>

![](https://velog.velcdn.com/images/seripark/post/f0e3165b-03ca-4f44-9028-f10f8fe326ec/image.png)

<br>

리렌더링의 과정은 어떨까요?

**리액트의 리렌더링 과정**

> 1. 기존의 UI를 재사용할지 확인한다.
> 2. render method, component 함수를 호출한다.
> 3. 함수의 호출 결과에 따라 VirtualDOM을 생성한다.
> 4. 전에 생성했던 VirtualDOM(실제 DOM과 비슷한 객체)과 이번에 생성한 VirtualDOM을 비교하고, 실제로 변한 부분만 DOM에 적용한다.

<br>

여기서 Virtual DOM은 최적화하기 위해 React가 사용하는 것입니다. 이는 무엇일까요?

렌더링을 위해서는 CRP(critical rendering path) 과정을 거쳐야 합니다. 즉, CSSOM을 생성하고, DOM을 생성하고, 이를 합치고, layout과 paint 과정을 거쳐야 하는데요. DOM에 변화가 생기면 이 과정을 또, 반복적으로 거쳐야 합니다. SPA(Single Page Application)은 DOM 조작을 많이 해야 하는데 이러면 성능에 좋지 못한 영향을 많이 주게 되죠.

그래서 React는 이전에 생성되었던 VirtualDOM과 새로 생성된 VirtualDOM을 비교해서 실제로 변한 부분을 찾아 한번에 DOM에 반영하는 방법을 택한 것입니다.

이렇게 리렌더링이 무엇인지 그리고 그 과정에 대해 알아보았습니다.

<br>

**참고 문서**

[saiki.hashnode.dev](https://saiki.hashnode.dev/the-one-thing-that-no-one-properly-explains-about-react-why-virtual-dom)

[beta.reactjs.org](https://beta.reactjs.org/)

[why-react-re-renders](https://www.joshwcomeau.com/react/why-react-re-renders/)
