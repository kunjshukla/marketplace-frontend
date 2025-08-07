'use client'

import { useState, useEffect } from 'react'

export interface FilterState {
  category: string
  sortBy: string
  priceRange: { min: number | null; max: number | null }
  currency: 'INR' | 'USD'
  showAvailable: boolean
}

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: string[]
  sortOptions: { value: string; label: string }[]
}

export function FilterBar({
  filters,
  onFiltersChange,
  categories,
  sortOptions,
}: FilterBarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    const newFilters = { ...localFilters, ...updates }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const newPriceRange = { ...localFilters.priceRange, [field]: numValue }
    handleFilterUpdate({ priceRange: newPriceRange })
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      sortBy: 'newest',
      priceRange: { min: null, max: null },
      currency: 'INR',
      showAvailable: false,
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white/80">Category:</label>
          <select
            value={localFilters.category}
            onChange={(e) => handleFilterUpdate({ category: e.target.value })}
            className="bg-gray-800/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white/80">Sort:</label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterUpdate({ sortBy: e.target.value })}
            className="bg-gray-800/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white/80">Currency:</label>
          <div className="flex rounded-lg overflow-hidden border border-white/20">
            <button
              type="button"
              onClick={() => handleFilterUpdate({ currency: 'INR' })}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                localFilters.currency === 'INR'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-white/70 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              INR
            </button>
            <button
              type="button"
              onClick={() => handleFilterUpdate({ currency: 'USD' })}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                localFilters.currency === 'USD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-white/70 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white/80">Price Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={localFilters.priceRange.min || ''}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            className="bg-gray-800/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-white/60">-</span>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.priceRange.max || ''}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            className="bg-gray-800/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Show Available Only */}
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.showAvailable}
              onChange={(e) => handleFilterUpdate({ showAvailable: e.target.checked })}
              className="rounded border-white/20 bg-gray-800/50 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-white/80">Available Only</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
