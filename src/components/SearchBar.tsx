'use client'

import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearchChange: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearchChange, placeholder = "Search NFTs by title, creator, or category..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search to avoid too many calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(query)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearchChange])

  const handleSearchChange = (value: string) => {
    setQuery(value)
    if (value.length > 0) {
      setIsSearching(true)
    }
  }

  const clearSearch = () => {
    setQuery('')
    onSearchChange('')
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            />
            {query && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Quick search suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular searches:</span>
            {['digital art', 'collectible', 'gaming', 'music'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearchChange(term)}
                className="px-3 py-1 text-xs bg-white/60 text-gray-600 rounded-full hover:bg-white hover:text-blue-600 transition-colors border border-gray-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
