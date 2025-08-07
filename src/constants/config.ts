// App-wide configuration constants

export const APP_CONFIG = {
  // App Info
  APP_NAME: 'NFT Marketplace',
  APP_DESCRIPTION: 'Single-sale NFT marketplace with Google OAuth and multi-currency payments',
  APP_VERSION: '1.0.0',
  
  // PayPal Configuration
  PAYPAL: {
    CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    CURRENCY: 'USD',
  },
  
  // Google OAuth
  GOOGLE_OAUTH: {
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  
  // UI Settings
  UI: {
    ITEMS_PER_PAGE: 12,
    MAX_ITEMS_PER_PAGE: 50,
    PAGINATION_RANGE: 5,
    RESERVATION_TIMEOUT: 15, // minutes
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    CART: 'cart',
    THEME: 'theme',
  },
  
  // Supported Payment Methods
  PAYMENT_METHODS: {
    INR: {
      name: 'UPI',
      currency: 'INR',
      symbol: '₹',
      locale: 'en-IN',
      flag: '🇮🇳',
      description: 'Pay with UPI (GPay, PhonePe, Paytm)',
      processingType: 'manual',
    },
    USD: {
      name: 'PayPal',
      currency: 'USD',
      symbol: '$',
      locale: 'en-US',
      flag: '🌍',
      description: 'Pay with PayPal',
      processingType: 'automatic',
    },
  },
  
  // NFT Categories
  NFT_CATEGORIES: [
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'collectible', name: 'Collectibles', icon: '🃏' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'utility', name: 'Utility', icon: '🔧' },
  ],
  
  // Image Settings
  IMAGES: {
    PLACEHOLDER: '/images/nft-placeholder.png',
    LOGO: '/images/logo.png',
    DEFAULT_AVATAR: '/images/default-avatar.png',
    SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    AUTHENTICATION_ERROR: 'Authentication failed. Please sign in again.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    NFT_NOT_FOUND: 'NFT not found or no longer available.',
    PAYMENT_FAILED: 'Payment processing failed. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Successfully signed in!',
    LOGOUT_SUCCESS: 'Successfully signed out!',
    PURCHASE_INITIATED: 'Purchase initiated successfully!',
    EMAIL_SENT: 'Payment instructions sent to your email!',
    PAYMENT_CONFIRMED: 'Payment confirmed successfully!',
  },
  
  // API Settings
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Features flags
  FEATURES: {
    DARK_MODE: false,
    NOTIFICATIONS: true,
    ANALYTICS: true,
    PWA: false,
  },
}

export default APP_CONFIG
