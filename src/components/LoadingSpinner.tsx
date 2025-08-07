'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 animate-spin`}>
          <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-blue-600 animate-spin`}></div>
        </div>
        <div className={`absolute top-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-r-purple-600 animate-spin`} style={{ animationDuration: '1.5s' }}></div>
      </div>
      {text && (
        <p className={`mt-4 text-gray-600 ${
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
        }`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Alternative pulse loader
export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></div>
      ))}
    </div>
  )
}

// Skeleton loader for NFT cards
export function NFTCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-3"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}
