---
title: lighthouse로 프로젝트 개선해보기
date: 2022-12-27
description: 처음 사용해봤다.
tags: [JavaScript]
---

# 💡 성능 개선을 해보자

개인 프로젝트를 완성하고 나서, 이 프로젝트의 성능은 괜찮을까? 더 개선 시킬 수 있는 방법은 없을까?라는 고민을 가지고 있었는데, google의 **lighthouse**라는 성능 측정기를 이번에 접하게 되어서 이를 이용해 성능 개선을 해보려고 한다.

# 🙌 메인 페이지

<br>

![](https://velog.velcdn.com/images/seripark/post/b442d885-9632-4d30-9623-583dd620cfbc/image.png)![](https://velog.velcdn.com/images/seripark/post/8b816280-1724-42e5-b601-95bc9c4ebfb5/image.png)

<br>

메인 페이지를 검사 했을 때, 성능에서는 문제점이 없었고, 접근성에서 좋지 않은 결과가 나왔다.

**접근성**이란 이와 같은 것이다.

> Broadly speaking, when we say a site is accessible, we mean that the site's content is available, and its functionality can be operated, by literally anyone. ([출처](https://web.dev/accessibility/))

누구나 웹사이트를 이용했을 때, 좋은 사용자 경험을 얻을 수 있어야 한다는 것이다.

접근성이 안 좋았던 이유 단순히 `alt`를 명시해두지 않아서였다. 항상 `<img>` 태그를 작성할 때 대체 텍스트도 습관처럼 작성했었는데, 이를 놓친 줄 모르고 있었다. 이를 통해 다시 한 번 주의를 가지게 됐다.

다음과 같이 `alt`를 추가해주었다.

```jsx
<Img src={mainImage} alt="서핑을 하는 여성" />
```

이렇게 코드를 수정하고 다시 검사를 해보니 접근성, SEO 점수가 올라간 것을 확인할 수 있다.

<br>

![](https://velog.velcdn.com/images/seripark/post/cdf06b25-6304-4d67-a49b-c4e569f5f4ef/image.png)

<br>

접근성을 개선했는데, SEO 점수까지 올라간 이유는 이미지에 alt를 적는 것이 검색 엔진 최적화 방법 중 하나이기 때문이다.

> 이미지에 관한 맥락을 추가하면 검색결과가 더욱 유용해지므로 사이트로 양질의 트래픽을 유도할 수 있습니다. 예를 들어 이미지 또는 구조화된 데이터 마크업에 alt를 사용하는 등 이미지와 사이트를 Google 이미지에 최적화하면 사용자가 더 쉽게 발견할 수 있습니다. 가이드라인에 따라 Google 이미지 검색결과에 콘텐츠가 표시될 가능성을 높이세요. ([출처](https://developers.google.com/search/docs/appearance/google-images))

# 💼 계좌 목록

![](https://velog.velcdn.com/images/seripark/post/cd6851ba-f002-4e2d-89ce-b3b866ea3fac/image.png)![](https://velog.velcdn.com/images/seripark/post/ff4d7485-61b3-4c06-be16-2506392cf645/image.png)

<br>

계좌 목록에서는 성능에 대한 평가가 좋지 않았다. 그 중에서도 **LCP**, **CLS** 수치가 낮았다.

> **LCP?**
> 페이지가 처음으로 로드를 시작한 시점을 기준으로 뷰포트 내에 있는 가장 큰 이미지 또는 텍스트 블록의 렌더링 시간을 보고하는 것. ([출처](https://web.dev/lcp/))

> **CLS?**
> CLS는 페이지의 전체 수명 동안 발생하는 모든 예기치 않은 레이아웃 이동에 대해 가장 큰 레이아웃 이동 점수 버스트를 뜻함. ([출처](https://web.dev/cls/))

좋지 않은 LCP 수치가 발생하는 일반적인 이유는 다음과 같다.

- 느린 서버 응답 시간

- 렌더링 차단 JavaScript 및 CSS

- 느린 리소스 로드 시간

- 클라이언트 측 렌더링

<br>

![](https://velog.velcdn.com/images/seripark/post/8f41a94a-1413-4cec-8ece-c08200a638fc/image.png)

<br>

진단 항목에서 다음과 같은 경고가 떴고, 이에 대한 해결 방법은 [lighthouse 공식 문서](https://developer.chrome.com/docs/lighthouse/performance/font-display/?utm_source=lighthouse&utm_medium=devtools)에서 찾을 수 있었다. 나의 경우는 느린 리소스 로드 시간으로 인해 렌더링 시간이 길어지게 된 것 같다. 폰트는 대부분 대용량 파일이기에 로드 시간이 느리다. 일부 브라우저에서는 폰트가 로드 될 때까지 텍스트가 표시 되지 않도록 하기 때문에, `FOIT(flash of invisible text)` 현상이 나타날 수 있다. 폰트가 로드될 때까지 사용자는 필요한 정보를 보지 못 하고 기다려야 하기 때문에, 폰트가 로드되기 전에는 시스템 폰터를 보여주도록 하는 것이 좋은 사용자 경험을 만들 수 있는 한 방법이다.

```css
@font-face {
  font-family: "Pretendard-Regular";
  src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}
```

위와 같이 display를 swap으로 설정해주면, 폰트가 로드될 때까지 시스템 폰트로 텍스트가 표시된다.

이렇게 LCP가 2.5초에서 1.2초로 줄어들었다.

<br>

![](https://velog.velcdn.com/images/seripark/post/3380c4a1-e176-4139-a23c-591bb06a1eba/image.png)![](https://velog.velcdn.com/images/seripark/post/cb38575a-f147-4cbd-a365-41e69ff38374/image.png)

# 맺으면서

프로젝트가 큰 편은 아니어서 그런지 크게 개선해야 할 것들은 없었다. 그래서 다양한 작업은 하지 못 해서 아쉽다. 우선 이러한 도구를 사용하고 프로젝트를 개선해가면서 몰랐던 것들을 알게 되어서 좋다.
