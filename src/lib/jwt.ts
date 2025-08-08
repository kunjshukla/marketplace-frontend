/**
 * JWT token handling utilities
 */

export interface JWTPayload {
  sub: string; // Subject (user ID)
  email: string;
  name: string;
  iat: number; // Issued at
  exp: number; // Expiration time
  [key: string]: unknown;
}

/**
 * Decode JWT token without verification (for client-side use only)
 * Note: This is not secure for validation, only for extracting payload data
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    return decoded as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return new Date(payload.exp * 1000);
};

/**
 * Get time until token expires (in seconds)
 */
export const getTimeUntilExpiration = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Store JWT token in localStorage
 */
export const storeToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Retrieve JWT token from localStorage
 */
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Store user data in localStorage
 */
export const storeUserData = (userData: Record<string, unknown>): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

/**
 * Retrieve user data from localStorage
 */
export const getStoredUserData = (): Record<string, unknown> | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData) as Record<string, unknown>;
    }
  }
  return null;
};

/**
 * Remove user data from localStorage
 */
export const removeUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  removeToken();
  removeUserData();
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): { Authorization: string } | object => {
  const token = getStoredToken();
  if (token && !isTokenExpired(token)) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

/**
 * Auto-refresh token before expiration (if refresh token is available)
 * This is a placeholder for future implementation with refresh tokens
 */
export const setupTokenRefresh = (): (() => void) => {
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) {
    return () => {}; // No cleanup needed
  }

  const timeUntilExpiration = getTimeUntilExpiration(token);
  const refreshTime = Math.max(0, (timeUntilExpiration - 300) * 1000); // Refresh 5 minutes before expiration

  const timeoutId = setTimeout(async () => {
    try {
      // TODO: Implement refresh token logic here
      // const newToken = await refreshAccessToken();
      // if (newToken) {
      //   storeToken(newToken);
      //   onRefresh?.(newToken);
      // }
      console.log('Token refresh would occur here');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth data if refresh fails
      clearAuthData();
    }
  }, refreshTime);

  // Return cleanup function
  return () => clearTimeout(timeoutId);
};

/**
 * Format token expiration for display
 */
export const formatTokenExpiration = (token: string): string => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 'Unknown';

  return expiration.toLocaleString();
};

/**
 * Validate token format (basic check)
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};
