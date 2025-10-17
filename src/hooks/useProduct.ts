import { useState, useEffect } from 'react'
import { getProduct, getProductList, type Product, type PageResponseDTO, type PageParam } from '@/api/productApi'

export const useProduct = (pno: string | number | undefined) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pno) {
      setLoading(false)
      return
    }

    setLoading(true)
    getProduct(pno)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [pno])

  return { product, loading, error }
}

export const useProductList = (params?: PageParam) => {
  const [data, setData] = useState<PageResponseDTO<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    getProductList(params)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [params?.page, params?.size])

  return {
    products: data?.dtoList || [],
    pageInfo: data,
    loading,
    error
  }
}
