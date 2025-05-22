'use client';

import { useProfile } from '@/hooks/useProfile';
import Image from 'next/image';

interface NFTGalleryCardProps {
  userWalletAddress?: string;
}

export function NFTGalleryCard({ userWalletAddress }: NFTGalleryCardProps) {
  const { profile, isLoading } = useProfile();

  // For now, we'll show a fixed set of NFTs including the timepiece
  const defaultNfts = [
    { id: 'timepiece', image: profile?.timepiece_url || '/images/timepiece-nft.png' },
    { id: 'avatar', image: profile?.avatar_url || '/images/avatars/default.svg' },
  ];

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm text-gray-400 mb-2">NFT Gallery</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded bg-gray-700 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-2">NFT Gallery</h3>
      <div className="grid grid-cols-3 gap-2">
        {defaultNfts.map(nft => (
          <div key={nft.id} className="aspect-square rounded bg-gray-700 overflow-hidden relative">
            <Image 
              src={nft.image}
              alt={`${nft.id} NFT`}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/avatars/default.svg';
              }}
            />
          </div>
        ))}
        {/* Placeholder for future NFTs */}
        <div className="aspect-square rounded bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
          +
        </div>
      </div>
    </div>
  );
} 