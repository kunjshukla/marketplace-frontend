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

  const fetchNFTs = useCallback(async (
    filters: NFTFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<NFTListResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters)
            .filter(([, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, value.toString()])
        ),
      });

      const response = await fetch(`/api/nft/list?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }

      const data: NFTListResponse = await response.json();

      setNfts(data.nfts);
      setPagination(data.pagination);

      return data;
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

      const nft: NFT = await response.json();
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/nft/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nft_id: purchaseData.nftId,
          currency: purchaseData.currency,
          payment_method: purchaseData.paymentMethod,
          email: purchaseData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Purchase failed');
      }

      // Update the NFT status in local state if it exists
      setNfts(prev => prev.map(nft =>
        nft.id.toString() === purchaseData.nftId
          ? { ...nft, status: 'sold' as const }
          : nft
      ));

      return {
        success: true,
        transactionId: result.transaction_id,
        redirectUrl: result.redirect_url,
        qrImageUrl: result.qr_image_url,
        message: result.message || 'Purchase initiated successfully',
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
      const token = localStorage.getItem('token');
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

      const result = await response.json();
      return result.nfts || [];
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
      const params = new URLSearchParams({
        search: query,
        limit: '20',
      });

      const response = await fetch(`/api/nft/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      return result.nfts || [];
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
