'use client';
import * as React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';

// Sub-components
import { NFTGallery } from './NFTGallery';
import { Cabal } from './Cabal';
import Chat from './Chat';

interface Message {
  id: number;
  text?: string;
  gif?: string;
}

interface Badge {
  id: string;
  name: string;
  lore: string;
}

interface Profile {
  name: string;
  status: string;
  wallet_address: string;
}

interface ProfileModalProps {
  profileName: string;
  status: string;
  onClose: () => void;
  onSave: () => void;
  onChangeName: (name: string) => void;
  onChangeStatus: (status: string) => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function ProfileModal({
  profileName,
  status,
  onClose,
  onSave,
  onChangeName,
  onChangeStatus,
}: ProfileModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2A] text-white p-6 rounded-xl max-w-md w-full border border-[#00d8ff] shadow-[0_0_10px_rgba(0,216,255,0.3)]">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full p-2 bg-[#2A2A3A] rounded border border-gray-700 focus:border-[#00d8ff] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => onChangeStatus(e.target.value)}
              className="w-full p-2 bg-[#2A2A3A] rounded border border-gray-700 focus:border-[#00d8ff] outline-none"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] text-white rounded hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const ALL_BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', lore: 'You were among the first to enter the Vault.' },
  { id: 'first_referral', name: 'First Referral', lore: 'You called another into the dark.' },
  { id: 'ghost_in_the_shell', name: 'Ghost In The Shell', lore: 'You forged your identity from the shadows.' },
  { id: 'dimensional_echo', name: 'Dimensional Echo', lore: 'Your voice was heard across timelines.' },
  { id: 'hidden_key', name: 'The Hidden Key', lore: 'You found what wasn\'t meant to be found.' },
];

const EonicDashboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Community');
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Badge | null>(null);
  const [profileName, setProfileName] = useState('');
  const [status, setStatus] = useState('online');
  const [unlocked, setUnlocked] = useState<string[]>(['early_adopter', 'ghost_in_the_shell']);

  useEffect(() => {
    if (!connected && publicKey === null) {
      router.replace('/');
      return;
    }

    const loadProfile = async () => {
      if (!publicKey) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (error) throw error;

        if (data) {
          setProfileName(data.name);
          setStatus(data.status);
        }
      } catch (error) {
        toast.error('Error loading profile');
      }
    };

    loadProfile();
  }, [connected, publicKey, router]);

  const saveProfile = async () => {
    if (!publicKey) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          wallet_address: publicKey.toString(),
          name: profileName,
          status,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
      setShowProfile(false);
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBadgeClick = (badge: Badge) => {
    if (unlocked.includes(badge.id)) {
      setSelected(badge);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] bg-clip-text text-transparent">
            Eonic Vault
          </h1>
          <button
            onClick={() => setShowProfile(true)}
            className="px-4 py-2 bg-[#1E1E2A] rounded-lg border border-[#00d8ff] hover:shadow-[0_0_10px_rgba(0,216,255,0.3)] transition-shadow"
          >
            Edit Profile
          </button>
        </header>

        {/* Navigation */}
        <nav className="flex space-x-4 mb-6">
          {['NFTs', 'Community', 'Cabal', 'Achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab
                ? 'bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] text-white'
                : 'bg-[#1E1E2A] text-gray-400 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="bg-[#1E1E2A] rounded-xl p-6 border border-[#00d8ff] shadow-[0_0_20px_rgba(0,216,255,0.15)]">
          {activeTab === 'NFTs' && <NFTGallery />}
          {activeTab === 'Community' && (
            <Chat
              walletAddress={publicKey?.toString() || ''}
              room="general"
            />
          )}
          {activeTab === 'Cabal' && <Cabal />}
          {activeTab === 'Achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => handleBadgeClick(badge)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    unlocked.includes(badge.id)
                      ? 'bg-gradient-to-r from-[#1E1E2A] to-[#2A2A3A] border border-[#00d8ff]'
                      : 'bg-[#1E1E2A] opacity-50'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{badge.name}</h3>
                  <p className="text-gray-400">{badge.lore}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          profileName={profileName}
          status={status}
          onClose={() => setShowProfile(false)}
          onSave={saveProfile}
          onChangeName={setProfileName}
          onChangeStatus={setStatus}
        />
      )}
    </div>
  );
    setIsLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        wallet_address: publicKey.toString(),
        name: profileName,
        status: status,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success('Profile saved successfully!');
      setShowProfile(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Eonic Vault
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 transition-colors"
            >
              Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-500/20">
            <div className="flex space-x-4 mb-6">
              {['NFTs', 'Community', 'Cabal', 'Achievements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[500px]">
              {activeTab === 'NFTs' && <NFTGallery publicKey={publicKey} />}
              {activeTab === 'Community' && (
                <Chat
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  setMessages={setMessages}
                  publicKey={publicKey}
                />
              )}
              {activeTab === 'Cabal' && <Cabal />}
              {activeTab === 'Achievements' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_BADGES.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => setSelected(badge)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        unlocked.includes(badge.id)
                          ? 'bg-purple-900/50 border border-purple-500'
                          : 'bg-gray-800/50 border border-gray-700'
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-400">{badge.lore}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showProfile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {showProfile && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>;

function handleSaveProfile() {
  setIsLoading(true);
  try {
    const { error } = await supabase.from('profiles').upsert({
      wallet_address: publicKey.toString(),
      name: profileName,
      status: status,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    toast.success('Profile saved successfully!');
    setShowProfile(false);
  } catch (err) {
    console.error('Error saving profile:', err);
    toast.error('Failed to save profile');
  } finally {
    setIsLoading(false);
  }
}

export default EonicDashboard;
