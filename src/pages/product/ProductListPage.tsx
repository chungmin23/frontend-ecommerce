import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { ProductCard } from "@/components/product/ProductCard"
import { getProductList, getProductImage } from "@/api/productApi"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<PageResponseDTO<Product> | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    fetchProducts(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  const fetchProducts = async (page: number, search: string) => {
    try {
      setLoading(true)
      console.log('📦 Fetching products:', { page, size: pageSize })
      const response = await getProductList({ page, size: pageSize })
      console.log('✅ Product list response:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response))

      let filteredProducts = response.dtoList

      // 검색어가 있으면 상품명으로 필터링
      if (search) {
        filteredProducts = filteredProducts.filter(product =>
          product.pname.toLowerCase().includes(search.toLowerCase())
        )
      }

      setProducts(filteredProducts)
      setPageData(response)
    } catch (error: any) {
      console.error('❌ 상품 목록 조회 실패:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })

      // 에러 타입별 메시지
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        alert('백엔드 서버에 연결할 수 없습니다.\n서버가 http://localhost:8080 에서 실행 중인지 확인해주세요.')
      } else if (error.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.')
      } else if (error.response?.status === 403) {
        alert('접근 권한이 없습니다.')
      } else {
        alert(`상품 목록 조회 실패: ${error.message}`)
      }

      // 빈 배열로 설정하여 UI가 깨지지 않도록
      setProducts([])
      setPageData(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">전체 상품</h1>
        <p className="text-muted-foreground">
          총 {pageData?.totalCount || 0}개의 상품
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">상품이 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
              : '등록된 상품이 없습니다.'
            }
          </p>
          {searchQuery && (
            <Button onClick={() => window.location.href = '/products'}>
              전체 상품 보기
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}

      {pageData && pageData.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pageData.prevPage)}
            disabled={!pageData.prev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageData.pageNumList.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              onClick={() => handlePageChange(pageNum)}
              className={currentPage === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pageData.nextPage)}
            disabled={!pageData.next}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
