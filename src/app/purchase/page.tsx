'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, ArrowLeft, Download, Receipt } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';
import { useNFTs } from '../../hooks/useNFTs';
import Button from '../../components/common/Button';
import Image from 'next/image';
import { NFT } from '../../types/nft';

const PurchasePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkPaymentStatus } = usePayment();
  const { fetchNFTById } = useNFTs();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<{
    status: string;
    transaction_id?: string;
    amount?: number;
    currency?: string;
    payment_method?: string;
    created_at?: string;
  } | null>(null);
  const [nft, setNft] = useState<NFT | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transactionId = searchParams?.get('transaction_id');
  const nftId = searchParams?.get('nft_id');
  const paymentMethod = searchParams?.get('payment_method');

  const checkPurchaseStatus = useCallback(async () => {
    if (!transactionId) return;
    try {
      const paymentStatus = await checkPaymentStatus(transactionId);
      setPaymentDetails(paymentStatus);
      switch (paymentStatus.status) {
        case 'completed':
          setStatus('success');
          break;
        case 'pending':
        case 'processing':
          setStatus('pending');
          setTimeout(checkPurchaseStatus, 5000);
          break;
        case 'failed':
        case 'cancelled':
          setStatus('failed');
          setError('Payment was unsuccessful');
          break;
        default:
          setStatus('pending');
          break;
      }
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to check payment status');
    }
  }, [transactionId, checkPaymentStatus]);

  const loadNFT = useCallback(async () => {
    if (!nftId) return;
    try {
      const nftData = await fetchNFTById(nftId);
      setNft(nftData);
    } catch (err) {
      console.error('Failed to load NFT details:', err);
    }
  }, [nftId, fetchNFTById]);

  useEffect(() => {
    if (transactionId) {
      checkPurchaseStatus();
    } else {
      setStatus('failed');
      setError('Invalid purchase link');
    }
  }, [transactionId, checkPurchaseStatus]);

  useEffect(() => {
    if (nftId) {
      loadNFT();
    }
  }, [nftId, loadNFT]);

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Download receipt for transaction:', transactionId);
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'loading':
      case 'pending':
        return <Clock className="w-16 h-16 text-blue-500 mx-auto animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />;
      default:
        return <Clock className="w-16 h-16 text-gray-500 mx-auto" />;
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Checking Payment Status...',
          message: 'Please wait while we verify your payment.',
          className: 'text-blue-800',
        };
      case 'pending':
        return {
          title: 'Payment Processing',
          message: paymentMethod === 'upi' 
            ? 'We\'re waiting for your UPI payment confirmation. Please complete the payment using the QR code sent to your email.'
            : 'Your payment is being processed. This may take a few moments.',
          className: 'text-blue-800',
        };
      case 'success':
        return {
          title: 'Purchase Successful!',
          message: 'Congratulations! You now own this NFT. It has been added to your collection.',
          className: 'text-green-800',
        };
      case 'failed':
        return {
          title: 'Purchase Failed',
          message: error || 'Your payment could not be processed. Please try again or contact support.',
          className: 'text-red-800',
        };
      default:
        return {
          title: 'Unknown Status',
          message: 'Unable to determine payment status.',
          className: 'text-gray-800',
        };
    }
  };

  const statusInfo = renderStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Navigation */}
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="mb-6 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Section */}
          <div className="px-6 py-8 text-center border-b border-gray-200">
            {renderStatusIcon()}
            <h1 className={`text-2xl font-bold mt-4 mb-2 ${statusInfo.className}`}>
              {statusInfo.title}
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {statusInfo.message}
            </p>
          </div>

          {/* Transaction Details */}
          {paymentDetails && (
            <div className="px-6 py-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Transaction ID:</span>
                  <div className="font-mono text-gray-900 break-all">
                    {paymentDetails.transaction_id}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <div className="font-semibold text-gray-900">
                    {formatAmount(paymentDetails.amount, paymentDetails.currency)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <div className="font-semibold text-gray-900 capitalize">
                    {paymentDetails.payment_method}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <div className="text-gray-900">
                    {new Date(paymentDetails.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NFT Details */}
          {nft && (
            <div className="px-6 py-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Details</h3>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={nft.image_url}
                    alt={nft.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/nft-placeholder.png';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">{nft.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {/* by {nft.creator || 'Unknown Artist'} */}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {nft.category}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {status === 'success' && (
                <>
                  <Button
                    onClick={() => router.push('/profile/collection')}
                    className="flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Receipt size={16} />
                    View Collection
                  </Button>
                  <Button
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download Receipt
                  </Button>
                </>
              )}
              
              {status === 'failed' && (
                <>
                  <Button
                    onClick={() => router.push(`/nft/${nftId}`)}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.push('/support')}
                    variant="outline"
                    className="flex-1"
                  >
                    Contact Support
                  </Button>
                </>
              )}

              {status === 'pending' && paymentMethod === 'upi' && (
                <Button
                  onClick={checkPurchaseStatus}
                  variant="outline"
                  className="w-full inline-flex items-center justify-center gap-2"
                  // Button is always enabled here since status is 'pending'
                >
                  Check Payment Status
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? Contact our{' '}
            <a href="/support" className="underline hover:text-gray-700">
              support team
            </a>{' '}
            or check our{' '}
            <a href="/faq" className="underline hover:text-gray-700">
              FAQ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
