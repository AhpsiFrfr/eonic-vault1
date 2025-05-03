'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletButton } from '../../components/WalletButton';
import { setWalletCookie, removeWalletCookie } from '../../utils/auth';

export default function Login() {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      removeWalletCookie();
      return;
    }

    if (publicKey) {
      console.log('Setting wallet cookie:', publicKey.toString());
      setWalletCookie(publicKey.toString());
      router.push('/dashboard');
    }
  }, [connected, publicKey, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
          EONIC Vault
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Connect your wallet to access your digital assets
        </p>
        <div className="flex justify-center">
          <WalletButton className="!py-3 !px-6 !text-lg !font-medium" />
        </div>
      </div>
    </div>
  );
}
