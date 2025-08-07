'use client'

import { useState } from 'react'
import { apiService } from '../services/api'

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
}

export function PaymentModal({ isOpen, onClose, nft, currency, onPurchaseComplete }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1) // 1: confirm, 2: payment, 3: success
  const [paymentMethod, setPaymentMethod] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')

  const price = currency === 'INR' ? nft.price_inr : nft.price_usd
  const currencySymbol = currency === 'INR' ? '₹' : '$'

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const response: any = await apiService.purchaseNFT(nft.id.toString(), currency)
      
      if (currency === 'INR') {
        setPaymentMethod('UPI')
        setQrCode(response.qr_code || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
      } else {
        setPaymentMethod('PayPal')
        // In a real app, you would redirect to PayPal
        window.open(response.payment_url || 'https://paypal.com', '_blank')
      }

      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to initiate purchase')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentComplete = async () => {
    setIsProcessing(true)
    setError('')

    try {
      // In a real app, this would be called after payment confirmation
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      setStep(3)
      
      // Call the completion callback
      if (onPurchaseComplete) {
        onPurchaseComplete(nft.id, currency)
      }
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setError('')
    setQrCode('')
    setPaymentMethod('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
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
              <img
                src={nft.image_url}
                alt={nft.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/400x400/E0E0E0/808080?text=No+Image'
                }}
              />
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
              <h4 className="font-semibold text-gray-900 mb-2">Purchase Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>NFT Price:</span>
                  <span>{currencySymbol}{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (2.5%):</span>
                  <span>{currencySymbol}{Math.round(price * 0.025).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{currencySymbol}{Math.round(price * 1.025).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
              <div className="text-sm text-gray-600">
                {currency === 'INR' ? (
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    <div>
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-xs">Scan QR code with any UPI app</div>
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
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
                <h3 className="text-xl font-semibold mb-4">Scan QR Code to Pay</h3>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
                  {qrCode ? (
                    <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">Loading QR Code...</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Use any UPI app like PhonePe, Paytm, or Google Pay to scan and pay
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {currencySymbol}{Math.round(price * 1.025).toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-4">Complete PayPal Payment</h3>
                <p className="text-gray-600 mb-6">
                  A new window has opened for PayPal payment. Complete the payment and return here.
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {currencySymbol}{Math.round(price * 1.025).toLocaleString()}
                </div>
              </div>
            )}

            <button
              onClick={handlePaymentComplete}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-4 ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming...
                </div>
              ) : (
                'I have completed the payment'
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
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
}
