import React, { useState, useEffect } from 'react';
import { Room, connect } from 'livekit-client';
import { useUser } from '@/hooks/useUser';

interface VoiceChannel {
  id: string;
  name: string;
  participants: string[];
}

export default function VoiceChannelList() {
  const { user } = useUser();
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [channels] = useState<VoiceChannel[]>([
    { id: 'general', name: 'General', participants: [] },
    { id: 'dev-chat', name: 'Dev Chat', participants: [] },
    { id: 'music', name: 'Music', participants: [] },
  ]);

  const joinVoiceChannel = async (channelId: string) => {
    if (!user) return;
    
    try {
      // Disconnect from current room if any
      if (activeRoom) {
        activeRoom.disconnect();
        setActiveRoom(null);
      }

      // Get token from our API
      const res = await fetch(`/api/livekit-token?identity=${user.walletAddress}&room=${channelId}`);
      if (!res.ok) throw new Error('Failed to get token');
      const { token } = await res.json();

      // Connect to LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || '', token);
      setActiveRoom(room);

      // Handle room events
      room.on('participantConnected', () => {
        console.log('A participant connected');
      });

      room.on('participantDisconnected', () => {
        console.log('A participant disconnected');
      });

    } catch (error) {
      console.error('Error joining voice channel:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeRoom) {
        activeRoom.disconnect();
      }
    };
  }, [activeRoom]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-blue-400 mb-4">Voice Channels</h3>
      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => joinVoiceChannel(channel.id)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeRoom?.name === channel.id
              ? 'bg-blue-900/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
              : 'hover:bg-gray-800 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
          }`}
        >
          <div className="flex items-center">
            <span className="mr-3">🎙️</span>
            <span>{channel.name}</span>
          </div>
          {channel.participants.length > 0 && (
            <span className="text-sm text-gray-400">
              {channel.participants.length} online
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 