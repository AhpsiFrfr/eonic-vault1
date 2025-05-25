'use client';

import React from 'react';
import { ChatWithDM } from '../../../components/ChatWithDM';
import { useChannels } from '@/context/ChannelContext';

export default function EnhancedChatView() {
  const { channels, activeChannelId } = useChannels();
  
  // Find the active channel
  const activeChannel = channels.find(c => c.id === activeChannelId);
  const roomName = activeChannel?.name || 'general';

  return (
    <div className="h-full bg-[#0e1525]">
      <ChatWithDM
        room={roomName}
        showDMTab={true}
        defaultMode="chat"
        className="h-full"
      />
    </div>
  );
} 