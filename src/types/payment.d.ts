interface Payment {
  paymentId: number
  orderNumber: string
  status: string
  paymentMethod: string
  amount: number
  paymentDate?: string
  cancelReason?: string
  cancelDate?: string
}
