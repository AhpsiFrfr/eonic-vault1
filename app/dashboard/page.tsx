'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import Chat from '../../components/Chat';
import NFTGallery from '../../components/NFTGallery';
import { Cabal } from '../../components/Cabal';
import CommunityChat from '../../components/CommunityChat';
import { supabase } from '../../utils/supabase';

// DM list will be loaded dynamically in the DM tab

const tabs = [
  { id: 'dms', name: 'Direct Messages' },
  { id: 'vault', name: 'Vault' },
  { id: 'community', name: 'Community' },
  { id: 'profile', name: 'Profile' },
];

const communityRooms = [
  { id: 'general', name: 'General' },
  { id: 'cabal', name: 'Cabal' },
  { id: 'investor', name: 'Investor' },
];

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [selectedDM, setSelectedDM] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedDM') || '';
    }
    return '';
  });
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeTab') || 'dms';
    }
    return 'dms';
  });
  const [currentRoom, setCurrentRoom] = useState('general');
  const [communityRoom, setCommunityRoom] = useState('general');
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: string; username: string; wallet_address: string }>>([]);
  const userWalletAddress = publicKey?.toString() || '';

  const getOnlineUsers = async (roomId: string) => {
    const { data } = await supabase
      .from('online_users')
      .select('id, username, wallet_address')
      .eq('room_id', roomId)
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    return data || [];
  };

  return (
    <div className="flex h-screen text-white bg-gray-950 overflow-hidden">
      {/* LEFT: Navigation */}
      <div className="w-64 p-6 bg-gray-900 border-r border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Platform</h2>
        {/* Navigation Tabs */}
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                localStorage.setItem('activeTab', tab.id);
                if (tab.id !== 'dms') {
                  setSelectedDM('');
                  localStorage.removeItem('selectedDM');
                }
              }}
              className={`cursor-pointer p-3 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT: Chat/Tab Window */}
      <div className="flex-1 bg-gray-900">
        {/* Direct Messages Tab */}
        {activeTab === 'dms' ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Direct Messages</h3>
              {/* DM List */}
              <div className="grid gap-2">
                {['ENIC.0', 'Zypher', 'Cabal Ops'].map((dmName) => (
                  <button
                    key={dmName}
                    onClick={() => {
                      setSelectedDM(dmName);
                      localStorage.setItem('selectedDM', dmName);
                    }}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedDM === dmName
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {dmName}
                  </button>
                ))}
              </div>
            </div>
            {/* Chat Window */}
            <div className="flex-1 overflow-hidden">
              {selectedDM ? (
                <Chat room="dm" isDM={true} recipientAddress={selectedDM} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'vault' ? (
          <NFTGallery />
        ) : activeTab === 'community' ? (
          <div className="flex flex-col h-full">
            {/* Room switcher */}
            <div className="flex space-x-2 p-4 border-b border-gray-700">
              {communityRooms.map((room) => (
                <button
                  key={room.id}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    communityRoom === room.id
                      ? 'bg-indigo-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setCommunityRoom(room.id)}
                >
                  {room.name}
                </button>
              ))}
            </div>

            {/* Community chat for selected room */}
            <div className="flex-1 overflow-y-auto">
              <CommunityChat
                userWalletAddress={userWalletAddress}
                roomId={communityRoom}
              />
            </div>
          </div>
        ) : activeTab === 'profile' ? (
          <div className="flex-1 p-6 overflow-auto bg-gray-900">
            <div className="max-w-md mx-auto text-sm text-white">
              <h2 className="text-xl font-bold mb-6">Your Profile</h2>
              
              <div className="flex items-center mb-6 space-x-4">
                <img
                  src="https://via.placeholder.com/64"
                  alt="Avatar"
                  className="rounded-full w-16 h-16 border border-indigo-500"
                />
                <div>
                  <p className="text-gray-400">Wallet:</p>
                  <p className="font-mono text-indigo-400 break-all">{userWalletAddress || 'Not connected'}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-1">Bio</label>
                <textarea
                  placeholder="Tell us about you..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Achievements</label>
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  {/* Placeholder trophies */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                      <span className="text-2xl">🏆</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                Save Changes
              </button>
            </div>
          </div>
        ) : activeTab === 'cabal' ? (
          <Cabal />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Coming soon: {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );
}
