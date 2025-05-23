'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme/ThemeProvider';

interface VoiceChannel {
  id: string;
  name: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    speaking?: boolean;
    muted?: boolean;
  }[];
}

const mockVoiceChannels: VoiceChannel[] = [
  {
    id: '1',
    name: 'General Voice',
    participants: [
      {
        id: '1',
        name: 'DevLead',
        avatar: '/images/avatars/default.svg',
        speaking: true
      },
      {
        id: '2',
        name: 'QAEngineer',
        avatar: '/images/avatars/default.svg',
        muted: true
      }
    ]
  },
  {
    id: '2',
    name: 'Cabal Meeting',
    participants: []
  }
];

const VoiceChannelList: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [channels] = useState<VoiceChannel[]>(mockVoiceChannels);

  const handleJoinVoice = () => {
    router.push('/vaultcord');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Voice Channels</h2>
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium flex items-center">
                <span className="text-indigo-400 mr-2">🔊</span>
                {channel.name}
              </h3>
              <button 
                onClick={handleJoinVoice}
                className="text-blue-400 hover:text-blue-300 text-sm bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1 rounded transition-colors"
              >
                Join VaultCord
              </button>
            </div>
            
            {channel.participants.length > 0 && (
              <div className="space-y-2">
                {channel.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div className="relative">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {participant.speaking && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                      )}
                      {participant.muted && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900" />
                      )}
                    </div>
                    <span className="text-gray-300">{participant.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {channel.participants.length === 0 && (
              <p className="text-sm text-gray-500">No one is here yet</p>
            )}
          </div>
        ))}
      </div>
      
      {/* Quick Access to VaultCord */}
      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
        <h3 className="text-blue-400 font-medium mb-2">🎙️ Enhanced Voice Experience</h3>
        <p className="text-sm text-gray-400 mb-3">
          Join VaultCord for advanced voice features, spatial audio, and real-time collaboration.
        </p>
        <button
          onClick={handleJoinVoice}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Launch VaultCord
        </button>
      </div>
    </div>
  );
};

export default VoiceChannelList;
