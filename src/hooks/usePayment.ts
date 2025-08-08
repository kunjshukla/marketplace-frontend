'use client';

import { useState, useCallback } from 'react';

export interface PayPalPaymentData {
  nftId: string;
  paypalOrderId: string;
  amount: number;
  currency: string;
  payerDetails: Record<string, unknown>;
}

export interface UPIPaymentData {
  nftId: string;
  amount: number;
  currency: string;
  email: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: 'paypal' | 'upi';
  createdAt?: string;
  updatedAt?: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayPalPayment = useCallback(async (
    paymentData: PayPalPaymentData
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/payment/paypal/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nft_id: paymentData.nftId,
          paypal_order_id: paymentData.paypalOrderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          payer_details: paymentData.payerDetails,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Payment processing failed');
      }

      return {
        success: true,
        transactionId: result.transaction_id,
        message: result.message || 'Payment processed successfully',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateUPIQR = useCallback(async (
    paymentData: UPIPaymentData
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/payment/upi/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nft_id: paymentData.nftId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          email: paymentData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Failed to generate UPI QR code');
      }

      return {
        success: true,
        transactionId: result.transaction_id,
        message: 'UPI QR code generated successfully',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate UPI QR code';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (
    transactionId: string
  ): Promise<PaymentStatus | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/payment/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check payment status';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPaymentHistory = useCallback(async (): Promise<PaymentStatus[]> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/payment/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const result = await response.json();
      return result.transactions || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment history';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelPayment = useCallback(async (
    transactionId: string
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/payment/cancel/${transactionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Failed to cancel payment');
      }

      return {
        success: true,
        message: 'Payment cancelled successfully',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel payment';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    processPayPalPayment,
    generateUPIQR,
    checkPaymentStatus,
    getUserPaymentHistory,
    cancelPayment,
    clearError: () => setError(null),
  };
};
