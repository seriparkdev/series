---
title: 재사용 가능한 컴포넌트 만들기
date: 2023-02-02
description: "#Headless #input #modal #button"
tags: [refactoring]
---

# Reusable Component

그동안은 규모가 작은 프로젝트를 하다보니 button이나, input, modal 같은 작은 단위의 컴포넌트를 재사용할 수 있게 만들어야 한다는 필요성을 느끼지 못해서 원래 진행하던 방식대로 프로젝트를 만들었습니다. 그러나, 프로젝트를 완성하고 난 뒤 코드를 다시 훑어보면서 중복되는 코드가 적지 않다는 것을 느꼈습니다. **이런 컴포넌트가 계속 필요하다면 또 이렇게 작성해야겠네? 비효율적이다**는 생각에 재사용할 수 있는 컴포넌트에 관해 공부하기 시작했습니다.

먼저 재사용 가능한 컴포넌트를 만들기 위해서 가장 첫 번째로 공부한 키워드는 `Headless Component`입니다.

# Headless Component란?

Headless Component란 재사용 가능한 UI 컴포넌트를 빌드하는 구축 패턴 중 하나입니다. 이러한 패턴을 기반으로 구현한 컴포넌트는 **UI에 독립적**이며, **상태와 관련된 로직만 가지고 있습니다.**

UI에 독립적이면 무슨 장점이 있을까요? 매번 상태와 관련된 로직을 작성하지 않고도 다양한 스타일의 컴포넌트를 빠르게 만들어낼 수 있습니다. 반대로 한 컴포넌트 안에 UI와 상태 관리 로직이 공존하여 UI에 의존적이게 된다면 이 컴포넌트는 반드시 똑같은 디자인이 필요할 때만 재사용될 수 있습니다. 예를 들어 디자인이 다른 7개의 input을 만들고자 하는데 똑같은 로직을 7번 작성해야 한다면 굉장히 비효율적일 것입니다.

- `변하지 않는 것(상태 관련 로직)` => 재사용할 수 있게 만들기

- `변하는 것(UI 관련 로직)` => 변경에 빠르게 대응할 수 있도록 독립시키기

<br>

# input Headless Component

그럼 공부한 것을 기반으로 Headless한 input 컴포넌트를 만들어보겠습니다. 앞서 Headless Component는 데이터 로직만을 가지고 있다고 말했었죠. input의 데이터 로직은 무엇일까요?

input의 데이터 로직은 다음과 같아요.

- input의 value

- value가 변경될 때마다 state를 update하는 함수

이를 기반으로 input 컴포넌트를 다음과 같이 만들었습니다.

```javascript
import { useState } from "react";

type InputType = [string, (e: React.ChangeEvent<HTMLInputElement>) => void];

function useInput(initialValue: string): InputType {
  const [value, setValue] = useState(initialValue);

  const onChangeValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, onChangeValueHandler];
}

export default useInput;
```

useState에 매번 초깃값도 같이 적용해줘야 해서 props로 initialValue를 전달받도록 만들었습니다. 그리고 언제든지 사용처에서 input의 value에 접근하고 수정할 수 있도록 `value`와 `onChangeValueHandler`를 반환시켰습니다.

이렇게 완성된 useInput은 다음과 같이 사용할 수 있습니다.

```javascript
import useInput from "../hooks/useInput";

export default function Example() {
  const [name, onChangeNameHandler] = useInput("");

  return <input type="text" value={name} onChange={onChangeNameHandler} />;
}
```

매번 데이터 관련 로직을 작성할 필요 없게 되었고 UI와 완전히 독립적이기 때문에 어떠한 제약 없이 스타일링을 할 수 있습니다.

<br>

# 고민

결과적으로 Headless하게 input을 관리할 수 있도록 만들었지만, 다음과 같은 방식도 고려했습니다.

```javascript
import { inputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 initialValue: string;
}

function Input({ initialValue, ...rest }: InputProps) {
 const [value, setValue] = useState(initialValue);

  const onChangeValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  return <S.Input {...rest} onChange={onChangeValueHandler} value={value} /
}

export default Input;

const S = {
  Input: styled.input`
	// 스타일 코드
  `,
};
```

이는 Headless 방식은 아닙니다. UI와 데이터 로직이 분리되어 있지 않아요. 재사용 가능한 컴포넌트를 만들면서 다른 프로젝트를 참고했는데, 이러한 방식을 많이 사용하고 있어서 저의 요구 사항에 맞게 구현해봤습니다.

그런데 이러한 방식이 괜찮은지 확신이 들지 않았습니다. Headless 방식의 장점이 제게 크게 와닿았기 때문입니다. UI를 자유롭게 커스텀할 수 있는 편이 언제든지 변경될 수 있는 요구사항에 빠르게 대응하기 좋다고 생각했습니다.

그렇지만, 사람들이 왜 이러한 방식을 채택하고 있는지 그 이유가 궁금했습니다. 이는 UI에 독립적이지 않기 때문에 스타일링을 자유롭게 할 수 없습니다. 결국 다른 디자인의 input이 필요하다면 또다시 만들어야 해요.

그럼에도 이 방식의 장점이 존재하지 않을까? 이 방식을 선택한 이유가 있지 않을까? 라는 생각에 나름의 추측을 해봤습니다.

- 사실 한 프로젝트 내에서 input의 스타일은 그렇게 다양하지 않고, 일관적일 때가 많다.

- input의 스타일을 하나로 정해놓고, 더 이상의 변경에 대응할 필요가 없는 프로젝트일 경우라면?

- 그렇다면, UI와 데이터 로직을 분리하지 않는 방식으로 하나의 스타일만 사용하는 것이 오히려 스타일 코드의 반복을 줄일 수 있다.

이렇게 나름의 이유를 추측하니 이해가 되었습니다.

늘 그렇듯이 한 가지 방식이 언제나 옳은 것은 아니기 때문에, 방식을 채택하기에 앞서서 고민이 필요한 것 같습니다.

<br>

# Reusable Modal Component

input에 이어서 Modal과 관련된 코드의 중복을 줄이기 위해서 재사용 가능한 모달 컴포넌트를 구현했습니다.

모달 컴포넌트를 구현하기 위한 로직은 다음과 같습니다.

**1. `useModal`이라는 이름의 모달과 관련한 데이터 로직이 담긴 custom hook**

useModal은 모달을 사용할 컴포넌트에 필요한 모달의 상태, 모달의 상태를 제어하기 위해 필요한 함수를 리턴해야 합니다.

**2. 재사용할 모달 컴포넌트**

모달 컴포넌트에서는 `useModal`에서 받아온 `isOpenModal`과 `closeModal`을 전달받습니다. modal의 상태가 true(open)라면 ReactDOM.createPortal로 모달을 보여줍니다. 여기서 추가로 Dimmer라는 컴포넌트가 필요한데, 이는 모달의 배경으로 모달 뒤에 표시되는 콘텐츠를 가려주는 overlay입니다. Dimmer의 영역을 클릭하면 모달이 닫힐 수 있도록 onClick시 closeModal 함수가 실행됩니다.
<br>

> **ReactDOM.createPortal?** createPortal을 사용하면, 일부 자식 요소를 DOM의 다른 영역에서 렌더링할 수 있습니다. 즉, 메인 어플리케이션이 돌아가고 있는 메인 DOM과는 별개인 영역에 일부 element를 렌더링할 수 있습니다. Modal을 구현하면서 포탈을 사용하게 된 이유는 CSS의 상속 때문입니다. 부모의 스타일에 영향을 받지 않도록 완전히 독립시킬 수 있습니다.

**3. 모달 컴포넌트로 전달할 모달의 메인 컨텐츠 (뷰)**

뷰로 보여주고자 하는 메인 컨텐츠는 모달 컴포넌트로 감싸면 됩니다. 이는 children으로 모달 컴포넌트에 삽입됩니다.

# 코드

useModal.ts

```javascript
import { useEffect, useState } from "react";

export default function useModal() {
  const [isOpenModal, setisOpenModal] = useState(false);

  const openModalHandler = () => {
    setisOpenModal(true);
  };

  const closeModalHandler = () => {
    setisOpenModal(false);
  };

  const toggleModalHandler = () => {
    setisOpenModal((prev) => !prev);
  };

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isOpenModal]);

  return {
    closeModalHandler,
    toggleModalHandler,
    openModalHandler,
    isOpenModal,
  };
}
```

모달의 상태를 다루는 close, open, toggle 함수를 만들었고, 모달의 상태가 바뀔 때마다 useEffect에서는 스크롤에 대한 처리를 해줍니다. 모달이 open 상태라면 스크롤을 할 수 없게 하고, 모달이 닫혀 있는 상태라면 스크롤을 자유롭게 할 수 있도록 해줬습니다.

<br>

Modal.tsx

```javascript
import Dimmer from "./Dimmer";
import ReactDOM from "react-dom";

interface Props {
  children: JSX.Element;
  closeModalHandler: VoidFunction;
  isOpenModal: boolean;
}

export default function Modal({
  children,
  isOpenModal,
  closeModalHandler,
}: Props) {
  const root = document.getElementById("portal-root");

  return (
    <>
      {isOpenModal && root
        ? ReactDOM.createPortal(
            <>
              <Dimmer onClick={closeModalHandler} />
              {children}
            </>,
            root
          )
        : null}
    </>
  );
}
```

index.html

```html
<body>
  <div id="root"></div>
  <div id="portal-root"></div>
</body>
```

모달 컴포넌트에서는 `children`(메인 컨텐츠), `isOpenModal`(모달의 상태), `closeModalHandler`(모달을 닫는 함수)를 받고 있습니다. 모달이 open 상태(isOpenModal가 true)라면 컨텐츠를 표시합니다. Dimmer를 클릭하면 모달이 닫힐 수 있도록 `closeModalHandler`를 전달했습니다. CSS 상속으로 인해 모달이 원하는 곳에 위치하지 않는 경우가 발생할 것을 대비해 포탈로 모달을 메인 돔 외부에 띄우도록 만들었습니다.

모달을 열면 다음과 같이 portal-root에 모달을 띄우고 있음을 확인할 수 있습니다.

<br>

![](https://velog.velcdn.com/images/seripark/post/dd1836c3-aedc-4766-8f79-c0bb629c5e0b/image.jpg)

<br>

# 프로젝트에 적용해보기

```javascript
export default function UserDetail() {
  const { isOpenModal, closeModalHandler, openModalHandler } = useModal();

  return (
    <Modal isOpenModal={isOpenModal} closeModalHandler={closeModalHandler}>
      <EditUserForm closeModalHandler={closeModalHandler} />
    </Modal>
  );
}
```

useModal에서 필요한 로직과 상태를 가져오고 필요한 컴포넌트에 props로 넘겨주었습니다. 그리고 모달의 메인 컨텐츠인 EditUserForm을 감싸면 Form은 Modal의 children으로 표시됩니다. 간단하게 모달을 만들 수 있게 되었어요.

<br>

# 삽질기

처음에 저는 모달 컴포넌트는 이렇게 구현하지 않았습니다. 재사용성이 떨어지게 모달 컴포넌트를 만들었는데요. 그 이유에 대해서 적고 문제를 짚어보려고 합니다.

```javascript
interface ModalProps {
  children: JSX.Element;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenModal: boolean;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function Modal({
  children,
  isOpenModal,
  setIsOpenModal,
  submitForm,
}: ModalProps) {
  return (
    <>
      {isOpenModal && (
        <>
          <S.Background />
          <S.Form onSubmit={submitForm}>
            {children}
            <S.ButtonWrapper>
              <Button
                type="button"
                colorTheme="gray"
                onClick={() => setIsOpenModal(false)}
              >
                취소
              </Button>
              <Button type="submit">등록</Button>
            </S.ButtonWrapper>
          </S.Form>
        </>
      )}
    </>
  );
}
```

이것이 제가 가장 처음 만들었던 모달 컴포넌트의 코드입니다. 이렇게 만든 이유를 먼저 적어 보자면, 제가 프로젝트에서 모달을 사용할 일은 form과 결합하여 사용하는 것 뿐이었습니다. 그래서 이 경우에만 집중하다 보니 더 많이 재사용할 수 있는 방법을 고려하지 않게 됐습니다.

이는 앞서 만들었던 컴포넌트에 비해 굉장히 구체적입니다. 이 모달 컴포넌트가 사용되는 경우는 모달의 메인 컨텐츠가 form일 때밖에 없습니다. 재사용 가능한 컴포넌트에 대한 이해가 부족한 결과였던 것 같습니다.

앞서 만들었던 모달 컴포넌트와 비교해보면 어떤 것이 재사용성이 더 높은지, 어떤 부분이 아쉬운지, 왜 추상화를 하는 게 좋은지 알 수 있을 것입니다. 제가 처음에 만들었던 모달 컴포넌트는 너무 많은 일을 하고 있어서 좋은 예시가 아닙니다. 조금 더 작은 단위로 쪼개는 것이 컴포넌트의 재사용성을 높일 수 있습니다. 물론 반드시 그래야 하는 것은 아니고 상황에 맞게 고려해서 기준을 정해야 합니다.

# Reusable Button component

다음은 재사용 가능한 버튼 컴포넌트 코드입니다.

```javascript
import { ButtonHTMLAttributes, ReactElement } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactElement | string;
  colorTheme?: "default" | "lightGreen" | "white" | "gray";
  size?: "small" | "medium" | "large";
  borderRadius?: string;
}

const ButtonStyleOption = {
  size: {
    small: "0.4rem",
    medium: "0.8rem",
    large: "1.7rem",
  },
  fontSize: {
    small: "1rem",
    medium: "1.3rem",
    large: "1.7rem",
  },
  default: {
    backgroundColor: "#4da64d",
    color: "#ffffff",
  },
  lightGreen: {
    backgroundColor: "#b3d9b3",
    color: "#515151",
  },
  white: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  gray: {
    backgroundColor: "#f7f7f7",
    color: "#313131",
  },
};

const Button = ({
  colorTheme = "default",
  size = "medium",
  children,
  borderRadius,
  ...rest
}: ButtonProps) => {
  return (
    <S.Button
      colorTheme={colorTheme}
      size={size}
      borderRadius={borderRadius}
      {...rest}
    >
      {children}
    </S.Button>
  );
};

const S = {
  Button:
    styled.button <
    ButtonProps >
    `
    ${({ colorTheme = "default", size = "medium", borderRadius }) => css`
      width: 100%;
      padding: ${ButtonStyleOption.size[size]};
      background-color: ${ButtonStyleOption[colorTheme].backgroundColor};
      color: ${ButtonStyleOption[colorTheme].color};
      border-radius: ${borderRadius};
      font-weight: bold;
    `}
  `,
};

export default Button;
```

버튼은 앞서 구현했던 modal과 input과는 다르게 스타일링을 컴포넌트 내에서 해주고 있습니다. 프로젝트에는 비슷한 색상과, 크기를 가진 버튼이 많이 필요하기 때문에 이러한 스타일 코드를 줄이는 것을 우선으로 생각했습니다.

`ButtonHTMLAttributes<HTMLButtonElement>` 타입을 확장해서 button의 테마, 크기, radius, 속성 등을 정의하는 ButtonProps라는 타입을 정의했습니다. colorTheme는 프로젝트에 사용되는 버튼의 테마 이름을 받습니다. 프로젝트에는 많은 색상의 버튼이 필요하지 않기 때문에 4가지의 테마를 만들었습니다. size도 비슷한 크기의 버튼이 많이 필요하기 때문에 small, medium, large로 나누었습니다. radius는 마음대로 커스텀할 수 있도록 string으로 타입을 정의해주었습니다. ButtonStyleOption는 버튼의 스타일을 담은 객체입니다. 테마나 사이즈에 맞는 색상 코드, 크기를 정의해주었습니다. props에 따라 스타일이 정의됩니다.

# 맺으면서

구현하고 직접 사용하면서 왜 재사용성을 고려해서 컴포넌트를 만들어야 하는지 필요성을 체감하게 되었습니다. 컴포넌트를 만들고 직접 프로젝트에 적용하면서 코드가 굉장히 깔끔해졌습니다. 짐을 던 것 같은 가벼운 기분도 들었습니다. 처음엔 단순히 코드의 중복성을 줄이자는 목표로 시작했는데 코드를 파악하기 더 쉬워졌고, 개발 속도가 가속화되는 등 유지, 보수에 많은 장점이 있다는 것을 느꼈습니다.

<br>

**참고 문서**

[Effective Component 지속 가능한 성장과 컴포넌트](https://www.youtube.com/watch?v=fR8tsJ2r7Eg)

[컴포넌트 다시 생각하기](https://www.youtube.com/watch?v=HYgKBvLr49c)

[Headless UI Library란](https://jbee.io/react/headless-concept/)

[The Sexiness of Headless UI Components](https://www.joshbritz.co/posts/the-sexiness-of-headless-ui/)

[Effective Component 지속 가능한 성장과 컴포넌트](https://youtube.com/watch?v=fR8tsJ2r7Eg&si=EnSIkaIECMiOmarE)
