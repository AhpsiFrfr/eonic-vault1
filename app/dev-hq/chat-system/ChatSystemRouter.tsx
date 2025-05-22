'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChannelSidebar from './ChannelSidebar';
import MessagePanel from './MessagePanel';
import VoiceChannelList from './VoiceChannelList';
import DirectMessagePanel from './DirectMessagePanel';

// @dev-vault-component
export default function ChatSystemRouter() {
  const params = useParams();
  const router = useRouter();
  
  // Extract route parameters
  const { channelId, userId } = params || {};
  
  // Determine which view to render based on route
  const renderView = () => {
    // If we have a userId, render the DM panel
    if (userId) {
      return <DirectMessagePanel userId={userId} />;
    }
    
    // Otherwise render the channel view (default or specific channel)
    return (
      <div className="flex h-full w-full overflow-hidden">
        <ChannelSidebar />
        <MessagePanel channelId={channelId} />
        <VoiceChannelList />
      </div>
    );
  };
  
  return (
    <div className="flex h-full w-full overflow-hidden bg-zinc-950 text-white">
      {renderView()}
    </div>
  );
}
