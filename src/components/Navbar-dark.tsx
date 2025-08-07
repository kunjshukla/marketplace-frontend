'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from './LoginModal'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
  }

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="gradient-text text-2xl font-bold tracking-tight">
                  NFT Showcase
                </div>
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="/collections"
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Collections
              </a>
              <a
                href="/artists"
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Artists
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="p-2 text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Connect Wallet / Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || '👤'}
                      </span>
                    </div>
                    <span className="text-white font-medium hidden sm:block">{user?.name || 'User'}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-white/10 py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-sm text-white/60">{user?.email || 'user@example.com'}</p>
                      </div>
                      <div className="py-1">
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </a>
                        <a
                          href="/my-nfts"
                          className="flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          My Collection
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="btn btn-outline text-white border-white/20 hover:bg-white/10"
                  >
                    Connect Wallet
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <div className="flex flex-col space-y-2">
                <a
                  href="/"
                  className="text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="/collections"
                  className="text-white/70 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Collections
                </a>
                <a
                  href="/artists"
                  className="text-white/70 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Artists
                </a>

                {!isAuthenticated && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full btn btn-outline text-white border-white/20"
                    >
                      Connect Wallet
                    </button>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full btn btn-primary"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
