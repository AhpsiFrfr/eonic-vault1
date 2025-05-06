import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenOverview } from './TokenOverview';
import { ReferralStats } from './ReferralStats';
import { NFTViewer } from './NFTViewer';
import { WalletButton } from './WalletButton';
import { Tab } from '@headlessui/react';

const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700/50 ${className}`}
  >
    {children}
  </motion.div>
);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function MyTimepieceDashboard() {
  const { publicKey } = useWallet();
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [headline, setHeadline] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [username, setUsername] = useState('Nicholas D\'Erode');
  const [status, setStatus] = useState('last seen recently');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock data
  const mockENS = 'nicholas.eth';
  const mockStage = 'Stage 2';

  const tabs = [
    { name: 'Token Overview', component: TokenOverview },
    { name: 'NFT Gallery', component: NFTViewer },
    { name: 'Referral Program', component: ReferralStats },
    { name: 'Timepiece Evolution', component: () => (
      <div>Timepiece Evolution Content</div>
    )},
  ];

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to access your Timepiece</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">My Timepiece</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity Overview */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Identity Overview</h2>
          <div className="space-y-3">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="font-mono text-sm text-gray-300 break-all">
                {publicKey.toString()}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span>ENS:</span>
              <span className="text-blue-400">{mockENS || 'Not set'}</span>
            </div>
            <div className="inline-block bg-indigo-600 rounded-full px-4 py-1 text-sm">
              {mockStage}
            </div>
          </div>
        </Card>

        {/* Business Card Settings */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Business Card</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showBusinessCard}
                onChange={(e) => setShowBusinessCard(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          {showBusinessCard && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your professional headline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Looking For</label>
                <input
                  type="text"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are you looking for?"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Profile Settings */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Theme</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Card className="md:col-span-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-gray-800 text-white shadow'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-gray-900/20 p-3',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </div>
  );
} 