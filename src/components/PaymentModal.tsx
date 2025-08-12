'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ReactDOM from 'react-dom'
import PayPalButton from './payment/PayPalButton'

// Remove unused temporary apiService in favor of real backend endpoints

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  nft: {
    id: number
    title: string
    image_url: string
    price_inr: number
    price_usd: number
  }
  currency: 'INR' | 'USD'
  onPurchaseComplete?: (nftId: number, currency: 'INR' | 'USD') => void
  transactionId?: number
}

export function PaymentModal({ isOpen, onClose, nft, currency, onPurchaseComplete, transactionId }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1) // 1: confirm, 2: payment, 3: success
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [imgError, setImgError] = useState(false)
  // New: UPI deep link and related UI state
  const [upiLink, setUpiLink] = useState('')
  const [upiLinkLoading, setUpiLinkLoading] = useState(false)
  const [upiLinkError, setUpiLinkError] = useState('')
  const [copied, setCopied] = useState(false)

  const price = currency === 'INR' ? nft.price_inr : nft.price_usd
  const currencySymbol = currency === 'INR' ? '₹' : '$'
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Create a portal root for the modal to avoid z-index / stacking issues
  const portalEl = useMemo(() => {
    if (typeof document === 'undefined') return null
    let el = document.getElementById('modal-root') as HTMLDivElement | null
    if (!el) {
      el = document.createElement('div')
      el.id = 'modal-root'
      document.body.appendChild(el)
    }
    return el
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // When we have a transaction id for INR, set QR preview URL from backend
  useEffect(() => {
    if (currency === 'INR' && transactionId) {
      setQrCode(`/api/payment/upi/qr/${transactionId}`)
      // Also fetch a deep link for tap-to-pay
      setUpiLink('')
      setUpiLinkError('')
      setCopied(false)
      setUpiLinkLoading(true)
      fetch(`/api/payment/upi/link/${transactionId}`)
        .then(r => r.json())
        .then(d => {
          if (d?.success && d.upi_link) {
            setUpiLink(d.upi_link as string)
          } else {
            setUpiLinkError(d?.message || 'Unable to get UPI link')
          }
        })
        .catch(() => setUpiLinkError('Unable to get UPI link'))
        .finally(() => setUpiLinkLoading(false))
    }
  }, [currency, transactionId])

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    setError('')

    // Check if user is logged in
    if (!isLoggedIn) {
      setError('You must be logged in to purchase. Please sign in with Google.')
      setIsProcessing(false)
      return
    }

    try {
      // Backend will create transaction on /api/nft/:id/buy, we already did that before opening this modal.
      // Move straight to Step 2 to render the payment method.
      setStep(2)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to initiate purchase')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentComplete = async () => {
    setIsProcessing(true)
    setError('')
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setStep(3)
      onPurchaseComplete?.(nft.id, currency)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Payment confirmation failed')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setError('')
    setQrCode('')
    setImgError(false)
    setUpiLink('')
    setUpiLinkError('')
    setCopied(false)
    onClose()
  }

  const retryQr = () => {
    if (transactionId) {
      setQrCode(`/api/payment/upi/qr/${transactionId}?t=${Date.now()}`)
      setError('')
    }
  }

  const copyUpiLink = async () => {
    if (!upiLink) return
    try {
      await navigator.clipboard.writeText(upiLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setUpiLinkError('Copy failed')
    }
  }

  if (!isOpen || !portalEl) return null

  const content = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 && 'Confirm Purchase'}
            {step === 2 && 'Complete Payment'}
            {step === 3 && 'Purchase Successful!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Confirm Purchase */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                {!imgError ? (
                  <Image
                    src={nft.image_url}
                    alt={nft.title}
                    width={600}
                    height={192}
                    className="w-full h-48 object-cover"
                    onError={() => setImgError(true)}
                    priority
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-500">
                    Preview unavailable
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {nft.title}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {currencySymbol}{price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  {currency === 'INR' ? `~$${Math.round(price / 83)}` : `~₹${Math.round(price * 83)}`}
                </span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
              <div className="text-sm text-gray-600">
                {currency === 'INR' ? (
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    <div>
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-xs">Scan QR code or tap link with any UPI app</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">💳</span>
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-xs">Secure payment via PayPal</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className={`${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } w-full py-3 px-4 rounded-lg font-medium transition-colors`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ${currencySymbol}${Math.round(price * 1.025).toLocaleString()}`
              )}
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="text-center">
            {currency === 'INR' ? (
              <div>
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Scan QR Code to Pay</h3>
                <p className="text-xs text-gray-500 mb-4">Each QR and link are unique to this transaction.</p>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
                  {qrCode ? (
                    <Image 
                      src={qrCode} 
                      alt="UPI QR Code" 
                      width={192} 
                      height={192} 
                      className="w-48 h-48" 
                      onError={() => setError('Unable to load QR code. Please try again.')}
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">Loading QR Code...</span>
                    </div>
                  )}
                </div>
                {!transactionId && (
                  <p className="text-xs text-red-600 mb-2">Missing transaction reference. Please retry purchase.</p>
                )}
                {error && (
                  <div className="mb-3">
                    <button onClick={retryQr} className="text-sm text-blue-600 hover:underline">Retry loading QR</button>
                  </div>
                )}

                {/* Tap-to-pay and utilities */}
                <div className="flex flex-col gap-2 items-center mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={retryQr}
                      className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Reload QR
                    </button>
                    {upiLink && (
                      <a
                        href={upiLink}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        rel="noreferrer"
                      >
                        {isMobile ? 'Open in UPI app' : 'Open UPI link'}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {upiLink && (
                      <button
                        onClick={copyUpiLink}
                        className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {copied ? 'Link copied!' : 'Copy UPI link'}
                      </button>
                    )}
                    {upiLinkLoading && (
                      <span className="text-xs text-gray-500 self-center">Fetching link…</span>
                    )}
                    {upiLinkError && (
                      <span className="text-xs text-red-600 self-center">{upiLinkError}</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Use any UPI app like PhonePe, Paytm, or Google Pay to scan or tap and pay
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {currencySymbol}{Math.round(price * 1.025).toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-4">Pay with PayPal</h3>
                <div className="mb-4">
                  <PayPalButton
                    amount={Math.round(price * 1.025)}
                    currency={'USD'}
                    nftId={String(nft.id)}
                    onSuccess={() => {
                      setStep(3)
                      onPurchaseComplete?.(nft.id, 'USD')
                    }}
                    onError={(e) => setError((e as any)?.message || 'PayPal payment failed')}
                    onCancel={() => setError('Payment cancelled')}
                  />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {currencySymbol}{Math.round(price * 1.025).toLocaleString()}
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors mt-2"
            >
              Close
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-4">Purchase Successful!</h3>
            <p className="text-gray-600 mb-6">
              Congratulations! You now own <strong>{nft.title}</strong>. 
              A confirmation email with your ownership certificate has been sent to you.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-800">Payment Confirmed</span>
              </div>
              <div className="text-sm text-green-700">
                Transaction ID: #{Date.now().toString().slice(-8)}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {/* Download certificate logic */}}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Download Certificate
              </button>
              
              <button
                onClick={() => {/* View NFT logic */}}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                View My NFT
              </button>
              
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return ReactDOM.createPortal(content, portalEl)
}
