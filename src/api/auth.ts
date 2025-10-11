import axiosInstance from './axios'

const prefix = '/member'

// =====================================
// 타입 정의
// =====================================
export interface SignupRequest {
  email: string
  password: string
  name: string      // ← 프론트엔드는 name 사용
  phone?: string
}

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
// 회원가입
// =====================================
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  console.log('📝 회원가입 요청:', {
    email: data.email,
    password: data.password ? '***' : 'MISSING',
    name: data.name
  })

  // ✅ 비밀번호 검증
  if (!data.password) {
    throw new Error('비밀번호가 필요합니다.')
  }

  try {
    const res = await axiosInstance.post(`${prefix}/join`, {
      email: data.email,
      password: data.password,
      nickname: data.name,  // ← name을 nickname으로 변환
      phone: data.phone
    })

    console.log('✅ 회원가입 성공:', res.data)

    // ✅ 회원가입 성공 시 자동 로그인
    if (res.data.result === 'SUCCESS') {
      // 로그인 API 호출
      const loginParams = new URLSearchParams()
      loginParams.append('username', data.email)
      loginParams.append('password', data.password)

      const loginRes = await axiosInstance.post(`${prefix}/login`, loginParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      // 토큰 저장
      if (loginRes.data.accessToken) {
        localStorage.setItem('accessToken', loginRes.data.accessToken)
        localStorage.setItem('refreshToken', loginRes.data.refreshToken)
        
        const user = {
          email: loginRes.data.email,
          nickname: loginRes.data.nickname,
          social: loginRes.data.social,
          roleNames: loginRes.data.roleNames
        }
        localStorage.setItem('user', JSON.stringify(user))

        console.log('✅ 자동 로그인 완료')
      }

      return loginRes.data
    }

    return res.data
    
  } catch (error: any) {
    console.error('❌ 회원가입 실패:', error)
    console.error('Request data:', {
      email: data.email,
      hasPassword: !!data.password,
      nickname: data.name
    })
    console.error('Error response:', error.response?.data)
    
    // 에러 메시지 파싱
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    } else if (error.response?.status === 400) {
      throw new Error('잘못된 요청입니다. 입력 정보를 확인해주세요.')
    } else if (error.response?.status === 500) {
      throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
    
    throw error
  }
}

// =====================================
// 이메일 중복 체크
// =====================================
export const checkEmailAvailable = async (email: string): Promise<boolean> => {
  try {
    const res = await axiosInstance.get(`${prefix}/check-email`, {
      params: { email }
    })
    return res.data.available
  } catch (error) {
    console.error('이메일 체크 실패:', error)
    return true
  }
}

// =====================================
// 로그인
// =====================================
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const params = new URLSearchParams()
  params.append('username', data.email)
  params.append('password', data.password)

  try {
    const res = await axiosInstance.post(`${prefix}/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('🔐 Login response:', res.data)

    if (res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      
      const user = {
        email: res.data.email,
        nickname: res.data.nickname,
        social: res.data.social,
        roleNames: res.data.roleNames
      }
      localStorage.setItem('user', JSON.stringify(user))

      console.log('✅ Tokens saved!')
    }

    return res.data
  } catch (error: any) {
    console.error('❌ Login failed:', error)
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
}

// =====================================
// 현재 사용자 정보
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

    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)

    return res.data.accessToken
  } catch (error) {
    console.error('❌ Token refresh failed:', error)
    logout()
    throw error
  }
}