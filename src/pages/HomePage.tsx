import { HeroSection } from "@/components/common/HeroSection"
import { CategorySection } from "@/components/product/CategorySection"
import { ProductGrid } from "@/components/product/ProductGrid"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <ProductGrid />
    </>
  )
}
