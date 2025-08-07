'use client'

interface EmptyStateProps {
  title: string
  description: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon = "🎨", 
  actionLabel = "Reset Filters",
  onAction,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="text-8xl mb-6 animate-bounce">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// Specific empty states
export function NoNFTsFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      title="No NFTs Found"
      description="We couldn't find any NFTs matching your criteria. Try adjusting your filters or browse all collections."
      icon="🔍"
      actionLabel="Reset Filters"
      onAction={onReset}
    />
  )
}

export function NoSearchResults({ searchTerm, onReset }: { searchTerm: string, onReset?: () => void }) {
  return (
    <EmptyState
      title="No Results Found"
      description={`We couldn't find any NFTs matching "${searchTerm}". Try different keywords or browse our collections.`}
      icon="🔍"
      actionLabel="Clear Search"
      onAction={onReset}
    />
  )
}

export function LoadingFailed({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      title="Failed to Load NFTs"
      description="Something went wrong while loading the NFT collection. Please try again."
      icon="⚠️"
      actionLabel="Try Again"
      onAction={onRetry}
      className="text-red-600"
    />
  )
}
