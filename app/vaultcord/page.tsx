'use client';

import { useRouter } from 'next/navigation';
import ServerSidebar from './components/ServerSidebar';
import ChannelList from './components/ChannelList';
import ChatView from './components/ChatView';
import { VoiceRoom } from './components/VoiceRoom';

export default function VaultcordPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-[#0e1525]">
      {/* Server Sidebar with Voice Room */}
      <div className="w-20 bg-[#0a1019] border-r border-gray-700">
        <ServerSidebar />
      </div>

      {/* Channel List */}
      <div className="w-64 bg-[#0e1525] border-r border-gray-700">
        <ChannelList />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#111827]">
        {/* Chat Header */}
        <div className="h-16 bg-[#0e1525] border-b border-gray-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">VaultCord</h1>
          
          {/* Return to Vault Button in Header */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-[#172a45] rounded-lg hover:bg-[#203651] text-white font-medium transition-colors"
          >
            <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-5 h-5" />
            Return to The Vault
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1">
          <ChatView />
        </div>

        {/* Optional: Voice Room in Main View */}
        {/* Uncomment this section if you want the voice room in the main view instead of sidebar */}
        {/*
        <div className="p-4 border-t border-cosmic-light/10">
          <VoiceRoom
            roomName="general-voice"
            userId="user123" // Replace with actual user ID
          />
        </div>
        */}
      </main>
    </div>
  );
} 