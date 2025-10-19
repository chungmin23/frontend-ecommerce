import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getCartItems, changeCartItem, deleteCartItem } from '@/api/cartApi'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, Minus, ShoppingBag, Package } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 토큰 확인
    const accessToken = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')

    console.log('🔐 Auth check:', {
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasUser: !!user
    })

    if (!accessToken || !user) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    fetchCartData()
  }, [navigate])

  // 장바구니 업데이트 이벤트 리스너
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartData()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const fetchCartData = async () => {
    try {
      setLoading(true)

      // 장바구니 조회
      const cartResponse = await getCartItems()
      console.log('🛒 Cart response:', cartResponse)
      console.log('🛒 Cart data:', cartResponse.data)
      console.log('🛒 Is array?', Array.isArray(cartResponse.data))

      // 응답이 배열인지 확인
      if (Array.isArray(cartResponse.data)) {
        setCartItems(cartResponse.data)
      } else {
        console.error('Cart response is not an array:', cartResponse.data)

        // 인증 에러인 경우
        if ((cartResponse.data as any)?.error === 'ERROR_ACCESS_TOKEN') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

        setCartItems([])
      }
    } catch (error: any) {
      console.error('장바구니 조회 실패:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      // 네트워크 에러 처리
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        alert('백엔드 서버에 연결할 수 없습니다.\n서버가 http://localhost:8080 에서 실행 중인지 확인해주세요.')
      } else if (error.response?.status === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
        return
      } else {
        alert('장바구니를 불러오는데 실패했습니다.')
      }

      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1) return

    try {
      await changeCartItem({
        email: user?.email || '',
        pno: item.pno,
        qty: newQty,
      })
      fetchCartData()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('수량 변경 실패:', error)
      alert('수량 변경에 실패했습니다.')
    }
  }

  const handleRemoveItem = async (cino: number) => {
    if (!confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) return

    try {
      await deleteCartItem(cino)
      fetchCartData()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('상품 삭제 실패:', error)
      alert('상품 삭제에 실패했습니다.')
    }
  }

  const handleClearCart = async () => {
    if (!confirm('장바구니를 전체 비우시겠습니까?')) return

    try {
      for (const item of cartItems) {
        await deleteCartItem(item.cino)
      }
      fetchCartData()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('장바구니 비우기 실패:', error)
      alert('장바구니 비우기에 실패했습니다.')
    }
  }

  const calculateTotal = () => {
    // cartItems가 배열인지 확인
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array:', cartItems)
      return { subtotal: 0, total: 0 }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

    return {
      subtotal,
      total: subtotal,
    }
  }

  const handleCheckout = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    // 주문 페이지로 이동 (장바구니 아이템 전달)
    navigate('/checkout', {
      state: { items: cartItems }
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

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground">상품을 담아보세요!</p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          >
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    )
  }

  const { subtotal, total } = calculateTotal()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">장바구니</h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          전체 삭제
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                장바구니 상품 ({cartItems.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cino} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  {/* 상품 이미지 */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.uploadFileNames && item.uploadFileNames.length > 0 ? (
                      <img
                        src={`http://localhost:8080/api/products/view/${item.uploadFileNames[0]}`}
                        alt={item.pname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.pname}</h3>
                      <p className="text-orange-600 font-bold">
                        {formatPrice(item.price)}원
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* 수량 조절 */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item, item.qty + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-lg">
                          {formatPrice(item.price * item.qty)}원
                        </p>
                        {/* 삭제 버튼 */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.cino)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">주문 요약</h2>

              <div className="space-y-2 py-4 border-t border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 수</span>
                  <span className="font-medium">
                    {Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + item.qty, 0) : 0}개
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span className="font-medium">{formatPrice(subtotal)}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="font-medium text-green-600">무료</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-orange-600 text-2xl">
                  {formatPrice(total)}원
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                  onClick={handleCheckout}
                  size="lg"
                >
                  주문하기 ({formatPrice(total)}원)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/products')}
                >
                  쇼핑 계속하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
