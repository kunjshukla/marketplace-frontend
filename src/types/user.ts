// User-related type definitions

export interface User {
  id: number
  name: string
  email: string
  google_id: string
  profile_pic?: string
  role: 'user' | 'admin'
  is_active: boolean
  created_at: string
}

export interface UserCreate {
  name: string
  email: string
  google_id: string
  profile_pic?: string
}

export interface UserUpdate {
  name?: string
  profile_pic?: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
  google_id: string
  profile_pic?: string
  role: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserResponse
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email?: string, password?: string) => Promise<void>
  loginWithGoogle: () => void
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

export interface GoogleOAuthResponse {
  access_token: string
  refresh_token: string
  user: UserResponse
}
