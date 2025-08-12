'use client';

import { useState, useEffect, useCallback } from 'react';
import { NFT } from '@/types/nft';

export interface NFTFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: 'USD' | 'INR';
  status?: 'available' | 'sold';
  search?: string;
}

export interface NFTPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NFTListResponse {
  nfts: NFT[];
  pagination: NFTPagination;
}

export interface PurchaseData {
  nftId: string;
  currency: 'USD' | 'INR';
  paymentMethod: 'paypal' | 'upi';
  email?: string;
}

const normalizeImageUrl = (raw?: string): string => {
  if (!raw) return '/images/1.png';
  try {
    // If absolute URL, return as is
    if (/^https?:\/\//i.test(raw)) return raw;
    // If backend static path, proxy via Next.js rewrite
    if (raw.startsWith('/static/')) return raw.replace('/static/', '/images/');
    if (raw.startsWith('static/')) return raw.replace('static/', '/images/');
    // If already proxied path
    if (raw.startsWith('/images/')) return raw;
    // If it's just a filename, serve from /images
    if (/^\w+\.(png|jpe?g|gif|webp)$/i.test(raw)) return `/images/${raw}`;
    // Default fallback
    return raw;
  } catch {
    return '/images/1.png';
  }
};

export const useNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<NFTPagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const mapNFT = (n: any): NFT => ({
    id: n.id,
    title: n.title,
    description: n.description,
    image_url: normalizeImageUrl(n.image_url),
    price_inr: typeof n.price_inr === 'number' ? n.price_inr : parseFloat(n.price_inr || '0'),
    price_usd: typeof n.price_usd === 'number' ? n.price_usd : parseFloat(n.price_usd || '0'),
    category: n.category,
    is_sold: !!n.is_sold,
    is_reserved: !!n.is_reserved,
    status: n.is_sold ? 'sold' : (n.is_reserved ? 'reserved' : 'available'),
    creator_name: n.creator_name,
    attributes: n.attributes,
    reserved_at: n.reserved_at,
    sold_at: n.sold_at,
    owner_id: n.owner_id,
    created_at: n.created_at || new Date().toISOString(),
  });

  const fetchNFTs = useCallback(async (
    filters: NFTFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<NFTListResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const skip = (page - 1) * limit;
      const params = new URLSearchParams({
        skip: String(skip),
        limit: String(limit),
      });
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);

      const response = await fetch(`/api/nft/list?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }

      const wrapper = await response.json();
      const payload = wrapper?.data || wrapper; // unwrap { success, data }
      const items = Array.isArray(payload?.nfts) ? payload.nfts : [];
      const mapped = items.map(mapNFT);
      const total = Number(payload?.total || mapped.length);

      setNfts(mapped);
      setPagination({
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });

      return { nfts: mapped, pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      }};
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNFTById = useCallback(async (id: string): Promise<NFT | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nft/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NFT not found');
        }
        throw new Error('Failed to fetch NFT details');
      }

      const wrapper = await response.json();
      const data = wrapper?.data || wrapper; // unwrap { success, data }
      const nft = mapNFT(data);
      return nft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFT';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseNFT = useCallback(async (purchaseData: PurchaseData): Promise<{
    success: boolean;
    transactionId?: string;
    redirectUrl?: string;
    qrImageUrl?: string;
    message?: string;
    error?: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/nft/${purchaseData.nftId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_mode: purchaseData.currency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || result.message || 'Purchase failed');
      }

      // Update the NFT status in local state if it exists
      setNfts(prev => prev.map(nft =>
        nft.id.toString() === purchaseData.nftId
          ? { ...nft, status: 'sold' as const, is_sold: true }
          : nft
      ));

      return {
        success: true,
        transactionId: String(result?.data?.transaction_id || result?.transaction_id || ''),
        redirectUrl: result?.redirect_url,
        qrImageUrl: result?.qr_image_url,
        message: result?.message || 'Purchase initiated successfully',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPurchases = useCallback(async (): Promise<NFT[]> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/nft/my-purchases', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }

      const wrapper = await response.json();
      const list = (wrapper?.nfts || wrapper?.data?.nfts || []).map(mapNFT);
      return list;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch purchases';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNFTs = useCallback(async (query: string): Promise<NFT[]> => {
    if (!query.trim()) return [];

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ search: query, limit: '20' });
      const response = await fetch(`/api/nft/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const wrapper = await response.json();
      const list = (wrapper?.nfts || wrapper?.data?.nfts || []).map(mapNFT);
      return list;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNFT = useCallback(async (id: string): Promise<NFT | null> => {
    const nft = await fetchNFTById(id);
    if (nft) {
      // Update the NFT in the list if it exists
      setNfts(prev => prev.map(existing =>
        existing.id.toString() === id.toString() ? nft : existing
      ));
    }
    return nft;
  }, [fetchNFTById]);

  // Load initial NFTs on mount
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    pagination,
    fetchNFTs,
    fetchNFTById,
    purchaseNFT,
    getUserPurchases,
    searchNFTs,
    refreshNFT,
    clearError: () => setError(null),
  };
};
