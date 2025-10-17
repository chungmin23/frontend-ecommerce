import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialSize?: number
}

export const usePagination = ({ initialPage = 1, initialSize = 10 }: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1))
  }, [])

  const changeSize = useCallback((newSize: number) => {
    setSize(newSize)
    setPage(1) // 사이즈 변경 시 첫 페이지로
  }, [])

  const reset = useCallback(() => {
    setPage(initialPage)
    setSize(initialSize)
  }, [initialPage, initialSize])

  return {
    page,
    size,
    goToPage,
    nextPage,
    prevPage,
    changeSize,
    reset
  }
}
