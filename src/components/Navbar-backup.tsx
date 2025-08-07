export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              NFT Marketplace
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Browse NFTs
            </a>
            <a
              href="/profile"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              My Collection
            </a>
            <a
              href="/admin"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Admin
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <button className="btn-outline">
              Sign In with Google
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
