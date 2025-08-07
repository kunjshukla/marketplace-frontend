'use client'

import { useState, useEffect } from 'react'
import { useNFTs } from '@/hooks/useNFTs'
import NFTCard from './NFTCard'

interface NFTListProps {
  className?: string
  category?: string
  limit?: number
}

export default function NFTList({ className = '', category, limit }: NFTListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(category || '')
  
  const { 
    nfts, 
    loading, 
    error, 
    pagination, 
    fetchNFTs
  } = useNFTs()

  const itemsPerPage = limit || 12

  useEffect(() => {
    fetchNFTs({
      category: selectedCategory
    }, currentPage, itemsPerPage)
  }, [currentPage, selectedCategory, fetchNFTs, itemsPerPage])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil((pagination?.total ?? 0) / itemsPerPage)

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-500 text-lg mb-2">⚠️ Error loading NFTs</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => fetchNFTs({ 
            category: selectedCategory
          }, currentPage, itemsPerPage)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Category Filter */}
      {/* Category Filter */}
      {/* Category filter removed due to missing 'categories' property in hook */}
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
                <div className="h-6 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Grid */}
      {!loading && nfts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination?.total ?? 0)} of {pagination?.total ?? 0} NFTs
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && nfts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {selectedCategory ? `No ${selectedCategory} NFTs found` : 'No NFTs available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory 
              ? 'Try selecting a different category or check back later.'
              : 'Check back later for new NFT drops!'
            }
          </p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange('')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All NFTs
            </button>
          )}
        </div>
      )}
    </div>
  )
}
