'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface NFTBuyFormProps {
  nft: {
    id: number
    title: string
    price_inr: number
    price_usd: number
    is_sold: boolean
    is_reserved: boolean
  }
  onPurchaseStart?: (paymentMode: 'INR' | 'USD') => void
  onPurchaseError?: (error: string) => void
  className?: string
}

export default function NFTBuyForm({ 
  nft, 
  onPurchaseStart, 
  onPurchaseError,
  className = '' 
}: NFTBuyFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [selectedPayment, setSelectedPayment] = useState<'INR' | 'USD'>('INR')
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`
    }
    return `$${price.toFixed(2)}`
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nft/${nft.id}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          payment_mode: selectedPayment
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Purchase failed')
      }

      const result = await response.json()
      
      if (result.success) {
        onPurchaseStart?.(selectedPayment)
      } else {
        throw new Error(result.message || 'Purchase failed')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed'
      console.error('Purchase error:', errorMessage)
      onPurchaseError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const canPurchase = !nft.is_sold && !nft.is_reserved && isAuthenticated

  if (nft.is_sold) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">NFT Sold</h3>
        <p className="text-gray-600">This NFT has already been purchased.</p>
      </div>
    )
  }

  if (nft.is_reserved) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">⏳</div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">NFT Reserved</h3>
        <p className="text-yellow-700">This NFT is currently reserved for another buyer.</p>
        <p className="text-sm text-yellow-600 mt-2">Check back in a few minutes if the purchase isn't completed.</p>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase {nft.title}</h3>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Payment Method
        </label>
        
        <div className="space-y-3">
          {/* INR Payment Option */}
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="INR"
              checked={selectedPayment === 'INR'}
              onChange={(e) => setSelectedPayment(e.target.value as 'INR')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(nft.price_inr, 'INR')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">UPI</span>
                  <span className="text-2xl">🇮🇳</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pay with UPI (GPay, PhonePe, Paytm) • Manual verification required
              </p>
            </div>
          </label>

          {/* USD Payment Option */}
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="USD"
              checked={selectedPayment === 'USD'}
              onChange={(e) => setSelectedPayment(e.target.value as 'USD')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(nft.price_usd, 'USD')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">PayPal</span>
                  <span className="text-2xl">🌍</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pay with PayPal • Instant automatic processing
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-1">ℹ️</div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">
              {selectedPayment === 'INR' ? 'UPI Payment Process' : 'PayPal Payment Process'}
            </p>
            <p className="text-blue-800">
              {selectedPayment === 'INR' 
                ? 'After clicking "Buy Now", you\'ll receive a UPI QR code via email. Complete the payment and submit the transaction reference for verification.'
                : 'You\'ll be redirected to PayPal to complete the payment securely. The NFT will be transferred immediately after successful payment.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Button or Login Prompt */}
      {isAuthenticated ? (
        <button
          onClick={handlePurchase}
          disabled={isLoading || !canPurchase}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200
            ${canPurchase
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Buy Now for ${selectedPayment === 'INR' ? formatPrice(nft.price_inr, 'INR') : formatPrice(nft.price_usd, 'USD')}`
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to purchase this NFT</p>
          <button
            onClick={() => setShowLoginPrompt(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In to Buy
          </button>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-3">Sign In Required</h3>
            <p className="text-gray-600 mb-4">
              Please sign in with your Google account to purchase NFTs.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = '/login'
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
