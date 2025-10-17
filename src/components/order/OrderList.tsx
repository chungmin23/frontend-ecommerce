import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '@/api/orderApi';

interface Order {
  ono: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  finalAmount: number;
}

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders({ page, size: 10 });
      setOrders(response.data.dtoList);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
      alert('주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (ono: number) => {
    if (!window.confirm('주문을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelOrder(ono);
      alert('주문이 취소되었습니다.');
      fetchOrders();
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

  return (
    <div className="order-list">
      <h2>주문 내역</h2>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>주문 내역이 없습니다.</p>
          <button onClick={() => navigate('/products')}>쇼핑하러 가기</button>
        </div>
      ) : (
        <>
          <div className="orders">
            {orders.map((order) => (
              <div key={order.ono} className="order-card">
                <div className="order-header">
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className={`order-status status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-number">
                  주문번호: {order.orderNumber}
                </div>

                <div className="order-amount">
                  결제금액: {order.finalAmount.toLocaleString()}원
                </div>

                <div className="order-actions">
                  <button
                    onClick={() => navigate(`/orders/${order.orderNumber}`)}
                    className="btn-detail"
                  >
                    상세보기
                  </button>

                  {(order.status === 'PENDING' || order.status === 'PAID') && (
                    <button
                      onClick={() => handleCancelOrder(order.ono)}
                      className="btn-cancel"
                    >
                      주문취소
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </button>
            <span>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;
