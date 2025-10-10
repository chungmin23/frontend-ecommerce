import axiosInstance from './axios'

const prefix = '/products'

// AI Recommendation APIs (새로 추가된 Spring AI 기능)
// Get product recommendation based on user query using RAG + AI
export const getRecommendation = async (userQuery: string): Promise<ProductRecommendation> => {
  const res = await axiosInstance.post(`${prefix}/recommend`, { userQuery })
  return res.data
}

// Index all products into vector database
export const indexAllProducts = async () => {
  const res = await axiosInstance.post(`${prefix}/index`)
  return res.data
}

// Search similar products using vector similarity (without AI generation)
export const searchSimilarProducts = async (query: string, topK: number = 5): Promise<Product[]> => {
  const res = await axiosInstance.get(`${prefix}/search`, {
    params: { query, topK }
  })
  return res.data
}

// 기존 Product CRUD APIs
// 상품 목록 조회
export const getProductList = (params?: PageParam) => {
  return axiosInstance.get(`${prefix}/list`, { params })
}

// 상품 상세 조회
export const getProduct = (pno: number | string | undefined) => {
  return axiosInstance.get(`${prefix}/${pno}`)
}

// 상품 등록
export const createProduct = (formData: FormData) => {
  return axiosInstance.post(`${prefix}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 상품 수정
export const updateProduct = (pno: number, formData: FormData) => {
  return axiosInstance.put(`${prefix}/${pno}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 상품 삭제
export const deleteProduct = (pno: number) => {
  return axiosInstance.delete(`${prefix}/${pno}`)
}

// 상품 이미지 조회
export const getProductImage = (fileName: string) => {
  return `${axiosInstance.defaults.baseURL}${prefix}/view/${fileName}`
}
