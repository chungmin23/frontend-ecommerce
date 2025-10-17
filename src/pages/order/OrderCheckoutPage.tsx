import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { createOrder } from '@/api/orderApi'
import { getCheckoutCoupons } from '@/api/couponApi'
import { getCartItems, deleteCartItem } from '@/api/cartApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/auth-store'
import { ShoppingCart, MapPin, CreditCard, Tag, ArrowLeft } from 'lucide-react'

export default function OrderCheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [coupons, setCoupons] = useState<MyCoupon[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: '',
    receiverPhone: '',
    zipCode: '',
    address: '',
    addrDetail: '',
    deliveryMessage: '',
  })

  const [paymentMethod, setPaymentMethod] = useState<string>('CARD')

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    fetchCheckoutData()
  }, [isAuthenticated, navigate])

  const fetchCheckoutData = async () => {
    try {
      setLoading(true)

      // 장바구니에서 넘어온 경우
      const stateItems = location.state?.items as CartItem[]
      if (stateItems && stateItems.length > 0) {
        setCartItems(stateItems)
      } else {
        // 직접 접근한 경우 장바구니 전체 가져오기
        const cartResponse = await getCartItems()
        if (cartResponse.data.length === 0) {
          alert('주문할 상품이 없습니다.')
          navigate('/cart')
          return
        }
        setCartItems(cartResponse.data)
      }

      // 사용 가능한 쿠폰 조회
      try {
        const couponsResponse = await getCheckoutCoupons()
        setCoupons(couponsResponse.data)
      } catch (error) {
        console.log('쿠폰 조회 실패 (계속 진행)')
      }
    } catch (error) {
      console.error('체크아웃 데이터 조회 실패:', error)
      alert('주문 정보를 불러오는데 실패했습니다.')
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    let discount = 0

    if (selectedCoupon) {
      const coupon = coupons.find(c => c.memberCouponId === selectedCoupon)
      if (coupon) {
        if (coupon.couponType === 'PERCENT') {
          discount = Math.floor(subtotal * (coupon.discountValue / 100))
          if (coupon.maxDiscountAmount) {
            discount = Math.min(discount, coupon.maxDiscountAmount)
          }
        } else {
          discount = coupon.discountValue
        }
      }
    }

    return {
      subtotal,
      discount,
      total: subtotal - discount,
    }
  }

  const handleSubmitOrder = async () => {
    // 배송지 정보 검증
    if (!deliveryInfo.receiverName || !deliveryInfo.receiverPhone || !deliveryInfo.address) {
      alert('배송지 정보를 모두 입력해주세요.')
      return
    }

    if (!paymentMethod) {
      alert('결제 방법을 선택해주세요.')
      return
    }

    if (!confirm('주문하시겠습니까?')) return

    try {
      setSubmitting(true)

      const orderData: OrderData = {
        email: user?.email || null,
        orderItems: cartItems.map(item => ({
          pno: item.pno,
          pname: item.pname,
          price: item.price,
          qty: item.qty,
        })),
        delivery: {
          receiverName: deliveryInfo.receiverName,
          receiverPhone: deliveryInfo.receiverPhone,
          zipCode: deliveryInfo.zipCode,
          address: `${deliveryInfo.address} ${deliveryInfo.addrDetail}`,
          deliveryMessage: deliveryInfo.deliveryMessage,
        },
        memberCouponId: selectedCoupon ? String(selectedCoupon) : null,
        paymentMethod,
      }

      const response = await createOrder(orderData)

      if (response.data.orderNumber) {
        // 주문 성공 시 장바구니에서 삭제
        for (const item of cartItems) {
          try {
            await deleteCartItem(item.cino)
          } catch (error) {
            console.log('장바구니 삭제 실패 (무시)')
          }
        }

        // 장바구니 업데이트 이벤트 발생
        window.dispatchEvent(new Event('cartUpdated'))

        alert('주문이 완료되었습니다!')
        navigate('/orders')
      }
    } catch (error: any) {
      console.error('주문 생성 실패:', error)
      alert(error.response?.data?.error || '주문에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
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

  const { subtotal, discount, total } = calculateTotal()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            장바구니로
          </Button>
          <h1 className="text-3xl font-bold">주문/결제</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  주문 상품 ({cartItems.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cino} className="flex justify-between items-center pb-3 border-b last:border-0">
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

            {/* 배송지 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  배송지 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">수령인</label>
                  <Input
                    value={deliveryInfo.receiverName}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, receiverName: e.target.value })}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">연락처</label>
                  <Input
                    value={deliveryInfo.receiverPhone}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, receiverPhone: e.target.value })}
                    placeholder="010-1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">우편번호</label>
                  <Input
                    value={deliveryInfo.zipCode}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">주소</label>
                  <Input
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    placeholder="기본 주소를 입력하세요"
                    className="mb-2"
                  />
                  <Input
                    value={deliveryInfo.addrDetail}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, addrDetail: e.target.value })}
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">배송 메시지 (선택)</label>
                  <Input
                    value={deliveryInfo.deliveryMessage}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryMessage: e.target.value })}
                    placeholder="배송 시 요청사항을 입력하세요"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 쿠폰 선택 */}
            {coupons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    쿠폰 선택
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCoupon(null)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedCoupon === null ? 'border-orange-600 bg-orange-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      쿠폰 사용 안 함
                    </button>
                    {coupons.filter(c => !c.used).map((coupon) => (
                      <button
                        key={coupon.memberCouponId}
                        onClick={() => setSelectedCoupon(coupon.memberCouponId)}
                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                          selectedCoupon === coupon.memberCouponId ? 'border-orange-600 bg-orange-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{coupon.couponName}</p>
                            <p className="text-sm text-muted-foreground">
                              {coupon.couponType === 'PERCENT'
                                ? `${coupon.discountValue}% 할인`
                                : `${formatPrice(coupon.discountValue)}원 할인`}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(coupon.endDate).toLocaleDateString()}까지
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 결제 방법 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  결제 방법
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['CARD', 'BANK', 'KAKAO', 'TOSS'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        paymentMethod === method ? 'border-orange-600 bg-orange-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {method === 'CARD' && '신용/체크카드'}
                      {method === 'BANK' && '계좌이체'}
                      {method === 'KAKAO' && '카카오페이'}
                      {method === 'TOSS' && '토스페이'}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 결제 금액 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>결제 금액</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품금액</span>
                  <span className="font-medium">{formatPrice(subtotal)}원</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">할인금액</span>
                    <span className="font-medium text-red-600">-{formatPrice(discount)}원</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold text-lg">최종 결제금액</span>
                  <span className="font-bold text-lg text-orange-600">{formatPrice(total)}원</span>
                </div>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full mt-4"
                  size="lg"
                >
                  {submitting ? '처리 중...' : `${formatPrice(total)}원 결제하기`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
