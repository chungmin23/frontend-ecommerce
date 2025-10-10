interface Coupon {
  couponId: number
  couponCode: string
  couponName: string
  couponType: 'FIXED' | 'PERCENT'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
}

interface CouponData {
  couponCode: string
  couponName: string
  couponType: 'FIXED' | 'PERCENT'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  startDate: string
  endDate: string
}

interface MyCoupon {
  memberCouponId: number
  couponName: string
  couponType: 'FIXED' | 'PERCENT'
  discountValue: number
  minOrderAmount?: number
  endDate: string
  used: boolean
  usedDate?: string
}
