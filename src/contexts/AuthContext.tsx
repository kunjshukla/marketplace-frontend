'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook, User } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (googleAuthCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<User, 'name'>>) => Promise<boolean>;
  isTokenValid: () => boolean;
  getAuthHeader: () => { Authorization: string } | object;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook for API calls with authentication
export function useAuthFetch() {
  const { getAuthHeader } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...getAuthHeader(),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return authFetch;
}
