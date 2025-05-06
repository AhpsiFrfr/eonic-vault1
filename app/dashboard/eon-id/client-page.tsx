'use client';

import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

// Dynamically import the original EonId component for full UI layout
const EonIdComp = dynamic(
  () => import('../../../components/EonId'),
  { ssr: false }
);

export function EonIdClient() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';

  if (!walletAddress) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <p className="text-gray-400">Please connect your wallet to customize your EON-ID.</p>
      </div>
    );
  }

  return <EonIdComp userWalletAddress={walletAddress} />;
} 