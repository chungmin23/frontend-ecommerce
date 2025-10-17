import axiosInstance from './axios'

const prefix = '/admin'

// Product Management
export const createProduct = (formData: FormData) => {
  return axiosInstance.post(`${prefix}/products`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateProduct = (pno: number, formData: FormData) => {
  return axiosInstance.put(`${prefix}/products/${pno}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteProduct = (pno: number) => {
  return axiosInstance.delete(`${prefix}/products/${pno}`)
}

// Coupon Management
export const createCoupon = (coupon: CouponCreateRequest) => {
  return axiosInstance.post(`${prefix}/coupons`, coupon)
}

// Order Management
export const updateOrderStatus = (ono: number, status: string) => {
  return axiosInstance.put(`${prefix}/orders/${ono}/status`, { status })
}

export const getOrderList = (params?: PageParam): Promise<{ data: PageResponseDTO<Order> }> => {
  return axiosInstance.get(`${prefix}/orders/list`, { params })
}
