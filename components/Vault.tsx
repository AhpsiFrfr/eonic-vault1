import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { TokenOverview } from './TokenOverview';
import { NFTViewer } from './NFTViewer';
import { ReferralStats } from './ReferralStats';
import { TimepieceEvolution } from './TimepieceEvolution';

type TabType = 'overview' | 'nfts' | 'referrals' | 'evolution';

export const Vault: React.FC = () => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="mt-2 text-gray-600">Please connect your wallet to access the vault</p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; name: string }[] = [
    { id: 'overview', name: 'Token Overview' },
    { id: 'nfts', name: 'NFT Gallery' },
    { id: 'referrals', name: 'Referral Program' },
    { id: 'evolution', name: 'Timepiece Evolution' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && <TokenOverview />}
          {activeTab === 'nfts' && <NFTViewer />}
          {activeTab === 'referrals' && <ReferralStats />}
          {activeTab === 'evolution' && <TimepieceEvolution />}
        </div>
      </div>
    </div>
  );
}; 