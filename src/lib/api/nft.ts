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

// Helper to normalize image URLs to go through Next.js proxy (/images/* -> backend /static/*)
const normalizeImageUrl = (raw?: string): string => {
  if (!raw) return '/images/1.png';
  try {
    if (/^https?:\/\//i.test(raw)) return raw; // absolute URL
    if (raw.startsWith('/static/')) return raw.replace('/static/', '/images/');
    if (raw.startsWith('static/')) return raw.replace('static/', '/images/');
    if (raw.startsWith('/images/')) return raw;
    if (/^\w+\.(png|jpe?g|gif|webp)$/i.test(raw)) return `/images/${raw}`;
    return raw;
  } catch {
    return '/images/1.png';
  }
};

export const nftApi = {
  /**
   * Fetch list of NFTs with optional filters and pagination
   */
  async list(
    filters: NFTFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<NFTListResponse> {
    // Backend expects skip/limit; keep page for client pagination
    const skip = Math.max(0, (page - 1) * limit);
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);

    // Use relative /api path so Next.js rewrites proxy to backend
    const response = await fetch(`/api/nft/list?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const payload = wrapper?.data || wrapper; // unwrap { success, data }
    const items: NFT[] = Array.isArray(payload?.nfts)
      ? payload.nfts.map((n: any) => ({
          ...n,
          image_url: normalizeImageUrl(n?.image_url),
        }))
      : [];
    const total = Number(payload?.total || items.length);

    return {
      nfts: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  /**
   * Fetch a single NFT by ID
   */
  async getById(id: string): Promise<NFT> {
    const response = await fetch(`/api/nft/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NFT not found');
      }
      throw new Error(`Failed to fetch NFT: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const data = wrapper?.data || wrapper; // unwrap { success, data }
    return {
      ...data,
      image_url: normalizeImageUrl(data?.image_url),
    } as NFT;
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

    const response = await fetch(`/api/nft/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const payload = wrapper?.data || wrapper;
    const list = Array.isArray(payload?.nfts) ? payload.nfts : [];
    return list.map((n: any) => ({ ...n, image_url: normalizeImageUrl(n?.image_url) }));
  },

  /**
   * Purchase an NFT
   */
  async purchase(
    purchaseData: PurchaseRequest,
    token: string
  ): Promise<PurchaseResponse> {
    // Backend route is /api/nft/{nft_id}/buy with body { payment_mode }
    const response = await fetch(`/api/nft/${purchaseData.nft_id}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_mode: purchaseData.currency,
      }),
    });

    const wrapper = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = wrapper?.detail || wrapper?.message || 'Purchase failed';
      throw new Error(msg);
    }

    return wrapper as PurchaseResponse;
  },

  /**
   * Get user's purchased NFTs
   */
  async getUserPurchases(token: string): Promise<NFT[]> {
    const response = await fetch(`/api/nft/my-purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch purchases: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const payload = wrapper?.data || wrapper;
    const list = Array.isArray(payload?.nfts) ? payload.nfts : [];
    return list.map((n: any) => ({ ...n, image_url: normalizeImageUrl(n?.image_url) }));
  },

  /**
   * Get NFT categories
   */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`/api/nft/categories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const payload = wrapper?.data || wrapper;
    return payload?.categories || [];
  },

  /**
   * Get featured NFTs
   */
  async getFeatured(): Promise<NFT[]> {
    const response = await fetch(`/api/nft/featured`);

    if (!response.ok) {
      throw new Error(`Failed to fetch featured NFTs: ${response.statusText}`);
    }

    const wrapper = await response.json();
    const payload = wrapper?.data || wrapper;
    const list = Array.isArray(payload?.nfts) ? payload.nfts : [];
    return list.map((n: any) => ({ ...n, image_url: normalizeImageUrl(n?.image_url) }));
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
    const response = await fetch(`/api/nft/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFT stats: ${response.statusText}`);
    }

    const wrapper = await response.json();
    return (wrapper?.data || wrapper) as any;
  },
};
