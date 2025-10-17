import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-background to-orange-100/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-slide-up">
            새로운 라이프스타일을
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              경험하세요
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI가 추천하는 당신만을 위한 특별한 상품들을 만나보세요
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="text-base bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <a href="/products">쇼핑 시작하기</a>
            </Button>
            <Button size="lg" variant="outline" className="text-base border-2 border-orange-600 text-orange-600 hover:bg-orange-50 transition-all duration-300">
              <a href="/new">신상품 보기</a>
            </Button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}} />
    </section>
  )
}
