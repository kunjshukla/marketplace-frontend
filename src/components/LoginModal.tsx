'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { API_ENDPOINTS } from '../constants/api'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isLoading, error } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (!document.getElementById('google-identity-script')) {
        const script = document.createElement('script')
        script.id = 'google-identity-script'
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        script.onload = () => initializeGoogleSignIn()
      } else if (window.google) {
        initializeGoogleSignIn()
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const initializeGoogleSignIn = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('Google Client ID not configured')
      setLocalError('Google authentication is not configured')
      return
    }
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true
        })
        const btn = document.getElementById('google-btn-container')
        if (btn) {
          window.google.accounts.id.renderButton(btn, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular'
          })
        }
      } catch (e) {
        console.error('Failed to initialize Google Sign-In:', e)
        setLocalError('Failed to initialize Google Sign-In')
      }
    }
  }

  const handleCredentialResponse = async (response: any) => {
    setIsGoogleLoading(true)
    try {
      const backendResponse = await fetch(API_ENDPOINTS.AUTH.GOOGLE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      })

      const result = await backendResponse.json()
      
      if (result.success && result.data) {
        const { access_token, refresh_token, user } = result.data
        
        // Store tokens with consistent naming
        localStorage.setItem('token', access_token)
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token)
        }
        localStorage.setItem('user', JSON.stringify(user))
        
        // Close modal and reload to trigger auth context update
        onClose()
        window.location.reload()
      } else {
        console.error('Login failed:', result.message || 'Unknown error')
        setLocalError(result.message || 'Login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      setLocalError('Login failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setLocalError('Google authentication is not configured')
      return
    }
    if (window.google) {
      setIsGoogleLoading(true)
      try {
        // Trigger One Tap / popup prompt (credential only)
        window.google.accounts.id.prompt()
        setIsGoogleLoading(false)
      } catch (e) {
        console.error('Failed to start Google Sign-In:', e)
        setLocalError('Failed to start Google Sign-In')
        setIsGoogleLoading(false)
      }
    } else {
      setLocalError('Google Sign-In is not available')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom glass-card rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Sign In
              </h3>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-white/70">
              Sign in to your account to purchase NFTs and access your collection.
            </p>
          </div>

          <div className="px-6 pb-6">
            {(error || localError) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error || localError}
              </div>
            )}

            <div id="google-btn-container" className="mb-4 flex justify-center" />
            <div className="text-center text-white/40 text-xs mb-4">or</div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGoogleLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
