import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductActionsProps {
  onAddToCart: (e: React.MouseEvent) => void
}

export function ProductActions({ onAddToCart }: ProductActionsProps) {
  return (
    <div className="p-4 pt-0">
      <Button
        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300"
        size="sm"
        onClick={onAddToCart}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        장바구니 담기
      </Button>
    </div>
  )
}
