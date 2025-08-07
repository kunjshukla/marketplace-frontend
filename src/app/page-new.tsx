'use client'

import { useState, useEffect } from 'react'
import { NFTCard } from '../components/NFTCard'
import { FilterBar } from '../components/FilterBar'
import { PaginationControls } from '../components/PaginationControls'

// Simplified NFT data for demonstration
const sampleNFTs = [
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

const categories = ['art', 'collectible', 'gaming', 'music']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
]

export default function HomePage() {
  const [nfts, setNfts] = useState(sampleNFTs)
  const [filteredNfts, setFilteredNfts] = useState(sampleNFTs)
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'newest',
    priceRange: { min: null, max: null },
    currency: 'INR',
    showAvailable: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isLoading, setIsLoading] = useState(false)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...nfts]

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
  }, [nfts, filters])

  // Get current page items
  const totalItems = filteredNfts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredNfts.slice(startIndex, endIndex)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
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
    setIsLoading(true)
    try {
      // In a real app, this would make an API call to purchase
      console.log(`Purchasing NFT ${nftId} with ${currency}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state to mark as sold
      setNfts(prevNfts =>
        prevNfts.map(nft =>
          nft.id === nftId ? { ...nft, is_sold: true } : nft
        )
      )
      
      alert(`NFT purchased successfully with ${currency}!`)
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Unique NFTs
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Own digital art and collectibles from talented creators worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{nfts.length}</div>
              <div className="text-sm opacity-75">Total NFTs</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {nfts.filter(nft => !nft.is_sold && !nft.is_reserved).length}
              </div>
              <div className="text-sm opacity-75">Available</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm opacity-75">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
      />

      {/* Results Summary */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            NFT Collection
            {filters.category !== 'all' && (
              <span className="ml-2 text-lg font-normal text-gray-600">
                in {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              </span>
            )}
          </h2>
          <div className="text-gray-600">
            {totalItems === 0 ? (
              'No NFTs found'
            ) : (
              `${totalItems} ${totalItems === 1 ? 'NFT' : 'NFTs'} found`
            )}
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="container mx-auto px-4 pb-8">
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        )}

        {totalItems === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No NFTs found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => handleFilterChange({
                category: 'all',
                sortBy: 'newest',
                priceRange: { min: null, max: null },
                currency: 'INR',
                showAvailable: false,
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  )
}
