'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorBanner } from '../../components/ErrorBanner';
import { API_ENDPOINTS } from '@/constants/api';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, error, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/');
      return;
    }

    // Inject Google One Tap script
    if (!window.google && GOOGLE_CLIENT_ID) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            // Send credential to backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();
            if (data.success && data.data) {
              localStorage.setItem('token', data.data.access_token);
              localStorage.setItem('user', JSON.stringify(data.data.user));
              router.replace('/');
            } else {
              alert('Google sign-in failed');
            }
          },
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-one-tap'),
          { theme: 'outline', size: 'large' }
        );
        window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
    }
  }, [isAuthenticated, router]);

  // PATCH: Move this useEffect to top level
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      (async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          const data = await res.json()
          if (data?.success && data?.data) {
            const { access_token, refresh_token, user } = data.data
            localStorage.setItem('token', access_token)
            if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
            localStorage.setItem('user', JSON.stringify(user))
            router.replace('/')
          } else {
            alert(data?.message || 'Invalid or expired link')
          }
        } catch (e) {
          alert('Failed to verify link')
        }
      })()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

            {/* Magic Link Login */}
            <div className="space-y-3">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const formData = new FormData(form);
                  const email = String(formData.get('email') || '').trim();
                  if (!email) return;
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-link`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  const data = await res.json();
                  if (data?.success) {
                    alert('Login link sent. Check your email.');
                  } else {
                    alert(data?.message || 'Failed to send login link');
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
                <button type="submit" className="btn-primary w-full">Send Login Link</button>
              </form>
            </div>

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div id="google-one-tap" className="mb-6" />
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
