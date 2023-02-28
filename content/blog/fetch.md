---
title: fetch와 Axios에 대해서
date: 2022-09-01
description: 뭐가 다를까?
tags: [API]
---

```javascript
fetch("/article/fetch/post/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  body: JSON.stringify(user),
});
```

fetch는 **http**(웹에서 브라우저와 서버가 통신하기 위한 프로토콜) **요청 전송 기능**을 제공하는 클라이언트 사이드 web API이다. http 요청 전송 기능은 그동안 fetch를 사용하면서 썼던 http 요청 메서드인 `get, post, put, delete`를 이용해 서버에 리소스에 대한 특정 행위를 요청하던 것을 말한다.

```javascript
.then(response => response.json())
```

fetch를 사용하면서 위와 같이 `.then(res => ~)` 이런 코드를 작성할 때 then을 어떻게 쓸 수 있는 거지? response는 갑자기 어디서 등장한 거지?라는 의문점이 있었다. 이는 fetch가 http 응답인 **response 객체**를 래핑한 **프로미스**를 **반환**하기 때문이었다. 그래서 프로미스의 후속 처리 메서드인 then을 이용해 객체를 받고 처리를 하는 등의 행위를 할 수 있던 것이다.

얼마 전에 axios를 처음 사용하게 되었는데 차이점에 대해서는 알아본 적이 없어서 이 부분에 대해서도 알아봤다.

`axios`는 **모든 http 에러를 reject하는 프로미스를 반환**해서 **모든 에러를 catch에서 처리**할 수 있다고 한다. 그러나 fetch는 **어떠한 에러에 의해 요청이 완료되지 않은** 경우만 프로미스를 reject하기 때문에 명확한 에러 처리를 위해서는 response의 상태를 확인해야 한다. 그래서 **axios가 에러를 처리하기에 더 편하다.**

reject와 catch는 무슨 관계일까 찾아보니, catch는 프로미스가 rejected 상태인 경우에만 호출된다고 한다. 그래서 모든 http 에러가 reject 처리가 된다면 catch문에서 더 간편하게 처리할 수 있는 것이다.

이 외에도 axios는 인터셉터, 요청 설정 등 fetch보다 더 많은 기능을 지원하기 때문에 axios를 사용하는 게 좋다.

<br>

**참고 문서**

모던 자바스크립트 딥다이브
