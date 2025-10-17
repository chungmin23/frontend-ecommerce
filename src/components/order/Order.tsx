import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '@/api/orderApi';
import { getMyCoupons } from '@/api/couponApi';

interface OrderItem {
  pno: number;
  pname: string;
  qty: number;
  price: number;
}

interface Delivery {
  receiverName: string;
  receiverPhone: string;
  address: string;
  zipCode: string;
  deliveryMessage: string;
}

interface Coupon {
  memberCouponId: number;
  couponName: string;
  discountValue: number;
}

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [delivery, setDelivery] = useState<Delivery>({
    receiverName: '',
    receiverPhone: '',
    address: '',
    zipCode: '',
    deliveryMessage: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  useEffect(() => {
    // 상품 또는 장바구니에서 전달받은 주문 아이템 설정
    if (location.state?.product) {
      const { product, quantity } = location.state as any;
      setOrderItems([{
        pno: product.pno,
        pname: product.pname,
        qty: quantity,
        price: product.price,
      }]);
    } else if (location.state?.orderItems) {
      setOrderItems((location.state as any).orderItems);
    } else {
      alert('주문 정보가 없습니다.');
      navigate('/cart');
    }

    fetchMyCoupons();
  }, []);

  const fetchMyCoupons = async () => {
    try {
      const response = await getMyCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
    }
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDelivery(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!delivery.receiverName || !delivery.receiverPhone || !delivery.address || !delivery.zipCode) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    try {
      const email = localStorage.getItem('userEmail');
      const orderData = {
        email,
        orderItems,
        delivery,
        memberCouponId: selectedCoupon || null,
        paymentMethod,
      };

      const response = await createOrder(orderData);
      const orderNumber = response.data.orderNumber;

      alert('주문이 완료되었습니다!');
      navigate(`/orders/${orderNumber}`);
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="order">
      <h2>주문/결제</h2>

      <form onSubmit={handleSubmitOrder}>
        <section className="order-items">
          <h3>주문 상품</h3>
          {orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.pname}</span>
              <span>{item.qty}개</span>
              <span>{(item.price * item.qty).toLocaleString()}원</span>
            </div>
          ))}
        </section>

        <section className="delivery-info">
          <h3>배송 정보</h3>
          <div className="form-group">
            <label>받는 사람*</label>
            <input
              type="text"
              name="receiverName"
              value={delivery.receiverName}
              onChange={handleDeliveryChange}
              required
            />
          </div>
          <div className="form-group">
            <label>연락처*</label>
            <input
              type="tel"
              name="receiverPhone"
              value={delivery.receiverPhone}
              onChange={handleDeliveryChange}
              placeholder="010-0000-0000"
              required
            />
          </div>
          <div className="form-group">
            <label>우편번호*</label>
            <input
              type="text"
              name="zipCode"
              value={delivery.zipCode}
              onChange={handleDeliveryChange}
              required
            />
          </div>
          <div className="form-group">
            <label>주소*</label>
            <input
              type="text"
              name="address"
              value={delivery.address}
              onChange={handleDeliveryChange}
              required
            />
          </div>
          <div className="form-group">
            <label>배송 메시지</label>
            <textarea
              name="deliveryMessage"
              value={delivery.deliveryMessage}
              onChange={handleDeliveryChange}
              placeholder="배송 시 요청사항을 입력해주세요."
            />
          </div>
        </section>

        <section className="coupon-section">
          <h3>쿠폰 선택</h3>
          <select
            value={selectedCoupon}
            onChange={(e) => setSelectedCoupon(e.target.value)}
          >
            <option value="">쿠폰을 선택하세요</option>
            {coupons.map((coupon) => (
              <option key={coupon.memberCouponId} value={coupon.memberCouponId}>
                {coupon.couponName} - {coupon.discountValue}원 할인
              </option>
            ))}
          </select>
        </section>

        <section className="payment-method">
          <h3>결제 수단</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === 'CARD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              신용카드
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="TRANSFER"
                checked={paymentMethod === 'TRANSFER'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              계좌이체
            </label>
          </div>
        </section>

        <section className="order-summary">
          <h3>결제 금액</h3>
          <div className="summary-row">
            <span>상품 금액:</span>
            <span>{calculateTotal().toLocaleString()}원</span>
          </div>
          <div className="summary-row total">
            <span>최종 결제 금액:</span>
            <span className="total-amount">{calculateTotal().toLocaleString()}원</span>
          </div>
        </section>

        <button type="submit" className="btn-submit-order">
          결제하기
        </button>
      </form>
    </div>
  );
};

export default Order;
