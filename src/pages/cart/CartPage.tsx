import { useNavigate } from "react-router"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.")
      return
    }

    // TODO: 결제 페이지로 이동
    alert("결제 기능은 준비 중입니다.")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground">상품을 담아보세요!</p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          >
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">장바구니</h1>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          전체 삭제
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-orange-600 font-bold">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* 수량 조절 */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">주문 요약</h2>

              <div className="space-y-2 py-4 border-t border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 수</span>
                  <span className="font-medium">{items.reduce((sum, item) => sum + item.quantity, 0)}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span className="font-medium">{getTotalPrice().toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="font-medium text-green-600">무료</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-orange-600 text-2xl">
                  {getTotalPrice().toLocaleString()}원
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                  onClick={handleCheckout}
                >
                  주문하기
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/products")}
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
