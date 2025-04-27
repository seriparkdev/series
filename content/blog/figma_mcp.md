---
title: Figma MCP로 디자인 구현 시간 단축하기
date: 2025-04-27
description: 디자인을 코드로 빠르게 변환하는 새로운 방법
tags: [MCP]
---
# MCP(Model Context Protocol)

![](https://velog.velcdn.com/images/parkseridev/post/e27b86ec-48b9-463f-a951-6b0a9a16df7e/image.png)


MCP(Model Context Protocol)는 2024년 11월 공개한 오픈소스 프로토콜로, **애플리케이션이 LLM에 컨텍스트를 제공하는 방식을 표준화하는 개방형 프로토콜**이다.


## LLM에 컨텍스트를 제공할 때의 문제점
구체적으로 어떤 걸 표준화하는 걸까? LLM은 방대한 데이터를 학습하지만 이로써도 한계가 있기 때문에 학습 범위 밖의 정보가 필요할 때는 외부의 도움을 받아야 한다.

예를 들어, LLM은 날씨에 관한 질문을 받으면 자체적으로 처리하지 못하기에 날씨 API에 접근해 최신 정보를 가져온 후 응답을 생성한다. 이렇게 LLM은 콘텐츠 저장소, 데이터 소스와 같은 외부 시스템과 상호작용함으로써 추론 정확도와 문제 해결력을 향상시켰다.

그러나, 각각의 데이터 소스에 접근을 하고 상호작용을 하는 방식이 모두 달랐기 때문에 이를 연결하는 과정이 복잡했다. **인증 체계, 데이터 요청 방식 등 서로서로 다르기 때문에 각각의 요구 사항에 맞춰 개별적인 통합 코드를 작성해야 했다.** 이는 개발자들에게 큰 부담이 되었고, 시스템 확장성에도 제약을 가져왔다.

## MCP: 표준화된 해결책
![](https://velog.velcdn.com/images/parkseridev/post/89a1562b-2086-4af8-9e49-ebb5817fc540/image.png)

바로 이러한 문제를 해결하기 위해 등장한 것이 MCP다. MCP는 LLM에 필요한 컨텍스트를 제공하기 위해 외부 시스템에 연결하기 위한 방법들을 통일하여 표준화된 방법을 제공한다.

공식 문서에서 MCP를 USB-C에 비유를 하고 있는데 USB-C가 다양한 전자기기를 표준화된 방식으로 연결하여 복잡한 케이블 문제를 해결했듯이, MCP도 다양한 외부 시스템과 LLM을 표준화된 프로토콜로 연결함으로써 이전의 복잡하고 파편화된 통합 방식 문제를 해결하고 있다.


## 핵심적인 기본 구조
![](https://velog.velcdn.com/images/parkseridev/post/760b074c-5617-46a2-806f-6a2bbff30479/image.webp)

MCP는 Host, Client, Server라는 세 개의 주요 컴포넌트로 구성된다. 각각의 역할이 무엇이고 어떻게 상호작용 하는지 알아보자.

### MCP Host
MCP Host는 MCP를 통해 외부 시스템과 연결하려는 Claude Desktop, IDE, AI 도구 같은 프로그램으로 LLM이 실행되는 환경이다.  Host는 사용자 인터페이스를 제공하고 사용자 입력을 LLM에 전달하며, LLM의 응답을 사용자에게 표시한다. MCP 클라이언트를 앱에 통합하여 MCP 서버에서 제공하는 도구를 사용해 LLM의 기능을 확장한다.

### MCP Client
MCP Client는 Host와 Server 사이의 중간 다리 역할을 하며, 표준화된 프로토콜을 통해 서버와 통신한다. Client는 `tools/list`와 같은 엔드포인트를 통해 서버로부터 도구 목록을 가져와 LLM에 제공하고, LLM이 도구를 사용하려 할 때 `tools/call` 엔드포인트를 통해 해당 요청을 적절한 서버로 라우팅한다. 또한 서버로부터 받은 결과를 LLM이 이해할 수 있는 형식으로 변환하여 전달하고, 오류 처리 및 재시도 메커니즘을 제공한다.


### MCP Server
MCP Server는 LLM이 사용할 수 있는 도구와 데이터 액세스 기능을 제공한다. 서버는 외부 시스템, API, 데이터베이스 등과의 통합을 처리하고, 도구 목록을 제공하며 도구 실행 요청을 처리한다. 또한 인증, 권한 부여, 속도 제한 등의 보안 기능을 제공하고, 로컬 환경이나 클라우드에 배포될 수 있다.

이렇게 세 구성 요소가 상호작용을 함으로써 LLM이 단순한 텍스트 생성 외에도 계산, 데이터 검색, 외부 시스템과의 상호작용 등 다양한 기능을 수행할 수 있게 하여 LLM의 능력을 크게 확장시킨다.


# Figma MCP
Figma MCP는 AI 코딩 에이전트에 Figma 레이아웃 정보를 제공하는 MCP 서버다. 에이전트에게 Figma 데이터에 대한 접근 권한을 부여하여 단시간에 디자인을 빠르게 구현할 수가 있다.

MCP 서버가 개발되기 이전에는 디자인을 스크린샷으로 찍어 에이전트에게 제공해 초기 UI 구조를 잡는 방식으로 생산성을 높였었는데 정확도가 많이 낮았다. Figma는 그에 비해 정확도가 높기에 훨씬 더 생산성 있게 디자인을 완성할 수 있다.

Figma MCP는 Figma API에서 받은 데이터를 단순화하고 변환하여 가장 관련성 높은 레이아웃과 스타일 정보만 모델에게 제공하기에 응답의 정확도가 높아진다. 이 과정에서 데이터를 약 90%까지 압축하여 응답의 정확도를 향상시킨다. 현재 시점에서 Cline, Cursor, Windsurf와 호환 가능하다.


## 사용법
사용법은 Cursor 기준이다.

1. 먼저 Figma에서 Access Token을 발급 받기 위해 왼쪽 상단에 있는 Figma 아이콘을 클릭하고 `Help and account` > `Account settings`를 클릭한다.
   ![](https://velog.velcdn.com/images/parkseridev/post/bf550774-78ef-448f-9576-4217396676e5/image.png)

2. `Security` 탭에서 `Generate new token`을 클릭한다.
   ![](https://velog.velcdn.com/images/parkseridev/post/993803eb-a9e4-4f5f-ab90-bad598855de3/image.jpeg)

3. `File content` 와 `Dev resources`에서 읽기 권한을  허용해야 한다.
   ![](https://velog.velcdn.com/images/parkseridev/post/0eb62119-3e13-4e09-bb5c-0fe7003e7e19/image.jpeg)

4. `Cursor Setting`의 MCP 메뉴에서 `Add new global MCP server`를 클릭한다.

![](https://velog.velcdn.com/images/parkseridev/post/dff9e33e-54b4-4f20-9e3c-a6400669a2e0/image.jpeg)

5. Figma MCP 서버를 추가하기 위해 `mcp.json`을 다음과 같이 구성한다.

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```
6. 다음과 같이 초록불이 들어오면 정상적으로 서버가 추가된 것이다. `Tools`에서 Figma MCP가 제공하는 도구들도 확인할 수 있다.
   ![](https://velog.velcdn.com/images/parkseridev/post/b9a6986a-e9dd-48f6-923b-f081536e6dd4/image.jpeg)
7. 다시 Figma로 돌아가 원하는 프레임을 선택한 후 오른쪽 마우스를 클릭한 뒤 뜨는 창에서 `Copy as` > `Copy link to selection`을 클릭하여 프레임의 링크를 복사한다. 컨텍스트가 작을 수록 정확도가 높아지니 프레임 단위나 그룹 단위로 링크를 생성하는 게 좋다.

![](https://velog.velcdn.com/images/parkseridev/post/bb77c23e-e3d6-4de2-ac36-c516ac344654/image.png)

8. 링크를 프롬프트에 입력하는데 정확도를 위해 `React, Tailwind로 구현해줘`와 같이 추가적인 리소스를 제공하면 원하는 결과물을 생성할 수 있다.
   ![](https://velog.velcdn.com/images/parkseridev/post/2818c0d2-6844-4246-a497-be48a37e904c/image.jpeg)
9. 답변을 생성하며 요청 처리에 필요한 도구들을 실행할 수 있는 UI가 뜬다. `get_figma_data`는 Figma에서 디자인과 관련된 세부 정보를 가져오기 위해 Figma MCP에서 제공하는 도구다. `download_figma_images`는 Figma에서 이미지와 아이콘 같은 리소스를 다운로드 하는 도구다. 이를 각각 `Run tools` 버튼을 클릭해 실행해준다.
   ![](https://velog.velcdn.com/images/parkseridev/post/5f632170-2150-48bf-9f72-9f2f9b4f2286/image.png)

## 코드 생성 결과
Figma MCP를 통해 생성된 결과물은 다음과 같다. 디자인과 약간의 차이가 있지만, 기본적인 UI 구조와 레이아웃이 상당히 정확하게 구현되었다. 컴포넌트가 복잡할 수록 구현의 완성도는 떨어지는 것 같게 보이지만, 구조 자체는 완성도가 높고 spacing, font 관련 작업도 잘 해주었기에 간단한 수정만으로 디자인을 완성할 수 있을 것 같다.

이미지와 아이콘 같은 에셋 관련 처리는 아직 미흡한 것 같아서 결국 직접 import 작업이 필요할 것 같다. 요구사항과 조금 다르게 아이콘을 가져오는 것 같다.
![](https://velog.velcdn.com/images/parkseridev/post/0f428e80-9e06-4623-8c34-65909116d944/image.jpeg)

LLM이 생성한 코드는 예상보다는 완성도가 높은 편이었다. 단순하게 마크업 정도만 해주지 않을까 싶었는데 닉네임 유효성 검사와 같은 로직까지 자동으로 구현해주었다.

몇 가지 아쉬운 점은 있지만 약간의 스타일 조정과 아이콘 작업만 추가한다면 실제 사용 가능한 수준의 UI 코드를 생성해줘서 추후에도 UI 개발할 때 유용하게 사용해볼 수 있을 것 같다.

```tsx
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProfileEditFormProps {
   className?: string;
}

export default function ProfileEditForm({ className }: ProfileEditFormProps) {
   const [nickname, setNickname] = useState<string>('아이오닉');

   // Form validation state
   const [isMinLengthValid, setIsMinLengthValid] = useState<boolean>(true);
   const [isMaxLengthValid, setIsMaxLengthValid] = useState<boolean>(true);
   const [hasSpecialChars, setHasSpecialChars] = useState<boolean>(false);

   const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNickname(value);

      // Validation checks
      setIsMinLengthValid(value.length >= 2);
      setIsMaxLengthValid(value.length <= 20);
      setHasSpecialChars(/[!@#$%^&*(),.?":{}|<>]/.test(value));
   };

   return (
           <div
                   className={twMerge('flex flex-col h-full bg-[#F8FBFF] w-full', className)}
           >
              {/* Status Bar */}
              <div className="w-full h-[45px]">
                 {/* Status bar content would go here */}
              </div>

              {/* Header with subtitle styling */}
              <div className="w-full h-[50px] flex items-center border-b border-slate-300 bg-white">
                 <div className="flex items-center w-full px-5">
                    <button className="mr-4">
                       <svg
                               width="24"
                               height="24"
                               viewBox="0 0 24 24"
                               fill="none"
                               xmlns="http://www.w3.org/2000/svg"
                       >
                          <path
                                  d="M15 19L8 12L15 5"
                                  stroke="#171717"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                          />
                       </svg>
                    </button>
                    <h1 className="subtitle2_medium text-center absolute left-1/2 -translate-x-1/2">
                       프로필 수정
                    </h1>
                 </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-col items-center px-5 pt-8 pb-4 relative flex-1">
                 {/* Profile Avatar */}
                 <div className="relative mb-6">
                    <div className="w-[80px] h-[80px] rounded-full bg-slate-300 flex items-center justify-center">
                       {/* 아이콘 관련 코드 생략 */}
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1E5280] flex items-center justify-center">
                       {/* 아이콘 관련 코드 생략 */}
                    </button>
                 </div>

                 {/* Email and Birth/Gender */}
                 <div className="flex flex-col items-center gap-0.5 mb-6">
                    <p className="text-base text-[#171717] opacity-60 font-medium">
                       evPedialive@gmail.com
                    </p>
                    <p className="text-sm text-[#171717] opacity-60">남성 / 1990-0101</p>
                 </div>

                 {/* Nickname Display */}
                 <div className="text-lg font-semibold text-[#171717] mb-6">
                    {nickname}
                 </div>

                 {/* Text Input Field */}
                 <div className="w-full max-w-[350px] h-14 px-5 py-[15px] border border-[#CBD5E1] rounded-lg mb-4 flex justify-between items-center bg-white">
                    <input
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            placeholder="닉네임을 입력하세요"
                            className="w-full bg-transparent outline-none text-base font-medium placeholder:text-[#171717] placeholder:opacity-50"
                    />
                    <span className="text-sm font-medium text-[#1C1917] opacity-60">
            {nickname.length}/20
          </span>
                 </div>

                 {/* Validation Messages */}
                 <div className="w-full max-w-[308px] flex flex-col items-end gap-1.5 mb-6 opacity-40">
                    {/* Min Length Check */}
                    <div className="w-full flex items-center gap-1.5">
                       <div className="w-5 h-5 flex items-center justify-center">
                          {isMinLengthValid ? (
                                  // 아이콘 관련 코드 생략
                          )}
                       </div>
                       <p className="text-sm font-medium text-[#171717]">
                          2 글자 이상이에요.
                       </p>
                    </div>

                    {/* Max Length Check */}
                    <div className="w-full flex items-center gap-1.5">
                       <div className="w-5 h-5 flex items-center justify-center">
                          {isMaxLengthValid ? (
                                  // 아이콘 관련 코드 생략
                          )}
                       </div>
                       <p className="text-sm font-medium text-[#171717]">
                          최대글자 20자를 넘지 않아요.
                       </p>
                    </div>

                    {/* Special Characters Check */}
                    <div className="w-full flex items-center gap-1.5">
                       <div className="w-5 h-5 flex items-center justify-center">
                          {!hasSpecialChars ? (
                                  // 아이콘 관련 코드 생략
                          )}
                       </div>
                       <p className="text-sm font-medium text-[#171717]">
                          특수문자가 들어갔어요 ex). !@#*^
                       </p>
                    </div>
                 </div>
              </div>

              {/* Bottom Actions */}
              <div className="w-full mt-auto">
                 <div className="py-2 px-5 flex justify-center bg-[#F8FBFF]">
                    <button
                            className="w-full max-w-[350px] py-4 rounded-lg bg-[#E2E8F0] flex justify-center"
                            disabled={!isMinLengthValid || !isMaxLengthValid || hasSpecialChars}
                    >
            <span className="text-[17px] font-semibold text-[#94A3B8]">
              저장
            </span>
                    </button>
                 </div>

                 {/* Home Bar */}
                 <div className="flex justify-center items-center h-[35px] w-full bg-[#F8FBFF]">
                    <div className="w-[134px] h-[5px] bg-[#171717] rounded-full opacity-20"></div>
                 </div>
              </div>
           </div>
   );
}
```



