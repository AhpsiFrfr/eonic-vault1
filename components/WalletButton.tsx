import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useState, useEffect } from 'react';

export const WalletButton: FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, wallets, select, connecting, connected } = useWallet();
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);
  
  useEffect(() => {
    // Check for available wallets in the window object
    const detectWallets = () => {
      if (typeof window === 'undefined') return;
      
      const detected: string[] = [];
      
      // Check for Phantom
      if (window.hasOwnProperty('solana') && window.solana?.isPhantom) {
        detected.push('Phantom');
      }
      
      // Check for Solflare
      if (window.hasOwnProperty('solflare')) {
        detected.push('Solflare');
      }
      
      // Check for other wallets as needed
      // You can add more wallet detection logic here
      
      setDetectedWallets(detected);
    };
    
    detectWallets();
  }, []);
  
  // Helper function to open wallet website
  const goToWalletWebsite = () => {
    window.open('https://phantom.app/download', '_blank');
  };
  
  // Create a custom button to replace WalletMultiButton when no wallets are detected
  if (detectedWallets.length === 0 && !connected && !connecting) {
    return (
      <button 
        onClick={goToWalletWebsite}
        className={`flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg transition-colors ${className}`}
      >
        Install Wallet
      </button>
    );
  }
  
  // Override the button text with custom style
  return (
    <div className="relative">
    <WalletMultiButton 
      className={`!bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-lg ${className}`}
    />
      <style jsx global>{`
        .wallet-adapter-button-text-placeholder {
          display: none;
        }
        .wallet-adapter-button-text:after {
          content: "${connected ? 'Connected' : detectedWallets.length > 0 ? `Connect ${detectedWallets[0]}` : 'Connect Your Wallet'}";
        }
      `}</style>
    </div>
  );
};
