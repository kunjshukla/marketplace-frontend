// API service for making requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.getHeaders()

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email: string, password?: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async googleLogin(code: string) {
    return this.request('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // NFT endpoints
  async getNFTs(params?: {
    page?: number
    limit?: number
    category?: string
    sort_by?: string
    min_price?: number
    max_price?: number
    currency?: string
    available_only?: boolean
  }) {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    return this.request(`/nfts?${searchParams.toString()}`)
  }

  async getNFTById(id: string) {
    return this.request(`/nfts/${id}`)
  }

  async createNFT(nftData: any) {
    return this.request('/nfts', {
      method: 'POST',
      body: JSON.stringify(nftData),
    })
  }

  async updateNFT(id: string, nftData: any) {
    return this.request(`/nfts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(nftData),
    })
  }

  async deleteNFT(id: string) {
    return this.request(`/nfts/${id}`, {
      method: 'DELETE',
    })
  }

  // Purchase endpoints
  async purchaseNFT(nftId: string, currency: 'INR' | 'USD', formData?: { name: string; email: string; phone: string }) {
    const endpoint = currency === 'INR'
      ? `/purchase/inr/${nftId}`
      : `/purchase/usd/${nftId}`
    
    const body = currency === 'INR' && formData
      ? { form_data: formData }
      : undefined

    return this.request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async confirmPayment(transactionId: string) {
    return this.request('/purchase/confirm', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    })
  }

  async getPurchaseHistory(page: number = 1, limit: number = 20) {
    return this.request(`/purchase/history?page=${page}&limit=${limit}`)
  }

  async downloadCertificate(transactionId: string) {
    const url = `${this.baseURL}/purchase/${transactionId}/certificate`
    const headers = this.getHeaders()

    const response = await fetch(url, {
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to download certificate')
    }

    return response.blob()
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats')
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`)
  }

  async verifyUser(userId: string) {
    return this.request(`/admin/users/${userId}/verify`, {
      method: 'POST',
    })
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  async getAllTransactions(page: number = 1, limit: number = 20) {
    return this.request(`/admin/transactions?page=${page}&limit=${limit}`)
  }

  // Analytics endpoints
  async getAnalytics(period: string = '30d') {
    return this.request(`/analytics?period=${period}`)
  }

  async trackEvent(event: string, properties: any) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event,
        properties,
      }),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

// Create and export a singleton instance
export const apiService = new APIService()

// Export types for better TypeScript support
export interface NFT {
  id: string
  title: string
  description: string
  image_url: string
  price_inr: number
  price_usd: number
  category: string
  creator_id: string
  creator_name: string
  is_sold: boolean
  is_reserved: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'admin'
  is_verified: boolean
  profile_picture?: string
  created_at: string
}

export interface Transaction {
  id: string
  nft_id: string
  buyer_id: string
  seller_id: string
  amount_inr: number
  amount_usd: number
  currency: string
  status: string
  payment_method: string
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  total_pages: number
  total_items: number
  has_next: boolean
  has_prev: boolean
}

export default apiService
