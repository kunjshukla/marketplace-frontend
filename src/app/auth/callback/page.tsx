'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiService } from '../../../services/api'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')

        if (errorParam) {
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            router.push('/')
          }, 3000)
          return
        }

        if (code) {
          // Send code to backend
          try {
            const response: any = await apiService.googleLogin(code)
            
            if (response.success && response.data) {
              const { access_token, refresh_token, user } = response.data
              
              // Store tokens
              apiService.setToken(access_token)
              localStorage.setItem('refresh_token', refresh_token)
              localStorage.setItem('user_data', JSON.stringify(user))
              
              // Redirect to home page
              router.push('/')
            } else {
              setError('Authentication failed. Please try again.')
              setTimeout(() => {
                router.push('/')
              }, 3000)
            }
          } catch (err: any) {
            console.error('Authentication error:', err)
            setError(err.message || 'Authentication failed')
            setTimeout(() => {
              router.push('/')
            }, 3000)
          }
        } else {
          setError('No authorization code received')
          setTimeout(() => {
            router.push('/')
          }, 3000)
        }
      } catch (err) {
        console.error('Callback handling error:', err)
        setError('An error occurred during authentication')
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we finish setting up your account.
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In Successful!
            </h2>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading...
            </h2>
            <p className="text-gray-600">
              Please wait while we process your request.
            </p>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}