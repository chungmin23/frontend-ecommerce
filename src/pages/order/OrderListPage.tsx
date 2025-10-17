import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { getMyOrders } from '@/api/orderApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/auth-store'
import { Package, Calendar, CreditCard, ChevronRight } from 'lucide-react'

export default function OrderListPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate, page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getMyOrders({ page, size: 10 })
      setOrders(response.data.dtoList)
      setTotalPage(response.data.totalPage)
    } catch (error) {
      console.error('주문 목록 조회 실패:', error)
      alert('주문 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: '대기중', variant: 'secondary' as const },
      PAID: { label: '결제완료', variant: 'default' as const },
      PREPARING: { label: '준비중', variant: 'default' as const },
      SHIPPING: { label: '배송중', variant: 'default' as const },
      DELIVERED: { label: '배송완료', variant: 'default' as const },
      CANCELLED: { label: '취소됨', variant: 'destructive' as const },
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">주문 내역</h1>
          <Button variant="outline" onClick={() => navigate('/mypage')}>
            마이페이지로
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">주문 내역이 없습니다</p>
              <p className="text-muted-foreground mb-6">첫 주문을 시작해보세요!</p>
              <Button onClick={() => navigate('/products')}>상품 둘러보기</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.ono} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg">주문번호: {order.orderNumber}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <Link to={`/orders/${order.ono}`}>
                        <Button variant="ghost" size="sm">
                          상세보기
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">주문일:</span>
                        <span className="font-medium">{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">결제금액:</span>
                        <span className="font-bold text-lg">{formatPrice(order.finalAmount || order.totalAmount)}원</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">상품:</span>
                        <span className="font-medium">
                          {order.orderItems?.[0]?.pname || '상품'}
                          {order.orderItems && order.orderItems.length > 1 && ` 외 ${order.orderItems.length - 1}개`}
                        </span>
                      </div>
                    </div>

                    {/* 할인 정보 */}
                    {order.discountAmount > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">할인금액</span>
                          <span className="text-red-600 font-medium">-{formatPrice(order.discountAmount)}원</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPage > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  이전
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={page === p ? 'default' : 'outline'}
                      onClick={() => setPage(p)}
                      className="w-10"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  disabled={page === totalPage}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
