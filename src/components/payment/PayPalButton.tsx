'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { usePayment } from '@/hooks/usePayment';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PayPalButtonProps {
  amount: number;
  currency: 'USD' | 'INR';
  nftId: string;
  onSuccess: (details: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCancel?: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'USD',
  nftId,
  onSuccess,
  onError,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const { processPayPalPayment } = usePayment();

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: currency,
    intent: 'capture',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createOrder = async (data: any, actions: any) => {
    setLoading(true);
    try {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount.toString(),
              currency_code: currency,
            },
            description: `NFT Purchase - ID: ${nftId}`,
          },
        ],
      });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = async (data: any, actions: any) => {
    setLoading(true);
    try {
      const details = await actions.order.capture();
      
      // Process payment through backend
      const result = await processPayPalPayment({
        nftId,
        paypalOrderId: details.id,
        amount,
        currency,
        payerDetails: details.payer,
      });

      if (result.success) {
        onSuccess({
          ...details,
          backendResult: result,
        });
      } else {
        onError(new Error('Payment processing failed'));
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onErrorHandler = (err: unknown) => {
    console.error('PayPal payment error:', err);
    onError(err);
    setLoading(false);
  };

  const onCancelHandler = () => {
    console.log('PayPal payment cancelled');
    onCancel?.();
    setLoading(false);
  };

  if (!paypalOptions['client-id']) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">
          PayPal client ID not configured. Please check environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center p-4">
          <LoadingSpinner size="md" />
          <span className="ml-2 text-gray-600">Processing payment...</span>
        </div>
      )}
      
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          onCancel={onCancelHandler}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
          }}
          disabled={loading}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;
