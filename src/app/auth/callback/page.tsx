'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DeprecatedAuthCallbackPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">/auth/callback deprecated. Redirecting...</p>
    </div>
  )
}