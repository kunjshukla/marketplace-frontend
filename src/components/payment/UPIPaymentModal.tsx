'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, AlertCircle, Download, Copy } from 'lucide-react';
import Button from '@/components/common/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string;
  amount: number;
  currency: 'INR';
  userEmail: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

interface UPIQRStatus {
  status: 'generating' | 'sent' | 'expired' | 'completed' | 'failed';
  qrImageUrl?: string;
  upiId?: string;
  transactionId?: string;
  expiresAt?: string;
  message?: string;
}

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  nftId,
  amount,
  currency,
  userEmail,
  onSuccess,
  onError,
}) => {
  const [qrStatus, setQrStatus] = useState<UPIQRStatus>({ status: 'generating' });
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateUPIQR();
    }
  }, [isOpen]);

  useEffect(() => {
    if (qrStatus.expiresAt && qrStatus.status === 'sent') {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(qrStatus.expiresAt!).getTime();
        const remaining = Math.max(0, expiry - now);
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setQrStatus(prev => ({ ...prev, status: 'expired' }));
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [qrStatus.expiresAt, qrStatus.status]);

  const generateUPIQR = async () => {
    try {
      setQrStatus({ status: 'generating' });
      
      const response = await fetch('/api/payment/upi/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nft_id: nftId,
          amount,
          currency,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrStatus({
          status: 'sent',
          qrImageUrl: data.qr_image_url,
          upiId: data.upi_id,
          transactionId: data.transaction_id,
          expiresAt: data.expires_at,
          message: 'UPI QR code has been sent to your email!',
        });
        
        // Start polling for payment status
        pollPaymentStatus(data.transaction_id);
      } else {
        throw new Error(data.detail || 'Failed to generate UPI QR code');
      }
    } catch (error) {
      console.error('UPI QR generation error:', error);
      setQrStatus({
        status: 'failed',
        message: error instanceof Error ? error.message : 'Failed to generate QR code',
      });
      onError(error);
    }
  };

  const pollPaymentStatus = async (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/status/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.status === 'completed') {
            setQrStatus(prev => ({ ...prev, status: 'completed' }));
            clearInterval(pollInterval);
            onSuccess({
              transactionId,
              amount,
              currency,
              paymentMethod: 'UPI',
              status: 'completed',
            });
          } else if (data.status === 'failed') {
            setQrStatus(prev => ({ ...prev, status: 'failed', message: 'Payment failed' }));
            clearInterval(pollInterval);
            onError(new Error('Payment verification failed'));
          }
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 15 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 15 * 60 * 1000);
  };

  const formatTimeLeft = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const copyUPIId = async () => {
    if (qrStatus.upiId) {
      try {
        await navigator.clipboard.writeText(qrStatus.upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy UPI ID:', error);
      }
    }
  };

  const handleRetry = () => {
    generateUPIQR();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">UPI Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-900">
              ₹{amount.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-gray-600">
              NFT ID: {nftId}
            </p>
          </div>

          {qrStatus.status === 'generating' && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Generating UPI QR code...</p>
            </div>
          )}

          {qrStatus.status === 'sent' && (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
                <p className="text-green-800 text-sm font-medium">
                  {qrStatus.message}
                </p>
              </div>

              {qrStatus.qrImageUrl && (
                <div className="mb-4">
                  <img
                    src={qrStatus.qrImageUrl}
                    alt="UPI QR Code"
                    className="mx-auto border rounded-lg shadow-sm max-w-48 max-h-48"
                  />
                </div>
              )}

              {qrStatus.upiId && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">UPI ID:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {qrStatus.upiId}
                    </code>
                    <button
                      onClick={copyUPIId}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy UPI ID"
                    >
                      {copied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {timeLeft > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-800">
                    <Clock size={16} />
                    <span className="text-sm font-medium">
                      Time remaining: {formatTimeLeft(timeLeft)}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Scan the QR code with any UPI app or use the UPI ID above to complete the payment.
                  We'll automatically verify your payment.
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Clock size={16} />
                  <span className="text-sm">Waiting for payment confirmation...</span>
                </div>
              </div>
            </div>
          )}

          {qrStatus.status === 'completed' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Payment Successful!
              </h3>
              <p className="text-green-600 mb-4">
                Your NFT purchase has been completed successfully.
              </p>
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {qrStatus.status === 'expired' && (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                QR Code Expired
              </h3>
              <p className="text-orange-600 mb-4">
                The payment window has expired. Please generate a new QR code.
              </p>
              <Button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Generate New QR
              </Button>
            </div>
          )}

          {qrStatus.status === 'failed' && (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Payment Failed
              </h3>
              <p className="text-red-600 mb-4">
                {qrStatus.message || 'Unable to process payment. Please try again.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
