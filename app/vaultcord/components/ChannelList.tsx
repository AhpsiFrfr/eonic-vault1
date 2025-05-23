'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { VoiceRoom } from './VoiceRoom';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unreadCount?: number;
  category: string;
}

export default function ChannelList() {
  const { theme } = useTheme();
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'general',
      name: 'general',
      type: 'text',
      category: 'Text Channels',
      unreadCount: 2,
    },
    {
      id: 'dev-chat',
      name: 'dev-chat',
      type: 'text',
      category: 'Text Channels',
    },
    {
      id: 'voice-general',
      name: 'General',
      type: 'voice',
      category: 'Voice Channels',
    },
    {
      id: 'voice-coding',
      name: 'Coding Session',
      type: 'voice',
      category: 'Voice Channels',
    },
  ]);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<string | null>(null);

  const categories = Array.from(new Set(channels.map((channel) => channel.category)));

  const handleChannelClick = (channel: Channel) => {
    if (channel.type === 'text') {
      setActiveChannel(channel.id);
    } else {
      setActiveVoiceChannel(activeVoiceChannel === channel.id ? null : channel.id);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Server Header */}
      <div className="flex h-12 items-center border-b border-cosmic-light/10 px-4">
        <h2 className="font-semibold text-cosmic-light">Dev Vault</h2>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-cosmic-light/50">
              {category}
            </h3>
            {channels
              .filter((channel) => channel.category === category)
              .map((channel) => (
                <div key={channel.id}>
                  <button
                    onClick={() => handleChannelClick(channel)}
                    className={`group relative flex w-full items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-cosmic-light/5 ${
                      (channel.type === 'text' ? activeChannel === channel.id : activeVoiceChannel === channel.id)
                        ? 'bg-cosmic-light/10 text-cosmic-light'
                        : 'text-cosmic-light/70'
                    }`}
                  >
                    {channel.type === 'text' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                        <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                      </svg>
                    )}
                    <span>{channel.name}</span>
                    {channel.unreadCount && (
                      <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {channel.unreadCount}
                      </div>
                    )}
                  </button>
                  {channel.type === 'voice' && activeVoiceChannel === channel.id && (
                    <div className="mt-1 pl-6">
                      <VoiceRoom
                        roomName={channel.id}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="flex h-14 items-center gap-3 border-t border-cosmic-light/10 px-3">
        <div className="h-8 w-8 rounded-full bg-cosmic-light/20" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-cosmic-light">Username</span>
          <span className="text-xs text-cosmic-light/50">#1234</span>
        </div>
      </div>
    </div>
  );
} 