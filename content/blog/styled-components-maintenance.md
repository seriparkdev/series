---
title: styled-components가 왜 유지보수 모드로 전환되었을까? (1)
date: 2025-04-21
description: "RSC(React Server Components)에서의 CSS-in-JS"
tags: [styling]
---
# 🏃 들어가며

오랫동안 React의 생태계에서 핵심 스타일링 솔루션으로 자리 잡았던 styled-components가 커뮤니티를 통해 [유지 보수 모드로 전환한다는 소식](https://opencollective.com/styled-components/updates/thank-you)을 알렸다.

![](https://velog.velcdn.com/images/parkseridev/post/c0d5b821-f7cd-4944-a0d0-e15ca249aa16/image.png)

해당 글에서는 styled-components의 유지보수 모드 전환 배경에 대한 세 가지 주요 원인들을 알 수 있다.

1. React 코어팀이 RSC(React Server Components) 환경에서 **Context API**를 **사실상 권장하지 않기로(defacto-deprecate)** 결정했다는 점.
2. **생태계**가 **CSS-in-JS에서 이탈했으며** Tailwind CSS와 같은 라이브러리가 압도적으로 큰 인기를 얻고 있다는 사실.
3. 핵심 styled-components **메인테이너**가 대규모 애플리케이션에서 더 이상 **이 라이브러리를 사용하지 않기에.**


후반부의 글을 읽어보면 styled-components가 **기존 React Context 기반 API를 유지**할 것이며, 앞으로는 버그 수정과 유지보수 정도의 작업만 할 것이라는 내용이 있다. 또한 새로운 프로젝트에서는 **styled-components 대신 다른 CSS-in-JS 라이브러리를 사용할 것을 권장**하고 있다.

글에서 React 코어팀이 RSC 환경에서 Context API를 권장하지 않기로 결정했다고 했는데 이와 styled-components가 어떤 관계가 있는지 글에서 다뤄볼 예정이다. 이는 호환성 문제로 RSC에서는 styled-components 사용이 어렵다.

![](https://velog.velcdn.com/images/parkseridev/post/7094f061-763e-4103-a9b8-6d48a0fb7d5f/image.png)


styled-components는 오랫동안 React 생태계에서 큰 비중을 차지하던 CSS-in-JS 라이브러리였기 때문에 많은 사람들이 이 소식에 귀를 기울였다. 최근 styled-components 대신 다른 라이브러리를 채택하는 흐름을 보이고 있었지만, 소식을 전하기 이전까지도 굉장히 많은 사람들이 사용하던 라이브러리였기 때문이다.

이 글에서는 React 생태계의 변화 속에서 **styled-components가 직면한 기술적 한계점**을 분석하고, **유지보수로 전환하게된 배경**을 살펴보려고 한다. RSC와 관련된 이슈들을 중심적으로 다룰 예정이며, 그 외의 요인들은 다음 글에서 다룰 예정이다.

본 글은 styled-components를 중심으로 작성할 예정이지만, 내용의 대부분은 런타임 기반 CSS-in-JS 라이브러리 전반에 적용되는 개념이다.



# 🔍 styled-components 작동 방식
styled-components와 관련된 기술적 문제를 이해하기 위해서는 먼저 작동 방식에 대해 알아야 한다.  

## 기본 사용법

```tsx
export default function App() {
  return (
    <Button>
      클릭
    </Button>
  );
}
const Button = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
`;
```

CSS-in-JS는 별도의 CSS 파일 대신 JavaScript 파일 내에 직접 스타일을 정의할 수 있는 방식이다. 이 방식은 클래스 대신 스타일을 컴포넌트에 캡슐화하여 재사용할 수 있다. 

styled-components는 `button`, `h1`, `header` 등 HTML element와 동일한 이름을 가진 헬퍼 메서드를 제공한다. 이 메서드에 템플릿 리터럴로 CSS를 전달하면, 해당 HTML element에 스타일이 적용된 React 컴포넌트가 생성된다.

이렇게 생성된 컴포넌트는 위 예시의 `Button`와 같은 상수에 할당되고 `Button` 컴포넌트를 렌더링하면 `<button>` DOM 노드가 생성이 된다. 이렇게 styled-components로 생성한 컴포넌트는 일반 React 컴포넌트와 동일하게 사용할 수 있다.

## Tagged templates

```tsx
const Button = styled.button(`
  padding: 10px 15px;
  border-radius: 4px;
`);
```
 
헬퍼 메서드 호출 방식이 낯설 수 있는데 이렇게 작성한 것과 동일하다. JavaScript의 `Tagged Template Literals`라는 기능을 활용한 것으로 JavaScript에서 함수명 뒤에 바로 백틱으로 템플릿 리터럴을 작성하면 해당 함수는 `태그 함수(tag function)`로써 호출이 된다.

```js
function log(strings, ...values) {
return `문자열: ${strings[0]}, 값: ${values[0]}`;
}

const value = 42;
const result = log`숫자는 ${value}입니다`;

console.log(result);
// 문자열: 숫자는 , 값: 42
```


태그 함수는 다음과 같이 템플릿 리터럴을 좀 더 특별하게 처리할 수 있는 함수다. 파라미터로 전달 받은 템플릿 리터럴에 원하는 작업을 수행한 다음 조작된 문자열을 반환할 수 있다.



따라서 `styled.button`은 하나의 메서드고 백틱으로 작성해주었던 템플릿 리터럴은 인수로서 메서드에 전달된다. [관련 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)를 읽어보면 해당 기능에 대해 더 자세히 이해할 수 있다.


## 핵심적인 내부 동작

```tsx
function button(styles) {
  return function NewComponent(props) {
    const uniqueClassName = comeUpWithUniqueName(styles);
    const processedStyles = runStylesThroughStylis(styles);
    createAndInjectCSSClass(uniqueClassName, processedStyles);
    return <button className={uniqueClassName} {...props} />
  }
}
```
 
그러면 `button` 함수에 전달한 템플릿 리터럴 즉, `styles`라는 매개변수는 어떻게 사용되어 DOM 노드에 적용되는 걸까? 실제 코드는 많이 다르고 복잡하기 때문에 흐름의 이해를 돕기 위한 용도로 위 코드를 참고하면 좋을 것 같다.

### 고유한 클래스명 생성(comeUpWithUniqueName)
우선 매개변수로 전달 받은 스타일 문자열을 해싱 알고리즘을 통해 처리한다. 이 해싱 과정을 통해 **aBdnRQ**와 같은 짧고 고유한 클래스명을 생성한다. 해싱 알고리즘을 통해 처리함으로써 서로 다른 컴포넌트가 같은 클래스명을 사용해서 클래스명이 충돌되지 않도록 한다.

### CSS 전처리(runStylesThroughStylis)
styled-components는 내부적으로 Stylis라는 CSS 전처리기를 사용한다. 이 단계에서 템플릿 리터럴로 작성한 스타일 코드를 브라우저가 이해할 수 있는 표준 CSS로 변환한다. 


```jsx
const Button = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
`;
```

=> 전처리 이전의 styled-components 생성 코드
```css
.aBdnRQ {
  padding: 10px 15px;
  border-radius: 4px;
}
```
=> 전처리 과정을 거쳐 변환된 표준 CSS


### 스타일 주입(createAndInjectCSSClass)
마지막으로 생성해두었던 고유한 클래스명과 전처리된 CSS를 DOM에 삽입하는 작업 수행한다. `<style>` 태그를 생성하거거나 업데이트 해서 문서의 `<head>` 섹션에 삽입한다.

이러한 작업이 완료되면, 웹 페이지의 HTML 구조는 다음과 같이 구성된다.
```html
<html>
  <head>
    <style data-styled="active">
      .aBdnRQ {
        padding: 10px 15px;
  		border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <button className="aBdnRQ">
      버튼
    </button>
  </body>
</html>
```


# 🔍 SSR에서 발생하는 styled-components의 문제점

styled-components는 원래 CSR(Client Side Rendering)을 염두에 두고 설계되었다. 그러나 웹 성능과 SEO 개선을 위해 SSR(Server Side Rendering)을 도입하는 프로젝트가 늘어나면서, styled-components를 SSR 환경에서 사용할 때 발생하는 문제점들이 대두되었다.

## 렌더링 전략에 따른 차이점

### CSR(Client Side Rendering) 환경
- 모든 과정이 사용자의 브라우저에서 JavaScript가 실행되는 **런타임에 진행**된다.
- React가 가상 DOM을 생성하고 styled-components가 스타일을 주입하는 작업이 모두 클라이언트 측에서 동시에 진행된다.
- 컴포넌트가 마운트될 때 스타일이 생성되고 주입되므로, **스타일과 컴포넌트 렌더링이 동기화**된다.

### SSR(Server Side Rendering) 환경

- Node.js **서버 환경**에서 React를 실행하여 애플리케이션을 렌더링하고 초기 HTML을 생성한다.
- 클라이언트 단에서는 생성된 HTML을 받아 로드하는데 **스타일이 적용되지 않은채로 표출**한다.
- JavaScript를 실행하여 스타일을 주입하면 **깜빡이며 스타일이 적용**된 페이지를 표출한다.

##  FOUC(Flash of Unstyled Content)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <style>
    /* 스타일이 없는 빈 스타일 태그 또는 스타일 태그 자체가 없음 */
  </style>
</head>
<body>
<div id="__next">
  <button class="aBdnRQ">버튼</button>
</div>
<script src="/bundle.js"></script>
</body>
</html>
```

SSR 시 서버는 다음과 같이 스타일이 없는 초기 HTML을 클라이언트에게 전송한다. 서버에서 React 컴포넌트 트리는 HTML로 렌더링되어 styled-components 요소들에 고유 클래스명이 부여되지만, 각 **클래스명과 매핑되는 CSS 규칙은 `<style>` 태그에 존재하지 않는다.** 따라서 HTML이 브라우저에서 로드가 되지만 사용자는 **스타일이 적용되지 않은 버튼**을 보게 된다.


```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <style data-styled="active">
    .aBdnRQ {
      padding: 10px 15px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
<div id="__next">
  <button class="aBdnRQ">버튼</button>
</div>
<script src="/bundle.js"></script>
</body>
</html>
```

이후에 브라우저가 JavaScript 번들을 다운로드하고 실행하면, React 애플리케이션은 하이드레이션 과정을 거친다. 이 과정에서 styled-components는 컴포넌트가 마운트 될 때 필요한 스타일을 생성하고 생성된 스타일 규칙을 담은 `<style>` 태그를 동적으로 `<head>`에 삽입한다. 이제 사용자는 스타일이 적용된 버튼을 볼 수 있게 된다.



## SSR에서 스타일을 적용할 수 없는 이유
React로 SSR을 구현할 때 스타일이 초기 HTML에 적용되지 않는 근본적인 이유를 이해해 보자.

```tsx
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

React의 SSR은 서버 환경에서 `ReactDOMServer.renderToPipeableStream` 또는 `ReactDOMServer.renderToString` 메서드를 사용해 컴포넌트를 실행하고, 그 결과로 생성된 HTML 문자열을 클라이언트에 전송한다.

styled-components가 정상적으로 작동하려면 스타일 시트를 생성하여 `<style>` 태그에 주입해야 하는데, 이러한 SSR 메서드들은 이 작업을 수행하지 않는다.

왜 그럴까? styled-components는 일반적으로 DOM API를 사용하여 스타일을 주입한다. 그러나 **서버 환경에서는 DOM API로 문서를 조작할 수 없다.** 

**DOM 조작은 브라우저 환경에서만 가능하기 때문이다.** 서버에서는 HTML이 단순한 문자열 형태로만 존재하기에 Node.js 환경에서는 브라우저의 document 객체가 존재하지 않는다. 따라서 이에 접근하려고 하면 에러가 발생한다.

```js
document.head.appendChild(styleElement);
// ReferenceError: document is not defined
```

## SSR에서 styled-components를 사용하는 방법
```tsx
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

const sheet = new ServerStyleSheet();
try {
  // 앱 렌더링 과정에서 styled-components 스타일 수집
  const html = renderToString(sheet.collectStyles(<YourApp />));

  // 수집된 스타일을 HTML 문자열로 변환
  const styleTags = sheet.getStyleTags(); 

  // 최종 HTML에 스타일 태그와 앱 마크업을 결합
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My SSR App</title>
        ${styleTags}
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;

  // 완성된 HTML을 클라이언트에 전송
} catch (error) {
  console.error('styled-components SSR 오류:', error);
} finally {
  sheet.seal();
}
```
styled-components는 이러한 SSR 환경에서의 문제를 해결하기 위해 `ServerStyleSheet` 클래스를 제공한다. 이 클래스는 서버에서 React 컴포넌트를 렌더링할 때 styled-components로 생성된 CSS를 수집하고, 이를 초기 HTML에 포함시켜 클라이언트로 전송하게 도와준다.

따라서 클라이언트에서 JavaScript 번들을 다운 받아 실행하기 이전에도 스타일이 적용된 페이지를 볼 수 있게 된다. 이를 통해 SSR에서도 styled-components로 깜빡임 없이 페이지에 스타일을 적용할 수 있다.

# 🔍 RSC(React Server Components)
앞선 챕터들에서 SSR 환경에서도 styled-components가 특별한 설정을 통해 문제없이 동작할 수 있음을 알 수 있었다. 그렇다면 왜 React Server Components(RSC)에서는 호환성 문제가 발생는 걸까? 이를 이해하기 위해 RSC를 살펴보려 한다.

## RSC의 개념과 특징

RSC는 React 18에서 도입된 새로운 패러다임으로, **서버에서만 실행되는 컴포넌트**를 만들 수 있게 해준다. 이는 React 역사상 처음으로 컴포넌트가 서버에서만 실행될 수 있도록 하는 혁신적인 접근 방식이다. 

기존에는 React 컴포넌트가 클라이언트와 서버 양쪽에서 실행되었던 것과 달리, RSC는 일부 컴포넌트를 완전히 서버에서만 실행되도록 분리한다. **RSC는 JavaScript 번들에조차 포함되지 않는다.** 

이 개념은 전통적인 React보다는 서버에서 HTML을 생성하여 전송하는 PHP와 같은 서버 중심 렌더링 방식에 더 가깝다. 그러나 RSC의 핵심적인 가치는 서버 컴포넌트와 클라이언트 컴포넌트가 하나의 애플리케이션 내에서 자연스럽게 공존할 수 있다는 점에 있다고 볼 수 있다.

```tsx
function Todos() {
  const todos = db.query('SELECT * FROM TODOS');
  return (
    <div>
      {todos.map(todo => (
        <Todo key={todo.id} item={todo} />
      ))}
    </div>
  );
}
```

또한 기존에는 클라이언트와 서버에서 모두 실행되었기 때문에 서버에서만 실행될 수 있는 코드를 작성할 수 없었다. 예를 들어 다음과 같은 코드가 클라이언트에서 다시 실행하면 문제가 발생한다. 클라이언트 측에서는 데이터베이스에 접근할 수 없기 때문이다.


```tsx
export async function getServerSideProps() {
  const todos = await db.query('SELECT * FROM TODOS');
  return {
    props: {
      todos,
    },
  };
}
function Todos({todos}) {
  return (
    <div>
      {todos.map(todo => (
        <Todo key={todo.id} item={todo} />
      ))}
    </div>
  );
}
```

이를 해결하기 위한 API가 `getServerSideProps`로 다음과 같이 작성할 수 있었다. 그러나 이는 각 페이지의 최상위에서 하위 컴포넌트로 props를 내리는 방식이기에 props drilling을 야기하고, 원하는 곳 어디에서나 사용하기가 어렵다.

```tsx
function Todos() {
  const todos = db.query('SELECT * FROM TODOS');
  return (
    <div>
      {todos.map(todo => (
        <Todo key={todo.id} item={todo} />
      ))}
    </div>
  );
}
```
이에 대한 해결책이 RSC다. RSC를 활용하면 `getServerSideProps`를 따로 사용하지 않아도 간단하게 해결할 수 있다.

## RSC의 핵심적 제약: 업데이트 불가능성

RSC는 **하이드레이션 되거나 리렌더링 되지 않는다.**

하이드레이션이란 서버에서 생성된 정적 HTML에 JavaScript를 실행하여 이벤트 리스너를 연결하고 상태 관리를 활성화함으로써 페이지를 상호작용 가능하게 만드는 과정을 의미한다.

일반적인 React 컴포넌트와 달리, RSC는 서버에서 실행된 후 그 결과가 **JSON 형태로 직렬화된 React 트리**로 클라이언트에 전달된다.
```tsx
// RSC
function Homepage() {
  return (
    <p>
      Hello world!
    </p>
  );
}
```
이 컴포넌트는 클라이언트에 다음과 같은 직렬화된 형태로 전송된다.
```js
self.__next['$Homepage-1'] = {
  type: 'p',
  props: null,
  children: "Hello world!",
};
```
이렇게 직렬화된 결과물은 실행 가능한 코드가 아닌 단순한 스냅샷에 불과하다. 따라서 컴포넌트 로직, 이벤트 핸들러, 라이프사이클 메서드와 같은 동적 요소들이 포함되지 않는다.

React의 업데이트 메커니즘은 컴포넌트 함수를 다시 실행하고 이전 결과와 비교하는 방식으로 작동한다. 그러나 서버 컴포넌트는 JavaScript 번들에서 완전히 제외되기 때문에 클라이언트 측에서 이를 **재실행하거나 업데이트할 수 있는 방법이 존재하지 않는다.**

## React Hook 사용 제한

RSC의 이러한 특성 때문에 `useState`, `useEffect`, `useContext`와 같은 React Hook들은 서버 컴포넌트에서 사용할 수 없다.

`useState`의 경우, `setState` 함수를 통해 상태가 변경될 때 변경된 상태를 UI에 반영하기 위해 컴포넌트를 다시 렌더링해야 한다. 그러나 앞서 설명했듯이  RSC 관련 코드는 JS 번들에 조차 존재하지 않기에 서버 컴포넌트는 클라이언트에서 재렌더링할 수 없으므로 `useState`를 사용하는 것이 불가능하다.

`useEffect`도 마찬가지로 클라이언트 렌더링 이후에 실행되는 Hook이기 때문에, 서버 컴포넌트에 `useEffect`를 작성하더라도 클라이언트에서는 이 로직을 실행할 방법이 없다.


## RSC와 styled-components
styled-components는 내부적으로 `ThemeProvider`를 통한 테마 관리와 다양한 기능 구현을 위해 `useContext`를 광범위하게 사용한다. 이는 React의 라이프사이클과 긴밀하게 연동되어 작동하도록 설계되어 있는데, RSC 환경에서는 React의 생명주기라는 개념이 존재하지 않기 때문에 이러한 설계가 근본적인 제약에 부딪힌다.


```tsx
export function useTheme(): DefaultTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw styledError(18);
  }

  return theme;
}


export default function ThemeProvider(props: Props): React.JSX.Element | null {
  const outerTheme = React.useContext(ThemeContext);
  const themeContext = useMemo(
    () => mergeTheme(props.theme, outerTheme),
    [props.theme, outerTheme]
  );

  if (!props.children) {
    return null;
  }

  return <ThemeContext.Provider value={themeContext}>{props.children}</ThemeContext.Provider>;
}
```
다음과 같이 styled-components는 Context API를 활용해서 `useContext(ThemeContext)`로 어디에서든지 테마 값을 가져올 수 있게 하고, `<ThemeContext.Provider>`로 하위 컴포넌트에 테마 값을 제공할 수 있게 하여 전역 테마 상태 관리를 구현하고 있다. 이는 RSC에서 작동할 수 없는 로직이다.

# 📃 정리하며
styled-components가 유지보수 모드로 전환한 이유에 영향을 미쳤던 이유 중 하나인 RSC와의 호환성 문제에 대해 살펴보았다. styled-components는 Context API에 크게 의존하는 런타임 기반 CSS-in-JS 라이브러리로, 서버에서만 실행되고 클라이언트에서 하이드레이션되지 않는 RSC의 특성과 호환되지 않는다.

호환성에 대한 문제점이 계속 제기되면서 [styled-components GitHub issue](https://github.com/styled-components/styled-components/issues/3856)에서도 오랜기간 논의 되었고, 메인테이너는 React 팀에서 서버 컴포넌트에서도 사용할 수 있는 서버용 Context를 발표하기를 기대했던 것 같다.

그러나 React 팀이 RSC에서 사용 가능한 서버용 Context API를 제공하지 않기로 결정함에 따라, styled-components 팀은 근본적인 아키텍처 변경이 필요한 상황에 직면했다. 

그러나 React Context를 제거하려면 라이브러리를 전체적으로 다시 작성해야 하며 이 과정을 통해 API의 변경이 일어날 수도 있는데 그렇게 되면 현재 styled-components를 사용하는 수많은 사용자들이 대규모 리팩토링 작업을 해야 할 것이다. 

이런 저런 상황에 의해 개선 방법을 찾기보다는 styled-components는 React Context를 제거하지 않기로 결정하게 된 것 같다. 

아직 styled-components는 기본적인 CSR, SSR에서 문제 없이 동작하기에 해당 문제만으로는 더 이상 새 프로젝트에서 styled-components를 채택하지 말라고 말하기는 어렵다. 따라서 부수적인 원인이 무엇이었는지에 대해 다음 글에서 다뤄 볼 예정이다.



<br/>
<br/>
<br/>


**참고 문서**

[Demystifying styled-components](https://www.joshwcomeau.com/react/demystifying-styled-components/)

[CSS in React Server Components](https://www.joshwcomeau.com/react/css-in-rsc/)

[Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/)

[CSS-in-JS와 서버 컴포넌트](https://shiwoo.dev/posts/next-13-and-css-in-js#css-in-js%EC%99%80-%EC%84%9C%EB%B2%84-%EC%82%AC%EC%9D%B4%EB%93%9C-%EB%A0%8C%EB%8D%94%EB%A7%81)
