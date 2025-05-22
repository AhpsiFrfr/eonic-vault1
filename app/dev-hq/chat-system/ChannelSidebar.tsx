'use client';
import React, { useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';

// @dev-vault-component
interface Channel {
  id: string;
  name: string;
  type: 'text' | 'announcement';
  unreadCount?: number;
}

const mockChannels: Channel[] = [
  { id: '1', name: 'general', type: 'text' },
  { id: '2', name: 'announcements', type: 'announcement' },
  { id: '3', name: 'dev-chat', type: 'text', unreadCount: 3 },
  { id: '4', name: 'bug-reports', type: 'text' },
];

const ChannelSidebar: React.FC = () => {
  const { theme } = useTheme();
  const [activeChannel, setActiveChannel] = useState<string>('1');

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Text Channels</h2>
        <div className="space-y-1">
          {mockChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all ${
                activeChannel === channel.id
                  ? 'bg-indigo-600/20 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg mr-2">#</span>
              <span className="flex-1">{channel.name}</span>
              {channel.unreadCount && (
                <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                  {channel.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
