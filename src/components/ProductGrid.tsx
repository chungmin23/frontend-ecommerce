import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { Sparkles } from "lucide-react"
import { getProductList, getProductImage } from "@/api/productApi"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProductList({ page: 1, size: 8 })
      setProducts(response.data.dtoList)
    } catch (error) {
      console.error('상품 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">로딩 중...</div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-orange-50/20">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-orange-600" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            인기 상품
          </h2>
          <Sparkles className="h-6 w-6 text-orange-600" />
        </div>
        <p className="text-muted-foreground text-lg">지금 가장 많이 찾는 상품들을 만나보세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.pno}
            id={product.pno.toString()}
            name={product.pname}
            price={product.price}
            image={
              product.uploadFileNames && product.uploadFileNames.length > 0
                ? getProductImage(product.uploadFileNames[0])
                : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
            }
            rating={4.5}
            reviewCount={100}
          />
        ))}
      </div>
    </section>
  )
}
