import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { login as loginApi } from "@/api/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const loginToStore = useAuthStore((state) => state.login)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setLoading(true)

      console.log('🔄 로그인 시도:', { email: formData.email })

      // API 호출
      const response = await loginApi({
        email: formData.email,
        password: formData.password
      })

      console.log('✅ 로그인 성공:', response)

      // ✅ 수정: response.user.email → response.email
      loginToStore(response.email, formData.password)

      alert(`환영합니다, ${response.nickname}님!`)
      navigate("/")
      
    } catch (error: any) {
      console.error("❌ 로그인 실패:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)

      // 에러 메시지 처리
      let errorMessage = "로그인에 실패했습니다."
      
      if (error.response?.data?.error === "ERROR_LOGIN") {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다."
      } else if (error.response?.status === 401) {
        errorMessage = "인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center mb-2">로그인</h1>
          <p className="text-sm text-muted-foreground text-center">
            쇼핑몰 계정으로 로그인하세요
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호 입력"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "로그인"}
            </Button>

            <div className="text-center text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">계정이 없으신가요? </span>
                <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}