import React, { useState, useEffect } from 'react';
import { getActiveCoupons, getMyCoupons, issueCoupon } from '@/api/couponApi';

interface Coupon {
  couponId?: number;
  memberCouponId?: number;
  couponName: string;
  couponType: string;
  discountValue: number;
  minOrderAmount?: number;
  endDate: string;
  couponCode?: string;
  used?: boolean;
}

const CouponList: React.FC = () => {
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const [activeResponse, myResponse] = await Promise.all([
        getActiveCoupons(),
        getMyCoupons(),
      ]);

      setActiveCoupons(activeResponse.data);
      setMyCoupons(myResponse.data);
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      alert('쿠폰 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCoupon = async (couponCode: string) => {
    try {
      await issueCoupon(couponCode);
      alert('쿠폰이 발급되었습니다!');
      fetchCoupons();
    } catch (error: any) {
      console.error('쿠폰 발급 실패:', error);
      alert(error.response?.data?.message || '쿠폰 발급에 실패했습니다.');
    }
  };

  const getCouponTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      FIXED: '정액 할인',
      PERCENT: '정률 할인',
    };
    return typeMap[type] || type;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="coupon-list">
      <h2>쿠폰</h2>

      <div className="tabs">
        <button
          className={activeTab === 'available' ? 'active' : ''}
          onClick={() => setActiveTab('available')}
        >
          발급 가능한 쿠폰
        </button>
        <button
          className={activeTab === 'my' ? 'active' : ''}
          onClick={() => setActiveTab('my')}
        >
          내 쿠폰
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="available-coupons">
          {activeCoupons.length === 0 ? (
            <p className="empty-message">발급 가능한 쿠폰이 없습니다.</p>
          ) : (
            <div className="coupons-grid">
              {activeCoupons.map((coupon) => (
                <div key={coupon.couponId} className="coupon-card">
                  <div className="coupon-header">
                    <h3>{coupon.couponName}</h3>
                    <span className="coupon-type">{getCouponTypeText(coupon.couponType)}</span>
                  </div>

                  <div className="coupon-discount">
                    {coupon.couponType === 'FIXED'
                      ? `${coupon.discountValue.toLocaleString()}원 할인`
                      : `${coupon.discountValue}% 할인`
                    }
                  </div>

                  {coupon.minOrderAmount && (
                    <div className="coupon-condition">
                      {coupon.minOrderAmount.toLocaleString()}원 이상 구매 시
                    </div>
                  )}

                  <div className="coupon-period">
                    유효기간: {new Date(coupon.endDate).toLocaleDateString()}까지
                  </div>

                  <button
                    onClick={() => handleIssueCoupon(coupon.couponCode!)}
                    className="btn-issue"
                    disabled={isExpired(coupon.endDate)}
                  >
                    {isExpired(coupon.endDate) ? '기간 만료' : '쿠폰 받기'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my' && (
        <div className="my-coupons">
          {myCoupons.length === 0 ? (
            <p className="empty-message">보유한 쿠폰이 없습니다.</p>
          ) : (
            <div className="coupons-grid">
              {myCoupons.map((coupon) => (
                <div
                  key={coupon.memberCouponId}
                  className={`coupon-card ${coupon.used ? 'used' : ''} ${isExpired(coupon.endDate) ? 'expired' : ''}`}
                >
                  <div className="coupon-header">
                    <h3>{coupon.couponName}</h3>
                    <span className="coupon-type">{getCouponTypeText(coupon.couponType)}</span>
                  </div>

                  <div className="coupon-discount">
                    {coupon.couponType === 'FIXED'
                      ? `${coupon.discountValue.toLocaleString()}원 할인`
                      : `${coupon.discountValue}% 할인`
                    }
                  </div>

                  {coupon.minOrderAmount && (
                    <div className="coupon-condition">
                      {coupon.minOrderAmount.toLocaleString()}원 이상 구매 시
                    </div>
                  )}

                  <div className="coupon-period">
                    유효기간: {new Date(coupon.endDate).toLocaleDateString()}까지
                  </div>

                  <div className="coupon-status">
                    {coupon.used ? '사용 완료' : isExpired(coupon.endDate) ? '기간 만료' : '사용 가능'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponList;
