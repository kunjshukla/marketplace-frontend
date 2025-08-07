'use client'

import Image from 'next/image'
import Link from 'next/link'

interface NFTCardProps {
  nft: {
    id: number
    title: string
    description?: string
    image_url: string
    price_inr: number
    price_usd: number
    category?: string
    is_sold: boolean
    is_reserved: boolean
  }
  className?: string
  showPurchaseButton?: boolean
}

export default function NFTCard({ 
  nft, 
  className = '', 
  showPurchaseButton = true 
}: NFTCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`
    }
    return `$${price.toFixed(2)}`
  }

  const getStatusBadge = () => {
    if (nft.is_sold) {
      return (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          SOLD
        </span>
      )
    }
    if (nft.is_reserved) {
      return (
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          RESERVED
        </span>
      )
    }
    return (
      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
        AVAILABLE
      </span>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* NFT Image */}
      <div className="relative aspect-square">
        <Image
          src={nft.image_url}
          alt={nft.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {getStatusBadge()}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/nft/${nft.id}`}
            className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {nft.title}
          </h3>
          {nft.category && (
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {nft.category}
            </span>
          )}
        </div>

        {nft.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {nft.description}
          </p>
        )}

        {/* Pricing */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <div className="flex gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(nft.price_inr, 'INR')}
              </span>
              <span className="text-sm text-gray-500 self-end">
                / {formatPrice(nft.price_usd, 'USD')}
              </span>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        {showPurchaseButton && !nft.is_sold && (
          <Link
            href={`/nft/${nft.id}`}
            className={`
              block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors
              ${nft.is_reserved 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {nft.is_reserved ? 'Reserved' : 'Buy Now'}
          </Link>
        )}

        {nft.is_sold && (
          <div className="text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
            Sold Out
          </div>
        )}
      </div>
    </div>
  )
}
