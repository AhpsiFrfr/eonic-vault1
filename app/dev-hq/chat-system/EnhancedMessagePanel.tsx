'use client';

import React from 'react';
import { ChatWithDM } from '../../../components/ChatWithDM';

interface EnhancedMessagePanelProps {
  channelId?: string;
}

export default function EnhancedMessagePanel({ channelId }: EnhancedMessagePanelProps) {
  const roomName = channelId || 'dev-general';

  return (
    <div className="h-full bg-[#111827]">
      <ChatWithDM
        room={roomName}
        showDMTab={true}
        defaultMode="chat"
        className="h-full"
      />
    </div>
  );
} 