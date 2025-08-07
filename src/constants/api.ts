// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN_GOOGLE: `${API_BASE_URL}/auth/login-google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/auth/google/callback`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  
  // NFT
  NFT: {
    LIST: `${API_BASE_URL}/nft/list`,
    GET: (id: string) => `${API_BASE_URL}/nft/${id}`,
    BUY: `${API_BASE_URL}/nft/buy`,
    SEARCH: `${API_BASE_URL}/nft/search`,
    CATEGORIES: `${API_BASE_URL}/nft/categories`,
    FEATURED: `${API_BASE_URL}/nft/featured`,
    STATS: `${API_BASE_URL}/nft/stats`,
    MY_PURCHASES: `${API_BASE_URL}/nft/my-purchases`,
  },
  
  // Payment
  PAYMENT: {
    PAYPAL_PROCESS: `${API_BASE_URL}/payment/paypal/process`,
    UPI_GENERATE_QR: `${API_BASE_URL}/payment/upi/generate-qr`,
    UPI_VERIFY: `${API_BASE_URL}/payment/upi/verify`,
    STATUS: (id: string) => `${API_BASE_URL}/payment/status/${id}`,
    HISTORY: `${API_BASE_URL}/payment/history`,
    CANCEL: (id: string) => `${API_BASE_URL}/payment/cancel/${id}`,
    METHODS: `${API_BASE_URL}/payment/methods`,
  },
  
  // Email
  EMAIL: {
    SEND_QR: `${API_BASE_URL}/email/send-qr`,
  },
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
}

export default API_ENDPOINTS
