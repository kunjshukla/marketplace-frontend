// Authentication API functions
import { API_ENDPOINTS } from '@/constants/api'
import { TokenResponse, GoogleOAuthResponse } from '@/types/user'

export class AuthAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  /**
   * Initiate Google OAuth login
   * Returns the authorization URL for redirect
   */
  static async initiateGoogleLogin(): Promise<{ authorization_url: string }> {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN_GOOGLE, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initiate Google login')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to initiate Google login')
    }

    return result.data
  }

  /**
   * Handle Google OAuth callback
   * Exchange authorization code for tokens
   */
  static async handleGoogleCallback(code: string): Promise<GoogleOAuthResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.GOOGLE_CALLBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Authentication failed')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Authentication failed')
    }

    return result.data
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      })

      // Clear local storage regardless of response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
      }

      if (!response.ok) {
        console.warn('Logout request failed, but local tokens cleared')
        return
      }

      const result = await response.json()
      if (!result.success) {
        console.warn('Logout response indicates failure, but local tokens cleared')
      }
    } catch (error) {
      console.warn('Logout request failed, but local tokens cleared:', error)
      // Clear local storage even if request fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Token refresh failed')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Token refresh failed')
    }

    return result.data
  }

  /**
   * Verify current token and get user info
   */
  static async verifyToken(): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Token verification failed')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Token verification failed')
    }

    return result.data
  }
}
