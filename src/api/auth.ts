import axiosInstance from './axios'

const prefix = '/member'

// =====================================
// 타입 정의
// =====================================
export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  email: string
  pw: string
  nickname: string
  social: boolean
  roleNames: string[]
  accessToken: string
  refreshToken: string
}

// =====================================
// 로그인 (URLSearchParams 방식)
// =====================================
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  // ✅ URLSearchParams로 변환
  const params = new URLSearchParams()
  params.append('username', data.email)  // ← Spring Security는 username 필드 사용
  params.append('password', data.password)

  try {
    const res = await axiosInstance.post(`${prefix}/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('🔐 Login response:', res.data)

    // ✅ 토큰 저장
    if (res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      
      // 사용자 정보도 저장
      const user = {
        email: res.data.email,
        nickname: res.data.nickname,
        social: res.data.social,
        roleNames: res.data.roleNames
      }
      localStorage.setItem('user', JSON.stringify(user))

      console.log('✅ Tokens saved!')
      console.log('✅ User info:', user)
    } else {
      console.error('❌ No accessToken in response!')
    }

    return res.data
  } catch (error: any) {
    console.error('❌ Login failed:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// =====================================
// 로그아웃
// =====================================
export const logout = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  console.log('✅ Logged out')
}

// =====================================
// 현재 사용자 정보 조회
// =====================================
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// =====================================
// 토큰 갱신
// =====================================
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken')
  const accessToken = localStorage.getItem('accessToken')

  if (!refreshToken || !accessToken) {
    throw new Error('No tokens found')
  }

  try {
    const res = await axiosInstance.get('/member/refresh', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        refreshToken
      }
    })

    console.log('🔄 Token refreshed')

    // 새 토큰 저장
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)

    return res.data.accessToken
  } catch (error) {
    console.error('❌ Token refresh failed:', error)
    logout()
    throw error
  }
}

// =====================================
// 로그인 상태 확인
// =====================================
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken')
}