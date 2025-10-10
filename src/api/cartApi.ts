import axiosInstance from './axios'

// 장바구니 아이템 추가/수정
export const changeCartItem = (cartItemData: CartItemData) => {
  return axiosInstance.post('/cart/change', cartItemData)
}

// 장바구니 목록 조회
export const getCartItems = () => {
  return axiosInstance.get<CartItem[]>('/cart/items')
}

// 장바구니 아이템 삭제
export const deleteCartItem = (cino: number) => {
  return axiosInstance.delete(`/cart/${cino}`)
}
