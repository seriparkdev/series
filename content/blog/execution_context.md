---
title: 실행 컨텍스트로 이해하는 JavaScript의 동작 원리
date: 2025-09-30
description: 호이스팅, 스코프, 클로저를 이해할 수 있다
tags: [JavaScript]
---

## ✍️ 실행 컨텍스트의 기본 개념

실행 컨텍스트를 한 마디로 정의하면 **실행할 코드에 제공할 환경 정보들을 모아놓은 객체**라고 할 수 있다. 좀 더 구체적으로 말하면 소스코드를 실행하는데 필요한 환경을 제공하고 실행 결과를 관리하는 영역이다.

JavaScript 엔진이 코드를 처리하는 과정을 살펴보면 이해가 쉬워진다. 엔진은 소스코드를 두 단계로 나누어 처리한다:

1. **소스코드 평가**: 실행 컨텍스트를 생성하고 변수, 함수 등의 선언문만 먼저 실행해서 생성된 식별자를 실행 컨텍스트가 관리하는 스코프에 등록한다.
2. **소스코드 실행**: 선언문을 제외한 나머지 코드가 실행된다(런타임). 이때 필요한 정보들을 실행 컨텍스트가 관리하는 스코프에서 검색해서 가져온다.

간단한 예제로 살펴보자:

```jsx
const x = 1;

function foo() {
  const y = 2;

  function bar() {
    const z = 3;
    console.log(x + y + z);
  }
  bar();
}

foo(); // 6
```

이 코드가 실행될 때 실행 컨텍스트들이 콜 스택에 차례로 쌓이게 된다. 전역 컨텍스트가 먼저 생성되고, foo 함수가 호출되면 foo의 실행 컨텍스트가 생성되어 스택에 푸시된다. 그리고 bar 함수가 호출되면 bar의 실행 컨텍스트가 또 스택에 푸시된다.
![](https://velog.velcdn.com/images/parkseridev/post/c821b79b-abfd-4d8e-a2a5-c9dd08817827/image.png)

실행 컨텍스트가 활성화되는 시점에는 선언된 변수를 호이스팅하고, 외부 환경 정보를 구성하고, this 값을 설정하는 등의 작업이 수행된다. 콜 스택에서 가장 위에 있는 컨텍스트와 관련된 코드들이 실행되는 방식으로 코드의 환경과 순서를 보장한다.

## ✍️ 실행 컨텍스트의 종류

### 전역 실행 컨텍스트
전역 컨텍스트는 JavaScript 코드를 실행하는 순간 자동으로 생성된다. 브라우저에서 JavaScript 파일을 열자마자 전역 컨텍스트가 활성화되는 것이다. 최상단 공간이기 때문에 자동으로 실행된다고 볼 수 있다.

### 함수 실행 컨텍스트
함수가 호출될 때마다 해당 함수에 대한 환경 정보를 수집해서 실행 컨텍스트를 생성한 후 콜 스택에 담는다. 콜 스택에 함수 실행 컨텍스트가 푸시되는 것은 함수의 실행 시작을 의미한다.

전역 컨텍스트와 관련된 코드를 실행하다가도 콜 스택에 함수 관련 컨텍스트가 담기면 실행을 중단하고 해당 함수 내부 코드를 순차적으로 실행한다. 함수 내부에서 또 다른 함수를 호출하는 구조에서는 외부 함수의 컨텍스트 실행을 중단하고 내부 함수의 코드를 실행한다.

함수 내부의 코드를 모두 실행하고 나면 해당 함수와 관련된 실행 컨텍스트는 콜 스택에서 제거된다. 이렇게 콜 스택은 함수의 실행 순서를 관리하는 역할을 한다.

### eval 실행 컨텍스트
eval() 함수 내부 코드 실행 시 생성되나 보안/성능 문제로 현대 JavaScript에서 거의 사용하지 않는다.

## ✍️ 실행 컨텍스트 객체의 내부 구조

![](https://velog.velcdn.com/images/parkseridev/post/06f8998a-4b0a-4b0f-9099-dab4396cac4d/image.png)


실행 컨텍스트 객체에는 세 가지 주요 정보가 담긴다:

### VariableEnvironment
컨텍스트 내 식별자들에 대한 정보와 외부 환경 정보를 담고 있다. 선언 시점의 `LexicalEnvironment` 스냅샷이라고 볼 수 있으며, 따라서 변경 사항이 반영되지 않는다.

실행 컨텍스트를 생성할 때 `VariableEnvironment`에 먼저 정보를 담고 그대로 복사해서 `LexicalEnvironment`를 만든다. 이후에는 `LexicalEnvironment`를 주로 활용하고 `VariableEnvironment`는 스냅샷 유지 목적으로 사용한다.

### LexicalEnvironment
초기에는 `VariableEnvironment`와 같지만 변경 사항이 실시간으로 반영된다는 차이가 있다. 스코프와 변수를 관리하는 핵심적인 개념이며, 변수와 함수의 유효범위를 정의하는 구조다.

함수가 호출될 때마다 새로 생성되고, 함수가 실행되는 동안 해당 `LexicalEnvironment`와 연관된 변수를 참조하고 조작한다.

`LexicalEnvironment`는 두 가지 구성 요소를 가진다:

- **environmentRecord**: 특정 환경(즉, 스코프) 내에 정의된 식별자 정보를 저장하는 객체다. 매개변수 이름, 함수 선언, 변수명 등이 순서대로 수집된다. 현재 스코프에서 사용 가능한 식별자들을 매핑하며, 이로 인해 호이스팅이 발생한다.

- **outerEnvironmentReference**: 바로 직전 컨텍스트(외부 환경)의 `LexicalEnvironment` 정보를 참조한다. 이것이 스코프와 스코프 체인을 형성하는 핵심 메커니즘이다.

### ThisBinding
this 식별자가 바라봐야 하는 객체에 대한 정보를 담고 있다.

## ✍️ 실행 컨텍스트와 호이스팅

호이스팅을 이해하려면 실행 컨텍스트의 동작 방식을 알아야 한다. 다음 예제를 보자:

```jsx
// 원래 함수
function a() {
    var x = 1;
    console.log(x);
    var x;
    console.log(x);
    var x = 2;
    console.log(x);
}
```

JavaScript 엔진이 이 코드를 해석할 때는 다음과 같이 동작한다:

```jsx
// 호이스팅이 적용된 방식
function a() {
    var x;
    var x;
    var x;
    
    x = 1; // 할당 부분은 호이스팅되지 않음
    console.log(x);
    console.log(x);
    x = 2;
    console.log(x);
}
```

JavaScript 코드를 실행하기 전에 식별자를 수집하기 때문에 코드를 실행하는 시점에서는 엔진이 실행 컨텍스트에 속한 변수명을 모두 알고 있게 된다. 그래서 편의상 `식별자들을 최상단으로 끌어올린 다음 코드를 실행한다`고 설명하는 것이다.

하지만 실제로는 선언문을 최상단으로 끌어올리는 것이 아니라, 식별자에 대한 정보들이 `environmentRecord`에 미리 담겨있기 때문에 가능한 일이다.

### var, let, const 키워드의 차이점

let과 const 키워드로 선언한 전역 변수는 전역 객체의 프로퍼티가 되지 않고 개념적인 블록 내에 존재한다. 이는 전역 환경 레코드의 구성 방식과 관련이 있다.

전역 환경 레코드는 두 가지로 구성된다:

![](https://velog.velcdn.com/images/parkseridev/post/f6a24613-0b1a-418e-a2d3-18b3009a4223/image.png)


**객체 환경 레코드**: var 키워드로 선언한 전역 변수, 함수 선언문으로 정의한 전역 함수, 빌트인 전역 함수, 빌트인 객체를 관리한다. var는 `BindingObject`를 통해 전역 객체(window, global)의 프로퍼티와 메서드가 된다.

**선언적 환경 레코드**: let, const 키워드로 선언한 전역 변수를 관리한다.

따라서 var 키워드로 선언한 변수는 코드 실행 단계에서 변수 선언문 이전에도 참조할 수 있는데, let과 const의 경우 전역 객체의 프로퍼티가 아니라 초기화 전까지 `window.x`와 같은 접근으로 참조할 수 없다. 또한 var와 달리 선언 단계와 초기화 단계가 분리되어 진행되기 때문에 변수 선언문이 실행되기 전(초기화 단계 전)까지 `일시적 사각지대(Temporal Dead Zone)`에 빠진다.


```js

console.log(x); // Uncaught ReferenceError: Cannot access 'x' before initialization
let x = 10;

```

현재 선언적 환경 레코드의 x에는 `<uninitialized>`가 바인딩 되어 있다. 초기화 전이기 때문에 접근할 수 없는 상태임을 알 수 있다. 여기서 `ReferenceError`가 발생함으로써 호이스팅 되었다는 것은 확인할 수 있다. 호이스팅이 되지 않았다면 not defined가 발생할 것이다.



### 블록 레벨 스코프와 렉시컬 환경

let과 const로 선언한 변수는 블록 레벨 스코프를 갖는다. 다음 예제를 보자:

```javascript
let x = 1;

if (true) {
  let x = 10;
  console.log(x); // 10
}

console.log(x); // 1
```

if문의 코드 블록을 실행하면 기존의 전역 렉시컬 환경에서 **새로운 블록 레벨 렉시컬 환경이 생성되어 교체**된다. 이 새로운 렉시컬 환경은 선언적 환경 레코드를 갖고 있으며, 블록 내부에서 let으로 선언한 변수 x를 관리한다.

블록 레벨 렉시컬 환경의 `outerEnvironmentReference`는 전역 렉시컬 환경을 가리킨다. 따라서 블록 내부에서 변수를 참조할 때 현재 블록의 환경 레코드를 먼저 검색하고, 없으면 외부 렉시컬 환경으로 스코프 체인을 따라 올라간다.

if문의 실행이 종료되면 이전의 렉시컬 환경(전역 렉시컬 환경)으로 다시 교체된다. 이렇게 코드 블록이 실행될 때마다 새로운 렉시컬 환경이 생성되고 교체되는 방식으로 블록 레벨 스코프가 구현된다.


### 함수 선언문과 함수 표현식의 호이스팅

함수를 정의하는 방식에 따라 호이스팅 동작이 달라진다:

```jsx
console.log(sum(1, 2)); // 3 - 정상 동작
console.log(multiply(3, 4)); // TypeError: multiply is not a function

// 함수 선언문 sum
function sum (a, b) {
    return a + b;
}

// 익명 함수 표현식 multiply
var multiply = function (a, b) {
    return a * b;
}
```

호이스팅이 적용되면 다음과 같이 해석된다:

```jsx
// 함수 선언문은 전체가 호이스팅된다
var sum = function sum(a, b) {
    return a + b;
}

// 변수는 선언부만 끌어올려진다
var multiply;

console.log(sum(1, 2)); // 3 - 정상 동작
console.log(multiply(3, 4)); // TypeError

// 변수의 할당부는 원래 자리에 남게 된다
multiply = function (a, b) {
    return a * b;
}
```

함수 선언문은 일반 변수와 달리 선언과 동시에 바로 초기화되어 렉시컬 환경이 만들어지는 즉시 사용할 수 있다. `BindingObject`로 전역 객체에 함수 이름을 키로 등록하고 생성된 함수 객체를 즉시 등록한다. (var 변수의 경우 undefined를 바인딩하고 할당은 하지 않음)

하지만 이런 특성 때문에 예측 불가능한 버그가 발생할 수 있어서 함수 표현식을 사용하는 것이 좋다. 표현식의 경우 함수를 정의하기 이전에 실행하면 명확하게 `~ is not a function` 에러가 발생하기 때문이다.

```jsx
// 권장되는 방식
const multiply = (a, b) => {
    return a * b;
}
```


## ✍️ 실행 컨텍스트와 스코프 체인

### 스코프 체인이란?

스코프는 식별자의 유효 범위를 의미하는데, 스코프 체인은 식별자의 유효범위를 안에서 바깥으로 차례로 검색해나가는 것을 의미한다. 이것의 동작 원리는 `LexicalEnvironment`의` outerEnvironmentReference`에 있다.

`outerEnvironmentReference`는 현재 호출된 함수가 선언될 당시의 `LexicalEnvironment`를 참조한다. 이것이 핵심이다.


![](https://velog.velcdn.com/images/parkseridev/post/3a30aee1-a972-4086-b84d-fc3dfabdd02f/image.png)

변수를 탐색할 때는 현재 변수가 포함된 스코프 체인상의 첫 번째, 즉 현재 함수의 `LexicalEnvironment`부터 탐색하게 된다. `environmentRecord`를 먼저 확인하고, 없으면 `outerEnvironmentReference`를 따라 상위 스코프로 올라간다.

이 체인을 통해 변수를 탐색하다가 찾지 못하면 ReferenceError를 반환한다. 전역 렉시컬 환경에서 더 올라갈 상위 스코프는 존재하지 않기 때문에, 식별자 결정에 실패하게 되면 전역 렉시컬 환경에서 검색할 수 없는 `ReferenceError`를 발생시킨다.

전역 컨텍스트의 `LexicalEnvironment`에 담긴 변수를 전역변수라고 하고, 그 외 실행 컨텍스트의 변수들은 모두 지역변수다.

중요한 점은 함수를 어디서 호출했는지가 아니라 어디에 정의했는지에 따라 상위 스코프가 결정된다는 것이다. 이것이 바로 렉시컬 스코프(정적 스코프)의 개념이다.


## ✍️ 클로저(Closure)와 실행 컨텍스트

클로저는 실행 컨텍스트와 렉시컬 환경이 어떻게 동작하는지 이해해야만 제대로 설명할 수 있는 개념이다.

### 함수의 [[Environment]]와 렉시컬 스코프
다음 코드를 보자:
```jsx
const x = 1;

function foo(){
    const x = 10;
    bar();
}

function bar(){
    console.log(x);
}

foo(); // 1
bar(); // 1
```
bar 함수는 foo 함수 내부에서 호출되었지만 전역의 x = 1을 참조한다. 이는 JavaScript가 **렉시컬 스코프(정적 스코프)**를 따르기 때문이다. 함수의 상위 스코프는 함수가 정의된 위치에 의해 결정되며, 이 정보는 함수 객체의 내부 슬롯 `[[Environment]]`에 저장된다.

- 함수가 생성될 때 `[[Environment]]`에 현재 실행 중인 실행 컨텍스트의 렉시컬 환경 참조가 저장된다.
- `[[Environment]]`는 함수가 생성될 때 딱 한 번 설정되고 변하지 않는다.
- 함수가 호출되어 실행 컨텍스트가 생성될 때, 이 `[[Environment]]` 값이 외부 렉시컬 환경에 대한 참조(`outerEnvironmentReference`)로 사용된다

### 클로저와 렉시컬 환경의 생명 주기
클로저는 외부 함수보다 중첩 함수가 더 오래 유지되는 경우, **이미 생명 주기가 종료한 외부 함수의 변수를 참조**할 수 있는 중첩 함수를 말한다.

```js
const x = 1;

function outer(){
    const x = 10;
    const inner = function(){
        console.log(x);
    }
    return inner;
}

const innerFunc = outer(); // (1)
innerFunc(); // 10 (2)
```

1. outer 함수 실행 후: `outer` 함수의 실행 컨텍스트는 콜 스택에서 제거(pop)된다. 일반적으로 **실행 컨텍스트가 제거되면 해당 함수의 지역 변수도 소멸해야 한다.**

2. innerFunc 실행 시: 그런데 `innerFunc`를 호출하면 **이미 소멸한 `outer` 함수의 지역 변수 `x`에 접근할 수 있다.**


### 실행 컨텍스트 관점에서 본 클로저의 동작 원리

1. `outer` 함수 실행 시 `outer` 함수의 실행 컨텍스트가 생성되고 렉시컬 환경도 생성된다.
2. `inner` 함수가 생성될 때, `inner` 함수의 `[[Environment]]`에 현재 실행 중인 `outer` 함수의 렉시컬 환경 참조가 저장된다.
3. `outer` 함수가 `inner` 함수를 반환하고 종료되면, `outer` 함수의 실행 컨텍스트는 콜 스택에서 제거된다.
4. 하지만 `outer` 함수의 렉시컬 환경은 소멸하지 않는다. 왜냐하면 **`inner` 함수의 `[[Environment]]`가 `outer` 함수의 렉시컬 환경을 참조하고 있고, 전역 변수 `innerFunc`가 `inner` 함수를 참조하고 있기 때문**이다.
5. 가비지 컬렉터는 누군가 참조하고 있는 메모리를 해제하지 않는다. 따라서 `innerFunc` 호출 시 `inner` 함수의 실행 컨텍스트가 생성되고, `outerEnvironmentReference`는 `[[Environment]]`에 저장된 `outer` 함수의 렉시컬 환경을 가리킨다. 이를 통해 스코프 체인이 형성되어 `outer` 함수의 변수 `x`에 접근할 수 있다.

### 클로저에 의해 발생하는 메모리 소모 관리하기

클로저는 외부 함수의 렉시컬 환경을 메모리에 계속 유지하기 때문에, 필요 이상으로 메모리를 소비할 수 있다. 따라서 클로저 사용이 끝나면 적절하게 메모리를 해제해주는 것이 좋다. 참조 카운트를 0으로 만들어 가비지 컬렉터가 수거하도록 해야하는데, 식별자에 `null` 또는 `undefined` 같은 기본형 데이터를 할당하여 참조를 끊어주면 된다.

```js

let outer = (function() {
    let a = 1;
    let inner = function() {
        return ++a;
    };
    return inner;
})();

console.log(outer()); // 2
console.log(outer()); // 3

// 클로저 사용이 끝나면 참조를 해제
outer = null; // outer 함수의 렉시컬 환경이 가비지 컬렉션 대상이 됨
```


## 마무리

실행 컨텍스트는 JavaScript가 코드를 실행하는 방식을 이해하는 핵심 개념이다. 처음에는 복잡해 보이지만, 실행 컨텍스트의 동작 원리를 이해하고 나면 다음과 같은 JavaScript의 독특한 특징들이 왜 그렇게 동작하는지 명확하게 알 수 있다:

- 호이스팅: `environmentRecord`가 식별자 정보를 미리 수집하기 때문에 발생하는 현상
- 스코프 체인: `outerEnvironmentReference`를 통해 상위 스코프로 연결되어 변수를 탐색하는 메커니즘
- 클로저: 함수가 자신이 선언된 당시의 `LexicalEnvironment`를 기억하여 외부 함수의 변수에 접근할 수 있는 현상

실행 컨텍스트는 단순히 이론적인 개념이 아니라, JavaScript 엔진이 실제로 코드를 평가하고 실행하는 과정 그 자체다. 이를 이해하면 디버깅할 때 콜 스택을 읽는 능력이 향상되고, 예상치 못한 버그를 사전에 방지할 수 있으며, 더 나은 코드 구조를 설계할 수 있게 된다.
결국 실행 컨텍스트는 JavaScript가 "실행할 코드에 제공할 환경 정보들을 모아놓은 객체"라는 처음의 정의로 돌아온다.

<br>
<br>
<br>

**참고 문서**

[모던 자바스크립트 딥다이브](http://www.yes24.com/Product/Goods/92742567)

[코어 자바스크립트](https://www.yes24.com/Product/Goods/78586788)

[모던 JavaScript 튜토리얼](https://ko.javascript.info/)