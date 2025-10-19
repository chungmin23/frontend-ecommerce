import axiosInstance from './axios'

// Product Management (관리자 권한 필요)
export const createProduct = (formData: FormData) => {
  return axiosInstance.post(`/products`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateProduct = (pno: number, formData: FormData) => {
  return axiosInstance.put(`/products/${pno}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteProduct = (pno: number) => {
  return axiosInstance.delete(`/products/${pno}`)
}

// Coupon Management (관리자 권한 필요)
export const createCoupon = (coupon: CouponCreateRequest) => {
  return axiosInstance.post(`/coupons/`, coupon)
}

// Order Management
export const updateOrderStatus = (ono: number, status: string) => {
  return axiosInstance.put(`/orders/${ono}/status`, { status })
}

// 모든 주문 목록 조회 (관리자용) - 전체 조회
export const getOrderList = (params?: PageParam): Promise<PageResponseDTO<Order>> => {
  return axiosInstance.get(`/orders`, { params })
}
