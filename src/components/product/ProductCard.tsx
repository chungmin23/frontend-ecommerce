import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { useCartActions } from "@/hooks/useCartActions"
import { ProductImage } from "./ProductImage"
import { ProductInfo } from "./ProductInfo"
import { ProductActions } from "./ProductActions"

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
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCartActions()

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ id, name, price, image })
    alert(`${name}이(가) 장바구니에 추가되었습니다.`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
  }

  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
      <ProductImage
        id={id}
        image={image}
        name={name}
        badge={badge}
        discount={discount}
        isLiked={isLiked}
        onLikeToggle={handleLike}
      />

      <CardContent className="p-0">
        <ProductInfo
          id={id}
          name={name}
          price={price}
          originalPrice={originalPrice}
          rating={rating}
          reviewCount={reviewCount}
        />
      </CardContent>

      <CardFooter className="p-0">
        <ProductActions onAddToCart={handleAddToCart} />
      </CardFooter>
    </Card>
  )
}
