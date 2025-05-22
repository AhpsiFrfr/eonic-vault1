'use client';

import { useProfile } from '@/hooks/useProfile';
import Image from 'next/image';

interface TimepieceCardProps {
  userWalletAddress?: string;
}

export function TimepieceCard({ userWalletAddress }: TimepieceCardProps) {
  const { profile, isLoading } = useProfile();

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">Timepiece Stage</h3>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 relative mb-2">
          {isLoading ? (
            <div className="w-full h-full bg-gray-700 animate-pulse rounded-md"></div>
          ) : profile?.timepiece_url ? (
            <Image 
              src={profile.timepiece_url}
              alt="EONIC Timepiece"
              fill
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/timepiece-nft.png';
              }}
            />
          ) : (
            <Image 
              src="/images/timepiece-nft.png"
              alt="Default Timepiece"
              fill
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>
        <div className="text-lg font-medium text-indigo-400">
          {profile?.timepiece_stage || 'Genesis'}
        </div>
      </div>
    </div>
  );
} 