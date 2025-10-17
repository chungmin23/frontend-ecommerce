import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { Link } from "react-router"

interface ProductImageProps {
  id: string
  image: string
  name: string
  badge?: string
  discount?: number
  isLiked: boolean
  onLikeToggle: (e: React.MouseEvent) => void
}

export function ProductImage({
  id,
  image,
  name,
  badge,
  discount = 0,
  isLiked,
  onLikeToggle
}: ProductImageProps) {
  return (
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
          onClick={onLikeToggle}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>
    </Link>
  )
}
