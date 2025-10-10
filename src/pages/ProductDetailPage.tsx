import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { getProduct, getProductImage } from "@/api/productApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/cart-store"
import { ShoppingCart, Heart, Star, ArrowLeft } from "lucide-react"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (pno: string) => {
    try {
      setLoading(true)
      const response = await getProduct(pno)
      setProduct(response.data)
    } catch (error) {
      console.error('상품 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.pno.toString(),
        name: product.pname,
        price: product.price,
        image: product.uploadFileNames && product.uploadFileNames.length > 0
          ? getProductImage(product.uploadFileNames[0])
          : '',
      })
    }
    alert(`${product.pname} ${quantity}개가 장바구니에 추가되었습니다.`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">상품을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/products')} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const images = product.uploadFileNames && product.uploadFileNames.length > 0
    ? product.uploadFileNames.map(getProductImage)
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop']

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        목록으로
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.pname}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-orange-600 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.pname} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 섹션 */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge className="mb-2">{product.category}</Badge>
            )}
            <h1 className="text-3xl font-bold mb-4">{product.pname}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.5</span>
              </div>
              <span className="text-sm text-muted-foreground">(100 리뷰)</span>
            </div>

            <div className="text-3xl font-bold text-orange-600 mb-6">
              {product.price.toLocaleString()}원
            </div>

            {product.pdesc && (
              <div className="border-t border-b py-4 mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{product.pdesc}</p>
              </div>
            )}

            {product.stock !== undefined && (
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">
                  재고: {product.stock > 0 ? `${product.stock}개` : '품절'}
                </span>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">수량</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">총 금액</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "border-red-500 text-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock !== undefined && product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                  onClick={handleBuyNow}
                  disabled={product.stock !== undefined && product.stock === 0}
                >
                  바로 구매
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">배송 정보</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="flex justify-between">
                  <span>배송 기간</span>
                  <span>2-3일 소요</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
