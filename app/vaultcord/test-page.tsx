'use client';

import { useRouter } from 'next/navigation';
import { ChannelProvider } from '@/context/ChannelContext';
import { EnhancedChannelList } from '@/components/Sidebar/EnhancedChannelList';
import { EnhancedChatView } from '@/components/EnhancedChatView';
import { VoiceRoom } from './components/VoiceRoom';
import { AffirmationPylon } from '@/components/pylons/AffirmationPylon';

export default function VaultcordTestPage() {
  const router = useRouter();

  return (
    <ChannelProvider>
      <div className="flex h-screen w-full bg-[#0e1525]">
        {/* Server Sidebar */}
        <div className="w-20 bg-[#0a1019] border-r border-gray-700 flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-lg">VC</span>
          </div>
          
          {/* Additional server icons */}
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
              <span className="text-gray-400 font-bold text-sm">EV</span>
            </div>
            <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
              <span className="text-gray-400 font-bold text-sm">DH</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          {/* User status indicator */}
          <div className="w-12 h-12 bg-green-500/20 rounded-full border-2 border-green-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Channel List */}
        <div className="w-64">
          <EnhancedChannelList 
            showVoiceRooms={false}
            serverName="VaultCord [TESTING]"
            logoSrc="/images/vaultcord-logo.svg"
            logoAlt="VaultCord Logo"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header with Return Button */}
          <div className="h-16 bg-[#0e1525] border-b border-gray-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white">VaultCord</h1>
              <div className="px-3 py-1 bg-cyan-600/20 border border-cyan-600/30 rounded-full">
                <span className="text-cyan-400 text-xs font-medium">TESTING MODE</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-[#172a45] hover:bg-[#203651] rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
            >
              <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-5 h-5" />
              Return to The Vault
            </button>
          </div>

          {/* Enhanced Chat View */}
          <div className="flex-1">
            <EnhancedChatView />
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-80 bg-[#0e1525] border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
          {/* Voice Room Widget */}
          <div className="bg-[#2f3349] rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold">Active Voice</h3>
            </div>
            <VoiceRoom roomName="voice-general" />
          </div>
          
          {/* Quick Actions */}
          <div className="bg-[#2f3349] rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-[#3d4450] hover:bg-[#4a525f] rounded-lg transition-colors text-left">
                <span className="text-blue-400">📢</span>
                <span className="text-gray-300 text-sm">Screen Share</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-[#3d4450] hover:bg-[#4a525f] rounded-lg transition-colors text-left">
                <span className="text-green-400">🎵</span>
                <span className="text-gray-300 text-sm">Play Music</span>
              </button>
            </div>
          </div>
          
          {/* ENIC.0 Affirmation Pylon */}
          <div className="mt-6">
            <AffirmationPylon />
          </div>
        </div>
      </div>
    </ChannelProvider>
  );
} 