'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import CommunityChat from '../../../components/CommunityChat';
import { ViewModeToggle } from '../../../components/ViewModeToggle';

type ViewMode = 'web' | 'mobile';

// Define access requirements for future implementation
interface AccessRequirement {
  tokenHolding?: number;    // Minimum token amount required
  nftRequired?: boolean;    // Whether an NFT is required
  isAdmin?: boolean;        // Whether admin access is required
}

interface CommunityTab {
  id: string;
  name: string;
  channel: string;
  requirements?: AccessRequirement;
  description: string;
}

const communityTabs: CommunityTab[] = [
  {
    id: 'community',
    name: 'Community Chat',
    channel: 'community-chat',
    description: 'Open discussion for all community members',
    requirements: {} // No requirements
  },
  {
    id: 'lounge',
    name: 'Holders Lounge',
    channel: 'community-lounge',
    description: 'Token holders discussion space',
    requirements: {
      tokenHolding: 1 // Will require minimum 1 token in future
    }
  },
  {
    id: 'cabal',
    name: 'Cabal Chat',
    channel: 'community-cabal',
    description: 'Exclusive chat for token + NFT holders',
    requirements: {
      tokenHolding: 100,
      nftRequired: true
    }
  },
  {
    id: 'board',
    name: 'Board Room',
    channel: 'community-board',
    description: 'Admin and developer discussion',
    requirements: {
      isAdmin: true
    }
  }
];

export default function CommunityPage() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState(communityTabs[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const userWalletAddress = publicKey?.toString() || '';

  const currentChannel = communityTabs.find(tab => tab.id === activeTab)?.channel || 'community-chat';

  // TODO: Implement access control checks
  const checkAccess = (tab: CommunityTab) => {
    // For now, return true for all tabs
    // This will be replaced with actual checks when implementing gating
    return true;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F0F1A]">
      {/* Tab switcher */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1E1E2F]/30 backdrop-blur-sm">
        <div className="flex space-x-2">
          {communityTabs.map((tab) => (
            <button
              key={tab.id}
              className={`group relative px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-[#1E1E2F]/50 text-gray-300 hover:bg-[#1E1E2F] hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
              disabled={!checkAccess(tab)}
            >
              {tab.name}
              {/* Tooltip for requirements */}
              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap">
                {tab.description}
              </div>
            </button>
          ))}
        </div>
        <ViewModeToggle onViewModeChange={setViewMode} />
      </div>

      {/* Community chat for selected channel */}
      <div className="flex-1 h-[calc(100vh-5rem)]">
        <CommunityChat
          userWalletAddress={userWalletAddress}
          roomId={activeTab}
          channel={currentChannel}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
} 