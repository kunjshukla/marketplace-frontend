'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: any) => void
  trackPageView: (pageName: string) => void
  trackPurchase: (nftId: string, amount: number, currency: string) => void
  trackNFTView: (nftId: string) => void
  isAnalyticsEnabled: boolean
  setAnalyticsEnabled: (enabled: boolean) => void
}

const AnalyticsContext = createContext(undefined)

interface AnalyticsProviderProps {
  children: any
}

// Initialize Mixpanel (if available)
let mixpanel: any = null
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  try {
    // In a real app, you would import Mixpanel properly
    // import mixpanel from 'mixpanel-browser'
    console.log('Mixpanel would be initialized here with token:', process.env.NEXT_PUBLIC_MIXPANEL_TOKEN)
    
    // Simulate mixpanel object
    mixpanel = {
      track: (event: string, properties?: any) => {
        console.log('Mixpanel track:', event, properties)
      },
      track_pageview: (page: string) => {
        console.log('Mixpanel page view:', page)
      },
    }
  } catch (error) {
    console.error('Failed to initialize Mixpanel:', error)
  }
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true)

  // Load analytics preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('analytics_enabled')
    if (savedPreference !== null) {
      setIsAnalyticsEnabled(JSON.parse(savedPreference))
    }
  }, [])

  // Save analytics preference to localStorage
  useEffect(() => {
    localStorage.setItem('analytics_enabled', JSON.stringify(isAnalyticsEnabled))
  }, [isAnalyticsEnabled])

  const trackEvent = (eventName: string, properties?: any) => {
    if (!isAnalyticsEnabled) return

    console.log('Analytics Event:', eventName, properties)
    
    // Track with Mixpanel if available
    if (mixpanel) {
      mixpanel.track(eventName, {
        timestamp: new Date().toISOString(),
        ...properties,
      })
    }

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties)
    }
  }

  const trackPageView = (pageName: string) => {
    if (!isAnalyticsEnabled) return

    console.log('Analytics Page View:', pageName)
    
    // Track with Mixpanel
    if (mixpanel) {
      mixpanel.track_pageview(pageName)
    }

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_title: pageName,
        page_location: window.location.href,
      })
    }
  }

  const trackPurchase = (nftId: string, amount: number, currency: string) => {
    trackEvent('NFT Purchase', {
      nft_id: nftId,
      amount,
      currency,
      timestamp: new Date().toISOString(),
    })
  }

  const trackNFTView = (nftId: string) => {
    trackEvent('NFT View', {
      nft_id: nftId,
      timestamp: new Date().toISOString(),
    })
  }

  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackNFTView,
    isAnalyticsEnabled,
    setAnalyticsEnabled: setIsAnalyticsEnabled,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

// Analytics tracking hooks
export function usePageTracking() {
  const { trackPageView } = useAnalytics()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname)
    }
  }, [trackPageView])
}

export function useEventTracking() {
  const { trackEvent } = useAnalytics()
  
  return {
    trackClick: (element: string, properties?: any) => {
      trackEvent('Button Click', { element, ...properties })
    },
    trackSearch: (query: string, results: number) => {
      trackEvent('Search', { query, results })
    },
    trackFilter: (filterType: string, value: string) => {
      trackEvent('Filter Applied', { filter_type: filterType, value })
    },
  }
}
