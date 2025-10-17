import { useCartStore } from "@/lib/cart-store"

interface CartProduct {
  id: string
  name: string
  price: number
  image: string
}

export const useCartActions = () => {
  const addItem = useCartStore((state) => state.addItem)

  const addToCart = (product: CartProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'))

    return true
  }

  return { addToCart }
}
