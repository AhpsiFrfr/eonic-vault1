'use client';

import React from 'react';
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

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Left sidebar with text channels */}
      <ChannelSidebar />

      {/* Main chat area */}
      <div className="flex flex-col flex-1">
        <MessagePanel />
      </div>

      {/* Right sidebar with voice channels */}
      <div className="w-64 border-l border-gray-800">
        <VoiceChannelList />
      </div>
    </div>
  );
};

export default ChatRoom;
