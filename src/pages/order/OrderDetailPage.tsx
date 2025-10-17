import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getOrder, cancelOrder } from '@/api/orderApi'
import { getPaymentByOrderNumber } from '@/api/paymentApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/auth-store'
import { Package, MapPin, CreditCard, Calendar, XCircle, ArrowLeft } from 'lucide-react'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    if (!id) {
      alert('잘못된 접근입니다.')
      navigate('/orders')
      return
    }
    fetchOrderDetail()
  }, [id, isAuthenticated, navigate])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const orderResponse = await getOrder(Number(id))
      setOrder(orderResponse.data)

      // 결제 정보 조회 (옵션)
      if (orderResponse.data.orderNumber) {
        try {
          const paymentResponse = await getPaymentByOrderNumber(orderResponse.data.orderNumber)
          setPayment(paymentResponse.data)
        } catch (error) {
          console.log('결제 정보 없음')
        }
      }
    } catch (error) {
      console.error('주문 상세 조회 실패:', error)
      alert('주문 정보를 불러오는데 실패했습니다.')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    if (order.status === 'DELIVERED' || order.status === 'SHIPPING') {
      alert('배송 중이거나 배송 완료된 주문은 취소할 수 없습니다.')
      return
    }

    if (!confirm('정말 이 주문을 취소하시겠습니까?')) return

    try {
      await cancelOrder(order.ono)
      alert('주문이 취소되었습니다.')
      fetchOrderDetail()
    } catch (error) {
      console.error('주문 취소 실패:', error)
      alert('주문 취소에 실패했습니다.')
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: '대기중', variant: 'secondary' as const, color: 'text-gray-600' },
      PAID: { label: '결제완료', variant: 'default' as const, color: 'text-blue-600' },
      PREPARING: { label: '준비중', variant: 'default' as const, color: 'text-yellow-600' },
      SHIPPING: { label: '배송중', variant: 'default' as const, color: 'text-purple-600' },
      DELIVERED: { label: '배송완료', variant: 'default' as const, color: 'text-green-600' },
      CANCELLED: { label: '취소됨', variant: 'destructive' as const, color: 'text-red-600' },
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">주문 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            주문 목록으로
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            주문 목록으로
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">주문 상세</h1>
              <p className="text-muted-foreground">주문번호: {order.orderNumber}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="space-y-6">
          {/* 주문 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                주문 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문일시</span>
                <span className="font-medium">{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문상태</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 주문 상품 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 상품 ({order.orderItems?.length || 0}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.pno} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.pname}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}원 × {item.qty}개
                      </p>
                    </div>
                    <p className="font-bold">{formatPrice(item.price * item.qty)}원</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 배송 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">수령인</span>
                <span className="font-medium">{order.delivery?.receiverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">연락처</span>
                <span className="font-medium">{order.delivery?.receiverPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">우편번호</span>
                <span className="font-medium">{order.delivery?.zipCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주소</span>
                <span className="font-medium text-right">{order.delivery?.address}</span>
              </div>
              {order.delivery?.deliveryMessage && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송 메시지</span>
                  <span className="font-medium">{order.delivery.deliveryMessage}</span>
                </div>
              )}
              {order.delivery?.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">운송장 번호</span>
                  <span className="font-medium">{order.delivery.trackingNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품금액</span>
                <span className="font-medium">{formatPrice(order.totalAmount)}원</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">할인금액</span>
                  <span className="font-medium text-red-600">-{formatPrice(order.discountAmount)}원</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t">
                <span className="font-bold text-lg">최종 결제금액</span>
                <span className="font-bold text-lg text-orange-600">
                  {formatPrice(order.finalAmount || order.totalAmount)}원
                </span>
              </div>
              {payment && (
                <>
                  <div className="flex justify-between text-sm mt-4 pt-3 border-t">
                    <span className="text-muted-foreground">결제수단</span>
                    <span className="font-medium">{payment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">결제상태</span>
                    <span className="font-medium">{payment.paymentStatus}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 주문 취소 버튼 */}
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleCancelOrder}>
                <XCircle className="h-4 w-4 mr-2" />
                주문 취소
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
