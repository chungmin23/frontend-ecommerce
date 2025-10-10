import axiosInstance from './axios'

// 쿠폰 생성 (관리자)
export const createCoupon = (couponData: CouponData) => {
  return axiosInstance.post<Coupon>('/coupons/', couponData)
}

// 활성 쿠폰 목록 조회
export const getActiveCoupons = () => {
  return axiosInstance.get<Coupon[]>('/coupons/active')
}

// 쿠폰 발급
export const issueCoupon = (couponCode: string) => {
  return axiosInstance.post(`/coupons/issue/${couponCode}`)
}

// 내 쿠폰 목록 조회
export const getMyCoupons = () => {
  return axiosInstance.get<MyCoupon[]>('/coupons/my')
}
