'use client';

import { useState, useEffect } from 'react';

interface HoldingsCardProps {
  userWalletAddress?: string;
}

export function HoldingsCard({ userWalletAddress }: HoldingsCardProps) {
  const [eonicBalance, setEonicBalance] = useState(0);

  useEffect(() => {
    if (userWalletAddress) {
      // Mock data - this would come from an API in production
      setEonicBalance(750.25);
    }
  }, [userWalletAddress]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">EONIC Holdings</h3>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 mr-3 flex items-center justify-center text-xs font-bold">
          E
        </div>
        <div className="text-xl font-bold text-white">
          {eonicBalance.toLocaleString()} <span className="text-sm text-gray-400">EONIC</span>
        </div>
      </div>
    </div>
  );
} 