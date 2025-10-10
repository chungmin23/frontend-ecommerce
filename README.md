# E-commerce Frontend

이 프로젝트는 Spring Boot 기반 E-commerce API를 위한 React 프론트엔드 애플리케이션입니다.

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS

## 기능

### 상품 관리
- 상품 목록 조회 (페이징)
- 상품 상세 조회
- 상품 이미지 표시

### 장바구니
- 장바구니에 상품 추가
- 장바구니 목록 조회
- 수량 변경
- 상품 삭제

### 주문
- 주문 생성
- 주문 목록 조회
- 주문 상세 조회
- 주문 취소
- 배송 정보 입력

### 쿠폰
- 활성 쿠폰 목록 조회
- 쿠폰 발급
- 내 쿠폰 목록 조회
- 주문 시 쿠폰 적용

### 결제
- 결제 정보 조회
- 결제 취소

## 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

개발 서버가 [http://localhost:5173](http://localhost:5173)에서 실행됩니다.

### 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

## API 설정

기본 API 주소는 `http://localhost:8080/api`로 설정되어 있습니다.

다른 주소를 사용하려면 [src/api/axios.js](src/api/axios.js)의 `API_BASE_URL`을 수정하세요.

## 프로젝트 구조

```
src/
├── api/                 # API 통신 레이어
│   ├── axios.js        # Axios 인스턴스 설정
│   ├── productApi.js   # 상품 API
│   ├── cartApi.js      # 장바구니 API
│   ├── orderApi.js     # 주문 API
│   ├── couponApi.js    # 쿠폰 API
│   └── paymentApi.js   # 결제 API
├── components/          # React 컴포넌트
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Order.jsx
│   ├── OrderList.jsx
│   ├── OrderDetail.jsx
│   └── CouponList.jsx
├── App.jsx             # 메인 앱 컴포넌트
└── App.css             # 스타일시트
```

## API 엔드포인트

### 상품 (Products)
- `GET /api/products/list` - 상품 목록 조회
- `GET /api/products/{pno}` - 상품 상세 조회
- `POST /api/products/` - 상품 등록 (관리자)
- `PUT /api/products/{pno}` - 상품 수정 (관리자)
- `DELETE /api/products/{pno}` - 상품 삭제 (관리자)

### 장바구니 (Cart)
- `GET /api/cart/items` - 장바구니 목록 조회
- `POST /api/cart/change` - 장바구니 아이템 추가/수정
- `DELETE /api/cart/{cino}` - 장바구니 아이템 삭제

### 주문 (Orders)
- `POST /api/orders/` - 주문 생성
- `GET /api/orders/{ono}` - 주문 상세 조회
- `GET /api/orders/number/{orderNumber}` - 주문번호로 조회
- `GET /api/orders/my` - 내 주문 목록 조회
- `DELETE /api/orders/{ono}` - 주문 취소
- `PUT /api/orders/{ono}/status` - 주문 상태 변경 (관리자)

### 쿠폰 (Coupons)
- `POST /api/coupons/` - 쿠폰 생성 (관리자)
- `GET /api/coupons/active` - 활성 쿠폰 목록 조회
- `POST /api/coupons/issue/{couponCode}` - 쿠폰 발급
- `GET /api/coupons/my` - 내 쿠폰 목록 조회

### 결제 (Payments)
- `GET /api/payments/{paymentId}` - 결제 정보 조회
- `GET /api/payments/order/{orderNumber}` - 주문번호로 결제 조회
- `POST /api/payments/cancel/{orderNumber}` - 결제 취소

## 인증

JWT 토큰 기반 인증을 사용합니다. 로그인 후 토큰을 localStorage에 저장하고, 모든 API 요청에 자동으로 포함됩니다.

```javascript
// 토큰 저장
localStorage.setItem('token', 'your-jwt-token');

// 사용자 이메일 저장 (장바구니, 주문 등에 사용)
localStorage.setItem('userEmail', 'user@example.com');
```

## 주요 기능 설명

### 상품 목록 및 상세
- 페이징 처리된 상품 목록
- 상품 이미지 표시
- 상품 상세 정보 확인
- 장바구니 담기 및 바로 구매

### 장바구니
- 여러 상품을 장바구니에 담기
- 수량 조절
- 선택 삭제
- 전체 선택/해제
- 선택한 상품만 주문하기

### 주문
- 배송 정보 입력
- 쿠폰 적용
- 결제 수단 선택
- 주문 내역 확인
- 주문 취소

### 쿠폰
- 발급 가능한 쿠폰 목록 조회
- 쿠폰 발급 받기
- 내 쿠폰 관리
- 주문 시 쿠폰 사용

## 향후 개선 사항

- [ ] 로그인/회원가입 페이지 추가
- [ ] 상품 검색 기능
- [ ] 카테고리별 필터링
- [ ] 리뷰 시스템
- [ ] 찜하기 기능
- [ ] 실시간 주문 상태 업데이트
- [ ] 관리자 페이지
- [ ] 반응형 디자인 개선
- [ ] 이미지 업로드 기능
- [ ] 결제 API 연동 (토스페이먼츠, 아임포트 등)

## Backend Repository

https://github.com/chungmin23/ecommerce

## 라이센스

MIT
