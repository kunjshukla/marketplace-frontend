'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from './LoginModal'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="gradient-text text-2xl font-bold tracking-tight">
                  NFT Showcase
                </div>
              </a>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-white font-medium hover:text-indigo-400 transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="/collections"
                className="text-white/70 hover:text-white font-medium transition-colors relative group"
              >
                Collections
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="/artists"
                className="text-white/70 hover:text-white font-medium transition-colors relative group"
              >
                Artists
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="/stats"
                className="text-white/70 hover:text-white font-medium transition-colors relative group"
              >
                Stats
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Right side - Auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-white/70">
                    Welcome, <span className="text-white font-medium">{user.name || user.email}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg shadow-indigo-500/25">
                    {(user.name || user.email || '').charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-white/70 hover:text-white font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    className="btn-primary text-sm font-medium"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10">
            <div className="px-6 pt-4 pb-6 space-y-4">
              <a
                href="/"
                className="block text-white font-medium hover:text-indigo-400 transition-colors"
              >
                Home
              </a>
              <a
                href="/collections"
                className="block text-white/70 hover:text-white transition-colors"
              >
                Collections
              </a>
              <a
                href="/artists"
                className="block text-white/70 hover:text-white transition-colors"
              >
                Artists
              </a>
              <a
                href="/stats"
                className="block text-white/70 hover:text-white transition-colors"
              >
                Stats
              </a>
              
              <div className="pt-4 border-t border-white/10">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="text-sm text-white/70">
                      Welcome, <span className="text-white font-medium">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full btn-secondary text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full btn-secondary text-sm"
                    >
                      Sign In
                    </button>
                    <button 
                      className="w-full btn-primary text-sm"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
