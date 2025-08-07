'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorBanner } from '../../components/ErrorBanner';
import { isOAuthCallback, handleOAuthCallback, cleanupOAuthUrl } from '../../lib/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login, error, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      const returnTo = searchParams?.get('returnTo') || '/';
      router.replace(returnTo);
      return;
    }

    // Handle OAuth callback if present
    if (isOAuthCallback()) {
      handleOAuthCallback();
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      try {
        const callbackData = handleOAuthCallback();
        if (callbackData) {
          const success = await login(callbackData.code);
          if (success) {
            cleanupOAuthUrl();
            const returnTo = searchParams?.get('returnTo') || '/';
            router.replace(returnTo);
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        cleanupOAuthUrl();
      }
    };

    if (isOAuthCallback()) {
      handleCallback();
    }
  }, [login, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access exclusive NFT collections and start your digital art journey
          </p>
        </div>

        {error && (
          <ErrorBanner 
            error={error} 
            type="error" 
            className="mb-6"
          />
        )}

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <GoogleLoginButton className="w-full" />
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Why sign in?
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Purchase unique NFTs from verified creators</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Track your collection and transaction history</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Secure payments with PayPal and UPI</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Get notified about new releases and exclusive drops</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
