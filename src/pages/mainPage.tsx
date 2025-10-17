import { Header } from "@/components/common/Header"
import { HeroSection } from "@/components/common/HeroSection"
import { CategorySection } from "@/components/product/CategorySection"
import { ProductGrid } from "@/components/product/ProductGrid"
import { Footer } from "@/components/common/Footer"

function MainPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}

export default MainPage
