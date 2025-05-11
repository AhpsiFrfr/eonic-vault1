'use client';

import { useState } from 'react';
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

interface DisplayEonIDProps {
  userWalletAddress: string;
  activeWidgets?: string[];
}

export default function DisplayEonID({ userWalletAddress, activeWidgets }: DisplayEonIDProps) {
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
      {widgets.includes("DisplayName") && <DisplayNameCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("Domain") && <DomainCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("Timepiece") && <TimepieceCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("XPLevel") && <XPLevelCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("EonicHoldings") && <HoldingsCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("NFTGallery") && <NFTGalleryCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("Links") && <WebsiteLinksCard userWalletAddress={userWalletAddress} />}
      {widgets.includes("Logos") && <LogoCard userWalletAddress={userWalletAddress} />}
    </div>
  );
} 