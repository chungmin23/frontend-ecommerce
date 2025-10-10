import axiosInstance from './axios'

const prefix = '/todos'

// Todo 목록 조회
export const getTodoList = (params?: PageParam) => {
  return axiosInstance.get(`${prefix}/list`, { params })
}

// Todo 상세 조회
export const getTodo = (tno: number | string) => {
  return axiosInstance.get(`${prefix}/${tno}`)
}

// Todo 등록
export const createTodo = (todoData: TodoAdd) => {
  return axiosInstance.post(`${prefix}/`, todoData)
}

// Todo 수정
export const updateTodo = (tno: number, todoData: TodoModify) => {
  return axiosInstance.put(`${prefix}/${tno}`, todoData)
}

// Todo 삭제
export const deleteTodo = (tno: number) => {
  return axiosInstance.delete(`${prefix}/${tno}`)
}

