'use client'

import { AuthProvider } from '../contexts/AuthContext'
import { AnalyticsProvider } from '../contexts/AnalyticsContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  )
}
