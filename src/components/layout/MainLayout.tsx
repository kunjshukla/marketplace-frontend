'use client';

import React, { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBanner } from '@/components/ErrorBanner';

interface MainLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  className = '',
}) => {
  const { isLoading, error, clearError } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Navigation */}
      {showNavbar && <Navbar />}

      {/* Global Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          type="error"
          dismissible
          onClose={clearError}
        />
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
