'use client'

import { useState, useEffect } from 'react'

interface HeroSectionProps {
  totalNFTs: number
  availableNFTs: number
  totalCategories: number
  isConnected: boolean
  onExplore?: () => void
}

export function HeroSection({ 
  totalNFTs, 
  availableNFTs, 
  totalCategories, 
  isConnected,
  onExplore 
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroSlides = [
    {
      title: "Discover Unique Digital Art",
      subtitle: "Own exclusive NFTs from talented creators worldwide",
      gradient: "from-blue-600 to-purple-700",
      image: "🎨"
    },
    {
      title: "Collect Rare Digital Assets",
      subtitle: "Each NFT is sold only once, ensuring true ownership",
      gradient: "from-purple-600 to-pink-700",
      image: "💎"
    },
    {
      title: "Support Digital Creators",
      subtitle: "Invest in the future of digital art and creativity",
      gradient: "from-green-600 to-blue-600",
      image: "🚀"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const currentHero = heroSlides[currentSlide]

  return (
    <div className={`relative bg-gradient-to-r ${currentHero.gradient} text-white py-20 overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-4">
            <span className="text-6xl mb-6 block animate-bounce">
              {currentHero.image}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {currentHero.title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
            {currentHero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onExplore}
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Collection
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
              How it Works
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{totalNFTs}</div>
              <div className="text-sm md:text-base opacity-75">Total NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{availableNFTs}</div>
              <div className="text-sm md:text-base opacity-75">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{totalCategories}</div>
              <div className="text-sm md:text-base opacity-75">Categories</div>
            </div>
            <div className="text-center">
              {isConnected ? (
                <>
                  <div className="text-2xl md:text-3xl font-bold mb-2 text-green-300">✓ Live</div>
                  <div className="text-sm md:text-base opacity-75">Connected</div>
                </>
              ) : (
                <>
                  <div className="text-2xl md:text-3xl font-bold mb-2 text-yellow-300">⚡ Demo</div>
                  <div className="text-sm md:text-base opacity-75">Mode</div>
                </>
              )}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-white opacity-20 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border border-white opacity-20 rounded-full"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 border border-white opacity-20 rounded-full"></div>
    </div>
  )
}
