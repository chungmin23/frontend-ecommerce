import axiosInstance from './axios'

// 결제 정보 조회 (결제 ID로)
export const getPayment = (paymentId: number) => {
  return axiosInstance.get<Payment>(`/payments/${paymentId}`)
}

// 결제 정보 조회 (주문번호로)
export const getPaymentByOrderNumber = (orderNumber: string | undefined) => {
  return axiosInstance.get<Payment>(`/payments/order/${orderNumber}`)
}

// 결제 취소
export const cancelPayment = (orderNumber: string, cancelReason?: string) => {
  return axiosInstance.post(`/payments/cancel/${orderNumber}`, {
    cancelReason: cancelReason || '',
  })
}
