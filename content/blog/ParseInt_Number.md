---
title: 숫자로 변환할 때 어떤 걸 쓰지? ParseInt vs Number
date: 2022-12-14
description: 상황에 맞게 쓰면 된다
tags: [JavaScript]
---

## 💡 ParseInt?

`parseInt(string, radix[optional])
`

ParseInt는 숫자로 변환할 수 있는 문자열을 전달 받아 정수로 변환해줍니다. 숫자로 변환할 수 없는 값을 전달 받으면 일부의 경우는 `NaN`를 반환하지만 주로 다음과 같이 변환합니다.

```javascript
parseInt("123abc"); // 123
```

즉, 숫자로 변환할 수 있는 문자열만 정수로 변환하는 것이죠. 그리고 parse**Int** 이기 때문에 소수점 이하는 버리고 값을 반환합니다.

parseInt와 Number의 또 다른 차이점은 parseInt는 radix로 변환한 정수를 반환한다는 것입니다. 이 때 **radix의 기본값은 10이 아니기 때문에** 주의해야 합니다. 생략 시 예기치 못한 상황이 발생할 수 있으니 radix의 값을 지정해주는 것을 추천합니다. ([mdn - 관련 예시](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/parseInt#%EC%84%A4%EB%AA%85))를 참고해보세요.

```Javascript
parseInt('1.234') // 1
parseInt(3) // 3
parseInt('0xF', 16) // 15
```

<br>

## 💡Number?

Number 함수는 숫자로 변환할 수 있는 값을 전달 받아 숫자 형태로 변환을 해줍니다. parseInt와는 다르게 소수점 이하의 값을 버리지 않고 그대로 숫자로 변환해줍니다. 숫자로 변환할 수 없는 값을 값이 포함하고 있을 때는 완전히 NaN를 반환합니다.

```javascript
Number("123abc"); // NaN
Number("123"); // 123
```

<br>

## 결론

Number과 ParseInt에는 차이점이 존재합니다. 이 차이점을 고려해서 상황에 맞게 사용하면 됩니다.

<br>

**참고 문서**

[mdn - parseInt](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/parseInt#%EC%84%A4%EB%AA%85)

[mdn - Number](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number)
