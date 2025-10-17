import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { ProductImage } from "./ProductImage"
import { ProductInfo } from "./ProductInfo"

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

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

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
    </Card>
  )
}
