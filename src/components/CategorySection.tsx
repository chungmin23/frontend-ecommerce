import { Card } from "@/components/ui/card"
import { Smartphone, Headphones, Watch, Laptop, Camera, Home } from "lucide-react"

const CATEGORIES = [
  { name: "스마트폰", icon: Smartphone, href: "/category/smartphone", color: "from-blue-500 to-cyan-500" },
  { name: "오디오", icon: Headphones, href: "/category/audio", color: "from-purple-500 to-pink-500" },
  { name: "웨어러블", icon: Watch, href: "/category/wearable", color: "from-green-500 to-emerald-500" },
  { name: "컴퓨터", icon: Laptop, href: "/category/computer", color: "from-orange-500 to-red-500" },
  { name: "카메라", icon: Camera, href: "/category/camera", color: "from-indigo-500 to-blue-500" },
  { name: "홈/리빙", icon: Home, href: "/category/home", color: "from-amber-500 to-yellow-500" },
]

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background via-orange-50/30 to-background">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          카테고리
        </h2>
        <p className="text-muted-foreground text-lg">원하는 카테고리를 선택해보세요</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon
          return (
            <a key={category.name} href={category.href}>
              <Card
                className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer group border-2 border-transparent hover:border-orange-200 bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-sm group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </span>
                </div>
              </Card>
            </a>
          )
        })}
      </div>
    </section>
  )
}
