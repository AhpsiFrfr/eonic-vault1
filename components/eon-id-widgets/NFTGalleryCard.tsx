'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NFTGalleryCardProps {
  userWalletAddress?: string;
}

export function NFTGalleryCard({ userWalletAddress }: NFTGalleryCardProps) {
  const [nfts, setNfts] = useState<{id: string; image: string}[]>([]);

  useEffect(() => {
    if (userWalletAddress) {
      // Mock data - this would come from an API in production
      setNfts([
        { id: 'nft1', image: '/timepiece-nft.svg' },
        { id: 'nft2', image: '/default-avatar.png' },
        { id: 'nft3', image: '/timepiece-nft.svg' },
      ]);
    }
  }, [userWalletAddress]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-2">NFT Gallery</h3>
      {nfts.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {nfts.map(nft => (
            <div key={nft.id} className="aspect-square rounded bg-gray-700 overflow-hidden relative">
              <Image 
                src={nft.image}
                alt="NFT"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No NFTs to display</div>
      )}
    </div>
  );
} 