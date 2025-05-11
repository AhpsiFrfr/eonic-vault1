'use client';

import { useState, useEffect } from 'react';
import { getMockProfile } from '../../utils/mock-data';

interface DisplayNameCardProps {
  userWalletAddress?: string;
}

export function DisplayNameCard({ userWalletAddress }: DisplayNameCardProps) {
  const [displayName, setDisplayName] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (userWalletAddress) {
      const profile = getMockProfile(userWalletAddress);
      if (profile) {
        setDisplayName(profile.display_name || 'Anonymous User');
        setTitle(profile.title || 'EONIC User');
      }
    }
  }, [userWalletAddress]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">Display Name</h3>
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-white">{displayName || 'Anonymous User'}</div>
        {title && <div className="text-sm bg-gray-700 px-2 py-0.5 rounded text-gray-300">{title}</div>}
      </div>
    </div>
  );
} 