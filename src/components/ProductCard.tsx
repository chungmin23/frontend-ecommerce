import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"
import { Link } from "react-router"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  rating?: number
  reviewCount?: number
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  rating = 4.5,
  reviewCount = 0,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const addItem = useCartStore((state) => state.addItem)
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id,
      name,
      price,
      image,
    })
    alert(`${name}이(가) 장바구니에 추가되었습니다.`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
  }

  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
      <Link to={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={image || "https://via.placeholder.com/400"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {badge && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0 shadow-lg">
              {badge}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg font-bold">
              -{discount}%
            </Badge>
          )}

          <Button
            size="icon"
            variant="secondary"
            className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isLiked ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/90 hover:bg-white"
            }`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
          {reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-600">{price.toLocaleString()}원</span>
            {discount > 0 && (
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                {discount}%
              </span>
            )}
          </div>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300"
          size="sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          장바구니 담기
        </Button>
      </CardFooter>
    </Card>
  )
}
