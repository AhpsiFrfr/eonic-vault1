'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface Server {
  id: string;
  name: string;
  icon: string;
  unreadCount?: number;
}

export default function ServerList() {
  const { theme } = useTheme();
  const [servers, setServers] = useState<Server[]>([
    {
      id: 'dev-vault',
      name: 'Dev Vault',
      icon: '/images/icons/dev-vault.png',
      unreadCount: 3,
    },
    // Add more sample servers here
  ]);
  const [activeServer, setActiveServer] = useState<string>('dev-vault');

  return (
    <div className="flex h-full w-full flex-col items-center gap-2 py-4">
      {/* Home Button */}
      <Link
        href="/vaultcord"
        className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cosmic-darker transition-all hover:rounded-xl hover:bg-cosmic-accent ${
          activeServer === 'home' ? 'rounded-xl bg-cosmic-accent' : ''
        }`}
      >
        <Image
          src="/images/icons/home.png"
          alt="Home"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-white transition-all group-hover:h-5" />
      </Link>

      <div className="mx-2 h-0.5 w-full bg-cosmic-light/10" />

      {/* Server List */}
      <div className="flex flex-col gap-2 overflow-y-auto px-2">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cosmic-darker transition-all hover:rounded-xl hover:bg-cosmic-accent ${
              activeServer === server.id ? 'rounded-xl bg-cosmic-accent' : ''
            }`}
          >
            <Image
              src={server.icon}
              alt={server.name}
              width={32}
              height={32}
              className="rounded-lg"
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

      {/* Add Server Button */}
      <button className="mt-auto flex h-12 w-12 items-center justify-center rounded-full bg-cosmic-darker hover:bg-cosmic-accent transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
} 