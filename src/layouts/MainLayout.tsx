import { Outlet } from "react-router"
import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"

export function MainLayout() {
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
