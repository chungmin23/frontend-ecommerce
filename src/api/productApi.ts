import axiosInstance from './axios'

const prefix = '/products'
const recommendPrefix = '/recommendations'  // ← AI 추천 전용 prefix

// =====================================
// 타입 정의
// =====================================

export interface Product {
  pno: number
  pname: string
  price: number
  pdesc?: string
  delFlag?: boolean
  uploadFileNames?: string[]
  category?: string
}

export interface PageParam {
  page?: number
  size?: number
}

export interface PageResponseDTO<T> {
  dtoList: T[]
  pageNumList: number[]
  pageRequestDTO: {
    page: number
    size: number
  }
  prev: boolean
  next: boolean
  totalCount: number
  prevPage: number
  nextPage: number
  totalPage: number
  current: number
}

export interface ProductRecommendation {
  userQuery: string
  recommendedProducts: Product[]
  explanation: string
  confidence: number
}

// =====================================
// AI 추천 APIs (Spring AI 기능)
// =====================================

/**
 * RAG 기반 AI 상품 추천
 * @param query - 사용자 질문 (예: "저렴한 상품 추천해줘")
 * @returns AI 설명 + 추천 상품 리스트
 */
export const getRecommendation = async (query: string): Promise<ProductRecommendation> => {
  console.log('🤖 Calling recommendation API with query:', query)
  
  try {
    const res = await axiosInstance.get(`${recommendPrefix}`, {
      params: { query }  // ← userQuery가 아니라 query
    })
    
    console.log('✅ Recommendation API response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Recommendation API failed:', error)
    console.error('Request details:', {
      url: error.config?.url,
      params: error.config?.params,
      status: error.response?.status,
      data: error.response?.data
    })
    throw error
  }
}

/**
 * 벡터 검색 (AI 설명 없이 유사 상품만)
 * @param query - 검색 키워드
 * @param topK - 반환할 상품 개수 (기본: 5개)
 * @returns 유사 상품 리스트
 */
export const searchSimilarProducts = async (
  query: string, 
  topK: number = 5
): Promise<Product[]> => {
  console.log('🔍 Calling search API:', { query, topK })
  
  try {
    const res = await axiosInstance.get(`${recommendPrefix}/search`, {
      params: { query, topK }
    })
    
    console.log('✅ Search API response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Search API failed:', error)
    throw error
  }
}

/**
 * 채팅형 추천 API
 * @param message - 사용자 메시지
 * @returns 채팅 응답 + 추천 상품
 */
export const getChatRecommendation = async (message: string) => {
  console.log('💬 Calling chat API with message:', message)
  
  try {
    const res = await axiosInstance.post(`${recommendPrefix}/chat`, {
      message
    })
    
    console.log('✅ Chat API response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Chat API failed:', error)
    throw error
  }
}

/**
 * 전체 상품 벡터 DB 인덱싱 (관리자 전용)
 * 초기 설정 시 한 번만 실행
 */
export const indexAllProducts = async () => {
  console.log('📊 Indexing all products...')
  
  try {
    const res = await axiosInstance.post(`${recommendPrefix}/index/all`)
    console.log('✅ Indexing completed:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Indexing failed:', error)
    
    if (error.response?.status === 403) {
      throw new Error('관리자 권한이 필요합니다.')
    }
    
    throw error
  }
}

/**
 * 특정 상품 인덱싱 (관리자 전용)
 * 상품 추가/수정 시 호출
 */
export const indexProduct = async (pno: number) => {
  console.log('📊 Indexing product:', pno)
  
  try {
    const res = await axiosInstance.post(`${recommendPrefix}/index/${pno}`)
    console.log('✅ Product indexed:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Product indexing failed:', error)
    
    if (error.response?.status === 403) {
      throw new Error('관리자 권한이 필요합니다.')
    }
    
    throw error
  }
}

// =====================================
// 기존 Product CRUD APIs
// =====================================

/**
 * 상품 목록 조회 (페이징)
 */
export const getProductList = async (
  params?: PageParam
): Promise<PageResponseDTO<Product>> => {
  const res = await axiosInstance.get(`${prefix}/list`, { params })
  return res.data
}

/**
 * 상품 상세 조회
 */
export const getProduct = async (
  pno: number | string | undefined
): Promise<Product> => {
  if (!pno) {
    throw new Error('상품 번호가 필요합니다.')
  }
  
  const res = await axiosInstance.get(`${prefix}/${pno}`)
  return res.data
}

/**
 * 상품 등록
 */
export const createProduct = async (formData: FormData) => {
  const res = await axiosInstance.post(`${prefix}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  // ✅ 상품 등록 후 자동으로 벡터 DB에 인덱싱
  if (res.data.result) {
    try {
      await indexProduct(res.data.result)
      console.log('✅ 새 상품이 벡터 DB에 인덱싱되었습니다.')
    } catch (error) {
      console.warn('⚠️ 벡터 인덱싱 실패 (검색 기능에만 영향):', error)
    }
  }
  
  return res.data
}

/**
 * 상품 수정
 */
export const updateProduct = async (pno: number, formData: FormData) => {
  const res = await axiosInstance.put(`${prefix}/${pno}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  // ✅ 상품 수정 후 벡터 DB 재인덱싱
  try {
    await indexProduct(pno)
    console.log('✅ 수정된 상품이 벡터 DB에 재인덱싱되었습니다.')
  } catch (error) {
    console.warn('⚠️ 벡터 재인덱싱 실패 (검색 기능에만 영향):', error)
  }
  
  return res.data
}

/**
 * 상품 삭제
 */
export const deleteProduct = async (pno: number) => {
  const res = await axiosInstance.delete(`${prefix}/${pno}`)
  return res.data
}

/**
 * 상품 이미지 URL 생성
 */
export const getProductImage = (fileName: string): string => {
  if (!fileName) return ''
  return `${axiosInstance.defaults.baseURL}${prefix}/view/${fileName}`
}

// =====================================
// Helper Functions
// =====================================

/**
 * 상품 검색 (기존 방식 - 서버 검색)
 * @deprecated 대신 searchSimilarProducts 사용 권장
 */
export const searchProducts = async (keyword: string, params?: PageParam) => {
  const res = await axiosInstance.get(`${prefix}/list`, {
    params: {
      ...params,
      keyword
    }
  })
  return res.data
}

/**
 * 추천 기능 사용 가능 여부 확인
 */
export const checkRecommendationAvailable = async (): Promise<boolean> => {
  try {
    await axiosInstance.get(`${recommendPrefix}`, {
      params: { query: 'test' }
    })
    return true
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn('⚠️ 추천 기능이 비활성화되어 있습니다.')
      return false
    }
    return true
  }
}