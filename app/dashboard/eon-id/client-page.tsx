'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import EonIDSettings from '../../../components/EonIDSettings';
import DisplayEonID from '../../../components/DisplayEonID';
import EonIDWidgetSelector from '../../../components/EonIDWidgetSelector';

export function EonIdClient() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';
  const [activeWidgets, setActiveWidgets] = useState([
    "DisplayName",
    "Domain",
    "Timepiece",
    "XPLevel",
    "EonicHoldings",
    "NFTGallery",
    "Links",
    "Logos"
  ]);
  
  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  if (!walletAddress) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <p className="text-gray-400">Please connect your wallet to customize your EON-ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Panel */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <EonIDSettings userWalletAddress={walletAddress} />
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <EonIDWidgetSelector
              activeWidgets={activeWidgets}
              onToggleWidget={toggleWidget}
            />
          </div>
        </div>
        
        {/* Display Preview */}
        <div className="w-full md:w-2/3">
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Display EON-ID</h2>
            <DisplayEonID 
              userWalletAddress={walletAddress} 
              activeWidgets={activeWidgets}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 