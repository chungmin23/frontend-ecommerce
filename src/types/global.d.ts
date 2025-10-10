

interface PageParam {
  page ?: string | number
  size ?: string | number
}

interface UseCustomMoveReturn {
  moveToList: (pageParam?: PageParam) => void
  moveToModify: (tno:number) => void
  moveToRead: (tno:number) => void
  page: number
  size: number,
  refresh: boolean
}

interface PageRequestDTO {
  page:number,
  size: number
}

interface PageResponseDTO<T> {
  dtoList: T[]        // Generic array
  pageNumList: number[]   // Array of numbers
  pageRequestDTO : PageRequestDTO | null // Assuming it's an object or null
  prev: boolean       // Boolean indicating if there is a previous page
  next: boolean       // Boolean indicating if there is a next page
  totalCount: number     // Total count of items
  prevPage: number     // Previous page number
  nextPage: number      // Next page number
  totalPage: number     // Total number of pages
  current: number      // Current page number
}
  
interface ResultModal {
  title:string,
  content: string,
  callbackFn? : () => void 
}
    

  