'use client';

import { useState, useEffect } from 'react';
import { checkAccess } from '@/lib/token-checker';

interface UseTokenGatingReturn {
  hasAccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  checkWallet: (wallet: string) => Promise<void>;
}

export function useTokenGating(wallet?: string): UseTokenGatingReturn {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>();

  const checkWallet = async (walletAddress: string) => {
    if (!walletAddress) {
      setHasAccess(false);
      setIsLoading(false);
      setIsError(true);
      setError('No wallet address provided');
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(undefined);
      
      const access = await checkAccess(walletAddress);
      setHasAccess(access);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Token verification failed');
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      checkWallet(wallet);
    } else {
      setHasAccess(false);
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    hasAccess,
    isLoading,
    isError,
    error,
    checkWallet
  };
} 