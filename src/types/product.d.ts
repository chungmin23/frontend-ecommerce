interface Product {
  pno: number
  pname: string
  pdesc?: string
  price: number
  category?: string
  stock?: number
  uploadFileNames?: string[]
}

interface ProductRecommendation {
  userQuery: string
  recommendedProducts: Product[]
  explanation: string
  confidence: number
}

interface ProductRecommendationRequest {
  userQuery: string
}
