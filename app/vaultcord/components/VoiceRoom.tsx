'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

interface VoiceRoomProps {
  roomName: string;
  userId?: string;
}

export function VoiceRoom({ roomName, userId }: VoiceRoomProps) {
  const { publicKey } = useWallet();
  const [joined, setJoined] = useState(true);
  const [muted, setMuted] = useState(false);
  const router = useRouter();

  const participants = [
    { name: 'Nick', self: true, avatar: '/images/avatars/default.svg', speaking: false },
    { name: 'Kat', self: false, avatar: '/images/avatars/default.svg', speaking: true },
    { name: 'ENIC', self: false, avatar: '/images/enico-icon.png', speaking: false },
  ];

  const walletId = userId || publicKey?.toString();

  if (!walletId) {
    return (
      <div className="p-4 bg-[#0e1525] text-gray-300 rounded-lg">
        <p className="text-sm">Connect your wallet to join voice chat.</p>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="p-6 bg-[#0e1525] text-white rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-cyan-400">🎙️ {roomName}</h3>
        <button
          onClick={() => setJoined(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Join Voice Channel
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0e1525] text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-cyan-300 mb-6">{roomName}</h2>

      {/* Connection Status */}
      <div className="bg-green-600 rounded-lg px-4 py-2 text-sm mb-6 inline-flex items-center gap-2">
        <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
        ✓ Connected
      </div>

      {/* Voice Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setMuted(!muted)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            muted 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-green-500 hover:bg-green-400 text-white'
          }`}
        >
          {muted ? '🔇 Unmute' : '🎤 Mute'}
        </button>
        <button
          onClick={() => setJoined(false)}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Leave
        </button>
        <div className="text-sm text-cyan-200 ml-auto">
          {participants.length} online
        </div>
      </div>

      {/* Participants Section */}
      <div className="mb-8">
        <h3 className="text-lg mb-4 text-gray-300 uppercase tracking-wide text-sm font-semibold">
          Participants
        </h3>
        <div className="space-y-3">
          {participants.map((user, i) => (
            <div
              key={i}
              className="bg-[#1a2335] px-4 py-3 rounded-lg flex items-center justify-between hover:bg-[#20293a] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                  />
                  {user.speaking && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a2335] animate-pulse"></div>
                  )}
                  {muted && user.self && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1a2335]"></div>
                  )}
                </div>
                <div>
                  <span className={`font-medium ${user.self ? 'text-blue-400' : 'text-white'}`}>
                    {user.name}
                    {user.self && ' (You)'}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                {user.speaking ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Speaking
                  </span>
                ) : user.self && muted ? (
                  <span className="text-red-400">Muted</span>
                ) : (
                  <span className="text-gray-500">Idle</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return to Vault Button */}
      <div className="mt-10 flex justify-start">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-[#172a45] rounded-lg hover:bg-[#203651] text-white font-semibold transition-colors shadow-lg"
        >
          <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-6 h-6" />
          Return to The Vault
        </button>
      </div>
    </div>
  );
} 