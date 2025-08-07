// NFT-related type definitions

export interface NFT {
  id: number
  title: string
  description?: string
  image_url: string
  price_inr: number
  price_usd: number
  category?: string
  is_sold: boolean
  is_reserved: boolean
  status: 'available' | 'sold' | 'reserved'
  creator_name?: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
  reserved_at?: string
  sold_at?: string
  owner_id?: number
  created_at: string
}

export interface NFTCreate {
  title: string
  description?: string
  image_url: string
  price_inr: number
  price_usd: number
  category?: string
}

export interface NFTUpdate {
  title?: string
  description?: string
  price_inr?: number
  price_usd?: number
  category?: string
}

export interface NFTListParams {
  skip?: number
  limit?: number
  category?: string
  search?: string
  sort_by?: 'created_at' | 'price_inr' | 'price_usd' | 'title'
  sort_order?: 'asc' | 'desc'
}

export interface NFTListResponse {
  nfts: NFT[]
  total: number
  skip: number
  limit: number
  has_more: boolean
}

export interface NFTBuyRequest {
  payment_mode: 'INR' | 'USD'
}

export interface NFTBuyResponse {
  transaction_id: number
  payment_mode: string
  amount: number
  currency: string
  next_step: string
  payment_url?: string // For PayPal
}

export interface NFTCardProps {
  nft: NFT
  className?: string
  showPurchaseButton?: boolean
  onPurchase?: (nft: NFT) => void
}

export interface NFTCategory {
  id: string
  name: string
  icon: string
  count?: number
}
