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
  is_reserved?: boolean
  creator_name: string
  description: string
}

interface NFTDetailModalProps {
  nft: NFT | null
  isOpen: boolean
  onClose: () => void
}

export function NFTDetailModal({ nft, isOpen, onClose }: NFTDetailModalProps) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!isOpen || !nft) return null

  const formatPrice = (price: number, curr: 'INR' | 'USD') => {
    return curr === 'INR' 
      ? `₹${price.toLocaleString()}` 
      : `$${price.toLocaleString()}`
  }

  const getStatusBadge = () => {
    if (nft.is_sold) {
      return <span className="badge-sold px-4 py-2 rounded-full text-sm font-medium">Sold Out</span>
    }
    if (nft.is_reserved) {
      return <span className="badge-reserved px-4 py-2 rounded-full text-sm font-medium">Reserved</span>
    }
    return <span className="badge-available px-4 py-2 rounded-full text-sm font-medium">Available</span>
  }

  const handlePurchase = () => {
    setIsPaymentModalOpen(true)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft.title,
          text: `Check out this amazing NFT: ${nft.title} by ${nft.creator_name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="glass-card relative w-full max-w-6xl rounded-3xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative aspect-square lg:aspect-auto">
                {!imageLoaded && (
                  <div className="absolute inset-0 skeleton"></div>
                )}
                <img
                  src={nft.image_url}
                  alt={nft.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/800x800/6366F1/FFFFFF?text=${encodeURIComponent(nft.title)}`
                  }}
                />
                
                {/* Image Overlay Info */}
                <div className="absolute top-6 left-6 flex items-center space-x-3">
                  <span className="category-pill capitalize">
                    {nft.category}
                  </span>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4">{nft.title}</h1>
                  <div className="flex items-center text-white/70 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-lg">
                        {nft.creator_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm">Created by</div>
                      <div className="text-white font-semibold">{nft.creator_name}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-3">Description</h3>
                  <p className="text-white/70 leading-relaxed">{nft.description}</p>
                </div>

                {/* Properties */}
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-4">Properties</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-white/60 text-sm mb-1">Category</div>
                      <div className="text-white font-medium capitalize">{nft.category}</div>
                    </div>
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-white/60 text-sm mb-1">Token ID</div>
                      <div className="text-white font-medium">#{nft.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="mt-auto">
                  {/* Price Section */}
                  <div className="glass p-6 rounded-2xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/60">Current Price</div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrency('INR')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            currency === 'INR' 
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          INR
                        </button>
                        <button
                          onClick={() => setCurrency('USD')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            currency === 'USD' 
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          USD
                        </button>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatPrice(currency === 'INR' ? nft.price_inr : nft.price_usd, currency)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {!nft.is_sold && !nft.is_reserved ? (
                      <button 
                        onClick={handlePurchase}
                        className="w-full btn-primary py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        Purchase Now
                        <svg className="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full bg-white/5 text-white/40 py-4 text-lg font-semibold rounded-2xl cursor-not-allowed"
                      >
                        {nft.is_sold ? 'Sold Out' : 'Reserved'}
                      </button>
                    )}
                    
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 btn-secondary py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        title="Add to favorites"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Save</span>
                      </button>
                      
                      <button 
                        onClick={handleShare}
                        className="flex-1 btn-secondary py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        title="Share"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        nft={nft}
        currency={currency}
      />
    </>
  )
}
