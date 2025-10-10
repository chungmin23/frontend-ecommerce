import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByNumber, cancelOrder } from '../api/orderApi';
import { getPaymentByOrderNumber, cancelPayment } from '../api/paymentApi';

interface OrderItem {
  pname: string;
  qty: number;
  price: number;
}

interface Delivery {
  receiverName: string;
  receiverPhone: string;
  zipCode: string;
  address: string;
  deliveryMessage?: string;
  trackingNumber?: string;
}

interface Order {
  ono: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  orderItems: OrderItem[];
  delivery: Delivery;
}

interface Payment {
  status: string;
  paymentMethod: string;
}

const OrderDetail: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
    fetchPayment();
  }, [orderNumber]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getOrderByNumber(orderNumber);
      setOrder(response.data);
    } catch (error) {
      console.error('주문 상세 조회 실패:', error);
      alert('주문 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      const response = await getPaymentByOrderNumber(orderNumber);
      setPayment(response.data);
    } catch (error) {
      console.error('결제 정보 조회 실패:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    if (!window.confirm('주문을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelOrder(order.ono);

      if (payment && payment.status === 'COMPLETED') {
        const reason = prompt('취소 사유를 입력해주세요:');
        await cancelPayment(orderNumber!, reason || '');
      }

      alert('주문이 취소되었습니다.');
      navigate('/orders');
    } catch (error) {
      console.error('주문 취소 실패:', error);
      alert('주문 취소에 실패했습니다.');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '결제 대기',
      PAID: '결제 완료',
      PREPARING: '상품 준비중',
      SHIPPING: '배송중',
      DELIVERED: '배송 완료',
      CANCELLED: '취소됨',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!order) {
    return <div>주문을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="order-detail">
      <h2>주문 상세</h2>

      <section className="order-info">
        <h3>주문 정보</h3>
        <div className="info-row">
          <span>주문번호:</span>
          <span>{order.orderNumber}</span>
        </div>
        <div className="info-row">
          <span>주문일시:</span>
          <span>{new Date(order.orderDate).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span>주문상태:</span>
          <span className={`status-${order.status}`}>{getStatusText(order.status)}</span>
        </div>
      </section>

      <section className="order-items">
        <h3>주문 상품</h3>
        {order.orderItems.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-name">{item.pname}</div>
            <div className="item-qty">수량: {item.qty}개</div>
            <div className="item-price">{(item.price * item.qty).toLocaleString()}원</div>
          </div>
        ))}
      </section>

      <section className="delivery-info">
        <h3>배송 정보</h3>
        <div className="info-row">
          <span>받는 사람:</span>
          <span>{order.delivery.receiverName}</span>
        </div>
        <div className="info-row">
          <span>연락처:</span>
          <span>{order.delivery.receiverPhone}</span>
        </div>
        <div className="info-row">
          <span>주소:</span>
          <span>[{order.delivery.zipCode}] {order.delivery.address}</span>
        </div>
        {order.delivery.deliveryMessage && (
          <div className="info-row">
            <span>배송 메시지:</span>
            <span>{order.delivery.deliveryMessage}</span>
          </div>
        )}
        {order.delivery.trackingNumber && (
          <div className="info-row">
            <span>운송장 번호:</span>
            <span>{order.delivery.trackingNumber}</span>
          </div>
        )}
      </section>

      <section className="payment-info">
        <h3>결제 정보</h3>
        <div className="info-row">
          <span>상품 금액:</span>
          <span>{order.totalAmount.toLocaleString()}원</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="info-row discount">
            <span>할인 금액:</span>
            <span>-{order.discountAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="info-row total">
          <span>최종 결제 금액:</span>
          <span className="total-amount">{order.finalAmount.toLocaleString()}원</span>
        </div>
        {payment && (
          <>
            <div className="info-row">
              <span>결제 수단:</span>
              <span>{payment.paymentMethod === 'CARD' ? '신용카드' : '계좌이체'}</span>
            </div>
            <div className="info-row">
              <span>결제 상태:</span>
              <span>{payment.status}</span>
            </div>
          </>
        )}
      </section>

      <div className="action-buttons">
        <button onClick={() => navigate('/orders')} className="btn-list">
          목록으로
        </button>

        {(order.status === 'PENDING' || order.status === 'PAID') && (
          <button onClick={handleCancelOrder} className="btn-cancel">
            주문 취소
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
