---
title: webpack과 babel 설정하기
date: 2023-02-25
description: from scratch
tags: [webpack, babel]
---

webpack과 babel에 대해 공부해보고 싶어서 이들을 이용해 react 환경을 구축해봤습니다. webpack과 babel이 무엇인지 먼저 알아보고 어떻게 환경을 구축했는지 설명하려고 합니다.

# Babel

Babel은 **자바스크립트 컴파일러**입니다. 왜 컴파일러가 필요할까요? 최신 자바스크립트 문법을 모든 브라우저가 지원하지는 않기 때문에 이를 해결하기 위한 해결사가 필요합니다. 이것이 Babel입니다. 최신 문법의 자바스크립트 코드를 이전 버전의 자바스크립트로 변환시켜 더 많은 브라우저가 코드를 이해할 수 있게 도와주죠. Babel을 자주 접하지 못했던 이유는 create-react-app 같은 도구에 내장되어 있기 때문입니다.

<br>

# Webpack

<img src="https://user-images.githubusercontent.com/35218826/59730847-eb233b00-927e-11e9-9788-408e699c9e58.png">

<br>

webpack은 **정적 모듈 번들러**입니다. webpack은 패키지를 살펴보고 웹 애플리케이션이 예상대로 작동하는 데 필요한 다양한 모듈로 구성된 의존성 그래프를 생성합니다. 그리고 이 그래프에 따라 모든 모듈(HTML, CSS, JavaScript, Images 등)을 하나 이상의 번들로 결합합니다. 이는 HTML에 연결할 수 있는 bundle.js 같은 파일입니다.

> **모듈?** 특정 기능을 갖는 작은 코드 단위

> **모듈 번들링?** 여러 자원들을 하나의 파일로 병합 및 압축해주는 것

<br>

## 번들러를 왜 사용할까?

<br>

<img src="https://www.datocms-assets.com/48401/1636485841-bundle-up.gif?fit=max&fm=webp&w=900">

<br>

모듈 번들러는 사용자가 지정한 entry point부터 소스 파일의 종속성, 써드파티 **종속성**을 모두 추척해줍니다. 첫 번째 코드 파일을 통과하자마자 생성되는 종속성 그래프는 모든 소스 및 관련 코드 파일이 **최신 상태로 유지**되도록 보장해줍니다. 번들러가 없었을 땐 이렇게 최신 상태를 유지하는 것은 굉장히 복잡했기 때문에 이러한 기능이 개발자에게는 굉장한 이점인 것이죠.

번들러의 역할은 많은 파일을 하나의 파일로 번들링하는 것입니다. 굳이 하나의 파일로 묶어줄 필요가 있을까요? 묶어주지 않으면 곤란한 일들이 꽤 생깁니다. 많은 스크립트를 로드하게 되면 **네트워크 병목 현상**이 일어나는데 그렇다고 하나의 파일로 관리하게 되면 가독성, 유지 보수, 크기 측면에서 문제가 발생합니다. 하나의 파일로 잘 묶어주는 번들러를 사용한다면 이런 것들을 고민할 필요가 없겠죠.

과거에는 파일이 많으면 성능이 저하됐는데 HTTP/2의 등장으로 파일의 개수는 크게 상관이 없게 됐습니다. 그럼에도 한 개의 파일로 묶어주는 것은 의미가 있습니다. 각 요청은 개별적으로 캐시 되기 때문에 파일 수가 많으면 브라우저가 캐시에서 오래된 코드를 가져오는 것을 방지하기 어려워져요.

외에도 번들러는 종속성 그래프를 통해 종속성 관계를 관리하기 쉽게 도와주며, 이미지나 asset 등을 로드하는 데 도움을 줍니다. 그리고 아직은 브라우저가 모듈 시스템을 완전히 지원하지 않기 때문에 필요합니다.

<br>

## 웹팩의 코어 개념

웹팩의 코어 개념을 이해해 봅시다.

### Entry

entry는 **자원을 변환하기 위해 필요한 최초 진입점을 지정하는 속성**입니다. 즉, 내부 종속성 그래프를 만들기 시작할 때 사용할 모듈을 나타냅니다. entry 속성에 지정된 파일에는 웹 애플리케이션의 **전반적인 구조와 내용**이 담겨져 있어야 합니다. 웹팩은 이 파일을 통해 해당 엔트리 포인트가 의존하는 다른 모듈과 라이브러리를 파악하기 때문에 **애플리케이션을 동작시킬 수 있는 내용**들이 담겨 있어야 합니다.

종속성 그래프는 다음과 유사한 구조를 갖습니다. 의존 관계를 나타내고 있어요.
<img src="https://joshua1988.github.io/webpack-guide/assets/img/webpack-entry.90e26197.png">

entry는 기본적으로 다음과 같이 작성할 수 있습니다.

```javascript
module.exports = {
  entry: "./path/to/my/entry/file.js",
};
```

MPA(Muti Page Application)이라면 다음과 같이 엔트리 포인트를 여러 개 작성할 수도 있습니다.

```javascript
entry: {
  login: './src/LoginView.js',
  main: './src/MainView.js'
}
```

<br>

### Output

웹팩이 **번들링한 결과물**을 저장할 파일 경로를 지정할 수 있습니다.

```javascript
const path = require("path"); // 파일 경로를 조작하기 위한 Node.js 모듈

module.exports = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js",
  },
};
```

`path`에서는 번들의 위치, `filename`에서는 번들의 이름을 설정할 수 있습니다.

만약, 여러 개의 엔트리 포인트를 사용하거나 다양한 플러그인을 통해 여러 번들을 생성할 때는 고유한 이름을 지정해줘야 합니다. ([template strings](https://webpack.js.org/configuration/output/#template-strings))

- `[name]` : entry 속성
- `[id]` : 웹팩 내부적으로 사용하는 모듈 ID
- `[hash]` : 매번 빌드 시의 고유 해시 값
- `[chunkhash]` : 웹팩의 각 모듈 내용을 기준으로 생성된 해시 값

<br>

### Loader

웹팩은 **자바스크립트와 JSON**만 이해할 수 있는데 로더를 사용하면 이 외의 파일들(HTML, CSS, Image 등)을 처리하여 애플리케이션에서 사용할 수 있는 **유효한 모듈**로 변환합니다. 자세하게는 번들에 추가하기 전에 로더를 사용해서 파일을 변환할 수 있습니다.

> ex) TypeScript -> JavaScript

```javascript
const path = require("path");

module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};
```

- `test` : 어떤 파일을 변환할 것인가
- `use` : 어떤 로더를 사용할 것인가

<br>

### Plugin

[🍀 플러그인 모음](https://webpack.js.org/plugins)

플러그인은 번들 최적화, asset 관리, 환경 변수 삽입 등 **광범위**한 작업을 수행하는 데 필요합니다. `require()`로 플러그인을 배열에 추가할 수 있고, 대부분의 플러그인은 플러그인 옵션을 통해서 사용자 정의할 수 있습니다. 플러그인의 배열에는 생성자 함수로 생성한 객체 인스턴스만 추가될 수 있습니다.

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); //to access built-in plugins

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

<br>

### Mode

모드에는 `development`, `production`, `none` 이렇게 세 가지가 있습니다. 모드를 설정해주면 각 **환경에 맞는 웹팩의 기본 제공 최적화**를 활성화 할 수 있습니다. 아무것도 설정하지 않은 기본값은 `production`입니다. 모드 설정 시 `DefinePlugin`의 `process.env.NODE_ENV`가 `development`나, `production`이 되며 모드가 `none`일 때는 기본 최적화 옵션을 해제합니다.

<br>

# 적용한 설정들

## webpack

앞서 Mode에서 설명했듯이 각 환경에 맞는 모드를 설정해줄 수 있습니다. 그래서 `common`, `dev`, `production`으로 나눠서
설정해주었습니다.

<br>

### webpack.common.js

common은 production 환경과 development에 공통적으로 공유되는 설정을 담은 파일입니다. 이렇게 분리해주면 코드를 복제할 필요가 없기 때문에 유용합니다.

**output**

```javascript
module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
    clean: true,
  },
```

번들링한 파일을 저장할 곳, 파일의 이름을 지정해주었습니다. `filename`을 `[name].[chunkhash].js`로 지정해준 걸 볼 수 있는데 `[hash]`는 매번 컴파일을 할 때마다 다른 문자열을 표시해주지만, `[chunkhash]`는 파일이 달라질 때만 랜덤 값이 바뀌기 때문에 `[chunkhash]`로 지정해주었습니다. 이렇게 하면 **변경되지 않은 파일들은 캐싱 되고 변경된 파일만 새로** 불러오게 할 수 있습니다.

`publicPath`와 `path`의 차이가 무엇인지 헷갈렸는데, `publicePath`는 **서버상**에서 파일들이 위치할 기본 경로이며 이를 기반으로 한 URL을 통해 파일에 접근할 수 있습니다. `path`는 output의 결과물 파일이 저장되는 **로컬** 디렉터리를 가리킵니다.

webpack은 계속해서 파일을 생성하고 `/dist`에 저장합니다. 점점 쌓여가고 사용되지 않는 파일들을 정리해줄 필요가 있기 때문에 이 파일들을 자동으로 제거해주기 위해서 `clean`을 true로 설정해주었습니다. 이는 webpack 구버전에서 `clean-webpack-plugin`이라는 플러그인이 담당했었는데 v5로 넘어가면서 기능이 내장되었습니다.

<br>

**resolve**

```javascript
resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
```

resolve는 웹팩이 경로나 확장자를 처리하는 것을 도와줍니다. `extensions`에 적혀진 확장자의 순서에 따라 파일을 resolve 합니다. a.tsx, a.ts라는 파일이 존재한다면 extensions에 적혀진 순서에 따라 파일을 처리하고 나머지는 건너뜁니다. 그리고 대상 확장자들은 웹팩이 알아서 처리해주기 때문에 확장자명을 입력하지 않아도 됩니다.

`alias`는 파일을 더 쉽게 가져올 수 있도록 도와줍니다. src에 대해 설정해주면 다음과 같이 간단하게 파일을 가져올 수 있습니다.

```javascript
import Example from "@src/Example";
```

<br>

**module**

```javascript
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "tsx",
          target: "esnext",
        },
      },
      {
        test: /\.(png|jpe?g|gif|woff)$/i,
        type: "asset/resource",
      },
    ],
  },
```

원래 babel-loader를 사용했었는데 [Webpack 빌드에 날개를 달아줄 Esbuild-Loader](https://fe-developers.kakaoent.com/2022/220707-webpack-esbuild-loader/) 이 글을 읽고 esbuild-loader를 사용했습니다. 예전엔 코드를 변환해주기 위해서 `babel-loader`와 파일을 축소하기 위해 `terser`를 주로 사용했었는데 이젠 `esbuilder-loader`가 좋은 대안이 되어주고 있습니다. 이는 **변환, 축소 기능을 가지고 있으며 빌드 속도를 크게 향상**시켜줍니다.

왜 이런 속도 차이가 생기냐면, esbuild가 Go로 작성되어서 자바스크립트와는 본질적인 퍼포먼스 차이가 존재하기 때문입니다. 자바스크립트는 인터프리터 언어라서 실행할 때 한 줄씩 기계어로 번역하지만 Go는 컴파일 단계에서 미리 소스 코드를 기계어로 변환해 놓기 때문에 실행 단계에서 기계어로 변환하는 작업이 생략됩니다. 그리고 Go는 멀티 스레드 기반이기 때문에 파일을 동시에 번들링하거나 트랜스 파일링 될 수 있다는 점도 고려될 수 있을 것 같습니다.

`exclude`에는 컴파일하지 않을 폴더나 파일을 설정할 수 있습니다. node_modules는 보통 라이브러리가 배포될 때 이미 컴파일되어 있기 때문에 제외해 줍니다. (번들은 됩니다) `options`의 loader로 tsx를 지정해주면 tsx를 올바르게 처리해주고, target을 esnext를 설정해주면 최신 문법을 사용해도 브라우저의 호환성을 유지할 수 있습니다.

```javascript
 {
    test: /\.(png|jpe?g|gif|woff)$/i,
    type: "asset",
 },
```

Asset Modules는 파일을 처리하는 방식을 모아놓은 모듈입니다. 방식에 따라 브라우저가 한 번에 다운로드하는 파일의 개수와 용량을 결정합니다. 방식에는 `asset`, `asset/resource`, `asset/source`, `asset/inline`가 있는데 우선 어떤 프로젝트가 될지 모르기 때문에, 조건에 따라 처리 방식이 달라지는 asset을 사용했습니다.

```javascript
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
```

`HtmlWebpackPlugin`은 `scrpit` 태그를 사용해서 모든 웹팩 번들을 포함하는 HTML 파일을 자동으로 생성합니다. 파일 이름에 hash를 사용하고 여러 번 번들을 출력하다 보면 이를 수동으로 관리하기가 어려워지기 때문에 자동으로 관리할 필요성이 있어서 설정해주었습니다.

<br>

### webpack.dev.js

```javascript
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [new ReactRefreshWebpackPlugin()],
  optimization: {
    minimize: false,
  },
});
```

webpack.common.js를 webpack-merge를 통해서 dev에 병합할 수 있습니다. `ReactRefreshWebpackPlugin`은 코드에 변경 사항이 있을 때 감지하여 리로드시켜주는 플러그인입니다. 이를 사용하지 않으면 변경 사항이 자동으로 반영되지 않습니다. 이는 개발 환경에서만 필요하기 때문에 `devlopment` 모드에만 사용했습니다. `minimize`는 false로 지정해주었는데 이유는 개발 환경에서는 코드를 최적화하기보다는 디버깅과 코드 수정에 용이하도록 빌드 시간을 단축해주는 것이 좋기 때문입니다.

```javascript
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "esnext",
      }),
    ],
  },
});
```

`ESBuildMinifyPlugin`은 코드를 최적화하는데 이 또한 개발 모드에서는 사용하지 않는 게 좋기 때문에 `production` 모드에만 적용해 주었습니다.

<br>

## Babel

Babel은 다음과 같이 설정해주었습니다.

```javascript
module.exports = {
  presets: [
    ["@babel/preset-react"], // JSX 문법 변환
    "@babel/preset-env", .. // JavaScript 최신 문법 사용 가능
    "@babel/preset-typescript", // TypeScript 문법 변환
  ],
};
```

<br>

## package.json

```javascript
{
  "name": "react-boilerplate",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  "devDependencies": {
    "@babel/cli": "^7.21.0",
    "@babel/core": "^7.21.0",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.21.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.10",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "esbuild-loader": "^3.0.1",
    "eslint": "^8.34.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-prettier": "^4.2.1",
    "html-webpack-plugin": "^5.5.0",
    "typescript": "^4.9.5",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.11.1",
    "webpack-bundle-analyzer": "^4.8.0",
    "webpack-merge": "^5.8.0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1"
  }
}
```

<br>

# 맺으면서

이렇게 webpack과 babel을 설정해보았습니다. 코드는 깃허브에도 업로드 해놓았기에 [깃허브](#https://github.com/seriparkdev/react-boilerplate)에서 확인할 수 있습니다.

<br>

**참고 문서**

[webpack 공식 문서](https://webpack.js.org/)

[babel 공식 문서](https://babeljs.io/)

[Webpack 빌드에 날개를 달아줄 Esbuild-Loader](https://fe-developers.kakaoent.com/2022/220707-webpack-esbuild-loader/?ref=codenary)

[ZeroCho Blog](https://www.zerocho.com/)
