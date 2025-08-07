'use client'

import { useState } from 'react'

interface NFTCardProps {
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
  onClick?: () => void
  onPurchase?: (nftId: number, currency: 'INR' | 'USD') => void
}

export function NFTCard({
  id,
  title,
  image_url,
  price_inr,
  price_usd,
  category,
  is_sold,
  is_reserved,
  creator_name,
  description,
  onClick,
  onPurchase
}: NFTCardProps) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [imageLoaded, setImageLoaded] = useState(false)

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(id, currency)
    } else {
      console.log('Purchase NFT:', id)
      // Handle purchase logic
    }
  }

  const formatPrice = (price: number, curr: 'INR' | 'USD') => {
    return curr === 'INR' 
      ? `₹${price.toLocaleString()}` 
      : `$${price.toLocaleString()}`
  }

  const getStatusBadge = () => {
    if (is_sold) {
      return <span className="badge-sold px-3 py-1 rounded-full text-xs font-medium">Sold</span>
    }
    if (is_reserved) {
      return <span className="badge-reserved px-3 py-1 rounded-full text-xs font-medium">Reserved</span>
    }
    return <span className="badge-available px-3 py-1 rounded-full text-xs font-medium">Available</span>
  }

  return (
    <div 
      className="nft-card group cursor-pointer" 
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-3xl">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton rounded-t-3xl"></div>
        )}
        <img
          src={image_url}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://via.placeholder.com/400x400/6366F1/FFFFFF?text=${encodeURIComponent(title)}`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>

        {/* Category Pill */}
        <div className="absolute top-4 left-4">
          <span className="category-pill capitalize">
            {category}
          </span>
        </div>

        {/* Quick Action Button */}
        {!is_sold && !is_reserved && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handlePurchase()
              }}
              className="btn-primary px-4 py-2 text-sm rounded-xl shadow-xl"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Title and Creator */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-white/60 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            by {creator_name}
          </p>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrency(currency === 'INR' ? 'USD' : 'INR')
              }}
              className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              {currency}
            </button>
            <span className="text-2xl font-bold text-white">
              {formatPrice(currency === 'INR' ? price_inr : price_usd, currency)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => e.stopPropagation()} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Add to favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Button */}
        {!is_sold && !is_reserved ? (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handlePurchase()
            }}
            className="w-full btn-primary py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Purchase Now
          </button>
        ) : (
          <button 
            disabled
            className="w-full bg-white/5 text-white/40 py-3 rounded-xl font-semibold cursor-not-allowed"
          >
            {is_sold ? 'Sold Out' : 'Reserved'}
          </button>
        )}
      </div>
    </div>
  )
}
