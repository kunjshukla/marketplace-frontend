'use client'

interface CategoryShowcaseProps {
  categories: string[]
  onCategorySelect: (category: string) => void
  selectedCategory?: string
}

const categoryEmojis: { [key: string]: string } = {
  art: '🎨',
  collectible: '💎',
  gaming: '🎮',
  music: '🎵',
  photography: '📷',
  sports: '⚽',
  virtual: '🌐',
  all: '🌟'
}

const categoryDescriptions: { [key: string]: string } = {
  art: 'Digital paintings, illustrations, and creative masterpieces',
  collectible: 'Rare items and exclusive collections with unique value',
  gaming: 'In-game assets, characters, and gaming collectibles',
  music: 'Audio NFTs, album covers, and musical compositions',
  photography: 'Stunning photographs and visual captures',
  sports: 'Sports memorabilia and athletic moments',
  virtual: 'Virtual world assets and metaverse items',
  all: 'Explore all categories of unique digital assets'
}

export function CategoryShowcase({ categories, onCategorySelect, selectedCategory = 'all' }: CategoryShowcaseProps) {
  // Add 'all' category at the beginning
  const allCategories = ['all', ...categories]

  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover unique digital assets across various categories, from stunning art pieces to rare collectibles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`group p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  {/* Category Emoji/Icon */}
                  <div className={`text-4xl mb-3 transform transition-transform duration-300 ${
                    isSelected ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {categoryEmojis[category] || '📦'}
                  </div>

                  {/* Category Name */}
                  <h3 className={`font-bold text-lg mb-2 capitalize ${
                    isSelected ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {category === 'all' ? 'All Categories' : category}
                  </h3>

                  {/* Category Description */}
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {categoryDescriptions[category] || 'Unique digital assets'}
                  </p>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-3 flex justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Category Stats */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Showing {selectedCategory === 'all' ? 'all' : selectedCategory} category
          </p>
        </div>
      </div>
    </div>
  )
}
