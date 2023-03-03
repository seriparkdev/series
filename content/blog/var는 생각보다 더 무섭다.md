---
title: var는 생각보다 더 무섭다
date: 2023-01-07
description: 사용 금지
tags: [JavaScript]
---

## 💡 스코프

**var는 함수 스코프**이고, **let&const는 블록 단위 스코프**이며 TDZ의 영향을 받습니다. 사람이 코드를 읽을 때는 블록 단위의 스코프가 이해하기 쉽기 때문에 함수 스코프 단위인 var는 예상치 않은 결과를 가져올 수도 있어요. 블록 안에서 선언된 변수인데 블록 밖에서도 접근할 수 있는 전역 변수는 혼란스러운 거죠. 그래서 블록 스코프인 let & const가 안전합니다.

## 💡 전역 공간을 사용하지 말자

`브라우저 환경`일 때는 **window**가 최상위 객체입니다. 이 객체에는 자바스크립트 api 명세가 모두 들어 있습니다. web api란 window.setTimeout, window.setInterval 같이 브라우저에서 사용하는 인터페이스입니다.

`node.js 환경`일 때는 **global**이 최상위 객체입니다. global은 node.js를 위한 환경이기 때문에 브라우저에는 존재하지 않습니다.

var를 사용하면 이러한 최상위 객체를 건드리게 되기 때문에 무척 **위험성**이 크고 예상치 못한 결과를 야기시킬 수 있어요.

아래의 코드를 보면 A와 B는 다른 컴포넌트임에도 불구하고 A에서 선언된 변수 name이 B에서도 접근 가능하다는 것을 확인할 수 있습니다. 전역 변수이기 때문이죠.

A.js

```javascript
var name = "seri";
```

B.js

```javascript
console.log(name); // seri
```

<br>

다른 문제도 있습니다. 브라우저의 콘솔에서 window를 입력하고 window 객체의 프로퍼티를 확인해보면 아까 A.js에서 선언했던 변수 name이 들어가 있는 것을 확인할 수 있어요. 이것이 뜻하는 바는 위험성이 크다는 것입니다. window.alert도 내 마음대로 커스텀할 수 있어요.

<br>

![](https://velog.velcdn.com/images/seripark/post/1b3aa3ff-ec39-4de0-816a-d188e5117a71/image.png)

이러한 일이 발생하는 이유는 자바스크립트는 몽키패치이기 때문입니다. 런타임 중 프로그램 내용이 변경할 수 있고, 직접 언어에 개입을 할 수 있는 것이죠.

## 결론

어쨌거나, var는 절대 사용 금지!
