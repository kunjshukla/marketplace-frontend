'use client'

import { useState } from 'react'
import { NFTCard } from './NFTCard'

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

interface FeaturedSectionProps {
  featuredNFTs: NFT[]
  onPurchase?: (nftId: number, currency: 'INR' | 'USD') => void
  className?: string
}

export function FeaturedSection({ featuredNFTs, onPurchase, className = "" }: FeaturedSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!featuredNFTs.length) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredNFTs.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredNFTs.length - 2)) % Math.max(1, featuredNFTs.length - 2))
  }

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-blue-50 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured NFTs ✨
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover handpicked digital art from talented creators around the world
          </p>
        </div>

        {/* Featured NFT Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={featuredNFTs.length <= 3}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-12">
              {featuredNFTs.slice(currentIndex, currentIndex + 3).map((nft) => (
                <div key={nft.id} className="transform hover:scale-105 transition-all duration-300">
                  <NFTCard
                    {...nft}
                    creator_name={nft.creator_name ?? ""}
                    description={nft.description ?? ""}
                    onPurchase={onPurchase}
                  />
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={featuredNFTs.length <= 3}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          {featuredNFTs.length > 3 && (
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: Math.max(1, featuredNFTs.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            View All NFTs
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Categories showcase
export function CategoriesShowcase({ categories }: { categories: string[] }) {
  const categoryIcons = {
    art: "🎨",
    collectible: "💎",
    gaming: "🎮",
    music: "🎵",
    photography: "📸",
    sports: "⚽",
    utility: "🔧"
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600">
            Find NFTs that match your interests and style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="group cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category as keyof typeof categoryIcons] || "🎨"}
              </div>
              <h3 className="font-semibold text-gray-800 capitalize text-lg">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
