'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'admin'
  is_verified: boolean
  profile_picture?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext(undefined)

interface AuthProviderProps {
  children: any
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = Boolean(user && token)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
    
    setIsLoading(false)
  }, [])

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }, [user, token])

  const login = async (email: string, password?: string) => {
    setIsLoading(true)
    try {
      // For demo purposes, simulate a successful login without backend
      console.log('🔄 Demo login for:', email)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create demo user data
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        name: email.includes('demo') ? 'Demo User' : email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'buyer',
        is_verified: true,
        profile_picture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3B82F6&color=fff`
      }
      
      const demoToken = 'demo-jwt-token-' + Date.now()
      
      setToken(demoToken)
      setUser(demoUser)
      
      console.log('✅ Demo login successful:', demoUser)
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would handle Google OAuth flow
      // For now, we'll simulate it
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook for API calls with authentication
export function useAuthFetch() {
  const { token } = useAuth()

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  return authFetch
}
