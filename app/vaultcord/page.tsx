'use client';

import ServerSidebar from './components/ServerSidebar';
import ChannelList from './components/ChannelList';
import ChatView from './components/ChatView';
import VoiceRoom from './components/VoiceRoom';

export default function VaultcordPage() {
  return (
    <div className="flex h-screen w-full bg-cosmic-darker">
      {/* Server Sidebar with Voice Room */}
      <ServerSidebar />

      {/* Channel List */}
      <ChannelList />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
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