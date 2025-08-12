// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    MAGIC_REQUEST: `${API_BASE_URL}/api/auth/request-link`,
    MAGIC_VERIFY: `${API_BASE_URL}/api/auth/verify-link`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },

  // NFT
  NFT: {
    LIST: `${API_BASE_URL}/api/nft/list`,
    GET: (id: string) => `${API_BASE_URL}/api/nft/${id}`,
    BUY: `${API_BASE_URL}/api/nft/buy`,
    SEARCH: `${API_BASE_URL}/api/nft/search`,
    CATEGORIES: `${API_BASE_URL}/api/nft/categories`,
    FEATURED: `${API_BASE_URL}/api/nft/featured`,
    STATS: `${API_BASE_URL}/api/nft/stats`,
    MY_PURCHASES: `${API_BASE_URL}/api/nft/my-purchases`,
  },

  // Payment
  PAYMENT: {
    PAYPAL_PROCESS: `${API_BASE_URL}/api/payment/paypal/process`,
    UPI_GENERATE_QR: `${API_BASE_URL}/api/payment/upi/generate-qr`,
    UPI_VERIFY: `${API_BASE_URL}/api/payment/upi/verify`,
    STATUS: (id: string) => `${API_BASE_URL}/api/payment/status/${id}`,
    HISTORY: `${API_BASE_URL}/api/payment/history`,
    CANCEL: (id: string) => `${API_BASE_URL}/api/payment/cancel/${id}`,
    METHODS: `${API_BASE_URL}/api/payment/methods`,
  },

  // Email
  EMAIL: {
    SEND_QR: `${API_BASE_URL}/api/email/send-qr`,
  },

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
}

export default API_ENDPOINTS
