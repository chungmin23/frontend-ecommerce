# Shop API 문서

**Base URL**: `http://localhost:8080/api`

**Authentication**: JWT Bearer Token (로그인 후 발급)

---

## 📋 목차

1. [회원 관리 API](#회원-관리-api)
2. [상품 API](#상품-api)
3. [장바구니 API](#장바구니-api)
4. [쿠폰 API](#쿠폰-api)
5. [주문 API](#주문-api)
6. [결제 API](#결제-api)

---

## 회원 관리 API

### 1. 회원가입
**POST** `/member/join`

회원 계정을 생성합니다.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "사용자닉네임"
}
```

**Response (200 OK):**
```json
{
  "result": "SUCCESS",
  "email": "user@example.com"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "이미 사용 중인 이메일입니다."
}
```

**Required**: 없음 (비로그인)

---

### 2. 이메일 중복 체크
**GET** `/member/check-email?email=user@example.com`

이메일의 사용 가능 여부를 확인합니다.

**Query Parameters:**
- `email` (string, required): 확인할 이메일

**Response (200 OK):**
```json
{
  "available": true
}
```

**Required**: 없음 (비로그인)

---

## 상품 API

### 1. 상품 등록
**POST** `/products/`

새로운 상품을 등록합니다. (파일 업로드 포함)

**Request (multipart/form-data):**
- `pno` (number): 상품 ID
- `pname` (string): 상품명
- `pdesc` (string): 상품 설명
- `price` (number): 가격
- `files` (file[]): 상품 이미지 파일들

**Response (200 OK):**
```json
{
  "result": 1
}
```

**Required**: ROLE_ADMIN

---

### 2. 상품 목록 조회
**GET** `/products/list?page=1&size=10`

모든 상품을 페이지 단위로 조회합니다.

**Query Parameters:**
- `page` (number): 페이지 번호 (기본값: 1)
- `size` (number): 페이지당 항목 수 (기본값: 10)
- `type` (string): 검색 타입 (t: 제목, c: 내용, w: 작성자)
- `keyword` (string): 검색 키워드

**Response (200 OK):**
```json
{
  "dtoList": [
    {
      "pno": 1,
      "pname": "상품명",
      "pdesc": "상품 설명",
      "price": 50000,
      "uploadFileNames": ["image1.jpg"]
    }
  ],
  "pageNum": 1,
  "size": 10,
  "totalCount": 50,
  "totalPage": 5,
  "prev": false,
  "next": true,
  "start": 1,
  "end": 5
}
```

**Required**: 없음 (비로그인 가능)

---

### 3. 상품 상세 조회
**GET** `/products/{pno}`

특정 상품의 상세 정보를 조회합니다.

**Path Parameters:**
- `pno` (number, required): 상품 ID

**Response (200 OK):**
```json
{
  "pno": 1,
  "pname": "상품명",
  "pdesc": "상품 설명",
  "price": 50000,
  "uploadFileNames": ["image1.jpg"],
  "regDate": "2025-10-17T10:00:00",
  "modDate": "2025-10-17T10:00:00"
}
```

**Error (404 Not Found):**
상품이 존재하지 않음

**Required**: 없음 (비로그인 가능)

---

### 4. 상품 수정
**PUT** `/products/{pno}`

상품 정보를 수정합니다.

**Path Parameters:**
- `pno` (number, required): 상품 ID

**Request (multipart/form-data):**
- `pname` (string): 상품명
- `pdesc` (string): 상품 설명
- `price` (number): 가격
- `uploadFileNames` (string[]): 유지할 기존 파일명들
- `files` (file[]): 새로 추가할 이미지 파일들

**Response (200 OK):**
```json
{
  "RESULT": "SUCCESS"
}
```

**Required**: ROLE_ADMIN

---

### 5. 상품 삭제
**DELETE** `/products/{pno}`

상품을 삭제합니다. (연관된 파일도 함께 삭제)

**Path Parameters:**
- `pno` (number, required): 상품 ID

**Response (200 OK):**
```json
{
  "RESULT": "SUCCESS"
}
```

**Required**: ROLE_ADMIN

---

### 6. 상품 이미지 조회
**GET** `/products/view/{fileName}`

업로드된 상품 이미지를 다운로드합니다.

**Path Parameters:**
- `fileName` (string, required): 파일명

**Response**: 이미지 파일 (Resource)

**Required**: 없음 (비로그인 가능)

---

## 장바구니 API

### 1. 장바구니 항목 조회
**GET** `/cart/items`

현재 사용자의 장바구니 전체 항목을 조회합니다.

**Response (200 OK):**
```json
[
  {
    "cino": 1,
    "pid": 10,
    "pname": "상품명",
    "price": 50000,
    "qty": 2,
    "uploadFileNames": ["image.jpg"]
  }
]
```

**Required**: ROLE_USER

---

### 2. 장바구니 항목 추가/수정
**POST** `/cart/change`

장바구니에 상품을 추가하거나 수량을 수정합니다.

**Request Body:**
```json
{
  "email": "user@example.com",
  "pid": 10,
  "qty": 2
}
```

**Response (200 OK):**
```json
[
  {
    "cino": 1,
    "pid": 10,
    "pname": "상품명",
    "price": 50000,
    "qty": 2,
    "uploadFileNames": ["image.jpg"]
  }
]
```

**Required**: 본인 이메일 인증 필요

---

### 3. 장바구니 항목 삭제
**DELETE** `/cart/{cino}`

장바구니에서 특정 항목을 제거합니다.

**Path Parameters:**
- `cino` (number, required): 장바구니 항목 ID

**Response (200 OK):**
```json
[
  {
    "cino": 2,
    "pid": 11,
    "pname": "다른상품",
    "price": 30000,
    "qty": 1,
    "uploadFileNames": []
  }
]
```

**Required**: ROLE_USER

---

## 쿠폰 API

### 1. 쿠폰 생성
**POST** `/coupons/`

새로운 쿠폰을 생성합니다. (관리자 전용)

**Request Body:**
```json
{
  "couponCode": "SAVE50",
  "couponName": "50% 할인 쿠폰",
  "discountAmount": 50,
  "discountType": "PERCENT",
  "maxUsageCount": 1000,
  "minOrderAmount": 10000,
  "expiryDate": "2025-12-31T23:59:59"
}
```

**Response (200 OK):**
```json
{
  "couponId": 5
}
```

**Required**: ROLE_ADMIN

---

### 2. 활성 쿠폰 목록 조회
**GET** `/coupons/active`

현재 사용 가능한 쿠폰 목록을 조회합니다.

**Response (200 OK):**
```json
[
  {
    "couponId": 1,
    "couponCode": "SAVE50",
    "couponName": "50% 할인 쿠폰",
    "discountAmount": 50,
    "discountType": "PERCENT",
    "minOrderAmount": 10000,
    "expiryDate": "2025-12-31T23:59:59",
    "remainingCount": 500
  }
]
```

**Required**: 없음 (비로그인 가능)

---

### 3. 쿠폰 발급
**POST** `/coupons/issue/{couponCode}`

사용자 계정에 쿠폰을 발급합니다.

**Path Parameters:**
- `couponCode` (string, required): 쿠폰 코드

**Response (200 OK):**
```json
{
  "result": "SUCCESS"
}
```

**Error (400 Bad Request):**
- 쿠폰이 존재하지 않음
- 쿠폰이 만료됨
- 이미 발급받은 쿠폰

**Required**: ROLE_USER

---

### 4. 선착순 쿠폰 발급
**POST** `/coupons/issue-limited/{couponCode}`

재고 제한이 있는 선착순 쿠폰을 발급합니다.

**Path Parameters:**
- `couponCode` (string, required): 쿠폰 코드

**Response (200 OK):**
```json
{
  "result": "SUCCESS"
}
```

**Error (400 Bad Request):**
- 쿠폰 재고 부족

**Required**: ROLE_USER

---

### 5. 내 쿠폰 목록
**GET** `/coupons/my`

현재 사용자가 발급받은 쿠폰 목록을 조회합니다.

**Response (200 OK):**
```json
[
  {
    "memberCouponId": 1,
    "couponCode": "SAVE50",
    "couponName": "50% 할인 쿠폰",
    "discountAmount": 50,
    "discountType": "PERCENT",
    "usedYn": "N",
    "issuedDate": "2025-10-17T10:00:00",
    "expiryDate": "2025-12-31T23:59:59"
  }
]
```

**Required**: ROLE_USER

---

### 6. 주문 금액별 사용 가능 쿠폰
**GET** `/coupons/available?orderAmount=50000`

주문 금액에 사용 가능한 쿠폰 목록을 조회합니다.

**Query Parameters:**
- `orderAmount` (number, required): 주문 금액

**Response (200 OK):**
```json
[
  {
    "couponId": 1,
    "couponCode": "SAVE50",
    "couponName": "50% 할인 쿠폰",
    "discountAmount": 50,
    "minOrderAmount": 10000
  }
]
```

**Required**: ROLE_USER

---

### 7. 체크아웃용 사용 가능 쿠폰
**GET** `/coupons/checkout`

결제 페이지에서 사용 가능한 쿠폰 목록을 조회합니다.

**Response (200 OK):**
```json
[
  {
    "memberCouponId": 1,
    "couponCode": "SAVE50",
    "couponName": "50% 할인 쿠폰",
    "discountAmount": 50,
    "usedYn": "N"
  }
]
```

**Required**: ROLE_USER

---

## 주문 API

### 1. 주문 생성
**POST** `/orders/`

새로운 주문을 생성합니다.

**Request Body:**
```json
{
  "cartItems": [
    {
      "pid": 10,
      "qty": 2,
      "price": 50000
    }
  ],
  "deliveryDTO": {
    "receiverName": "배송수신자",
    "receiverPhone": "01012345678",
    "zipCode": "12345",
    "addr": "서울시 강남구",
    "addrDetail": "123-456"
  },
  "memberCouponId": 1,
  "paymentMethod": "CARD"
}
```

**Response (200 OK):**
```json
{
  "orderNumber": "ORD20251017123456",
  "result": "SUCCESS"
}
```

**Required**: ROLE_USER

---

### 2. 주문 상세 조회
**GET** `/orders/{ono}`

특정 주문의 상세 정보를 조회합니다.

**Path Parameters:**
- `ono` (number, required): 주문 ID

**Response (200 OK):**
```json
{
  "ono": 1,
  "orderNumber": "ORD20251017123456",
  "email": "user@example.com",
  "orderDate": "2025-10-17T10:00:00",
  "status": "PENDING",
  "totalPrice": 100000,
  "orderItems": [
    {
      "oino": 1,
      "pid": 10,
      "pname": "상품명",
      "price": 50000,
      "qty": 2
    }
  ],
  "delivery": {
    "receiverName": "배송수신자",
    "receiverPhone": "01012345678",
    "addr": "서울시 강남구 123-456"
  }
}
```

**Required**: ROLE_USER (본인 주문만 조회 가능)

---

### 3. 주문번호로 조회
**GET** `/orders/number/{orderNumber}`

주문번호로 주문 정보를 조회합니다.

**Path Parameters:**
- `orderNumber` (string, required): 주문번호

**Response (200 OK):**
상세 조회와 동일

**Required**: ROLE_USER (본인 주문만 조회 가능)

---

### 4. 내 주문 목록
**GET** `/orders/my?page=1&size=10`

현재 사용자의 주문 목록을 페이지 단위로 조회합니다.

**Query Parameters:**
- `page` (number): 페이지 번호 (기본값: 1)
- `size` (number): 페이지당 항목 수 (기본값: 10)

**Response (200 OK):**
```json
{
  "dtoList": [
    {
      "ono": 1,
      "orderNumber": "ORD20251017123456",
      "orderDate": "2025-10-17T10:00:00",
      "status": "PENDING",
      "totalPrice": 100000
    }
  ],
  "pageNum": 1,
  "size": 10,
  "totalCount": 25,
  "totalPage": 3,
  "prev": false,
  "next": true,
  "start": 1,
  "end": 3
}
```

**Required**: ROLE_USER

---

### 5. 주문 취소
**DELETE** `/orders/{ono}`

주문을 취소합니다. (결제가 있으면 자동으로 결제도 취소됨)

**Path Parameters:**
- `ono` (number, required): 주문 ID

**Response (200 OK):**
```json
{
  "result": "SUCCESS"
}
```

**Error (400 Bad Request):**
- 이미 배송된 주문은 취소 불가

**Required**: ROLE_USER (본인 주문만 취소 가능)

---

### 6. 주문 상태 변경
**PUT** `/orders/{ono}/status`

주문 상태를 변경합니다. (관리자 전용)

**Path Parameters:**
- `ono` (number, required): 주문 ID

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Response (200 OK):**
```json
{
  "result": "SUCCESS"
}
```

**Status 종류:**
- `PENDING`: 대기 중
- `CONFIRMED`: 확인됨
- `SHIPPED`: 배송 중
- `DELIVERED`: 배송 완료
- `CANCELLED`: 취소됨

**Required**: ROLE_ADMIN

---

## 결제 API

### 1. 결제 조회
**GET** `/payments/{paymentId}`

특정 결제 정보를 조회합니다.

**Path Parameters:**
- `paymentId` (number, required): 결제 ID

**Response (200 OK):**
```json
{
  "paymentId": 1,
  "orderNumber": "ORD20251017123456",
  "amount": 100000,
  "paymentMethod": "CARD",
  "paymentStatus": "COMPLETED",
  "paymentDate": "2025-10-17T10:05:00",
  "transactionId": "TXN123456789"
}
```

**Required**: ROLE_USER

---

### 2. 주문번호로 결제 조회
**GET** `/payments/order/{orderNumber}`

주문번호로 결제 정보를 조회합니다.

**Path Parameters:**
- `orderNumber` (string, required): 주문번호

**Response (200 OK):**
상세 조회와 동일

**Required**: ROLE_USER

---

### 3. 결제 취소
**POST** `/payments/cancel/{orderNumber}`

결제를 취소합니다. (환불 처리)

**Path Parameters:**
- `orderNumber` (string, required): 주문번호

**Request Body:**
```json
{
  "cancelReason": "고객 요청"
}
```

**Response (200 OK):**
```json
{
  "result": "SUCCESS"
}
```

**Required**: ROLE_USER (본인 결제만 취소 가능)

---

## 에러 응답

모든 API는 다음과 같은 형식의 에러 응답을 반환할 수 있습니다.

**401 Unauthorized:**
```json
{
  "error": "인증이 필요합니다.",
  "status": 401
}
```

**403 Forbidden:**
```json
{
  "error": "권한이 없습니다.",
  "status": 403
}
```

**404 Not Found:**
```json
{
  "error": "요청한 리소스를 찾을 수 없습니다.",
  "status": 404
}
```

**500 Internal Server Error:**
```json
{
  "error": "서버 오류가 발생했습니다.",
  "status": 500
}
```

---

## 인증

### JWT 토큰 발급 및 사용

1. **로그인 후 토큰 획득**
   - Authorization 헤더에 JWT 토큰 포함: `Authorization: Bearer {token}`

2. **모든 인증 필요한 요청에 헤더 포함**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 권한 종류

- **ROLE_USER**: 일반 사용자 (회원)
- **ROLE_ADMIN**: 관리자
- **없음**: 비로그인 가능

---

**마지막 업데이트**: 2025-10-17