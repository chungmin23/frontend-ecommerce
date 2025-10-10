interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
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
