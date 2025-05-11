'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  SolongWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useState, useEffect } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletProviderComponent: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network]);
  
  // Connection status tracking
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  
  // Initialize all supported wallet adapters
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new CloverWalletAdapter(),
    new SolongWalletAdapter()
  ], []);

  // Monitor connection state to help debug navigation issues
  useEffect(() => {
    console.log('[WALLET PROVIDER] Provider component mounted, autoConnect =', true);
    
    // Simpler wallet checking that won't cause navigation issues
    const checkWalletStatus = () => {
      try {
        const isPhantomConnected = window.solana?.isConnected;
        
        console.log('[WALLET PROVIDER] Wallet check:', { 
          exists: !!window.solana, 
          isConnected: isPhantomConnected 
        });
        
        // Simplified localStorage handling
        if (isPhantomConnected) {
          localStorage.setItem('walletConnected', 'true');
        }
      } catch (e) {
        console.error('[WALLET PROVIDER] Error checking wallet status:', e);
      }
    };
    
    // Only check on mount - remove intervals to prevent excessive checks
    checkWalletStatus();
    
    // Listen for visibility changes only
    document.addEventListener('visibilitychange', checkWalletStatus);
    
    return () => {
      document.removeEventListener('visibilitychange', checkWalletStatus);
    };
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
