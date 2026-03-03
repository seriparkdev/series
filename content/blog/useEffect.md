---
title: useEffect를 올바르게 사용하기
date: 2026-03-03
description: useEffect 사용 시 주의할 점
tags: [React]
---

## 들어가며

값이 바뀔 때 특정 코드를 실행하고 싶다거나, 데이터를 가공해서 다른 state에 저장하고 싶다거나, 부모 컴포넌트에 변경 사항을 알리고 싶을 때 `useEffect`를 사용하게 되는데, 이럴 경우 어느 순간부터 컴포넌트가 이상하게 동작하기 시작할 때가 있다.

분명히 값을 한 번만 바꿨는데 렌더링이 두세 번씩 일어나고, 화면에 표시되는 값이 예상과 다르게 나오고, 버그가 어디서 생겼는지 추적하려고 보면 코드는 흐름이 복잡해서 디버깅이 어려워진다.
Effect가 Effect를 부르고, 그 Effect가 또 다른 Effect를 부르는 연쇄 반응이 일어나기 십상이다.

이 모든 혼란의 출발점은 대부분 같다. **`useEffect`를 쓰면 안 되는 곳에 쓰고 있었기 때문이다.**

React 공식 문서에서는 `useEffect`는 React 패러다임에서 벗어나기 위한 '탈출구'이며, 외부 시스템과 컴포넌트를 동기화할 때 쓰라고 설계된 도구라고 정의하고 있다. 그리고 외부 시스템이 개입하지 않는 상황에서는 Effect가 필요하지 않다고 명시하고 있다.

이 글에서는 `useEffect`를 잘못 사용하는 대표적인 패턴 다섯 가지를 살펴보고 어떻게 `useEffect`를 올바르게 사용할 수 있는지에 대한 내용을 담았다.

## useEffect의 본질

`useEffect`의 역할을 먼저 제대로 짚고 이해하는 것이 중요하다.

> **`useEffect`는 React 컴포넌트를 외부 시스템과 동기화하기 위한 도구다.**

여기서 '외부 시스템'이라는 표현이 핵심이다. 브라우저 DOM을 직접 조작해야 한다거나, WebSocket 연결을 유지해야 한다거나, Google Maps 같은 서드파티 라이브러리를 초기화해야 한다거나, 네트워크 요청을 통해 서버와 데이터를 맞춰야 한다거나 이처럼 React가 직접 제어하지 않는 바깥 세계와 소통해야 할 때 `useEffect`가 등장한다.

React가 컴포넌트를 렌더링하는 방식을 생각해보면 이해가 쉽다. React는 기본적으로 state와 props를 받아 화면을 계산하는 순수한 계산 과정을 거친다. 렌더링 중에는 사이드 이펙트가 없어야 하는데, 현실에서는 렌더링 결과를 DOM에 반영한 뒤에 부가적으로 실행해야 할 작업들이 생긴다. 이를 위해 사용해야하는 것이 `useEffect`다.

즉, React 안에서 해결할 수 있는 것. 예를 들어, 기존 state나 props로 계산할 수 있는 값, 사용자 이벤트에 반응하는 동작, 다른 state를 조정하는 로직에는 `useEffect`가 필요하지 않다. 이를 간과하면 불필요한 렌더링, 추적하기 어려운 버그, 읽기 힘든 코드를 스스로 만들게 된다.

## useEffect를 잘못 사용한 케이스

### 렌더링 중에 계산할 수 있는 값을 state와 Effect로 저장하기

가장 흔하게 마주치는 패턴이다. 쇼핑몰 장바구니 화면을 생각해보자. 장바구니에 담긴 상품 목록(`cartItems`)과 쿠폰 할인율(`discountRate`)이 state로 있고, 이 두 값을 조합해서 최종 결제 금액(`totalPrice`)을 계산해 보여줘야 한다. 이때 이렇게 로직을 잘못 작성할 수 있다.

```jsx
// 🔴 나쁜 예
function CartSummary() {
  const [cartItems, setCartItems] = useState([]);
  const [discountRate, setDiscountRate] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // 굳이 state로 관리

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(subtotal * (1 - discountRate));
  }, [cartItems, discountRate]);

  return 결제 금액: {totalPrice.toLocaleString()}원;
}
```

`cartItems`나 `discountRate`가 바뀌면 Effect가 실행되고 `totalPrice`가 갱신되는 과정이 괜찮아 보일 수 있지만 이 코드에는 중요한 문제가 두 가지 있다.

첫 번째 문제는 성능이다. 사용자가 장바구니에 상품을 하나 추가한다고 해보자. React는 우선 컴포넌트를 렌더링한다. 이때 `totalPrice`는 아직 이전 값이다. 그 상태로 화면이 한 번 그려진다. 그 다음에 Effect가 실행되면서 `setTotalPrice`가 호출되고, React는 다시 렌더링한다. 즉, 불필요하게 렌더링이 두 번 일어난다. 오래된 금액으로 한 번, 업데이트된 금액으로 또 한 번. 사용자 눈에는 값이 순간적으로 잘못 표시되거나 깜빡이는 것처럼 보일 수 있다.

두 번째 문제는 코드 복잡성이다. 단순한 합계 계산일 뿐인데 state 변수가 하나 더 생기고, Effect가 하나 더 생기고, 이것들이 서로 동기화되어야 한다는 책임이 생긴다. 나중에 이 컴포넌트를 수정할 사람은 `totalPrice`가 언제 업데이트되는지를 머릿속에서 따라가야 한다.

해결책은 단순하다. `totalPrice`는 state가 아니라 렌더링 중에 계산되는 일반 변수로 두면 된다.

```jsx
// ✅ 좋은 예
function CartSummary() {
  const [cartItems, setCartItems] = useState([]);
  const [discountRate, setDiscountRate] = useState(0);

  // 렌더링 중에 그냥 계산한다. 추가 state도 Effect도 필요 없다.
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = subtotal * (1 - discountRate);

  return 결제 금액: {totalPrice.toLocaleString()}원;
}
```

`cartItems`나 `discountRate`가 바뀔 때마다 컴포넌트가 리렌더링되고, 그때 `totalPrice`도 자동으로 새로 계산된다. 렌더링은 한 번만 일어나고, 코드는 훨씬 짧아진다.

이렇게 **기존 props나 state에서 계산할 수 있는 값은 state에 저장하지 말고 렌더링 중에 계산해야 한다.** 이렇게 하면 동기화 문제도 없고, 불필요한 렌더링도 없고, 코드도 단순해진다.

만약 계산 비용이 클 경우 `useMemo`로 감싸서 의존값이 바뀔 때만 재계산하도록 캐싱할 수 있다.

```jsx
// ✅ 계산 비용이 크다면 useMemo로 캐싱
function ProductList({ products, category, priceRange, sortOrder }) {
  const [searchQuery, setSearchQuery] = useState("");

  // searchQuery가 바뀌어도 이 계산은 다시 실행되지 않는다
  const filteredProducts = useMemo(
    () =>
      getFilteredAndSortedProducts(products, category, priceRange, sortOrder),
    [products, category, priceRange, sortOrder],
  );

  // ...
}
```

`useMemo`로 감싼 함수는 `products`, `category`, `priceRange`, `sortOrder`가 바뀌지 않는 한 다시 실행되지 않는다. 검색어(`searchQuery`)처럼 관련 없는 state가 바뀌어도 불필요하게 재계산되지 않는다.

### 이벤트 핸들러에 넣어야 할 로직을 Effect에 넣기

이는 특정 조건이 됐을 때 뭔가 실행하고 싶다는 생각에서 `useEffect`를 사용하게 되는 케이스다.

예를 들어 쇼핑몰 상품 상세 페이지에 장바구니 담기 버튼이 있고, 버튼을 누르면 장바구니에 상품이 추가되면서 토스트 알림이 떠야 하는 경우가 있다. 이 때 아래와 같은 코드로 잘못 작성할 수가 있다.

```jsx
// 🔴 나쁜 예
function ProductDetail({ product, addToCart }) {
  useEffect(() => {
    if (product.isInCart) {
      showToast(`${product.name}이(가) 장바구니에 담겼습니다.`);
    }
  }, [product]);

  function handleAddToCartClick() {
    addToCart(product);
  }
}
```

이와 같은 경우 앱이 장바구니의 상태를 새로고침 시에도 기억하고 있다면, 새로고침을 할 때마다 장바구니에 상품이 담겼다는 토스트 메시지가 표출된다.
왜 이런 일이 벌어질까? Effect는 **컴포넌트가 화면에 표시되었을 때 무엇을 해야 하는지**에 대해 다루어야 한다. 반면 알림은 사용자가 버튼을 눌렀을 때 나타나야 한다.

어떤 코드를 Effect에 넣어야 하는지 헷갈릴 때, 이 코드는 컴포넌트가 표시되었기 때문에 실행되는지, 아니면 사용자가 특정 행동을 했기 때문에 실행되는지 생각해보면 좋다. 전자의 경우에는 Effect, 후자라면 이벤트 핸들러다.

알림은 분명히 사용자의 행동에 따라 나타나야 하기 때문에 이벤트 핸들러로 옮겨야 한다.

```jsx
// ✅ 좋은 예
function ProductDetail({ product, addToCart }) {
  // 두 버튼에서 공통으로 쓰는 로직은 함수로 묶으면 된다
  function addProductToCart() {
    addToCart(product);
    showToast(`${product.name}이(가) 장바구니에 담겼습니다.`);
  }

  function handleAddToCartClick() {
    addProductToCart();
  }

  function handleBuyNowClick() {
    addProductToCart();
    navigateTo("/checkout");
  }
}
```

코드가 더 짧아졌고, 버그도 사라졌다. 알림은 이제 사용자가 버튼을 눌렀을 때만 뜬다. 페이지를 새로 고침해도, 컴포넌트가 다시 마운트되어도 알림은 나타나지 않는다.

### Effect가 Effect를 트리거하는 체이닝

이 패턴은 처음에 논리적으로 보이기 때문에 특히 위험하다. 상태 A가 바뀌면 B가 바뀌고, B가 바뀌면 C가 바뀌는 연쇄 관계를 각각의 Effect로 표현하는 것이다.

예를 들어 사용자가 쿠폰을 선택하면 할인 금액이 계산되고, 할인 금액에 따라 결제 수단 옵션이 바뀌고, 결제 수단이 바뀌면 최종 결제 정보가 업데이트 될 때 이 흐름을 Effect 체인으로 작성하면 이렇게 된다.

```jsx
// 🔴 나쁜 예
function CheckoutPage({ cartItems }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [availablePayments, setAvailablePayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [finalOrderInfo, setFinalOrderInfo] = useState(null);

  // 쿠폰이 바뀌면 할인 금액을 계산
  useEffect(() => {
    if (selectedCoupon) {
      setDiscountAmount(calculateDiscount(cartItems, selectedCoupon));
    } else {
      setDiscountAmount(0);
    }
  }, [selectedCoupon, cartItems]);

  // 할인 금액이 바뀌면 사용 가능한 결제 수단을 업데이트
  useEffect(() => {
    const totalAfterDiscount = getTotal(cartItems) - discountAmount;
    setAvailablePayments(getAvailablePayments(totalAfterDiscount));
  }, [discountAmount, cartItems]);

  // 결제 수단이 바뀌면 최종 주문 정보를 구성
  useEffect(() => {
    if (selectedPayment) {
      setFinalOrderInfo(
        buildOrderInfo(cartItems, discountAmount, selectedPayment),
      );
    }
  }, [selectedPayment, discountAmount, cartItems]);
}
```

로직 자체는 맞다. 그런데 사용자가 쿠폰을 선택했을 때 내부에서 어떤 일이 일어나는지 생각해보자. `setSelectedCoupon` → 렌더링 → `setDiscountAmount` → 렌더링 → `setAvailablePayments` → 렌더링. 쿠폰 하나를 선택하는 동작에 렌더링이 세 번 연속으로 일어난다.

성능 문제만 있는 게 아니다. 나중에 이미 선택한 쿠폰이 사라졌을 때 자동으로 최적의 쿠폰으로 재선택해주는 기능을 넣어야 한다는 요구사항이 생겼다고 해보자. `selectedCoupon`을 바꾸는 순간 Effect 체인이 전부 다시 실행되고, 의도하지 않은 state 변경이 줄줄이 따라온다. 체인이 길수록 새 요구사항을 추가하거나 기존 로직을 수정하기가 점점 어려워진다.

해결책은 쿠폰을 선택하는 이벤트 하나에서 필요한 모든 값을 한 번에 계산하고, 렌더링 중에 계산할 수 있는 것은 state에서 제거하는 것이다.

```jsx
// ✅ 좋은 예
function CheckoutPage({ cartItems }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // discountAmount, availablePayments, finalOrderInfo는
  // state가 아니라 렌더링 중에 계산한다
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = selectedCoupon
    ? calculateDiscount(cartItems, selectedCoupon)
    : 0;
  const totalAfterDiscount = totalPrice - discountAmount;
  const availablePayments = getAvailablePayments(totalAfterDiscount);
  const finalOrderInfo = selectedPayment
    ? buildOrderInfo(cartItems, discountAmount, selectedPayment)
    : null;

  function handleCouponSelect(coupon) {
    setSelectedCoupon(coupon);
    // 쿠폰이 바뀌면 선택된 결제 수단도 초기화
    setSelectedPayment(null);
  }

  function handlePaymentSelect(payment) {
    setSelectedPayment(payment);
  }
}
```

이제 state는 딱 두 개다. 사용자가 선택한 쿠폰과 결제 수단. 나머지는 전부 렌더링 중에 계산된다. 쿠폰을 선택해도 렌더링은 딱 한 번만 일어나고, 모든 값은 그 렌더링 안에서 최신 상태로 한꺼번에 계산된다. 코드도 훨씬 읽기 쉽다.

### 자식 컴포넌트에서 Effect로 부모에게 데이터를 올려보내기

React의 데이터 흐름은 단방향이다. 부모에서 자식으로, 위에서 아래로 흐른다. 이 원칙이 있기 때문에 버그가 생겼을 때 "이 값이 어디서 왔을까?"를 컴포넌트 트리를 따라 위로 올라가며 추적할 수 있다.

그런데 가끔 이 흐름을 역행하는 코드를 만나게 된다. 자식 컴포넌트가 데이터를 가져온 뒤 Effect를 통해 부모 컴포넌트의 state를 업데이트하는 패턴이다.

쇼핑몰 주문 내역 페이지를 생각해보자. 부모 컴포넌트가 전체 레이아웃을 담당하고, 자식 컴포넌트가 주문 목록 데이터를 가져와서 부모에게 올려보내는 구조다.

```jsx
// 🔴 나쁜 예
function OrderHistoryPage() {
  const [orders, setOrders] = useState(null);

  return (
    <div>
      <h1>주문 내역</h1>
      {/* 자식이 데이터를 가져와서 부모에게 전달 */}
      <OrderList onFetched={setOrders} />
      {orders && <OrderSummary orders={orders} />}
    </div>
  );
}

function OrderList({ onFetched }) {
  const orders = useFetchOrders(); // 주문 목록을 가져오는 커스텀 훅

  useEffect(() => {
    if (orders) {
      onFetched(orders); // 자식이 부모의 state를 건드린다
    }
  }, [onFetched, orders]);

  return (
    <ul>
      {orders?.map((order) => (
        <li key={order.id}>{order.name}</li>
      ))}
    </ul>
  );
}
```

이 코드의 문제는 데이터의 '진실의 출처(source of truth)'가 불분명해진다는 것이다. `OrderSummary`에 잘못된 데이터가 표시되고 있을 때, `orders`가 어디서 왔는지 추적하려면 `OrderHistoryPage`를 보고, `OrderList`를 보고, 그 안의 Effect까지 들어가야 한다. 컴포넌트가 여러 겹으로 중첩되고 이런 패턴이 여러 곳에 퍼지면 디버깅은 기하급수적으로 어려워진다.

더 나아가 이 구조는 React의 단방향 데이터 흐름 원칙을 깨뜨린다. 코드를 처음 보는 사람이라면 "왜 자식이 부모의 state setter를 받아서 Effect 안에서 호출하지?"라는 의문을 품게 된다.

해결책은 **데이터를 어디서 가져올지의 결정권을 부모가 갖는 것**이다.

```jsx
// ✅ 좋은 예
function OrderHistoryPage() {
  // 부모가 직접 데이터를 가져온다
  const orders = useFetchOrders();

  return (
    <div>
      <h1>주문 내역</h1>
      {/* 데이터를 자식에게 내려보낸다 */}
      <OrderList orders={orders} />
      {orders && <OrderSummary orders={orders} />}
    </div>
  );
}

function OrderList({ orders }) {
  // props로 받아서 표시한다. 단순하다.
  return (
    <ul>
      {orders?.map((order) => (
        <li key={order.id}>{order.name}</li>
      ))}
    </ul>
  );
}
```

이제 데이터는 부모에서 자식으로 흐른다. 화면에 뭔가 잘못됐을 때 `OrderHistoryPage`를 보면 된다. 데이터 흐름이 선명해지고, 버그 추적도 쉬워진다.

### 경쟁 조건(Race Condition)을 처리하지 않은 채로 데이터 페칭하기

데이터 페칭 자체는 Effect를 써야 하는 정당한 케이스다. 컴포넌트가 화면에 표시되는 동안 서버의 최신 데이터와 동기화하는 것은 Effect의 전형적인 사용 사례다. 문제는 클린업 로직 없이 구현했을 때 발생한다.

쇼핑몰 상품 목록 페이지를 생각해보자. 카테고리 탭이 있고, 탭을 클릭하면 해당 카테고리의 상품을 서버에서 가져온다.

```jsx
// 🔴 나쁜 예 — 응답이 어떤 순서로 올지 보장할 수 없다
function ProductListPage({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProductsByCategory(category).then((data) => {
      setProducts(data); // 어떤 응답이 마지막으로 올지 모른다
    });
  }, [category]);
}
```

사용자가 탭을 빠르게 전환한다고 해보자. "여성의류" → "남성의류" → "신발" 순서로 클릭하면 세 번의 API 요청이 나간다. 이상적으로는 마지막으로 선택한 "신발" 카테고리의 상품이 표시되어야 한다. 그런데 네트워크 지연 때문에 "남성의류" 요청의 응답이 "신발" 요청의 응답보다 늦게 도착할 수 있다. 그러면 사용자는 "신발" 탭을 보고 있는데 "남성의류" 상품이 표시되는 황당한 상황이 생긴다.

이를 **경쟁 조건(Race Condition)** 이라고 한다. 여러 비동기 작업이 서로 경쟁하면서 예상치 못한 순서로 완료되는 현상이다. 이 버그는 로컬 환경에서는 잘 드러나지 않다가 (네트워크가 빨라서 순서대로 오는 경우가 많음), 실제 사용자 환경에서 간헐적으로 발생하기 때문에 발견하고 원인을 파악하기가 까다롭다.

해결책은 클린업 함수에서 이전 요청의 응답을 무시하도록 하는 것이다.

```jsx
// ✅ 좋은 예 — 마지막 요청의 결과만 반영된다
function ProductListPage({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let ignore = false;

    fetchProductsByCategory(category).then((data) => {
      if (!ignore) {
        // ignore가 true라면 이 응답은 오래된 것이므로 무시한다
        setProducts(data);
      }
    });

    return () => {
      // category가 바뀌어 다음 Effect가 실행되기 직전에 호출된다
      ignore = true;
    };
  }, [category]);
}
```

`category`가 바뀌면 React는 이전 Effect의 클린업 함수를 먼저 실행한다. 클린업 함수가 `ignore = true`로 설정하기 때문에, 이전 요청의 응답이 뒤늦게 도착하더라도 `setProducts`가 호출되지 않는다. 화면에는 항상 마지막으로 선택한 카테고리의 상품만 표시된다.

Effect에서 데이터를 페칭할 때는 이 패턴을 적용하는 습관을 들이는 것이 좋다.

## ✅ 그럼 useEffect는 언제 써야 할까?

`useEffect`가 진짜 필요한 상황은 분명히 있다. 다만 그 상황이 생각보다 좁다는 것을 인식하는 게 중요하다.

`useEffect`를 쓰는 것이 적절한 경우에 대해 예를 들어보자면 다음과 같다.

**외부 연결이나 구독이 필요할 때**
실시간 재고 현황을 WebSocket으로 받아야 하거나, Firebase로 주문 상태 변경을 구독해야 하는 경우처럼 컴포넌트가 마운트되는 동안 외부 연결을 유지해야 할 때가 여기에 해당한다. 이때는 반드시 클린업 함수에서 연결을 끊어야 한다.

**서드파티 라이브러리를 초기화할 때**
지도, 차트, 슬라이더처럼 DOM에 직접 인스턴스를 만드는 라이브러리는 React의 렌더링 사이클 밖에 있기 때문에 Effect에서 다뤄야 한다.

**컴포넌트가 화면에 표시될 때 서버 데이터와 동기화해야 할 때**
카테고리별 상품 목록, 사용자 주문 내역처럼 화면이 보이는 동안 최신 데이터를 보여줘야 한다면 Effect가 적절하다.

**페이지 방문, 상품 클릭 같은 행동 분석 이벤트를 로깅할 때**
컴포넌트가 표시되었기 때문에 실행되는 것이기 때문에 Effect가 필요하다.

## 마무리

`useEffect`는 React에서 없어서는 안 될 훅이다. 그런데 동시에 가장 많이 오용되는 훅이기도 하다. 왜냐하면 값이 바뀔 때 뭔가를 실행하고 싶은 경우 `useEffect`를 사용해야 한다고 잘못 인식할 때가 많기 때문이다. 그리고 대부분의 경우 당장은 동작하기 때문에 문제를 인식하지 못한 채 그 패턴을 계속 반복하게 된다.

하지만 Effect를 남발할수록 코드는 점점 이해하기 어려워진다. 어떤 순서로 어떤 Effect가 실행되는지 머릿속에서 시뮬레이션해야 하고, 불필요한 렌더링이 쌓이고, 버그가 생겼을 때 원인을 찾기도 어렵다.

**렌더링 중에 계산할 수 있는 건 렌더링 중에 계산**하고, **사용자의 행동으로 인한 건 이벤트 핸들러에서 처리**하고, **외부 시스템과 동기화할 때만 Effect를 쓴다**는 인식을 가지고 있다면 용도에 맞게 사용할 수 있을 것이다.
