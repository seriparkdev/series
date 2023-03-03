---
title: Array.prototype.reduce에 대해서
date: 2022-12-25
description: 그동안 잘 사용하지 않았서 친해지고자 정리해보았습니다
tags: [JavaScript]
---

# reduce란?

`arr.reduce(callback[, initialValue])`

```javascript
array.reduce(function (accumulator, currentValue, currentIndex, array) {
  return accumulator + currentValue;
}, initialValue);
```

reduce 메서드는 호출한 배열의 모든 요소를 순회하면서 하나의 결과값을 구해야 하는 경우에 사용합니다.

reduce 메서드는 첫 번째 인수로 콜백 함수, 두 번째 인수로 초기값을 전달 받습니다. 콜백 함수는 다음과 같이 4개의 인수를 전달 받습니다.

- accumulator: 초기값 또는 콜백 함수의 이전 반환값

- currentValue: 처리할 현재 요소

- currentIndex: 처리할 현재 요소의 인덱스

- array: reduce 메서드를 호출한 배열 자체

reduce는 자신을 호출한 배열의 요소를 모두 순회하면서, 인수로 전달받은 콜백 함수를 반복 호출합니다. 그리고 콜백 함수의 반환값을 콜백 함수의 첫 번째 인수(accumulator)에 전달합니다. 이 과정에서 원본 배열이 변경되지 않습니다.

reduce 메서드의 콜백 함수는 배열의 length만큼 호출됩니다.

# 예제

```javascript
const sum = [1, 2, 3, 4].reduce(
  (accumulator, currentValue, index, array) => accumulator + currentValue,
  0
);

console.log(sum); // 10
```

여기서 콜백 함수는 4번 호출됩니다. 값의 변화를 지켜보면 이해하기가 더 쉽습니다.

**🚚 첫 번째 순회**

- accumulator: 0(초기값)

- currentValue: 1

- index: 0

- array: [1,2,3,4]

- 콜백 함수의 반환값: 1 (accumulator+currentValue)

**🚚 두 번째 순회**

- accumulator: 1(콜백 함수의 반환값이 들어옴)

- currentValue: 2

- index: 1

- array: [1,2,3,4]

- 콜백 함수의 반환값: 3 (accumulator+currentValue)

**🚚 세 번째 순회**

- accumulator: 3

- currentValue: 3

- index: 2

- array: [1,2,3,4]

- 콜백 함수의 반환값: 6 (accumulator+currentValue)

**🚚 네 번째 순회**

- accumulator: 6

- currentValue: 4

- index: 3

- array: [1,2,3,4]

- 콜백 함수의 반환값: 10 (accumulator+currentValue)

# 주의

reduce 메서드를 호출할 때 두 번째 인수로 항상 **초기값**을 전달해주는 것을 추천합니다. 빈 배열에서 초기값 없이 reduce를 실행하면 원하는 결과를 얻지 못할 수도 있어요.

초기값이 없으면 인덱스 1부터 콜백 함수를 실행하기 때문에 인덱스 0은 무시가 됩니다. 이러한 상황을 의도하지 않았다면 초기값을 제공해주세요. 초기값을 제공하면 인덱스 0에서 시작해서 원하는 결과를 얻을 수 있을 것입니다.

<br>

**참고 문서**

[mdn
](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

[모던 자바스크립트 Deep Dive](http://www.yes24.com/Product/Goods/92742567)
