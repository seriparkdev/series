---
title: 브라우저 렌더링 과정
date: 2023-02-11
description: 픽셀로 화면에 보이기까지의 과정
tags: [web]
---

# 서론

이 글은 Blink engine 기준으로 작성되었습니다. 브라우저 렌더링 과정을 깊게 이해해 보는 것이 목표입니다.

# 개요

![](https://velog.velcdn.com/images/seripark/post/8a3088fb-e158-4782-9ab8-bcac9c89c5a8/image.jpg)

이 글에서 다룰 렌더링 절차는 다음과 같습니다. 렌더링은 메인 스레드에서 parsing부터 paint까지의 과정을 거쳐 compositing 후 display 단계로 마무리 되어 완료됩니다.

# Parsing

<br>

<p align="center"><img src="https://velog.velcdn.com/images/seripark/post/dd693b1f-375b-4a1e-8f92-3503d1dfb55c/image.png"></p>

<center>HTML 파싱 과정</center>

<br>

파싱이 왜 필요할까요? 파싱은 무엇일까요? HTML 문서는 브라우저가 이해할 수 없는 순수한 텍스트이기 때문에 이를 브라우저가 이해할 수 있는 형태인 자료구조로 변환시켜야 합니다. 이 변환 과정을 파싱이라고 하고, 문자열을 토큰으로 분해하고 파스 트리 만들어냅니다.

그래서 메인 스레드에서는 HTML을 응답으로 받게 되면 HTML을 파싱하여 `DOM(Document Object Model)`을 구축하기 시작합니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/31667f65-3bae-47a7-bc9b-acdbfa4ffa3f/image.jpg)

<center>HTML을 파싱하고 DOM 트리를 구축하는 메인 스레드</center>

<br>

## Parsing의 중단 지점

파싱은 `<link>`, `<img>`, `<script>` 태그를 만나면 중단됩니다. 보통 브라우저는 외부 리소스인 이미지, 자바스크립트, CSS를 사용하고 있는데 이는 네트워크나 캐시로부터 가져와야 하기 때문이죠.

아래 이미지는 개발자 도구에서 확인한 네트워크 요청과 응답 리스트입니다. 웹 페이지를 열자마자 리소스들을 가져오고 있는 것을 볼 수 있습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/d0e5584f-65f7-44ae-8815-4bdcd4ed33e5/image.png)

<br>

그러나 이런 중단 현상은 리소스를 사용하기까지의 시간을 늦추기 때문에 브라우저는 속도를 높이기 위해서 `preload scanner`를 동시에 실행합니다. `preload scanner`는 HTML parser가 생성한 토큰을 보고 네트워크 스레드에 소스 요청을 해줍니다. 이는 병렬적으로 실행되어서 이러한 성능 저하 문제를 해결해줄 수 있습니다.

`<script>` 태그를 만나면 파싱이 중단되는 이유는 자바스크립트가 `document.write()` 같은 것들을 사용하여 전체 DOM 구조를 변경시키기 때문입니다. 그러나 `<script>` 태그에 **defer, async** 속성을 사용한 경우는 예외입니다. 이는 HTML 파싱과 외부 자바스크립트 파일의 로드가 비동기적으로 병렬적으로 진행되기 때문입니다.

그러나 async와 defer 속성은 src 속성을 통해 외부 자바스크립트 파일을 로드하는 경우에만 사용할 수 있음을 알고 있어야 합니다.

```javascript
<script async src="exten.js"></script>
```

`document.write()` 같은 것을 사용하지 않았을 땐 defer이나 async 속성을 사용하는 것이 좋습니다.

<br>

# Style

<br>

![](https://velog.velcdn.com/images/seripark/post/65783dfe-1215-451e-9dc2-ce2a653f1991/image.jpg)

<center>계산된 스타일을 추가하기 위해 CSS를 파싱하는 메인 스레드</center>
<br>

HTML 파싱이 끝나면 CSS 파싱을 시작합니다. `<link>`, `<style>`의 CSS를 바탕으로 브라우저가 이해할 수 있는 스타일 시트를 생성하고 각 DOM 노드에 어떤 스타일을 적용할지 스타일을 계산합니다. 계산된 스타일은 개발자 도구에서 확인할 수 있습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/fb101344-c859-45c1-aed3-cece6b312822/image.png)

<br>

# Layout

<br>

![](https://velog.velcdn.com/images/seripark/post/623386b8-3932-40f2-85b8-5f2f3bc3b2a7/image.jpg)

<center>계산된 스타일을 훑고 레이아웃 트리를 생성하는 메인 스레드</center>

<br>

메인 스레드는 DOM과 계산된 스타일을 통해서 레이아웃 트리를 생성합니다. 레이아웃 트리는 x y좌표나 크기 같은 정보를 가지고 있습니다. 그러나 오직 화면에 렌더링 되는 노드만으로 구성되기 때문에 `display:none`가 적용된 노드, `<meta>`, `<script>` 같은 노드는 포함되지 않습니다.

<br>

# Paint

이제 얻은 정보들을 가지고 화면에 그려야 하지만 어떻게 그려야 하는지 순서 같은 것들을 모르고 있습니다. 만약 HTML을 따라 무작정 순서대로 그리면 다음과 같은 상황이 벌어집니다.
<br>

![](https://velog.velcdn.com/images/seripark/post/dc3b4c16-1b60-40fc-93e9-7d5f481367f0/image.avif)

<br>

그래서 페인트 단계에서는 레이아웃 트리를 통해 페인트 레코드를 생성합니다. 페인트 레코드는 그림을 어떻게 그릴지에 대한 정보를 알려줍니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/5b02ccab-a55a-45ef-8438-dd2f063ba975/image.jpg)

<center>레이아웃 트리를 통해 페인트 레코드를 생성하는 메인 스레드</center>

<br>

# Compositing

이제 HTML 구조, 각 요소의 스타일, 페이지의 기하학적 속성 등을 통해서 페이지에 그려야 합니다. 이 정보들을 픽셀로 변환하는 과정을 `픽셀화(rasterzing)`라고 합니다. 그러나 최신 브라우저에서는 `합성(composition)`이라는 과정을 거칩니다.

**합성은 페이지의 각 부분을 레이어로 분리해 개별적으로 픽셀화하고, 합성 스레드(compositor thread)라는 별도의 스레드를 통해 하나의 페이지로 합성하는 기술입니다.** 이 기술을 사용하면 스크롤이 발생했을 때 레이어가 이미 픽셀화되어 있기 때문에 새 프레임을 합성하게만 하도록 할 수 있습니다. 애니메이션도 한 레이어를 움직여 프레임을 합성함으로써 구현해낼 수 있습니다.

레이어도 개발자 도구에서 확인할 수 있습니다. 아래 사진과 같이 레이어가 쌓여 있는 것을 확인할 수 있습니다. 과도하게 많은 레이어는 작업 속도를 느리게 만들기 때문에 애플리케이션의 렌더링 성능을 측정하여 관리하는 것이 중요합니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/aa24a5e7-8049-442b-a6ac-ffc5304747e6/image.png)

<br>

이제 어떤 요소가 어느 레이어에 있어야 하는지 알기 위해서 메인 스레드는 레이아웃 트리를 훑어 레이어 트리를 생성합니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/c7ca91e2-1b8c-4aa1-ada9-ba47410d4a4f/image.jpg)

<center>레이아웃 트리를 통해 레이어 트리를 생성하는 메인 스레드</center>

<br>

## 메인 스레드에서의 래스터 및 합성 해제

<br>

![](https://velog.velcdn.com/images/seripark/post/2f52d7c0-c159-4b5c-bf1c-70f0cfff4387/image.jpg)

<center>타일의 비트맵을 생성하고 GPU로 보내는 래스터 스레드</center>

<br>

레이어 트리가 생성되고 페인트 순서가 결정되면 메인 스레드는 이 정보들을 합성 스레드에 커밋합니다. 다음으로 합성 스레드는 각 레이어를 픽셀화하고, 타일로 나눕니다. 이 타일은 래스터 스레드로 보내진 다음 래스터화되어 GPU 메모리에 저장됩니다. **합성 스레드는 커밋 받은 레이어를 쪼개어 래스터화하고 프레임으로 만들어서 GPU에 전달하는 역할을 수행한다고 생각하면 됩니다.**

더 자세히 보겠습니다. 타일을 래스터한 뒤에는 합성 프레임을 생성하기 위해서 DrawQuad라는 타일 정보를 수집합니다. (합성 스레드는 래스터 스레드의 우선순위를 지정해서 뷰포트나 뷰포트 근처에 있는 항목을 먼저 래스터할 수도 있습니다.)

- DrawQuad : 페이지 구성을 고려하여 메모리에서 타일의 위치와 페이지에서 타일을 그릴 위치 같은 정보 포함
- 합성 프레임: 페이지의 프레임을 나타내는 DrawQuad의 모음

<br>

![](https://velog.velcdn.com/images/seripark/post/d08edc91-cb04-413a-ae3c-caa2cb36b4fe/image.jpg)

<center>합성 프레임을 생성하는 합성 스레드. 프레임은 브라우저 프로세스로 전송된 다음 GPU로 전송.</center>
<br>

그 다음 합성 프레임은 IPC를 통해서 브라우저 프로세스에 전달됩니다. 이 때 UI 스레드는 브라우저 UI 변경을 위해서 또는 렌더러 프로세스에서는 확장을 위해서 다른 합성 프레임을 추가할 수도 있습니다. 그리고 스크롤 이벤트가 발생했을 때 합성 스레드는 GPU로 보낼 또 다른 컴포지터 프레임을 생성하기도 합니다. 브라우저 프로세스에서 GPU로 프레임이 전달되면 여러 개의 합성 프레임을 단일 프레임으로 합치고 화면에 픽셀을 렌더링합니다. 이렇게 브라우저 렌더링 과정이 마무리됩니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/6cc47b8b-9981-41f4-8f14-3f781a76b911/image.jpg)

<br>

합성의 장점은 메인 스레드를 포함하지 않고 수행된다는 것입니다. 합성 스레드는 스타일 계산이나 자바스크립트 실행을 기다릴 필요가 없습니다.

<br>

# 개발자 도구를 통해 보기

CRP(Critical Rendering Path)을 개발자 도구 성능 탭에서 확인해 볼 수 있습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/177beb2f-429d-4cd1-80aa-be7807d270cc/image.png)
<br>

처음 페이지를 로드했을 때의 기록입니다. 순서대로 `Receive Data`를 통해 HTML을 받아오면 `Parse HTML` 과정을 거쳐 HTML을 파싱합니다. `Parse StyleSheet` 단계에서 CSS를 파싱하고, `Event:load` 단계에서는 자바스크립트 소스를 실행하고 있습니다. 레이아웃 트리를 생성하는 `Layout` 단계를 거쳐 `Paint` 단계를 거친 후 `Composite Layers` 단계로서 렌더링 과정을 마무리 했습니다.

<br>
<br>

**참고 문서**

[브라우저는 어떻게 동작하는가?](https://d2.naver.com/helloworld/59361)

[Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)

[렌더링 성능 개선(1) — 렌더링 과정 이해하기](https://so-so.dev/web/browser-rendering-process/)

[Inside look at modern web browser (part 3)](https://developer.chrome.com/blog/inside-browser-part3/#paint)

[Remove Render-Blocking JavaScript](https://developers.google.com/speed/docs/insights/BlockingJS?hl=ko#FAQ)

모던 자바스크립트 딥다이브
