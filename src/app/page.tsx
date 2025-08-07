'use client'

import { useState, useEffect } from 'react'
import { NFTCard } from '../components/NFTCard'
import { FilterBar } from '../components/FilterBar'
import { PaginationControls } from '../components/PaginationControls'
import { HeroSection } from '../components/HeroSection'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'
import { StatsBar } from '../components/StatsBar'
import { FeaturedSection } from '../components/FeaturedSection'
import { SearchBar } from '../components/SearchBar'
import { CategoryShowcase } from '../components/CategoryShowcase'
import { Footer } from '../components/Footer'
import { apiService } from '../services/api'

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

// Fallback data for when API is unavailable
const fallbackNFTs = [
  {
    id: 1,
    title: 'Digital Sunset #001',
    image_url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Sunset+001',
    price_inr: 2500,
    price_usd: 30,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'ArtistOne',
    description: 'A beautiful digital sunset capturing the essence of nature.',
  },
  {
    id: 2,
    title: 'Abstract Dreams #002',
    image_url: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Dreams+002',
    price_inr: 1800,
    price_usd: 22,
    category: 'art',
    is_sold: false,
    is_reserved: true,
    creator_name: 'DreamMaker',
    description: 'An abstract piece that explores the realm of dreams.',
  },
  {
    id: 3,
    title: 'Cyber Punk Cat #003',
    image_url: 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Cat+003',
    price_inr: 3200,
    price_usd: 38,
    category: 'collectible',
    is_sold: true,
    is_reserved: false,
    creator_name: 'CyberArtist',
    description: 'A futuristic cat in a cyberpunk setting.',
  },
  {
    id: 4,
    title: 'Neon Landscape #004',
    image_url: 'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Neon+004',
    price_inr: 2800,
    price_usd: 34,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'NeonVision',
    description: 'A vibrant neon landscape with electric colors.',
  },
  {
    id: 5,
    title: 'Space Explorer #005',
    image_url: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Space+005',
    price_inr: 4200,
    price_usd: 50,
    category: 'collectible',
    is_sold: false,
    is_reserved: false,
    creator_name: 'CosmicArt',
    description: 'An adventurous space explorer ready for the unknown.',
  },
  {
    id: 6,
    title: 'Digital Ocean #006',
    image_url: 'https://via.placeholder.com/400x400/3498DB/FFFFFF?text=Ocean+006',
    price_inr: 3600,
    price_usd: 43,
    category: 'art',
    is_sold: false,
    is_reserved: false,
    creator_name: 'OceanicArt',
    description: 'The tranquility of the ocean captured digitally.',
  },
]

export default function HomePage() {
  const [nfts, setNfts] = useState([])
  const [filteredNfts, setFilteredNfts] = useState([])
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'newest',
    priceRange: { min: null, max: null },
    currency: 'INR' as const,
    showAvailable: false,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [useBackend, setUseBackend] = useState(false)

  // Load NFTs from API or fallback to demo data
  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Try to fetch from backend API
      const response: any = await apiService.getNFTs({
        page: 1,
        limit: 50, // Load more items initially
      })
      
      if (response && response.items) {
        setNfts(response.items)
        setUseBackend(true)
        console.log('✅ Connected to backend API:', response.items.length, 'NFTs loaded')
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      console.log('⚠️ Backend API unavailable, using demo data')
      setNfts(fallbackNFTs)
      setUseBackend(false)
      // Don't show error to user, just use fallback data
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters, search, and sorting
  useEffect(() => {
    if (!nfts || nfts.length === 0) {
      setFilteredNfts([])
      return
    }

    let result = [...nfts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(nft => 
        nft.title.toLowerCase().includes(query) ||
        (nft.creator_name && nft.creator_name.toLowerCase().includes(query)) ||
        nft.category.toLowerCase().includes(query) ||
        (nft.description && nft.description.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(nft => nft.category === filters.category)
    }

    // Filter by availability
    if (filters.showAvailable) {
      result = result.filter(nft => !nft.is_sold && !nft.is_reserved)
    }

    // Filter by price range
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      result = result.filter(nft => {
        const price = filters.currency === 'INR' ? nft.price_inr : nft.price_usd
        const min = filters.priceRange.min || 0
        const max = filters.priceRange.max || Infinity
        return price >= min && price <= max
      })
    }

    // Sort results
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
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredNfts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [nfts, filters, searchQuery])

  // Get current page items
  const totalItems = filteredNfts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredNfts.slice(startIndex, endIndex)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => {
    setFilters({ ...filters, category })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handlePurchase = async (nftId, currency) => {
    setIsProcessing(true)
    setError('')

    try {
      if (useBackend) {
        // Try to purchase via API
        console.log(`🔄 Purchasing NFT ${nftId} with ${currency} via API`)
        const response: any = await apiService.purchaseNFT(nftId.toString(), currency)
        console.log('✅ Purchase initiated:', response)
        
        // Update local state
        setNfts(prevNfts =>
          prevNfts.map(nft =>
            nft.id === nftId ? { ...nft, is_sold: true } : nft
          )
        )
        
        alert(`NFT purchase initiated! ${currency === 'INR' ? 'Please scan the QR code to complete payment.' : 'Please complete payment via PayPal.'}`)
      } else {
        // Demo mode - simulate purchase
        console.log(`🔄 Demo purchase: NFT ${nftId} with ${currency}`)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Update local state
        setNfts(prevNfts =>
          prevNfts.map(nft =>
            nft.id === nftId ? { ...nft, is_sold: true } : nft
          )
        )
        
        alert(`Demo Purchase Successful! NFT purchased with ${currency}. 🎉`)
      }
    } catch (error: any) {
      console.error('Purchase failed:', error)
      setError(error.message || 'Purchase failed. Please try again.')
      alert('Purchase failed: ' + (error.message || 'Please try again later.'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetryConnection = () => {
    loadNFTs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Status Banner */}
      {!useBackend && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> Backend API unavailable. Using sample data for demonstration.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleRetryConnection}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        totalNFTs={nfts.length}
        availableNFTs={nfts.filter(nft => !nft.is_sold && !nft.is_reserved).length}
        totalCategories={categories.length}
        isConnected={useBackend}
        onExplore={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
      />

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          onClose={() => setError('')}
        />
      )}

      {/* Search Bar */}
      <SearchBar
        onSearchChange={handleSearchChange}
      />

      {/* Category Showcase */}
      <CategoryShowcase
        categories={categories}
        onCategorySelect={handleCategorySelect}
        selectedCategory={filters.category}
      />

      {/* Filter Bar & Stats */}
      <StatsBar
        totalNFTs={totalItems}
        availableNFTs={filteredNfts.filter(nft => !nft.is_sold && !nft.is_reserved).length}
        soldNFTs={filteredNfts.filter(nft => nft.is_sold).length}
        totalValue={filteredNfts.reduce((sum, nft) => sum + (filters.currency === 'INR' ? nft.price_inr : nft.price_usd), 0)}
      />

      <FilterBar
        categories={categories}
        sortOptions={sortOptions}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner text="Loading NFTs..." />
        </div>
      )}

      {/* NFT Grid */}
      {!isLoading && (
        <div className="container mx-auto px-4 pb-8">
          {isProcessing && (
            <div className="text-center py-8">
              <LoadingSpinner text="Processing purchase..." />
            </div>
          )}

          {totalItems === 0 ? (
            <EmptyState
              icon="🎨"
              title="No NFTs found"
              description="Try adjusting your filters to see more results"
              actionLabel="Reset Filters"
              onAction={() => handleFilterChange({
                category: 'all',
                sortBy: 'newest',
                priceRange: { min: null, max: null },
                currency: 'INR' as const,
                showAvailable: false,
              })}
            />
          ) : (
            <>
              {/* Featured Section - Show featured NFTs if we have many */}
              {nfts.length >= 6 && currentPage === 1 && (
                <FeaturedSection
                  featuredNFTs={nfts.slice(0, 3)}
                  onPurchase={handlePurchase}
                />
              )}

              {/* Main NFT Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {filters.category !== 'all' 
                    ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Collection`
                    : 'All NFTs'
                  }
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentItems.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      onPurchase={handlePurchase}
                    />
                  ))}
                </div>
              </div>

              {/* Search and Category Showcase */}
              <div className="mb-8">
                <SearchBar
                  onSearchChange={handleSearchChange}
                />

              </div>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}
