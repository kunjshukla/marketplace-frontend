'use client'

import { useState } from 'react'
import { PaymentModal } from './PaymentModal'

interface NFT {
  id: number
  title: string
  image_url: string
  price_inr: number
  price_usd: number
  category: string
  is_sold: boolean
  is_reserved: boolean
  creator_name?: string
  description?: string
}

interface NFTCardProps {
  nft: NFT
  onPurchase?: (nftId: number, currency: 'INR' | 'USD') => void
}

export function NFTCard({ nft, onPurchase }: NFTCardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('INR')
  const [imageError, setImageError] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const getBadgeClass = () => {
    if (nft.is_sold) return 'bg-red-500 text-white'
    if (nft.is_reserved) return 'bg-yellow-500 text-black'
    return 'bg-green-500 text-white'
  }

  const getBadgeText = () => {
    if (nft.is_sold) return 'SOLD'
    if (nft.is_reserved) return 'RESERVED'
    return 'AVAILABLE'
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const handlePurchase = () => {
    if (!nft.is_sold && !nft.is_reserved) {
      setIsPaymentModalOpen(true)
    }
  }

  const handlePaymentComplete = (nftId: number, currency: 'INR' | 'USD') => {
    setIsPaymentModalOpen(false)
    if (onPurchase) {
      onPurchase(nftId, currency)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageError ? (
            <img
              src={nft.image_url}
              alt={nft.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <span className="text-gray-500 text-sm">Image not available</span>
              </div>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getBadgeClass()}`}>
            {getBadgeText()}
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs capitalize font-medium">
            {nft.category}
          </div>

          {/* Quick action overlay */}
          {!nft.is_sold && !nft.is_reserved && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handlePurchase}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
              >
                Quick Buy
              </button>
            </div>
          )}
        </div>

        {/* NFT Details */}
        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {nft.title}
            </h3>
            
            {nft.creator_name && (
              <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">👤</span> by {nft.creator_name}
              </p>
            )}
          </div>

          {nft.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {nft.description}
            </p>
          )}

          {/* Price Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(selectedCurrency === 'INR' ? nft.price_inr : nft.price_usd, selectedCurrency)}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <span className="mr-1">≈</span>
                {selectedCurrency === 'INR' 
                  ? `$${Math.round(nft.price_inr / 83)}` 
                  : `₹${Math.round(nft.price_usd * 83)}`
                }
              </span>
            </div>
            
            {/* Currency Toggle */}
            {!nft.is_sold && !nft.is_reserved && (
              <div className="flex bg-gray-50 rounded-lg p-1 border">
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedCurrency === 'INR'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCurrency('INR')}
                >
                  INR
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedCurrency === 'USD'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCurrency('USD')}
                >
                  USD
                </button>
              </div>
            )}
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={nft.is_sold || nft.is_reserved}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              nft.is_sold || nft.is_reserved
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {nft.is_sold 
              ? '🔒 Sold Out' 
              : nft.is_reserved 
              ? '⏳ Reserved' 
              : `🛒 Buy Now`
            }
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        nft={nft}
        currency={selectedCurrency as 'INR' | 'USD'}
        onPurchaseComplete={handlePaymentComplete}
      />
    </>
  )
}
