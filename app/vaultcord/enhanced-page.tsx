'use client';

import { useRouter } from 'next/navigation';
import ServerSidebar from './components/ServerSidebar';
import ChannelList from './components/ChannelList';
import EnhancedChatView from './components/EnhancedChatView';
import { VoiceRoom } from './components/VoiceRoom';
import { AffirmationPylon } from '@/components/pylons/AffirmationPylon';

export default function EnhancedVaultcordPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-[#0e1525]">
      {/* Server Sidebar */}
      <div className="w-20 bg-[#0a1019] border-r border-gray-700">
        <ServerSidebar />
      </div>

      {/* Channel List */}
      <div className="w-64 bg-[#0e1525] border-r border-gray-700">
        <ChannelList />
      </div>

      {/* Main Content with Enhanced Chat */}
      <main className="flex-1 flex flex-col bg-[#111827]">
        {/* Chat Header */}
        <div className="h-16 bg-[#0e1525] border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-white">VaultCord</h1>
            <div className="px-3 py-1 bg-cyan-600/20 border border-cyan-600/30 rounded-full">
              <span className="text-cyan-400 text-xs font-medium">ENHANCED WITH DMs</span>
            </div>
          </div>
          
          {/* Return to Vault Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-[#172a45] rounded-lg hover:bg-[#203651] text-white font-medium transition-colors"
          >
            <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-5 h-5" />
            Return to The Vault
          </button>
        </div>

        {/* Enhanced Chat with DM Integration */}
        <div className="flex-1">
          <EnhancedChatView />
        </div>
      </main>

      {/* Right Sidebar with Voice and Pylon */}
      <div className="w-80 bg-[#0e1525] border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
        {/* Voice Room Widget */}
        <VoiceRoom roomName="voice-general" />
        
        {/* ENIC.0 Affirmation Pylon */}
        <div className="mt-6">
          <AffirmationPylon />
        </div>
      </div>
    </div>
  );
} 