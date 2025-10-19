import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ✅ 실제 토큰 기반 로그인 체크
      login: async () => {
        // LoginPage에서 이미 API를 호출하고 토큰을 저장함
        // 여기서는 localStorage의 토큰과 유저 정보를 확인
        const accessToken = localStorage.getItem('accessToken')
        const userStr = localStorage.getItem('user')

        if (accessToken && userStr) {
          try {
            const userData = JSON.parse(userStr)
            const user: User = {
              id: userData.email, // email을 id로 사용
              email: userData.email,
              name: userData.nickname,
              phone: userData.phone,
            }
            set({ user, isAuthenticated: true })
            return true
          } catch (error) {
            console.error('Failed to parse user data:', error)
            return false
          }
        }
        return false
      },

      // ✅ 회원가입도 동일하게 처리
      signup: async () => {
        const accessToken = localStorage.getItem('accessToken')
        const userStr = localStorage.getItem('user')

        if (accessToken && userStr) {
          try {
            const userData = JSON.parse(userStr)
            const user: User = {
              id: userData.email,
              email: userData.email,
              name: userData.nickname || name,
              phone: userData.phone,
            }
            set({ user, isAuthenticated: true })
            return true
          } catch (error) {
            console.error('Failed to parse user data:', error)
            return false
          }
        }
        return false
      },

      // ✅ 로그아웃 시 localStorage도 정리
      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        set({ user: null, isAuthenticated: false })
      },

      // ✅ 인증 상태 확인 (페이지 로드 시 호출)
      checkAuth: () => {
        const accessToken = localStorage.getItem('accessToken')
        const userStr = localStorage.getItem('user')

        if (accessToken && userStr) {
          try {
            const userData = JSON.parse(userStr)
            const user: User = {
              id: userData.email,
              email: userData.email,
              name: userData.nickname,
              phone: userData.phone,
            }
            set({ user, isAuthenticated: true })
          } catch (error) {
            console.error('Failed to parse user data:', error)
            set({ user: null, isAuthenticated: false })
          }
        } else {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
