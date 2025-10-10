import axiosInstance from './axios'

// 주문 생성
export const createOrder = (orderData: OrderData) => {
  return axiosInstance.post<Order>('/orders/', orderData)
}

// 주문 상세 조회 (ID로)
export const getOrder = (ono: number) => {
  return axiosInstance.get<Order>(`/orders/${ono}`)
}

// 주문 상세 조회 (주문번호로)
export const getOrderByNumber = (orderNumber: string | undefined) => {
  return axiosInstance.get<Order>(`/orders/number/${orderNumber}`)
}

// 내 주문 목록 조회
export const getMyOrders = (params?: PageParam) => {
  return axiosInstance.get<PageResponse<Order>>('/orders/my', { params })
}

// 주문 취소
export const cancelOrder = (ono: number) => {
  return axiosInstance.delete(`/orders/${ono}`)
}

// 주문 상태 변경 (관리자)
export const updateOrderStatus = (ono: number, status: OrderStatus) => {
  return axiosInstance.put(`/orders/${ono}/status`, { status })
}
