'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, ExternalLink, Clock, User, Tag } from 'lucide-react';
import { useNFTs } from '../../../hooks/useNFTs';
// Update the path below to the correct relative location of AuthContext
import { useAuth } from '../../../contexts/AuthContext';
import { NFT } from '../../../types/nft';
import Button from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorBanner } from '../../../components/ErrorBanner';
import NFTBuyForm from '../../../components/nft/NFTBuyForm';
import { PaymentModal } from '../../../components/PaymentModal';

const NFTDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { fetchNFTById, loading, error } = useNFTs();
  const { isAuthenticated, user } = useAuth();
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const nftId = params?.id as string;

  useEffect(() => {
    if (nftId) {
      loadNFT();
    }
  }, [nftId]);

  const loadNFT = async () => {
    if (!nftId) return;
    
    const nftData = await fetchNFTById(nftId);
    setNft(nftData);
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      router.push('/auth/login');
      return;
    }

    if (nft?.status === 'sold') {
      return;
    }

    setShowBuyForm(true);
  };

  const handlePurchaseStart = (paymentMode: 'INR' | 'USD') => {
    if (!nft) return;
    
    // Set up payment data and show payment modal
    setPaymentData({ currency: paymentMode });
    setShowBuyForm(false);
    setShowPaymentModal(true);
  };

  const handlePurchaseError = (error: string) => {
    console.error('Purchase error:', error);
    // Could show an error toast/banner here
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
    // Refresh NFT data to update status
    loadNFT();
  };

  const handleShare = async () => {
    if (navigator.share && nft) {
      try {
        await navigator.share({
          title: nft.title,
          text: nft.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorBanner 
          error={error || 'NFT not found'} 
          type="error"
          className="mb-4"
        />
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
              <img
                src={nft.image_url}
                alt={nft.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/nft-placeholder.png';
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 inline-flex items-center justify-center gap-2"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <Heart size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Tag size={16} />
                <span className="capitalize">{nft.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {nft.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>Created by {nft.creator_name || 'Unknown Artist'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Current Price</div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{nft.price_inr?.toLocaleString('en-IN') || 'N/A'}
                </span>
                <span className="text-lg text-gray-600">
                  (${nft.price_usd || 'N/A'})
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                nft.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  nft.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {nft.status === 'available' ? 'Available' : 'Sold'}
              </div>
              {nft.created_at && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={14} />
                  Listed {new Date(nft.created_at).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Purchase Button */}
            {nft.status === 'available' && (
              <Button
                onClick={handleBuyClick}
                size="lg"
                className="w-full"
                disabled={nft.status !== 'available'}
              >
                {isAuthenticated ? 'Buy Now' : 'Login to Buy'}
              </Button>
            )}

            {/* Description */}
            {nft.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {nft.description}
                </p>
              </div>
            )}

            {/* Properties/Attributes */}
            {nft.attributes && nft.attributes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Properties</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600">
                        {attr.trait_type}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Form Modal */}
      {showBuyForm && nft && (
        <NFTBuyForm
          nft={nft}
          onPurchaseStart={handlePurchaseStart}
          onPurchaseError={handlePurchaseError}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentData && nft && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          nft={nft}
          currency={paymentData.currency}
          onPurchaseComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default NFTDetailPage;
