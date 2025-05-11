'use client';

import { useState, useEffect } from 'react';
import { getMockProfile } from '../../utils/mock-data';
import Image from 'next/image';

interface TimepieceCardProps {
  userWalletAddress?: string;
}

export function TimepieceCard({ userWalletAddress }: TimepieceCardProps) {
  const [timepieceUrl, setTimepieceUrl] = useState<string | null>(null);
  const [timepieceStage, setTimepieceStage] = useState('Genesis');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userWalletAddress) {
      setIsLoading(true);
      const profile = getMockProfile(userWalletAddress);
      if (profile) {
        setTimepieceUrl(profile.timepiece_url || '/timepiece-nft.svg');
        // Mock a stage for now
        setTimepieceStage('Genesis');
      } else {
        // Use default image if no profile found
        setTimepieceUrl('/timepiece-nft.svg');
      }
      setIsLoading(false);
    }
  }, [userWalletAddress]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">Timepiece Stage</h3>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 relative mb-2">
          {isLoading ? (
            <div className="w-full h-full bg-gray-700 animate-pulse rounded-md"></div>
          ) : timepieceUrl ? (
            <Image 
              src={timepieceUrl}
              alt="EONIC Timepiece" 
              fill
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Timepiece
            </div>
          )}
        </div>
        <div className="text-lg font-medium text-indigo-400">{timepieceStage}</div>
      </div>
    </div>
  );
} 