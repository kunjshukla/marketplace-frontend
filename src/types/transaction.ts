// Transaction-related type definitions

export interface Transaction {
  id: number
  user_id: number
  nft_id: number
  payment_mode: 'INR' | 'USD' | 'PAYPAL'
  payment_status: 'pending' | 'completed' | 'failed' | 'awaiting_verification' | 'expired'
  txn_ref?: string
  amount: number
  currency: string
  created_at: string
  updated_at: string
}

export interface TransactionCreate {
  user_id: number
  nft_id: number
  payment_mode: string
  amount: number
  currency: string
}

export interface TransactionUpdate {
  payment_status?: string
  txn_ref?: string
}

export interface TransactionResponse {
  id: number
  user_id: number
  nft_id: number
  payment_mode: string
  payment_status: string
  txn_ref?: string
  amount: number
  currency: string
  created_at: string
  updated_at: string
}

export interface PaymentRequest {
  transaction_id: number
  payment_method: 'paypal' | 'upi'
  return_url?: string
  cancel_url?: string
}

export interface PayPalPaymentResponse {
  payment_id: string
  approval_url: string
  status: string
}

export interface UPIPaymentRequest {
  transaction_id: number
  buyer_details: {
    name: string
    email: string
    phone?: string
  }
}

export interface UPIConfirmRequest {
  transaction_id: number
  upi_ref: string
}

export interface PaymentStatus {
  transaction_id: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  payment_method: 'paypal' | 'upi'
  payment_url?: string
  reference?: string
  error?: string
}

export type PaymentMode = 'INR' | 'USD'
export type PaymentMethod = 'paypal' | 'upi'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'awaiting_verification' | 'expired'
