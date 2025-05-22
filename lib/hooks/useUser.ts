'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface WalletData {
  wallet: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface PhantomProvider {
  isPhantom?: boolean;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export function useUser() {
  const { publicKey, disconnect, connected } = useWallet();
  const [walletData, setWalletData] = useState<WalletData>({
    wallet: null,
    isConnecting: false,
    error: null
  });

  useEffect(() => {
    // Update wallet state when publicKey changes
    if (publicKey && connected) {
      setWalletData(prev => ({
        ...prev,
        wallet: publicKey.toString(),
        isConnecting: false,
        error: null
      }));
    } else {
      setWalletData(prev => ({
        ...prev,
        wallet: null,
        isConnecting: false,
        error: null
      }));
    }
  }, [publicKey, connected]);

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  return {
    ...walletData,
    disconnectWallet
  };
} 