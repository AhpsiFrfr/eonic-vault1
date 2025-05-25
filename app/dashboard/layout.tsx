'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    console.log('💼 Dashboard Layout - Initial wallet state:', { connected, publicKey: publicKey?.toString() });
    
    // Clear the hyperspeed animation completion flag when dashboard loads
    // so it doesn't interfere with regular navigation
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hyperspeedAnimationCompleted');
    }
    
    console.log('💼 Dashboard access allowed without wallet to prevent loops.');
  }, [connected, publicKey]);

  // Simple pass-through layout since VaultSidebarLayout handles navigation
  return <>{children}</>;
}


