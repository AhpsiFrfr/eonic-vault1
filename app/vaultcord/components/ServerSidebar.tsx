'use client';

import { useState } from 'react';
import VoiceRoom from './VoiceRoom';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/lib/hooks/useUser';

interface Server {
  id: string;
  name: string;
  icon: string;
  unreadCount?: number;
}

export default function ServerSidebar() {
  const { theme } = useTheme();
  const { wallet, isConnecting, error, connectWallet } = useUser();
  const [activeServer, setActiveServer] = useState<string>('dev-vault');
  const [servers] = useState<Server[]>([
    {
      id: 'dev-vault',
      name: 'Dev Vault',
      icon: '/images/icons/dev-vault.png',
      unreadCount: 3,
    },
  ]);

  return (
    <aside className="flex h-full flex-col bg-cosmic-darker border-r border-cosmic-light/10">
      {/* Server List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server.id)}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all hover:rounded-xl hover:bg-cosmic-accent ${
                activeServer === server.id ? 'rounded-xl bg-cosmic-accent' : 'bg-cosmic-light/5'
              }`}
            >
              <img
                src={server.icon}
                alt={server.name}
                className="h-8 w-8 rounded-lg"
              />
              {server.unreadCount && (
                <div className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {server.unreadCount}
                </div>
              )}
              <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-white transition-all group-hover:h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Voice Room Section */}
      <div className="p-4 border-t border-cosmic-light/10">
        {error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={connectWallet}
              className="mt-2 px-4 py-2 bg-cosmic-accent rounded-lg text-white text-sm hover:bg-cosmic-accent/90 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : isConnecting ? (
          <div className="p-4 text-cosmic-light/70 text-sm">
            Connecting to wallet...
          </div>
        ) : wallet ? (
          <VoiceRoom
            roomName="general-voice"
            userId={wallet}
          />
        ) : (
          <div className="p-4 rounded-xl bg-cosmic-light/5 border border-cosmic-light/10">
            <p className="text-cosmic-light/70 text-sm mb-2">
              Connect your wallet to join voice chat
            </p>
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-cosmic-accent rounded-lg text-white text-sm hover:bg-cosmic-accent/90 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </aside>
  );
} 