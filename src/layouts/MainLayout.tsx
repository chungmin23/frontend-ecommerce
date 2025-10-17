import { useEffect } from "react"
import { Outlet } from "react-router"
import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { useAuthStore } from "@/lib/auth-store"

export function MainLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
