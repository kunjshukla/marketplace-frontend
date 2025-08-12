// Authentication API functions
import { API_ENDPOINTS } from '@/constants/api'

export class AuthAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('access_token')) : null
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  /**
   * Initiate Google login (One Tap only)
   */
  static async initiateGoogleLogin(): Promise<void> {
    // No-op: handled by Google Identity Services popup/One Tap
    return Promise.resolve()
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
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * Verify current token and get user info
   */
  static async verifyToken(): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.AUTH.ME, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      let detail = 'Token verification failed'
      try { const err = await response.json(); detail = err.message || err.detail || detail } catch (e) { /* ignore error in parsing error response */ }
      throw new Error(detail)
    }
    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message || 'Token verification failed')
    }
    return result.data
  }
}
