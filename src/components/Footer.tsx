import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SHOP</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              최고의 쇼핑 경험을 제공하는
              <br />
              온라인 쇼핑몰입니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">고객센터</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help" className="text-muted-foreground hover:text-accent transition-colors">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-muted-foreground hover:text-accent transition-colors">
                  배송 안내
                </a>
              </li>
              <li>
                <a href="/returns" className="text-muted-foreground hover:text-accent transition-colors">
                  반품/교환
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                  1:1 문의
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">쇼핑 정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  회사 소개
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="/partners" className="text-muted-foreground hover:text-accent transition-colors">
                  입점 문의
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">소셜 미디어</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                className="p-2 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                className="p-2 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                className="p-2 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
