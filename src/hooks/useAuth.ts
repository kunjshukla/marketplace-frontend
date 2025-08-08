'use client';

import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user') || localStorage.getItem('user_data');

        if (token && userStr) {
          // Verify token is not expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp > currentTime) {
            const user = JSON.parse(userStr);
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } else {
            // Token expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }

        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (googleAuthCode: string): Promise<boolean> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: googleAuthCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      // Store in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update state
      setAuthState({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setError(null);
    
    try {
      // Attempt to notify backend
      if (authState.token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authState.token}`,
            },
          });
        } catch (error) {
          // Ignore backend logout errors, still clear local state
          console.warn('Backend logout failed:', error);
        }
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Clear state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    }
  }, [authState.token]);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    if (!authState.token) return false;

    setError(null);

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await logout();
          return false;
        }
        throw new Error('Failed to refresh user data');
      }

      const wrapper = await response.json();
      const userData = wrapper.data ? wrapper.data : wrapper; // support both schemas

      localStorage.setItem('user', JSON.stringify(userData));
      setAuthState(prev => ({
        ...prev,
        user: userData,
      }));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user data';
      setError(errorMessage);
      return false;
    }
  }, [authState.token, logout]);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name'>>): Promise<boolean> => {
    if (!authState.token) return false;

    setError(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Profile update failed');
      }

      const updatedUser: User = await response.json();

      // Update localStorage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      return false;
    }
  }, [authState.token]);

  const isTokenValid = useCallback((): boolean => {
    if (!authState.token) return false;

    try {
      const decoded = jwtDecode(authState.token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : false;
    } catch {
      return false;
    }
  }, [authState.token]);

  const getAuthHeader = useCallback((): { Authorization: string } | object => {
    if (authState.token && isTokenValid()) {
      return { Authorization: `Bearer ${authState.token}` };
    }
    return {};
  }, [authState.token, isTokenValid]);

  return {
    ...authState,
    error,
    login,
    logout,
    refreshUser,
    updateProfile,
    isTokenValid,
    getAuthHeader,
    clearError: () => setError(null),
  };
};
