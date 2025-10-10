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
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication - in real app, this would call an API
        if (email && password) {
          const user: User = {
            id: "1",
            email,
            name: "홍길동",
            phone: "010-1234-5678",
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      signup: async (email: string, password: string, name: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock signup - in real app, this would call an API
        if (email && password && name) {
          const user: User = {
            id: "1",
            email,
            name,
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
