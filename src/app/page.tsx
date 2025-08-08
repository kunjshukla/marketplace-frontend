'use client'

import { useState, useEffect } from 'react'
import NFTCard from '../components/nft/NFTCard'
import { FilterBar } from '../components/FilterBar'
import { HeroSection } from '../components/HeroSection'
import { SearchBar } from '../components/SearchBar'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { nftApi } from '../lib/api/nft'

const categories = ['art', 'collectible', 'gaming', 'music']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
  { value: 'trending', label: 'Trending' },
]

// Premium fallback NFTs with local image assets
const fallbackNFTs = [
  {
    id: 101,
    title: 'Digital Horizon #001',
    image_url: '/images/1.png',
    price_inr: 85000,
    price_usd: 1020,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'NFT Studio',
    description: 'A stunning digital artwork featuring vibrant colors and modern design elements.',
  },
  {
    id: 102,
    title: 'Cyber Genesis #002',
    image_url: '/images/2.png',
    price_inr: 65000,
    price_usd: 780,
    category: 'collectible',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Digital Arts',
    description: 'An exclusive collectible piece from the Cyber Genesis collection.',
  },
  {
    id: 103,
    title: 'Abstract Vision #003',
    image_url: '/images/3.png',
    price_inr: 42000,
    price_usd: 505,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Modern Artist',
    description: 'A unique abstract composition that challenges traditional art boundaries.',
  },
  {
    id: 104,
    title: 'Neon Dreams #004',
    image_url: '/images/4.png',
    price_inr: 32000,
    price_usd: 385,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Neon Studio',
    description: 'Vibrant neon-inspired artwork perfect for digital art enthusiasts.',
  },
  {
    id: 105,
    title: 'Game Avatar #005',
    image_url: '/images/5.png',
    price_inr: 28000,
    price_usd: 335,
    category: 'gaming',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Game Studios',
    description: 'A rare gaming avatar with unique attributes and special abilities.',
  },
  {
    id: 106,
    title: 'Music Visualizer #006',
    image_url: '/images/6.png',
    price_inr: 25000,
    price_usd: 300,
    category: 'music',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Sound Wave',
    description: 'An audio-visual NFT that combines music and stunning visual effects.',
  },
  {
    id: 107,
    title: 'Pixel Art #007',
    image_url: '/images/7.png',
    price_inr: 18000,
    price_usd: 215,
    category: 'collectible',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Pixel Master',
    description: 'Classic pixel art style with modern digital techniques.',
  },
  {
    id: 108,
    title: 'Future Tech #008',
    image_url: '/images/8.png',
    price_inr: 35000,
    price_usd: 420,
    category: 'art',
    is_sold: true,
    is_reserved: false,
    creator_name: 'Tech Vision',
    description: 'Futuristic technology-inspired artwork showcasing tomorrow\'s possibilities.',
  },
  {
    id: 109,
    title: 'Gaming Legend #009',
    image_url: '/images/9.png',
    price_inr: 45000,
    price_usd: 540,
    category: 'gaming',
    is_sold: false,
    is_reserved: true,
    creator_name: 'Legend Studios',
    description: 'A legendary gaming NFT with rare attributes and collector value.',
  },
  {
    id: 110,
    title: 'Digital Masterpiece #010',
    image_url: '/images/10.png',
    price_inr: 55000,
    price_usd: 660,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'Master Creator',
    description: 'A true digital masterpiece combining traditional art concepts with modern technology.',
  }
]

export default function HomePage() {
  const [nfts, setNfts] = useState([])
  const [filteredNfts, setFilteredNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 12
  
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: {
      min: null,
      max: null
    },
    currency: 'INR' as const,
    sortBy: 'newest',
    showAvailable: false
  })

  // Load NFTs on component mount
  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    try {
      setLoading(true)
      const response = await nftApi.list({}, 1, 50)
      setNfts(Array.isArray(response.nfts) && response.nfts.length > 0 ? response.nfts : fallbackNFTs)
    } catch (err) {
      console.warn('API failed, using fallback data:', err)
      setNfts(fallbackNFTs)
    } finally {
      setLoading(false)
    }
  }

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...nfts]

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(nft => 
        nft.title.toLowerCase().includes(query) ||
        nft.creator_name.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query) ||
        nft.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(nft => nft.category === filters.category)
    }

    // Apply availability filter
    if (filters.showAvailable) {
      result = result.filter(nft => !nft.is_sold && !nft.is_reserved)
    }

    // Apply price range filter
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      result = result.filter(nft => {
        const price = filters.currency === 'INR' ? nft.price_inr : nft.price_usd
        const min = filters.priceRange.min || 0
        const max = filters.priceRange.max || Infinity
        return price >= min && price <= max
      })
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => {
          const priceA = filters.currency === 'INR' ? a.price_inr : a.price_usd
          const priceB = filters.currency === 'INR' ? b.price_inr : b.price_usd
          return priceA - priceB
        })
        break
      case 'price_high':
        result.sort((a, b) => {
          const priceA = filters.currency === 'INR' ? a.price_inr : a.price_usd
          const priceB = filters.currency === 'INR' ? b.price_inr : b.price_usd
          return priceB - priceA
        })
        break
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'oldest':
        result.sort((a, b) => a.id - b.id)
        break
      default: // newest
        result.sort((a, b) => b.id - a.id)
    }

    setFilteredNfts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [nfts, filters, searchQuery])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNFTs = filteredNfts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading amazing NFTs..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="mb-12">
            <FilterBar
              filters={filters}
              onFiltersChange={handleFilterChange}
              categories={categories}
              sortOptions={sortOptions}
            />
          </div>

          {/* NFT Grid */}
          {currentNFTs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {currentNFTs.map((nft, index) => (
                  <div 
                    key={nft.id} 
                    className="fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <NFTCard nft={nft} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-2.009-5.197m-4.014 0A7.962 7.962 0 0112 6c-.75 0-1.492.079-2.219.197M3 12a8.001 8.001 0 0114.9-3.6M21 12a8.001 8.001 0 01-14.9 3.6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-white/60 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setFilters({
                    category: 'all',
                    priceRange: { min: null, max: null },
                    currency: 'INR',
                    sortBy: 'newest',
                    showAvailable: false
                  })
                  setSearchQuery('')
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* NFT Detail Modal */}
      {/* Modal functionality to be implemented later */}
    </div>
  )
}
