import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { NFTGallery } from '../../components/NFTGallery';
import { Chat } from '../../components/Chat';
import { Cabal } from '../../components/Cabal';

const Dashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nfts');

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome, {publicKey?.toString().slice(0, 8)}...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('nfts')}
                    className={`${
                      activeTab === 'nfts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
                  >
                    NFTs
                  </button>
                  <button
                    onClick={() => setActiveTab('community')}
                    className={`${
                      activeTab === 'community'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
                  >
                    Community
                  </button>
                  <button
                    onClick={() => setActiveTab('cabal')}
                    className={`${
                      activeTab === 'cabal'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
                  >
                    Cabal
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'nfts' && <NFTGallery />}
                {activeTab === 'community' && <Chat />}
                {activeTab === 'cabal' && <Cabal />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
