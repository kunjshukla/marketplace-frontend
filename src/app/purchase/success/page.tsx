'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');
    if (!token) {
      setStatus('error');
      setMessage('Missing PayPal order token.');
      return;
    }
    // Optionally, trigger backend capture here if not already done
    fetch('/api/payment/paypal/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderID: token,
        nft_id: 1, // You may want to get this from context or query
        buyer_email: '', // Optionally pass buyer info
        buyer_name: '',
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Your NFT purchase is complete.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Payment capture failed.');
      });
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Purchase Status</h1>
        {status === 'pending' && <p>Processing payment...</p>}
        {status === 'success' && <p className="text-green-600">{message}</p>}
        {status === 'error' && <p className="text-red-600">{message}</p>}
      </div>
    </Suspense>
  );
}
