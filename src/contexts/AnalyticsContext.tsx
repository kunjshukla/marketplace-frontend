'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void;
  trackPageView: (pageName: string) => void;
  trackPurchase: (nftId: string, amount: number, currency: string) => void;
  trackNFTView: (nftId: string) => void;
  isAnalyticsEnabled: boolean;
  setAnalyticsEnabled: (enabled: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

// Initialize Mixpanel (if available)
let mixpanel: {
  track?: (event: string, properties?: Record<string, unknown>) => void;
  track_pageview?: (page: string) => void;
} | null = null;
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  try {
    // Simulate mixpanel object
    mixpanel = {
      track: (event: string, properties?: Record<string, unknown>) => {
        console.log('Mixpanel track:', event, properties);
      },
      track_pageview: (page: string) => {
        console.log('Mixpanel page view:', page);
      },
    };
  } catch (error) {
    console.error('Failed to initialize Mixpanel:', error);
  }
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);

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

  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (!isAnalyticsEnabled) return;
    console.log('Analytics Event:', eventName, properties);
    if (mixpanel && typeof mixpanel.track === 'function') {
      mixpanel.track(eventName, {
        timestamp: new Date().toISOString(),
        ...properties,
      });
    }
    if (typeof window !== 'undefined' && typeof (window as { gtag?: (event: string, ...args: unknown[]) => void }).gtag === 'function') {
      (window as { gtag?: (event: string, ...args: unknown[]) => void }).gtag!('event', eventName, properties);
    }
  }

  const trackPageView = (pageName: string) => {
    if (!isAnalyticsEnabled) return;
    console.log('Analytics Page View:', pageName);
    if (mixpanel && typeof mixpanel.track_pageview === 'function') {
      mixpanel.track_pageview(pageName);
    }
    if (typeof window !== 'undefined' && typeof (window as { gtag?: (event: string, ...args: unknown[]) => void }).gtag === 'function') {
      (window as { gtag?: (event: string, ...args: unknown[]) => void }).gtag!('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_title: pageName,
        page_location: window.location.href,
      });
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
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
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
  const { trackEvent } = useAnalytics();
  return {
    trackClick: (element: string, properties?: Record<string, unknown>) => {
      trackEvent('Button Click', { element, ...properties });
    },
    trackSearch: (query: string, results: number) => {
      trackEvent('Search', { query, results });
    },
    trackFilter: (filterType: string, value: string) => {
      trackEvent('Filter Applied', { filter_type: filterType, value });
    },
  };
}
