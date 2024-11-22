---
title: CSR과 SSR에 대해 알아보자
date: 2023-03-24
description: 웹 렌더링 방식
tags: [csr, ssr]
---

# 서론

최근 본 뉴스레터에서 본 글에 따르면 2010년부터 2020년까지는 Angular.js, React.js, Vus.js와 같이 CSR(client Sdie Rendering) 방식을 사용하는 SPA(Single Page Application)가 인기였는데, 이후 몇 년간은 SSR(Server Side Rendering)에 대한 관심이 다시 증가해서 Next.js의 인기가 높아졌다고 합니다. 왜 SSR이 인기가 많아졌는가에 대한 의문이 생겨서 하나 하나 정리해보고 이유를 찾아보고 싶어서 이 글을 통해 CSR, SSR이 무엇인지 정리해보고, 결론에서는 SSR이 왜 선호되고 있는가에 대한 궁금증을 해결하려고 합니다.

<br>

먼저, CSR과 SSR과 밀접한 개념이기 때문에 SPA와 MPA에 대해 짧게 알아보고 넘어가려고 합니다.

# SPA(Single Page Application)

<br>

<img src="https://www.datocms-assets.com/20623/1622711923-cropped-seagtsbcwyq3obtlhhz5ycq1.png">

<br>

SPA는 하나의 페이지로 구성되어 사용 중에 페이지를 다시 로드할 필요가 없는 패턴입니다. SPA는 페이지를 다시 로드하지 않기 때문에 애플리케이션이 전체적으로 빨라 사용자 경험이 좋습니다. 보통 SPA는 CSR(Client Side Rendering)을 렌더링 방식으로 사용합니다.

<br>

# MPA(Multi Page Application)

<br>

<img src="https://www.datocms-assets.com/20623/1622710220-sxbp86ckyjrsrp9vsf-rcmq1.png">

<br>

MPA 방식은 변경 사항이 있을 때마다 서버에게 새 HTML을 달라고 요청하여 새로 렌더링을 합니다. 그래서 MPA 방식을 사용하면 브라우저 내에서 이동할 때마다 화면 깜빡임이 발생한다는 단점과 서버에게 부담을 준다는 단점이 있습니다. 주로 MPA는 SSR(Server Side Rendering)을 렌더링 방식으로 사용합니다.

<br>

# CSR(Client Side Rendering)

<br>

<img src="https://miro.medium.com/max/1400/1*R1DpvOXzfTlyPsKkjhEsaA.jpeg">

<br>

CSR은 SPA의 등장 이후로 각광을 받기 시작했습니다. SPA의 렌더링 방식은 CSR이었기 때문입니다. 이 CSR은 JavaScript를 가지고 브라우저에서 직접 페이지를 렌더링하는 것을 말합니다. 로직이나 데이터를 가져오거나 라우팅 하는 작업들 또한 모두 브라우저에서 처리합니다. 유저가 웹사이트를 방문하면 서버에 컨텐츠 파일을 달라고 요청을 하면 서버는 응답으로 HTML 파일을 브라우저에게 전달하고, 브라우저는 이 HTML 파일을 다운 받기 시작합니다. 여기서 서버가 보낸 HTML 파일은 다음과 같이 빈 페이지입니다.

<br>

```html
<html>
  <head>
    <title>Title</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

<br>

브라우저가 연결된 JS 링크를 통해서 JS 파일을 다운받고 실행하면서 데이터를 가져오는데 필요한 API 호출을 하며 동적으로 태그나 스타일을 DOM에 그립니다. 여기서는 root라는 id를 가진 div에 렌더링이 됩니다.

<br>

```html
<html>
  <head>
    <title>Title</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <h2>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </h2>
  </body>
</html>
```

<br>

이러한 CSR은 유저랑 상호작용이 많은 경우, 애플리케이션이 대부분 고객 개인 정보로 이루어져서 검색 엔진에 노출될 필요가 없는 경우에 사용하면 좋습니다.

<br>

## CSR의 장점

**1. 서버 부하가 적어 서버 비용이 높지 않다**

서버에서는 빈 HTML만 응답으로 보내주면 되기 때문에 서버의 비용이 높지 않습니다.

<br>

**2. 초기 로딩 이후 로딩 속도가 빠르다**

페이지를 이동하더라도 전체 페이지를 다시 로딩하지 않아도 되기 때문에 속도가 빠릅니다. 페이지의 일부를 변경할 때 서버에 원하는 데이터만 요청하면 되기 때문입니다. 그렇기 때문에 사용자 경험 또한 좋습니다.

<br>

**3. TTV(Time To View)와 TTI(Time To Interactive)사이에 간극이 없다**

자바스크립트을 이용해 동적으로 DOM을 생성하기 때문에 화면에 띄워진 모든 요소들은 동작 가능합니다.

<br>

## CSR의 단점

**1. 애플리케이션이 커질 때마다 자바스크립트의 크기도 증가한다**

CSR은 자바스크립트 번들에 의존하기 때문에 코드 스플리팅이나 자바스크립트를 지연 로딩해야 하는 과정이 필요해집니다.

<br>

**2. 초기 로딩 시간이 길다**

JS 파일을 다운로드 받고 동적으로 DOM을 생성하는 시간을 기다려야 합니다. 이 시간 동안 사용자에게 빈 화면만 보여주게 되기 때문에 사용자 경험에 좋지 않습니다.

<br>

**3. SEO에 좋지 않다**

브라우저의 크롤러는 HTML을 통해 검색 색인(SEARCH 함수를 사용해 효율적으로 검색할 수 있도록 설계된 데이터 구조)을 만들기 때문에 CSR 방식은 실제로 순위가 낮은 경향이 있습니다. 그리고 웹사이트를 로드하는 시간이 너무 오래 걸리는 경우에는 빈 페이지가 색인화될 수 있습니다.

<br>

# SSR(Server Side Rendering)

<br>

<img src="https://miro.medium.com/max/1400/1*v-Fp0sGWFgaRMwV7AGEXtQ.jpeg">

</br>

SSR은 서버에서 페이지의 전체 HTML을 생성하는 방식입니다. 유저가 웹사이트에 방문하면 브라우저는 서버에 컨텐츠를 요청합니다. 여기서 CSR은 빈 페이지의 HTML을 서버로부터 받아왔지만 SSR은 CSS까지 적용되어 렌더링할 준비가 된 HTML을 서버로부터 받아옵니다. 필요한 API 호출도 미리 수행했기 때문에 필요한 데이터도 모두 같이 전달됩니다. 브라우저는 이 HTML을 빠르게 띄우지만, JS 로직이 없는 상태이기 때문에 아직 동작이 가능하진 않습니다. 브라우저가 자바스크립트 파일을 다운로드하면 유저는 이 때 웹페이지와 상호작용이 가능해집니다.

이런 SSR은 주로 사용자와 상호작용이 잘 일어나지 않으며, 어떤 사용자에게나 같은 내용을 표시하는 경우에 사용하면 좋습니다.

<br>

## SSR의 장점

**1. 초기 구동 속도 빠르다**

자바스크립트를 다운 받고 실행한 뒤에 화면을 볼 수 있었던 CSR과 달리 SSR은 자바스크립트와 상관 없이 사용자가 화면을 볼 수 있습니다.

<br>

**2. SEO에 좋다**

Google의 경우 로드가 빠른 웹사이트에 더 높은 검색 결과 순위를 줍니다. 그리고 렌더링할 준비가 된 HTML을 브라우저에게 전달하고 있기 때문에 CSR과 같은 색인화 문제가 발생하지 않습니다.

<br>

## SSR의 단점

**2. TTV(Time To View)와 TTI(Time To Interactive)사이에 간극이 있다**

자바스크립트 코드를 다운로드하고 실행하기 전에 사용자는 화면을 볼 수 있는데 이 때 JS 로직이 연결되지 않은 상태이기 때문에 사용자가 버튼을 클릭해도 이는 동작하지 않습니다. 그래서 이로 인한 사용자 경험이 좋지 않을 수 있습니다.

<br>

**3. 서버 부하가 있다**

매번 페이지를 이동할 때마다 서버에 HTML을 요청해야 하기 때문에 서버에 부담이 있고, 페이지를 이동할 때마다 화면 깜빡임이 발생합니다.

<br>

# 단점을 해결하자

## CSR 어떻게 개선하지?

CSR의 가장 큰 단점은 초기 로딩 속도가 느리고, SEO에 좋지 않다는 것입니다. 그럼 이는 어떻게 해결할 수 있을까요?

초기 로딩 속도는 code splitting, tree-shaking 분리를 통해 개선할 수 있습니다. 얼마 전 CRA 없이 React 환경 구축을 하면서 이와 같은 개념을 접할 수 있었습니다. Webpack을 통해서 이와 관련된 개선을 할 수 있었는데요. 각각의 개념에 대해 짧게 알고 넘어가 봅시다.

<br>

### code splitting

<br>

<img src="https://nextjs.org/static/images/learn/foundations/code-splitting.png">

<br>

네이버라는 서비스를 이용할 때 어떻게 하시나요? 검색을 하기도 하고, 뉴스를 보기도 하고, 웹툰을 보기도 할 겁니다. 그리고 이는 클릭을 통해서 다른 URL로 이동함으로써 가능해지죠. 이렇게 애플리케이션은 URL로 엑세스 할 수 있는 여러 페이지로 구성되어 있고 이러한 페이지는 애플리케이션의 고유한 진입점이라고 말할 수 있습니다.

앞서 언급했던 것처럼 어플리케이션의 크기가 커지면 커질 수록 번들의 크기도 커지는데, 방문하지 않은 페이지와 관련된 파일까지 가져오고 있다면 불필요하게 로딩 시간을 늘리고 있는 일이겠죠. 그렇기 때문에 한꺼번에 불필요하게 모든 내용이 담겨져 있는 대용량의 파일을 다운로드 하는 것이 아니라, 필요한 것들만 먼저 다운로드 하는 방식(lazy load)을 택하는 편이 좋습니다.

이와 관련된 개념이 code splitting입니다. 코드 분할은 애플리케이션의 번들을 각 진입점에 필요한 작은 청크로 분할하는 작업입니다. 이렇게 필요한 페이지를 실행하는데 필요한 코드만 로드하면 애플리케이션의 초기 로드 시간을 개선하고, 성능을 개선할 수 있습니다.

<br>

### tree-shaking

<br>

<img src="https://blogs.vmware.com/performance/files/2022/12/fig02c-tree-shaking.png">

<br>

코드 스플리팅 방법을 사용하면 청크를 필요로 하는 애플리케이션에만 청크들을 배분하여 성능을 개선시킬 수는 있으나, 근본적으로 무거운 자바스크립트의 크기를 줄여주지는 않습니다. 그래서 tree shaking이 필요합니다. tree shaking은 사용하지 않는 코드를 제거하는 기법을 의미합니다.

위 사진과 같이 트리 쉐이킹한 뒤에는 불필요한 것들이 제거되고 깔끔한 구조를 가지고 있는 것을 볼 수 있습니다. 마치 나무를 흔들면 낙엽이나 가지 같은 것들이 제거 되듯한 모습과 같다고 해서 트리 쉐이킹이라고 부릅니다. 이 트리의 각 노드는 앱에 고유한 기능을 제공하는 종속성을 나타냅니다.

시간이 지남에 따라 애플리케이션에서 일부 종속성은 실제로 사용되고 있지 않을 가능성이 높습니다. 이는 리소스를 낭비하고 성능을 저하시키기 때문에 사용하지 않는 부분을 제거해서 실제 실행하는 코드만 사용자에게 전송하도록 트리 셰이킹을 하는 것입니다.

```jsx
import { A } from "B";
```

이렇게 ES6 모듈의 특정 부분만 가져오는 방법을 사용하면 딱 필요한 A만 가져오도록 할 수 있습니다. dev build에서는 모든 모듈을 가져오기 때문에 실질적인 효과는 없지만 production build에서는 A 외에 명시적으로 가져오지 않는 ES6 모듈에 대해서 shake하도록 웹팩을 구성한다면 빌드를 더 작게 만들 수 있습니다.

더 깊은 개념을 알고 싶다면 [Tree Shaking - How to Clean up Your JavaScript](https://www.keycdn.com/blog/tree-shaking) 이 글을 참고하면 좋습니다.

이러한 개념으로 자바스크립트 번들 크기를 줄일 수가 있다는 것이 결론입니다.

<br>

### CSR + (?)

<br>

<img src="https://img1.daumcdn.net/thumb/R750x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FXXDsu%2Fbtrtb1XkdRU%2F2j8oEkCS7SZ465ppw4tvm0%2Fimg.jpg" width="300px">

<br>

CSR도 SSR도 매력적인 장점이 존재합니다. 그래서 CSR 환경에 SSR을 도입하는 방법을 택할 수도 있습니다. 이렇게 하면 CSR의 단점이었던 SEO도 향상시킬 수 있고, 초기 렌더링 속도도 빠르게 만들 수 있습니다.

<br>

# SSR은 왜 인기를 얻고 있을까?

> 생각을 정리하기 위해 혼잣말을 쓰듯이 말투를 바꾸었습니다.

SSR이 트렌드가 되었다고 이야기를 들었을 때 의문이 많았다.

<br>

> 결국 서비스 성격에 따라 사용하는 게 맞는 건데 왜 SSR이 트렌드가 되었는가? 사용자와 상호작용을 많이 하는 애플리케이션인 것 같은데 왜 SSR을 사용하지? 초기 렌더링 속도가 느려도 이후 상호작용이 빠른 게 가장 좋은 거 아닌가?

<br>

이런 저런 자료를 찾아도 명확한 답을 알기 어려워서 물어보기도 하면서 글을 찾아보았다.

먼저 흐름을 따라가보자면, 예전 Angular를 사용했던 시절에 Angular에 SSR을 사용하는 것이 불가능했다고 한다. 크롤러도 SPA를 이해하지 못했기 때문에 SEO의 문제가 있었는데, SSR이 가능한 SPA인 React가 등장하여 인기를 얻었던 것 같다. SEO가 가능한 SPA는 없었기 때문이다.

개발자분의 의견을 들어보면 그동안 SSR이 좋은 건 알았으나 개발이나 세팅이 너무 어려웠기 때문에 SSR을 사용하지 못했다는 걸 알 수 있었다. SSR의 장점인 SEO가 현업에서는 굉장히 중요시 여겨지는 것으로 추측된다. 수익과 연결되기 때문인 것 같다.

Next.js의 등장으로 SSR을 구현하는 것이 쉬워졌으나 그럼에도 아직 러닝커브가 높다는 평을 받는 것 같다. (React에서 SSR을 구현하는 것은 어려운 듯) CSR+SSR인 hydration 방식을 사용할 수 있지만, 중복 작업이 많이 들어간다는 평도 있다.

검색 엔진 크롤러들이 js도 크롤링 한다고 말을 하지만, 결과는 그렇게 좋진 않은 것 같다. 그래서 SEO를 위해 SSR를 어쨌거나 고려하는 것을 택할 수 밖에 없는 것 같기도 하다.

왜 CSR+SSR이 아닌가, CSR -> SSR은 SEO 하나 때문인가?라는 의문이 해결되지 않아 실제 사례를 찾아보았다.

토스에서는 로딩 시간을 단축하기 위해 SSR로 전환했고, Next로 구현했다고 한다. 실제 서비스에서는 역시 초기 로딩 시간이 중요한가? 그럼 그 후의 로딩 시간은? 이 의문이 풀리지 않아 더 찾아보았다.

네이버 블로그에서 SSR을 도입한 과정에 대해 설명하는 영상을 찾았고, 여기서 많은 궁금증을 해결할 수 있었다.

네이버 블로그는 프론트엔드의 생산성을 향상시키기 위해 SSR을 도입했고 다음과 같은 효과를 기대했다.

- 커뮤니케이션 비용 절감

- React 생태계 적극 이용

- 서버와 클라이언트에서 잘 동작하는 자바스크립트의 효과

구현 방식은 Next를 이용하지 않고 직접 구현하게 되었는데 Next가 요구사항을 빠르게 따라가지 못한다는 것이 이유였으나 현재에 와서는 Next를 사용할 것 같다고 한다.

이 외에도 SSR을 이용해서 성능 개선을 이루고자 목표가 있었다. 나는 CSR+SSR 방식을 왜 택하지 않는지가 가장 궁금했는데, 초기 렌더링은 SSR을 사용하고 view 외 바깥은 CSR로 처리하는 것 이상적이긴 하지만 작업 비용이 많이 들어간다는 것이 문제였다. 그래서 이러한 경우엔 server to browser 보다 server to server로 주고 받는 것이 비용기 적기 때문에 SSR을 택하는 것이 성능상으로 좋고 UX도 좋다고 한다.

이 외에 SSR은 단일 코드로 개발 생산성을 향상시킨다는 장점도 있기는 하지만 이는 숙련이 되었을 때의 경우이다.

결국 이런 다양한 이유로 인해 SSR의 인기가 많아진 것 같다.

<br>

# 결론

다음 프로젝트를 Next로 할까 고민하고 있던 와중에 이런 저런 글을 읽다가 의문이 많이 생겨서 쓰게 된 글이었는데, 어느 정도 해소할 수 있게 되었다. 나는 고민 끝에 Next.js를 기반으로 전체적으로 로딩 시간을 단축시킬 수 있는 CSR+SSR 방식을 사용해서 다음 프로젝트를 진행하려고 한다.

<br>

**참고 문서**

[Client-Side Rendering vs Server-Side Rendering vs Static-Site Generation](https://frontend-digest.com/client-side-rendering-vs-server-side-rendering-vs-static-site-generation-2a0702cbb08d)

[Frontend Rendering: SSG vs ISG vs SSR vs CSR — When to use which?](https://tapajyoti-bose.medium.com/frontend-rendering-ssg-vs-isg-vs-ssr-vs-csr-when-to-use-which-1bf9f39ff07c)

[Rendering on the Web](https://web.dev/rendering-on-the-web/#server-rendering-vs-static-rendering)

[Single-page application vs. multiple-page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)

[https://tech.weperson.com/wedev/frontend/csr-ssr-spa-mpa-pwa/#csr-client-side-rendering-vs-ssr-server-side-rendering](https://tech.weperson.com/wedev/frontend/csr-ssr-spa-mpa-pwa/#spa-mpa-%E1%84%8B%E1%85%A5%E1%86%AB%E1%84%8C%E1%85%A6-%E1%84%86%E1%85%AE%E1%84%8B%E1%85%A5%E1%86%BA%E1%84%8B%E1%85%B3%E1%86%AF-%E1%84%89%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A2%E1%86%A8%E1%84%92%E1%85%A2%E1%84%8B%E1%85%A3-%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB-%E1%84%80%E1%85%A5%E1%86%BA%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%80%E1%85%A1)

[10 Web Development Trends in 2023](https://www.robinwieruch.de/web-development-trends/)

[Tree Shaking - How to Clean up Your JavaScript](https://www.keycdn.com/blog/tree-shaking)

[[10분 테코톡] 🎨 신세한탄의 CSR&SSR](https://www.youtube.com/watch?v=YuqB8D6eCKE)

[어서와, SSR은 처음이지?(네이버 블로그 Node.js 기반의 Server-Side Rendering 적용기)](https://tv.naver.com/v/16970015)

[이제 React.js 를 버릴 때가 왔다](https://seokjun.kim/time-to-stop-react/)
