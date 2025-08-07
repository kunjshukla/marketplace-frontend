'use client'

import { useState } from 'react'

interface FilterState {
  category: string
  priceRange: {
    min: number | null
    max: number | null
  }
  currency: 'INR' | 'USD'
  sortBy: string
  showAvailable: boolean
}

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: string[]
  sortOptions: Array<{ value: string; label: string }>
}

export function FilterBar({ filters, onFiltersChange, categories, sortOptions }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tempPriceRange, setTempPriceRange] = useState(filters.priceRange)

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? 'all' : category
    })
  }

  const handlePriceRangeSubmit = () => {
    onFiltersChange({
      ...filters,
      priceRange: tempPriceRange
    })
  }

  const handleClearFilters = () => {
    const resetFilters = {
      category: 'all',
      priceRange: { min: null, max: null },
      currency: 'INR' as const,
      sortBy: 'newest',
      showAvailable: false
    }
    setTempPriceRange({ min: null, max: null })
    onFiltersChange(resetFilters)
  }

  const activeFilterCount = [
    filters.category !== 'all',
    filters.priceRange.min !== null || filters.priceRange.max !== null,
    filters.showAvailable
  ].filter(Boolean).length

  return (
    <div className="filter-bar">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-white text-lg font-semibold">All NFTs</h3>
          <span className="text-white/60 text-sm">10 items found</span>
          {activeFilterCount > 0 && (
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>Filters</span>
          </button>
          
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Categories */}
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm font-medium">All Collections</span>
          <button className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1">
            <span>All Categories</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm font-medium">All Categories</span>
          <button className="btn-secondary px-3 py-1 text-xs flex items-center space-x-1">
            <span>All Rarities</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Clear Button */}
        <button className="btn-secondary px-4 py-1 text-xs">
          Clear
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
          {/* Categories */}
          <div>
            <label className="block text-white font-medium mb-3">Category</label>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                  filters.category === 'all' 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-all capitalize ${
                    filters.category === category 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-white font-medium mb-3">Price Range</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => onFiltersChange({ ...filters, currency: 'INR' })}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filters.currency === 'INR' 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  INR
                </button>
                <button
                  onClick={() => onFiltersChange({ ...filters, currency: 'USD' })}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filters.currency === 'USD' 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  USD
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempPriceRange.min || ''}
                  onChange={(e) => setTempPriceRange({
                    ...tempPriceRange,
                    min: e.target.value ? Number(e.target.value) : null
                  })}
                  className="search-input text-sm py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={tempPriceRange.max || ''}
                  onChange={(e) => setTempPriceRange({
                    ...tempPriceRange,
                    max: e.target.value ? Number(e.target.value) : null
                  })}
                  className="search-input text-sm py-2"
                />
              </div>
              
              <button
                onClick={handlePriceRangeSubmit}
                className="w-full btn-secondary py-2 text-sm"
              >
                Apply Price Range
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-white font-medium mb-3">Sort By</label>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFiltersChange({ ...filters, sortBy: option.value })}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                    filters.sortBy === option.value 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showAvailable}
                  onChange={(e) => onFiltersChange({ ...filters, showAvailable: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-2"
                />
                <span className="text-white/70 text-sm">Available only</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
