'use client';
import Image from 'next/image';

const wallets = [
  { name: 'Phantom', icon: '/wallets/phantom.png' },
  { name: 'MetaMask', icon: '/wallets/metamask.png' },
  { name: 'Solflare', icon: '/wallets/solflare.png' },
  { name: 'Coinbase', icon: '/wallets/coinbase.png' }
];

export function WalletOptions({ onSelect, active }: { onSelect: (wallet: string) => void, active: string | null }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {wallets.map(wallet => (
        <button
          key={wallet.name}
          onClick={() => onSelect(wallet.name)}
          className={`p-3 bg-[#0f111b] rounded-xl transition-transform transform hover:scale-105 hover:shadow-lg 
            ${active === wallet.name ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}
        >
          <div className="relative w-16 h-16 mx-auto mb-2 animate-rotate-slow">
            <Image src={wallet.icon} alt={wallet.name} fill className="object-contain" />
          </div>
          <div className="text-sm text-center">{wallet.name}</div>
        </button>
      ))}
    </div>
  );
} 