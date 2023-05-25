---
title: "Vanilla JavaScript를 오랜만에 써봤다"
date: 2023-05-25
description: "재밌지만 복잡하고 길고 길다"
tags: [JavaScript]
---

최근에 Vanilla JavaScript를 이용해서 무언갈 구현하는 과제를 받아서 다시 공부했었다. Vanilla JavaScript를 사실 예전에 사용해 보고 그 후로는 계속 React로 개발을 해왔었기 때문에 되게 낯설게 느껴졌다. 그래도 한번 배웠던 지식은 머리 어딘가에 남겨져 있는 것 같다. 과제를 하면서 직접 사용을 하다 보니 금세 익숙해져서 재밌게 개발했다.

Vanilla JavaScript로 개발하면 어떤 단점이 있는지도 좀 많이 와닿았던 계기가 됐다. Vanilla JavaScript를 처음 사용했을 때는 원래 이렇구나라는 생각을 해서 불편함을 느끼지 않았는데 React로 개발을 하다가 다시 사용해 보니 차이가 바로 와닿았다. 아무래도 명령형이다 보니 React로는 한 줄로 작성할 수 있는 코드도 길게 작성해야 한다는 단점이 있다.

예를 들어 이런 코드다.

<br/>

```javascript
const li = document.createElement("li");
li.classList.add("fruit");
li.innerText = "apple";
```

<br/>

요소를 만들고 클래스 이름을 부여하고 거기에 이런 텍스트를 넣어줘라고 굉장히 섬세하게 알려줘야 한다. React라면 이런 식의 간단한 코드였을 텐데 말이다.

<br/>

```html
<li className="fruit">apple</li>
```

<br/>

아무래도 Vanilla JavaScript는 이렇게 코드를 길게 작성해줘야 하기 때문에, 코드의 가독성도 굉장히 좋지 않았다. 이게 어떤 코드인지 이해하고 흐름을 파악해야 하는 시간이 필요하다. 그리고 코드를 읽는 게 약간 이런 느낌이기도 했다.

<br/>

> 영희는 철수의 친구이다. 영희는 노란색 옷을 입은 여자아이이며 나이는 8살이다.

<br/>

그러나 이렇게 코드가 간단명료하게 읽히면 코드를 이해하는 데 쏟는 비용이 굉장히 줄어들 것이다. 이런 게 선언형의 방식이고 큰 장점인 것 같다.

<br/>

- 영희
  - 철수 친구
  - 노란색 옷 착용
  - 8살

<br/>

어쨌거나 Vanilla JavaScript 얘기로 돌아가자면, 이 코드를 어떻게 해야 가독성을 높일 수 있을지, 코드의 중복성을 줄일 수 있을지, 어떻게 하면 유지 보수하기 좀 더 쉬워질 수 있을지 감이 잘 잡히지 않았다. 중복을 줄이려면 반복되는 패턴이 있어야 하는데 세부적으로 조금씩 다른 코드를 가져서 그렇게 하는 게 어려웠다. 잘 작성된 Vanilla JavaScript는 어떤 것일까에 대해 조금 고민이 많았던 과제였다.

그래도 코드를 작성하면서 너무 반복적으로 작성하는 부분이 있다고 느껴지는 부분을 함수로 만들어보긴 했다. 아까 코드와 같은 부분이다.

<br/>

```javaScript
  const li = document.createElement("li");
  li.classList.add("fruit");
  li.innerText = 'apple';
```

<br/>

이 코드를 중복적으로 작성하고 있다는 생각이 들어서 이런 식으로 함수로 만들었다.

<br/>

```js
function CreateElement(element, className, text) {
  const createdElement = document.createElement(element);
  createdElement.classList.add(className);
  li.innerText = text;
}
```

<br/>

좋은 방법인진 모르겠으나... 그래도 중복을 좀 줄였다는 느낌이 들어서 좋았다. 재사용할 부분도 꽤 있었기 때문에 만족스러웠다.

나는 이런 식으로 코드의 가독성을 높이는 과정을 좋아하는 편이다. 뭔가 지저분한 걸 깔끔하게 만드는 느낌이다. 그래서 가독성을 높이면 속이 시원할 때가 있다. 이런 이유로 코드를 개선하는 데에 신경을 쓰다 보니 코드의 가독성이 좋다는 평을 종종 들을 수 있었다. 그러나 내가 한 방식이 좋은지, 옳은지에 대한 확신은 가지기 어렵긴 하다. 그래서 많은 사람과 코드에 대해 얘기를 나눠보는 것이 좋은 것 같다.

아무튼 Vanilla JavaScript를 사용하면서 느낀 생각에 대해 정리해 봤다. 요즘 이런저런 과제를 받아서 하는 게 재밌다. Vanilla JavaScript를 사용하는 과제를 받았을 땐 내가 잘 사용해 보지 않은 영역이라 어렵지 않을까 싶었는데, 그래도 재밌었다. 새로운 걸 한다는 건 처음엔 좀 막연한 어려움을 느끼게 하지만 적응하기 시작하고 능숙해지기 시작하면 재밌어지는 것 같다.
