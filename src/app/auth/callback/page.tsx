'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
// import { apiService } from '../../../services/api' // Service doesn't exist, will implement auth flow differently

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

function AuthCallbackContent() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
      fetch(`${backendUrl}/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Tokens:", data)
        if (data.success && data.data) {
          const { access_token, refresh_token, user } = data.data
          
          // Store tokens
          localStorage.setItem('access_token', access_token)
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
        setIsProcessing(false)
      })
      .catch(err => {
        console.error(err)
        setError('Authentication failed. Please try again.')
        setTimeout(() => {
          router.push('/')
        }, 3000)
        setIsProcessing(false)
      });
    } else {
      setError('No authorization code received')
      setTimeout(() => {
        router.push('/')
      }, 3000)
      setIsProcessing(false)
    }
  }, [router])

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