'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WalletButton } from '../../components/WalletButton';
import { setWalletCookie, removeWalletCookie } from '../../utils/auth';

export default function Login() {
  const { connected, connecting, publicKey, disconnect, wallets } = useWallet();
  const router = useRouter();
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Detect installed wallets
    if (typeof window !== 'undefined') {
      const detected: string[] = [];
      
      if (window.hasOwnProperty('solana') && window.solana?.isPhantom) {
        detected.push('Phantom');
      }
      
      if (window.hasOwnProperty('solflare')) {
        detected.push('Solflare');
      }
      
      setDetectedWallets(detected);
    }
  }, []);

  useEffect(() => {
    // Always display the connect button first by delaying redirect
    if (!connected) {
      removeWalletCookie();
      setShouldRedirect(false);
      return;
    }

    if (publicKey) {
      console.log('Setting wallet cookie:', publicKey.toString());
      setWalletCookie(publicKey.toString());
      // Set flag to redirect instead of redirecting immediately
      setShouldRedirect(true);
    }
  }, [connected, publicKey]);

  // Separate useEffect for redirection to ensure connect button is visible first
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (shouldRedirect && connected && publicKey) {
      // Short delay to ensure the user sees the connection confirmation
      redirectTimer = setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [shouldRedirect, connected, publicKey, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
          EONIC Vault
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Connect your wallet to access your digital assets
        </p>
        
        <div className="flex justify-center mb-6">
          <WalletButton className="!py-3 !px-6 !text-lg !font-medium" />
        </div>
        
        {connected && (
          <div className="text-center text-green-400 mb-4">
            <p>Connected! Redirecting to dashboard...</p>
          </div>
        )}
        
        {detectedWallets.length > 0 && (
          <div className="text-center text-sm text-gray-400 mt-4">
            <p>Detected wallet{detectedWallets.length > 1 ? 's' : ''}: {detectedWallets.join(', ')}</p>
          </div>
        )}
        
        {detectedWallets.length === 0 && !connected && (
          <div className="mt-4 p-4 bg-indigo-900/30 rounded-lg border border-indigo-800">
            <p className="text-sm text-center text-gray-300">
              No wallet detected. We support Phantom, Solflare, and other Solana wallets.
            </p>
            <div className="flex justify-center gap-3 mt-3">
              <a 
                href="https://phantom.app/download" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs py-1 px-2 bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
              >
                Get Phantom
              </a>
              <a 
                href="https://solflare.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs py-1 px-2 bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
              >
                Get Solflare
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
