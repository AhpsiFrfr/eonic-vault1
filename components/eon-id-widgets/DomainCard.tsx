'use client';

import { useState, useEffect } from 'react';
import { getMockProfile } from '../../utils/mock-data';

interface DomainCardProps {
  userWalletAddress?: string;
}

export function DomainCard({ userWalletAddress }: DomainCardProps) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (userWalletAddress) {
      const profile = getMockProfile(userWalletAddress);
      if (profile) {
        setDomain(profile.domain || '');
      }
    }
  }, [userWalletAddress]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">Vault Domain</h3>
      <div className="bg-gray-700 rounded px-3 py-2 text-gray-200 font-mono">
        {domain ? `${domain}.vault.sol` : 'No domain claimed'}
      </div>
    </div>
  );
} 