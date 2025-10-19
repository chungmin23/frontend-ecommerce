interface CartItem {
  cino: number
  pno: number
  pname: string
  price: number
  qty: number
  imageFile?: string
  uploadFileNames?: string[]
}

interface CartItemData {
  email?: string
  cino?: number
  pno: number
  qty: number
}
