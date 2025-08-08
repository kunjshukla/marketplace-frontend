import { NFT } from '@/types/nft';

export interface NFTFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: 'USD' | 'INR';
  status?: 'available' | 'sold';
  search?: string;
}

export interface NFTListResponse {
  nfts: NFT[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PurchaseRequest {
  nft_id: string;
  currency: 'USD' | 'INR';
  payment_method: 'paypal' | 'upi';
  email?: string;
}

export interface PurchaseResponse {
  success: boolean;
  transaction_id: string;
  redirect_url?: string;
  qr_image_url?: string;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const nftApi = {
  /**
   * Fetch list of NFTs with optional filters and pagination
   */
  async list(
    filters: NFTFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<NFTListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, value.toString()])
      ),
    });

    const response = await fetch(`${API_BASE_URL}/nft/list?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Fetch a single NFT by ID
   */
  async getById(id: string): Promise<NFT> {
    const response = await fetch(`${API_BASE_URL}/nft/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NFT not found');
      }
      throw new Error(`Failed to fetch NFT: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Search NFTs by query
   */
  async search(query: string, limit: number = 20): Promise<NFT[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
      search: query,
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/nft/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.nfts || [];
  },

  /**
   * Purchase an NFT
   */
  async purchase(
    purchaseData: PurchaseRequest,
    token: string
  ): Promise<PurchaseResponse> {
    const response = await fetch(`${API_BASE_URL}/nft/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(purchaseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Purchase failed');
    }

    return response.json();
  },

  /**
   * Get user's purchased NFTs
   */
  async getUserPurchases(token: string): Promise<NFT[]> {
    const response = await fetch(`${API_BASE_URL}/nft/my-purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch purchases: ${response.statusText}`);
    }

    const result = await response.json();
    return result.nfts || [];
  },

  /**
   * Get NFT categories
   */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/nft/categories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const result = await response.json();
    return result.categories || [];
  },

  /**
   * Get featured NFTs
   */
  async getFeatured(): Promise<NFT[]> {
    const response = await fetch(`${API_BASE_URL}/nft/featured`);

    if (!response.ok) {
      throw new Error(`Failed to fetch featured NFTs: ${response.statusText}`);
    }

    const result = await response.json();
    return result.nfts || [];
  },

  /**
   * Get NFT statistics
   */
  async getStats(): Promise<{
    total_nfts: number;
    total_sold: number;
    total_revenue: number;
    average_price: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/nft/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFT stats: ${response.statusText}`);
    }

    return response.json();
  },
};
