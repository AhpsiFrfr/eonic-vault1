'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import EonIDSettings from '../../../components/EonIDSettings';
import DisplayEonID from '../../../components/DisplayEonID';
import EonIDWidgetSelector from '../../../components/EonIDWidgetSelector';
import { getMockProfile, MockProfile } from '../../../utils/mock-data';

export function EonIdClient() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';
  const isGuest = !walletAddress;
  const userAddress = walletAddress || 'guest';
  
  // Add profile state to force re-renders
  const [profile, setProfile] = useState<MockProfile | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
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
  
  // Load initial profile
  useEffect(() => {
    const loadedProfile = getMockProfile(userAddress);
    setProfile(loadedProfile);
  }, [userAddress]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail.walletAddress === userAddress) {
        const updatedProfile = getMockProfile(userAddress);
        setProfile(updatedProfile);
        setLastUpdate(Date.now()); // Force re-render
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [userAddress]);
  
  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleProfileUpdate = (updatedProfile: MockProfile) => {
    setProfile(updatedProfile);
    setLastUpdate(Date.now()); // Force re-render
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      {isGuest && (
        <div className="mb-4 p-3 bg-yellow-900/20 text-yellow-300 rounded-lg text-center">
          You are customizing as a guest. Connect a wallet to save your EON-ID permanently.
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Panel */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <EonIDSettings 
              userWalletAddress={userAddress}
              onUpdate={handleProfileUpdate}
            />
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
              key={lastUpdate} // Force re-render on updates
              userWalletAddress={userAddress} 
              activeWidgets={activeWidgets}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 