---
title: 자바스크립트의 실행 컨텍스트
date: 2023-02-14
description: 호이스팅, 클로저 등을 이해할 수 있다
tags: [JavaScript]
---

# 서론

자바스크립트의 실행 컨텍스트를 이해하기 위해 글을 작성했습니다. 실행 컨텍스트를 이해하면 호이스팅, 클로저와 같은 개념을 좀 더 깊게 이해할 수 있습니다.

# 실행 컨텍스트란?

실행 컨텍스트란 **소스코드를 실행하는 데 필요한 환경 정보들을 모은 객체**입니다. 소스코드 평가 과정에서 실행 컨텍스트가 생성이 되면 소스코드 실행 시 필요한 정보들을 실행 컨텍스트에서 얻습니다. 모든 코드는 이 실행 컨텍스트를 통해 실행되고 관리됩니다.

# 실행 컨텍스트의 종류

실행 컨텍스트에는 3가지 종류가 있습니다. 이 컨텍스트들은 각 전역, 함수, eval 코드가 평가되면 생성됩니다. 각 소스코드 타입에 따라 필요한 과정과 관리 내용이 다르기 때문에 타입에 맞는 컨텍스트가 필요합니다.

- 전역 실행 컨텍스트
- 함수 실행 컨텍스트
- eval 실행 컨텍스트

<br>

![](https://velog.velcdn.com/images/seripark/post/e04dfcfa-a882-481d-b36b-6feeca9cd35d/image.jpg)

<br>

# 실행 컨텍스트 스택(call stack)

코드의 실행 순서는 `실행 컨텍스트 스택(call stack)`이라는 **스택 자료구조**로 관리됩니다. 코드가 실행되면 환경 정보들을 모은 실행 컨텍스트는 실행 컨텍스트 스택에 추가(push)됩니다. 실행 컨텍스트 스택의 최상위에는 항상 현재 실행 중인 코드의 실행 컨텍스트가 위치합니다.

```javascript
const x = 1;

function foo() {
  const x = 4;
  function bar() {
    console.log("bar 함수");
  }
  bar();
}

foo();
```

다음 코드를 실행되면 콜 스택에 어떤 변화가 일어나는지 살펴보겠습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/dcd4cabb-d8c0-47f6-b28a-855449c85470/image.jpg)

1. **전역 코드 평가와 실행**

2. **foo 함수 코드의 평가와 실행**

3. **bar 함수 코드의 평가와 실행**

4. **foo 함수 코드로 복귀**

5. **전역 코드로 복귀**

절차는 위와 같이 진행됩니다. 소스코드가 평가되면 실행 컨텍스트가 생성되고, 콜 스택에 푸시됩니다. 이때 변수나 함수가 실행 컨텍스트에 등록이 되고, 함수가 실행되면 값 할당이나 호출이 이뤄집니다. 전역 코드를 모두 실행하거나 함수가 종료되면 콜 스택에서 컨텍스트는 pop하여 제거됩니다. **콜 스택은 이렇게 코드의 실행 순서를 관리합니다.**

# 렉시컬 환경

![](https://velog.velcdn.com/images/seripark/post/79214361-7225-42ae-9a47-3ba99c8ba804/image.jpg)

실행 컨텍스트는 `LexicalEnvironment` 컴포넌트와 `VariableEnvironment` 컴포넌트로 구성되어 있습니다. 생성 초기에 `LexicalEnvironment` 컴포넌트와 `VariableEnvironment` 컴포넌트는 하나의 렉시컬 환경을 참조합니다. `LexicalEnvironment` 와 `VariableEnvironment`는 무엇일까요?

<br>

`VariableEnvironment`

**현재 컨텍스트 내의 식별자 정보 및 외부 환경 정보**를 가집니다. 최초 실행 시 LexicalEnvironment의 스냅샷을 가지는데 이후 **변경 사항**이 생긴다 하더라도 VariableEnvironment에는 **반영되지 않습니다**.

`LexicalEnvironment`

**VariableEnvironment와 같은 정보**를 가지고 있지만 LexicalEnvironment는 **변경 사항**이 생겼을 때 **실시간으로 반영**을 합니다.

<br>

실행 컨텍스트를 생성할 때 VariableEnvironment에 정보를 담고 이를 복사해서 LexicalEnvironment를 만듭니다.

`Lexical Environment`는 다음 두 개의 컴포넌트로 구성됩니다.
<br>

<img src="https://velog.velcdn.com/images/seripark/post/23a7f771-737e-4ad0-b40a-ef12e15e83c7/image.jpg" width="500px"/>

<br>

`EnvironmentRecord`

스코프에 포함된 식별자를 등록하고 등록된 식별자에 바인딩된 값을 관리하는 저장소입니다. 소스코드의 타입에 따른 차이가 있습니다.

`OuterLexicalEnvironmentReference`

상위 스코프(해당 실행 컨텍스트를 생성한 소스코드를 포함하는 상위 코드의 렉시컬 환경)를 가리키며 이를 통해 스코프 체인을 구현합니다.

이렇게 식별자와 스코프는 렉시컬 환경에 의해 관리됩니다.

# 실행 컨텍스트의 생성 과정과 식별자 검색 과정

어떻게 실행 컨텍스트가 생성되는지, 코드 실행 결과의 관리는 어떻게 이루어지는지, 어떻게 실행 컨텍스트를 통한 식별자를 검색하는지 훑어보도록 하겠습니다.

예제로 살펴볼 코드입니다.

```javascript
var x = 1;
const y = 2;

function foo(a) {
  var x = 3;
  const y = 4;

  function bar(b) {
    const z = 5;
    consolelog(a + b + x + y + z);
  }
  bar(10);
}

foo(20);
```

대략적인 과정은 다음과 같습니다. 이 중 몇 가지만 자세히 다루겠습니다.

> 1. 전역 객체 생성
> 2. 전역 코드 평가
>
> - 전역 실행 컨텍스트 생성
> - 전역 렉시컬 환경 생성
>   - 전역 환경 레코드 생성
>     - 객체 환경 레코드 생성
>     - 선언적 환경 레코드 생성
> - this 바인딩
> - 외부 렉시컬 환경에 대한 참조 결정
>
> 3. 전역 코드 실행
> 4. foo 함수 코드 평가
>
> - 함수 실행 컨텍스트 생성
> - 함수 렉시컬 환경 생성
> - 함수 환경 레코드 생성
> - this 바인딩
> - 외부 렉시컬 환경에 대한 참조 결정
>
> 5. foo 함수 코드 실행
> 6. bar 함수 코드 평가
> 7. bar 함수 코드 실행
> 8. bar 함수 코드 실행 종료
> 9. foo 함수 코드 실행 종료
> 10. 전역 코드 실행 종료

<br>

## 2. 전역 코드 평가 - 전역 렉시컬 환경 생성

### 전역 환경 레코드 생성

![](https://velog.velcdn.com/images/seripark/post/cd3afdf4-c7ae-4e54-bc2b-3751cba50e02/image.jpg)

var와 let, const를 구분해서 관리하기 위해 전역 스코프 역할을 하는 `전역 환경 레코드`는 `객체 환경 레코드`와 `선언적 환경 레코드`로 구성되어 있습니다. `객체 환경 레코드`는 **var로 선언한 전역 변수와 함수 선언문으로 정의한 전역 함수 등**을 관리하고 `선언적 환경 레코드`는 **let, const로 선언한 전역 변수**를 관리합니다.

<br>

**객체 환경 레코드 생성**

전역 코드 평가 과정에서 선언된 전역 변수(var)와 전역 함수(함수 선언문으로 생성된)는 객체 환경 레코드의 `BindingObject`를 통해 전역 객체의 프로퍼티와 메서드가 됩니다. 이 메커니즘이 전역 객체를 가리키는 window라는 식별자 없이도 프로퍼티를 참조할 수 있게 해줍니다. (window.x라고 하지 않아도 되는)

앞서 코드에서 선언한 x라는 변수는 var로 선언되었습니다. var는 **선언 단계와 초기화 단계가 동시에 진행**되는데 그 이유는 `BindingObject`를 통해서 전역 객체에 변수 식별자를 키로 등록한 뒤(선언) undefined를 바인딩(초기화)하기 때문입니다. 결국 var로 선언한 변수는 실행 단계에서 변수 선언문 이전에도 참조할 수 있는 **호이스팅**이 일어나는 것입니다.

함수 호이스팅과 변수 호이스팅은 조금 다른 것이 있죠.

```javascript
console.log(x);
var x = 10;
```

x는 undefined입니다. 앞서 설명했듯 undefined로 바인딩된 것입니다.

```javascript
console.log(add(3, 5));

function add(a, b) {
  return a + b;
}
```

위 함수의 결과는 8입니다. 왜 변수와는 다를까요? 함수 선언문으로 정의된 함수는 평가되었을 때 `BindingObject`를 통해 전역 객체에 키로 등록이 된 후, **생성된 함수 객체를 즉시 할당**합니다. 그래서 함수 선언문 이전에 함수를 호출할 수가 있던 거예요. **변수는 `undefined`를 바인딩하기만 하고 할당은 하지 않았습니다**. 이것이 차이가 일어나는 이유입니다.

<br>

#### 선언적 환경 레코드 생성

전역 환경 레코드에서 살펴본 바와 같이 **let, const는 `선언적 환경 레코드`에서 관리되기 때문에** 앞서 선언한 전역 변수 y는 **전역 객체의 프로퍼티가 되지 않습니다.** 그리고 var와는 달리 선언 단계와 초기화 단계가 분리되어 진행되기 때문에 변수 선언문이 실행되기 전(초기화 단계 전)까지 `일시적 사각지대(Temporal Dead Zone)`에 빠지게 됩니다.

> _TDZ : 초기화를 시작하기 전까지 변수를 참조할 수 없는 구간을 말한다._

```javascript
console.log(x);
let x = 10;
```

다음 코드의 결과는 `Uncaught ReferenceError: Cannot access 'x' before initialization`입니다. 현재 선언적 환경 레코드에는 y에 `<uninitialized>`가 바인딩되어 있습니다. 초기화 전이며 접근할 수 없다는 의미죠. let, const는 선언문에 도달하기 전까지 TDZ에 빠져있기 때문에 참조할 수는 없어요. 그러나 let, const도 호이스팅이 되기 때문에 `ReferenceError`가 뜹니다. (let, const는 호이스팅이 되지 않는 것처럼 보일 뿐입니다.)
![](https://velog.velcdn.com/images/seripark/post/256b2fa2-0c20-4c2b-8cba-5004a7b10b80/image.jpg)

## 3. 전역 코드 실행

식별자는 스코프가 다르면 이름이 같아도 상관없습니다. 어느 스코프의 식별자를 참조할 것인지 `식별자 결정`을 하면 됩니다. 식별자 결정을 위해서는 식별자 검색을 하는데 이는 실행 중인 실행 컨텍스트에서 이뤄집니다. 선언된 식별자는 실행 컨텍스트의 렉시컬 환경의 환경 레코드에 등록되어있습니다.

지금은 전역 코드를 살펴보고 있기 때문에 전역 실행 컨텍스트가 실행되고 있습니다. 전역 렉시컬 환경에서 x, y, foo를 검색하는데, 여기서 찾을 수 없으면 외부 렉시컬 환경에 대한 참조(OuterLexicalEnvironmentRefence)가 가리키는 렉시컬 환경(상위 스코프)로 이동하여 식별자를 검색합니다. 이를 `스코프 체인`이라고 부르는 거죠.

그러나 전역 렉시컬 환경에서 더 올라갈 상위 스코프는 존재하지 않습니다. 그래서 식별자 결정에 실패하게 되면 전역 렉시컬 환경에서 검색할 수 없는 `ReferenceError`를 발생시킵니다.

<br>

## 4. foo 함수 코드 평가

### 함수 환경 레코드 생성

함수 렉시컬 환경의 함수 환경 레코드는 매개변수, arguments 객체, 함수 내부에서 선언한 지역 변수와 중첩 함수를 등록하고 관리합니다.

### 외부 렉시컬 환경에 대한 참조 결정

자바스크립트 엔진은 함수 정의를 평가해 함수 객체를 생성할 때 실행 중인 실행 컨텍스트의 렉시컬 환경(함수의 상위 스코프)를 함수 객체의 내부 슬롯 `[[Environment]]`에 저장합니다.
<br>

![](https://velog.velcdn.com/images/seripark/post/80889d4f-edc6-47f1-8098-e65b07b4f78a/image.jpg)

<br>

함수 렉시컬 환경(foo Lexical Environment)의 외부 렉시컬 환경에 대한 참조(OuterLexicalEnvironmentRefence)에는 함수의 상위 스코프를 가리키는 함수 객체의 내부 슬롯 `[[Environment]]`에 저장된 렉시컬 환경의 참조가 할당됩니다. 함수 객체의 내부 슬롯에 `[[Environment]]`가 존재함으로써 렉시컬 스코프가 구현될 수 있는 것입니다.

<br>

# 실행 컨텍스트와 블록 레벨 스코프

```javascript
let x = 1;

if (true) {
  let x = 10;
  console.log(x);
}

console.log(x);
```

![](https://velog.velcdn.com/images/seripark/post/c57acb22-1559-4b9a-a61b-f31e8145a6bf/image.jpg)

let으로 선언한 변수는 블록 레벨 스코프를 갖습니다. 앞서 let은 선언적 환경 레코드가 관리한다고 했었죠. 그래서 if문의 코드 블록을 실행하면 이를 위해 기존의 전역 렉시컬 환경에서 선언적 환경 레코드를 갖는 렉시컬 환경이 새로 생성되고 이로 교체됩니다. if문의 코드 블록을 위한 렉시컬 환경의 외부 렉시컬 환경에 대한 참조(OuterLexicalEnvironmentRefence)는 전역 렉시컬 환경을 가리킵니다. if문의 실행이 종료되면 이전의 렉시컬 환경으로 다시 교체됩니다.

<br>

**참고 문서**

[모던 자바스크립트 딥다이브](http://www.yes24.com/Product/Goods/92742567)

[자바스크립트 함수(3) - Lexical Environment](https://meetup.nhncloud.com/posts/129)

[Understanding Execution Context and Execution Stack in Javascript](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)

[자바스크립트 실행 컨텍스트](https://junilhwang.github.io/TIL/Javascript/Domain/Execution-Context/#_4-outerenvironmentreference%E1%84%8B%E1%85%AA-scope)
