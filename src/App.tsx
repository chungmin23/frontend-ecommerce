import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { CategorySection } from "@/components/CategorySection"
import { ProductGrid } from "@/components/ProductGrid"
import { Footer } from "@/components/Footer"

function App() {
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

export default App
