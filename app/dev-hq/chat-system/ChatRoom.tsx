'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useUser } from '@/lib/hooks/useUser';
import ChannelSidebar from './ChannelSidebar';
import MessagePanel from './MessagePanel';
import VoiceChannelList from './VoiceChannelList';

interface ChatRoomProps {
  // Add props as needed
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const { theme } = useTheme();
  const { wallet, isConnecting, error } = useUser();
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#0e1525]">
      {/* Left sidebar with text channels */}
      <div className="w-64 bg-[#0a1019] border-r border-gray-700">
        <ChannelSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 bg-[#111827]">
        {/* Chat Header with Return Button */}
        <div className="h-16 bg-[#0e1525] border-b border-gray-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">Dev HQ Chat</h1>
          
          {/* Return to Vault Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 px-5 py-3 bg-[#172a45] rounded-lg hover:bg-[#203651] text-white font-semibold transition-colors shadow-lg"
          >
            <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-6 h-6" />
            Return to The Vault
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1">
          <MessagePanel />
        </div>
      </div>

      {/* Right sidebar with voice channels */}
      <div className="w-64 bg-[#0e1525] border-l border-gray-700">
        <VoiceChannelList />
      </div>
    </div>
  );
};

export default ChatRoom;
