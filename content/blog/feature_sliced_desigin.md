---
title: FSD(Feature Sliced Design)란?
date: 2024-10-27
description: 끊임없이 변화하는 비즈니스 요구사항에 대응하여 유지 보수를 편리하게 해줄 아키텍처
tags: [architecture]
---

<br/>

## 1. 폴더구조의 중요성

1. 코드의 유지 보수성 향상
   - 체계적인 폴더 구조는 탐색을 용이하게 하기 때문에 전체 프로젝트의 흐름 파악 쉬움.
   - 파일 위치를 쉽게 파악 가능하여 수정 작업이 간편함. 따라서 발생 가능한 혼란이나 버그를 줄여줌.
2. 확장성
   - 잘 설계된 폴더 구조는 프로젝트의 모듈화를 촉진함. 코드의 재사용성을 높이고, 중복 코드를 줄임.
   - 확장성을 고려한 폴더구조는 프로젝트가 커지더라도 재구조화의 필요성을 줄여줌. 확장에 따른 복잡성을 효과적으로 관리해줌.
3. 테스트 및 디버깅 용이성

   - 기능별로 잘 분리된 폴더구조는 독립적인 단위 테스트 작성이 쉬워짐.
   - 버그 발생 시 문제의 원인 파악 쉬워짐.

   <br/>

## 2. FSD(Feature Sliced Design) 등장 배경

**FSD의 모체 FDA(Feature Driven Architecture)**

- FDA의 등장 배경 - 고전적인 아키텍처의 단점 해결
  - 일차원적으로 기술 중심(components, utils, pages 등)으로 폴더를 분리했기 때문에 어떤 파일이 어떤 도메인과 연관 되어있는지 파악하기 쉽지 않음.
  - 컴포넌트의 암묵적인 연결 및 모듈의 복잡성 때문에 유지보수가 어려워짐.
  - 프로젝트의 규모가 커질 수록 단점이 극대화되는 구조.
    coupling: 결합도(모듈과 모듈간의 의존 정도)
    cohesion 응집도(모듈 내의 구성 요소들 간의 연관 정도)
    ![](https://velog.velcdn.com/images/parkseridev/post/3de2fb61-40b7-43a5-b98e-cb5eb5a6f06e/image.png)
- FDA란?
  - 기능을 중심으로 시스템을 설계하고 개발하는 접근 방식.
  - feature 단위의 코드들은 각 feature 내부에서만 사용되기 때문에 코드를 수정할 때 영향을 미치는 범위가 분명함.
  - 각 기능이 독립적으로 관리되어 가독성 및 유지보수성이 크게 향상됨.
  - 복잡성을 효과적으로 관리, 유연하고 확장 가능한 시스템 지향

 <br/>

```jsx
src/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.js
│   │   │   └── SignupForm.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── models/
│   │   │   └── User.js
│   │   └── index.js
│   │
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductList.js
│   │   │   └── ProductDetail.js
│   │   ├── services/
│   │   │   └── productService.js
│   │   ├── models/
│   │   │   └── Product.js
│   │   └── index.js
│   │
│   └── cart/
│       ├── components/
│       │   ├── CartList.js
│       │   └── CartSummary.js
│       ├── services/
│       │   └── cartService.js
│       ├── models/
│       │   └── CartItem.js
│       └── index.js
│
├── shared/
│   ├── components/
│   │   ├── Button.js
│   │   └── Input.js
│   ├── utils/
│   │   └── helpers.js
│   └── styles/
│       └── global.css
│
├── pages/
│   ├── HomePage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   └── AuthPage.js
│
└── App.js
```

 <br/>

**FSD의 등장 - FDA 단점 보완**

- 프로젝트 규모가 커질 수록 복잡성 관리가 어려워지는 문제 해결
- 더 엄격한 계층 구조를 통해 코드 구조화와 재사용성 개선
- 대규모 애플리케이션에서 새로운 기능을 쉽게 추가하고 기존 기능 수정 가능
- 계층 간 명확한 의존성 규칙을 통해 아키텍처의 일관성 유지

<br/>

## 3. FSD(Feature Sliced Design)?

![](https://velog.velcdn.com/images/parkseridev/post/90f2bc52-cb17-46c1-b1a2-59cb3b2a2e66/image.png)

FSD는 프론트엔드 애플리케이션의 단점을 극복하기 위한 아키텍처 방법론. 끊임없이 변화하는 비즈니스 요구사항에 맞서 프로젝트를 더 이해하기 쉽고 체계적으로 만드는 것이 목적.

FSD는 Layer, Slice, Segment라는 세 가지 계층으로 이루어짐.

<br/>

### 1. Layer

- src 폴더에 바로 속하는 최상위 디렉토리이며 애플리케이션 분해의 첫 단계.
- 레이어의 개수는 최대 6개로 제한됨. (process 계층은 deprecated 됨)
- 레이어들은 코드 베이스를 조직화 하고 모듈화하여 유지보수가 용이한 확장 가능한 아키텍처를 구축하는데 도움을 준다.

<br/>

**각 레이어에 대한 개념**

 <br/>

![](https://velog.velcdn.com/images/parkseridev/post/5fb6bb3f-e7cf-4b89-8e55-5c9ed96cab49/image.png)

 <br/>

1. app
   - 전체 어플리케이션 로직이 초기화 되는 곳. 애플리케이션의 진입점에 대한 책임을 가짐.
   - ex) 프로바이더, 라우터, 전역 스타일, 전역 타입 선언 등
2. processes
   - 여러 페이이지에 걸쳐 있는 프로세스를 처리함. (deprecated)
3. pages
   - 하위 레이어들을 조합하여 완전한 기능 제공. 각 라우터에 해당하는 페이지들을 작성함.
   - ex) /home, /main
4. widgets
   - 독립적으로 작동하는 대규모 기능 또는 UI 컴포넌트. 보통 하나의 완전한 기능.
   - ex) UserProfile, IssuesList
5. features(optional)
   - 비즈니스 가치를 전달하는 사용자 시나리오와 기능을 다룸. 제품 전반에 걸쳐 사용되는 기능 구현체.
   - ex) AddToCart, SendComment
6. entities(optional)
   - 프로젝트가 다루는 비즈니스 엔티티. 즉 데이터를 다루는 영역.
   - ex) User, Product, Order
7. shared
   - 특정 비즈니스 로직에 종속되지 않는 재사용 가능한 컴포넌트와 유틸리티 포함.
   - ex) ui kit, axios 설정, 애플리케이션 설정, 비즈니스 로직에 묶이지 않는 헬퍼 등

 <br/>

**추상화 레벨 비즈니스 레벨**

하위 레이어로 갈 수록 추상화가 심화되고 상위 레이어로 갈 수록 비즈니스 로직이 심화되는 구조

![](https://velog.velcdn.com/images/parkseridev/post/83f020bd-ae77-4f68-8628-974294313018/image.png)

 <br/>

**계층 구조**

- 위 레이어는 아래 레이어만 활용할 수 있음
  ⇒ features 레이어는 widgets 레이어를 활용할 수 없음.
- 이러한 계층 구조는 한 방향으로만 향하는 선형적 흐름을 유지하기 위해서임.
  ⇒ 복잡성을 관리하고 의존성을 명확히 하여 유지보수가 용이하도록 함.

![](https://velog.velcdn.com/images/parkseridev/post/20acc23e-cfe4-4527-a527-0ab4ceb40359/image.png)

<br/>

### 2. Slice

- 애플리케이션 분해의 두 번째 단계
- slice의 이름은 프로젝트의 비즈니스 영역에 따라 결졍되기 때문에 표준화 되어있지 않음.
- slice 주 목적은 코드를 데이터별로 그룹화 하는 것. (도메인에 따라 그룹화)
- 밀접한 slice는 디렉토리 내에 그룹지을 수 있으나, 다른 슬라이스와 같이 직접적으로 코드를 공유해선 안됨.

* App과 Shared는 슬라이스를 가지지 않고 세그먼트로 구성됨

![](https://velog.velcdn.com/images/parkseridev/post/331047a7-958a-442a-875d-7c55862e818e/image.png)

<br/>

### 3. Segment

- 각 슬라이스는 세그먼트로 구성됨
- 목적에 따라 슬라이스 내의 코드를 나누는데 도움이 됨.
- 팀마다 세그먼트의 구성과 이름을 변경할 수 있음.
- 일반적인 세그먼트 예시
  - api: 백엔드와의 상호작용. (request 함수, 데이터 타입, mapper 등.)
  - UI: UI 관련된 모든 것 (UI 컴포넌트, 날짜 포맷터, 스타일 등)
  - model: 비즈니스 로직, 즉 상태와의 상호 작용. (스키마, 인터페이스, 스토어, 비즈니스 로직, actions 및 selectors)
  - lib: 슬라이스 안에 있는 다른 모듈이 필요로 하는 라이브러리 코드. util 함수의 성격.
  - config: 설정 파일과 기능 플래그. (자주 사용되지는 않음)
    - 기능 플래그: 코드 배포와 기능의 출시를 분리할 수 있는 ON/OFF 스위치
  - consts: 필요한 상수 값들.

 <br/>

**공개 API**

- 각 슬라이스와 세그먼트는 진입점 역할을 하는 index파일을 가짐.
- 슬라이스 또는 세그먼트에서 필요한 기능만을 외부로 추출하고 불필요한 기능을 격리할 수 있음.
- 공개 API (즉 Index 파일)에서 정의되지 않은 슬라이스 및 세그먼트는 슬라이스 또는 세그먼트의 내부에서만 접근 가능.

<br/>

## 4. FSD의 장단점

**장점**

- 기능 분할 설계를 통해 결합을 느슨하게 하고 응집력을 높임. 이를 위해서 FSD는 OOP(객체 지향 프로그래밍)의 추상화, 다형성, 캡슐화, 상속 개념을 활용함.
  - 추상화 및 다형성: 레이어를 통해 달성 가능. 낮은 레이어는 추상화 되어 있어 더 높은 레이어에서 재사용됨. 특정 매개변수나 속성에 따라 컴포넌트나 기능이 다르게 작동할 수 있음.
  - 캡슐화: 공개 API를 통해 달성함. 슬라이스와 세그먼트의 외부에서 필요하지 않은 것을 격리시켜 접근을 제한시킴. 공개 API만이 슬라이스와 세그먼트에 접근할 수 있는 방법.
  - 상속: 레이어를 통해 달성됨. 더 높은 레이어는 낮은 레이어를 재사용할 수 있음.
  - 추상화 / 다형성 / 캡슐화 / 상속
- 같은 레이어나 상위 레이어의 구성 요소를 사용할 수 없기 때문에 사이드 이펙트 없이 격리된 수정이 가능.
- 레이어에 따라 코드를 재사용이 용이하게 혹은 지역적으로 사용하게 할 수 있음.
- 비즈니스 도메인으로 앱이 분할되기 때문에 무관한 부분을 이해하지 않고도 유용한 개발이 가능함.
- 아키텍처 구성 요소를 쉽게 교체, 추가, 제거할 수 있음

 <br/>

**단점**

- 다른 아키텍처에 비해 더 높은 이해도와 기술 수준을 필요로 함. (진입 장벽 높음)
- 팀 내에서 지식에 대한 습득 및 규칙 준수가 필요함.

<br/>

## 아키텍처 준수를 위한 도구

- [linter](https://github.com/feature-sliced/steiger)
- [folder generators](https://github.com/feature-sliced/awesome?tab=readme-ov-file#tools)

<br/>

## 예제

[Examples | Feature-Sliced Design](https://feature-sliced.design/kr/examples)

<br/>

**참고 문서**

[둘러보기 | Feature-Sliced Design](https://feature-sliced.design/kr/docs/get-started/overview)

[FSD 아키텍처 알아보기](https://velog.io/@jay/fsd)

[(번역) 기능 분할 설계 - 최고의 프런트엔드 아키텍처](https://emewjin.github.io/feature-sliced-design/)
