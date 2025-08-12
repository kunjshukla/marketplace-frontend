/**
 * Google One Tap / Credential utilities (OAuth redirect/code flow disabled)
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export interface GoogleAuthConfig {
  client_id: string;
}

export const googleAuthConfig: GoogleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID || '',
};

// Redirect/code flow disabled – keep stubs for backward compatibility
export const getGoogleAuthUrl = (): string => {
  throw new Error('Redirect flow disabled. Use One Tap credential.');
};
export const initiateGoogleLogin = (): void => {
  throw new Error('Redirect flow disabled. Use LoginModal popup.');
};
export const handleOAuthCallback = (): { code: string; state: string } | null => {
  throw new Error('Redirect flow disabled.');
};
export const isOAuthCallback = (): boolean => false;
export const cleanupOAuthUrl = (): void => {};

export const generateState = (): string => {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return array.join('');
};
export const validateState = (_receivedState: string): boolean => true;
export const storeState = (_state: string): void => {};

export const validateGoogleConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!GOOGLE_CLIENT_ID) errors.push('Google Client ID is not configured (NEXT_PUBLIC_GOOGLE_CLIENT_ID)');
  return { valid: errors.length === 0, errors };
};

export {};
