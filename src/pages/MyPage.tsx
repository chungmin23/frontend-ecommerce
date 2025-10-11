import { useNavigate } from "react-router"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, LogOut } from "lucide-react"

export default function MyPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    navigate("/login")
    return null
  }

  const handleLogout = () => {
    logout()
    alert("로그아웃되었습니다.")
    navigate("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">내 정보</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 회원 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                회원 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">이름</label>
                <p className="mt-1 text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일
                </label>
                <p className="mt-1 text-lg">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">전화번호</label>
                  <p className="mt-1 text-lg">{user.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 계정 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/orders")}
              >
                주문 내역 조회
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/cart")}
              >
                장바구니
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 추가 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">아직 활동 내역이 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
