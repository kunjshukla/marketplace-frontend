/**
 * Google OAuth client configuration and utilities
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;

export interface GoogleAuthConfig {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: string;
  access_type: string;
  prompt: string;
}

export const googleAuthConfig: GoogleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID || '',
  redirect_uri: GOOGLE_REDIRECT_URI,
  scope: 'openid profile email',
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
};

/**
 * Generate Google OAuth URL for authentication
 */
export const getGoogleAuthUrl = (): string => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: googleAuthConfig.client_id,
    redirect_uri: googleAuthConfig.redirect_uri,
    scope: googleAuthConfig.scope,
    response_type: googleAuthConfig.response_type,
    access_type: googleAuthConfig.access_type,
    prompt: googleAuthConfig.prompt,
    state: generateState(), // CSRF protection
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Generate a random state parameter for CSRF protection
 */
export const generateState = (): string => {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return array.join('');
};

/**
 * Validate state parameter
 */
export const validateState = (receivedState: string): boolean => {
  const storedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state'); // Clean up
  return storedState === receivedState;
};

/**
 * Store state in session storage
 */
export const storeState = (state: string): void => {
  sessionStorage.setItem('oauth_state', state);
};

/**
 * Initiate Google OAuth login
 */
export const initiateGoogleLogin = (): void => {
  try {
    const authUrl = getGoogleAuthUrl();
    const urlParams = new URLSearchParams(authUrl.split('?')[1]);
    const state = urlParams.get('state');
    
    if (state) {
      storeState(state);
    }

    // Redirect to Google OAuth
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Google login:', error);
    throw error;
  }
};

/**
 * Handle OAuth callback and extract authorization code
 */
export const handleOAuthCallback = (): { code: string; state: string } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (error) {
    throw new Error(`OAuth error: ${error}`);
  }

  if (!code || !state) {
    return null;
  }

  // Validate state for CSRF protection
  if (!validateState(state)) {
    throw new Error('Invalid state parameter - possible CSRF attack');
  }

  return { code, state };
};

/**
 * Check if we're in an OAuth callback flow
 */
export const isOAuthCallback = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('code') && urlParams.has('state');
};

/**
 * Clean up OAuth callback parameters from URL
 */
export const cleanupOAuthUrl = (): void => {
  if (isOAuthCallback()) {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('scope');
    url.searchParams.delete('authuser');
    url.searchParams.delete('prompt');
    
    window.history.replaceState({}, document.title, url.toString());
  }
};

/**
 * Google OAuth configuration validation
 */
export const validateGoogleConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!GOOGLE_CLIENT_ID) {
    errors.push('Google Client ID is not configured (NEXT_PUBLIC_GOOGLE_CLIENT_ID)');
  }

  if (!GOOGLE_REDIRECT_URI) {
    errors.push('Google Redirect URI is not configured (NEXT_PUBLIC_GOOGLE_REDIRECT_URI)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
