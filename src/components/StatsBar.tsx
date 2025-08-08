'use client'

interface StatsBarProps {
  totalNFTs: number
  availableNFTs: number
  soldNFTs: number
  totalValue: number
  className?: string
}

export function StatsBar({ 
  totalNFTs, 
  availableNFTs, 
  soldNFTs, 
  totalValue,
  className = "" 
}: StatsBarProps) {
  const stats = [
    {
      label: "Total NFTs",
      value: totalNFTs.toLocaleString(),
      icon: "🎨",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Available",
      value: availableNFTs.toLocaleString(),
      icon: "✨",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Sold",
      value: soldNFTs.toLocaleString(),
      icon: "🔥",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "Total Value",
      value: `₹${totalValue.toLocaleString()}`,
      icon: "💎",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className={`${stat.bgColor} rounded-lg p-4 text-center transition-all duration-300 hover:shadow-md cursor-pointer transform hover:-translate-y-1`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Market insights component
export function MarketInsights({ 
  averagePrice, 
  priceChange, 
  mostPopularCategory 
}: { 
  averagePrice: number
  priceChange: number
  mostPopularCategory: string 
}) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Average Price:</span>
            <span className="font-bold text-gray-900">₹{averagePrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">24h Change:</span>
            <span className={`font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Trending:</span>
            <span className="font-bold text-gray-900 capitalize">{mostPopularCategory}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
