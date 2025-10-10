interface Order {
  ono: number
  orderNumber: string
  orderDate: string
  status: OrderStatus
  totalAmount: number
  discountAmount: number
  finalAmount: number
  orderItems: OrderItem[]
  delivery: Delivery
}

interface OrderItem {
  pno: number
  pname: string
  price: number
  qty: number
}

interface Delivery {
  receiverName: string
  receiverPhone: string
  address: string
  zipCode: string
  deliveryMessage?: string
  trackingNumber?: string
}

interface OrderData {
  email?: string | null
  orderItems: OrderItem[]
  delivery: Delivery
  memberCouponId?: string | null
  paymentMethod: string
}

interface PageParam {
  page?: number
  size?: number
}

interface PageResponse<T> {
  dtoList: T[]
  totalPage: number
  page: number
  size: number
}

type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
