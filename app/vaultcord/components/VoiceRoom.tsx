'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface VoiceRoomProps {
  roomName: string;
  userId?: string; // Optional since we can get from wallet
}

export function VoiceRoom({ roomName, userId }: VoiceRoomProps) {
  const { publicKey } = useWallet();
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [participants] = useState(['You', 'Nick', 'ENIC.0']); // Replace with dynamic data later

  const walletId = userId || publicKey?.toString();

  if (!walletId) {
    return (
      <div className="p-4 bg-zinc-900 text-gray-300 rounded-lg">
        <p className="text-sm">Connect your wallet to join voice chat.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-zinc-900 text-white rounded-lg shadow-xl border border-zinc-700">
      <h3 className="text-lg font-bold mb-3 text-cyan-400">🎙️ {roomName}</h3>

      {!joined ? (
        <button
          onClick={() => setJoined(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Join Voice Channel
        </button>
      ) : (
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-2 bg-zinc-800 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
            <button
              onClick={() => setJoined(false)}
              className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              Leave
            </button>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMuted(!muted)}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                muted 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {muted ? '🔇 Unmute' : '🎤 Mute'}
            </button>
            <div className="text-xs text-gray-400 px-2">
              {participants.length} online
            </div>
          </div>

          {/* Participants List */}
          <div className="space-y-1">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide">Participants</h4>
            {participants.map((user, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 bg-zinc-800 rounded text-sm">
                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                <span className={idx === 0 ? 'text-blue-400 font-medium' : 'text-white'}>
                  {user}
                  {idx === 0 && ' (You)'}
                </span>
                {idx !== 0 && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {muted && idx === 0 ? 'Muted' : 'Speaking'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 