import { Star } from "lucide-react"
import { Link } from "react-router"

interface ProductInfoProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
}

export function ProductInfo({
  id,
  name,
  price,
  originalPrice,
  rating = 4.5,
  reviewCount = 0
}: ProductInfoProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className="p-4">
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
    </div>
  )
}
