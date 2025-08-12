'use client';

import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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
  const [clientIdState, setClientIdState] = useState<string>(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '');

  useEffect(() => {
    if (!clientIdState) {
      // fetch from backend helper endpoint
      fetch('/api/payment/paypal/client-id')
        .then((r) => r.json())
        .then((d) => {
          if (d?.client_id) setClientIdState(d.client_id);
        })
        .catch(() => {/* ignore */});
    }
  }, [clientIdState]);

  const clientId = clientIdState;
  const paypalOptions = {
    clientId,
    currency: currency,
    intent: 'capture',
  } as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nft_id: nftId,
          amount: amount.toString(),
          currency,
          return_url: window.location.origin + '/purchase/success',
          cancel_url: window.location.origin + '/purchase/cancel',
        })
      });
      const data = await response.json();
      setLoading(false);
      if (data && data.order && data.order.id) {
        return data.order.id;
      } else {
        onError(new Error(data.message || 'Could not create PayPal order'));
        return '';
      }
    } catch (error) {
      setLoading(false);
      onError(error);
      return '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID,
          nft_id: nftId,
          buyer_email: '',
          buyer_name: '',
        })
      });
      const result = await response.json();
      setLoading(false);
      if (result.success) {
        onSuccess(result);
      } else {
        onError(new Error(result.message || 'PayPal capture failed'));
      }
    } catch (error) {
      setLoading(false);
      onError(error);
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

  if (!clientId) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">
          PayPal client ID not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID or configure backend /api/payment/paypal/client-id.
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
