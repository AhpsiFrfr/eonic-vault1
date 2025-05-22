'use client';

import { useState, useEffect } from 'react';
import {
  DisplayNameCard,
  DomainCard,
  TimepieceCard,
  XPLevelCard,
  HoldingsCard,
  NFTGalleryCard,
  WebsiteLinksCard,
  LogoCard
} from './eon-id-widgets';
import { getMockProfile } from '../utils/mock-data';

interface DisplayEonIDProps {
  userWalletAddress: string;
  activeWidgets?: string[];
}

export default function DisplayEonID({ userWalletAddress, activeWidgets }: DisplayEonIDProps) {
  const [updateCounter, setUpdateCounter] = useState(0);

  // Force re-render on profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail.walletAddress === userWalletAddress) {
        setUpdateCounter(prev => prev + 1);
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [userWalletAddress]);

  // Use provided widgets or default to all widgets
  const widgets = activeWidgets || [
    "DisplayName",
    "Domain",
    "Timepiece",
    "XPLevel",
    "EonicHoldings",
    "NFTGallery",
    "Links",
    "Logos"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {widgets.includes("DisplayName") && (
        <DisplayNameCard key={`name-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("Domain") && (
        <DomainCard key={`domain-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("Timepiece") && (
        <TimepieceCard key={`timepiece-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("XPLevel") && (
        <XPLevelCard key={`xp-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("EonicHoldings") && (
        <HoldingsCard key={`holdings-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("NFTGallery") && (
        <NFTGalleryCard key={`nft-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("Links") && (
        <WebsiteLinksCard key={`links-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
      {widgets.includes("Logos") && (
        <LogoCard key={`logos-${updateCounter}`} userWalletAddress={userWalletAddress} />
      )}
    </div>
  );
} 