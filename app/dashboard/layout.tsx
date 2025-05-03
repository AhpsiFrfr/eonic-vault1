'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push('/login');
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return <>{children}</>;
}
