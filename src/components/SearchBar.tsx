'use client'

export function SearchBar() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search NFTs, collections, or creators..."
          className="search-input w-full pl-14 pr-6 text-lg placeholder-white/50 focus:placeholder-white/30"
        />
        <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-medium text-white/40 bg-white/5 rounded-lg border border-white/10">
              ⌘K
            </span>
          </div>
        </div>
      </div>
      
      {/* Search suggestions (hidden by default) */}
      <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl p-4 opacity-0 invisible transition-all duration-300">
        <div className="text-sm text-white/60 mb-2">Popular searches</div>
        <div className="flex flex-wrap gap-2">
          {['Digital Art', 'Photography', 'Gaming', 'Music', 'Abstract'].map((tag) => (
            <button key={tag} className="category-pill text-xs">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
