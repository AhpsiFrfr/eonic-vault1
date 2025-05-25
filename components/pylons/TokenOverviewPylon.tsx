'use client'

import { useEffect, useState } from 'react';

interface TokenData {
  balance: number;
  staked: number;
  locked: number;
  platformLocked: number;
  apy: number;
  valueUSD: number;
  change24h: number;
}

export default function TokenOverviewPylon() {
  const [token, setToken] = useState<TokenData>({
    balance: 123456,
    staked: 42000,
    locked: 18500,
    platformLocked: 980500,
    apy: 12.5,
    valueUSD: 4296.75,
    change24h: 8.7,
  });

  return (
    <div className="bg-[#1d1d28] rounded-xl p-4 border border-yellow-500 text-white">
      <h2 className="text-lg font-bold text-yellow-300 mb-2">$EONIC Overview</h2>
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-400">Total Holdings</p>
          <p className="text-emerald-400 font-bold">{token.balance.toLocaleString()} EONIC</p>
        </div>
        <div>
          <p className="text-gray-400">Staked</p>
          <p className="text-cyan-400 font-bold">{token.staked.toLocaleString()} EONIC</p>
        </div>
        <div>
          <p className="text-gray-400">Locked</p>
          <p className="text-purple-400 font-bold">{token.locked.toLocaleString()} EONIC</p>
        </div>
        <div>
          <p className="text-gray-400">Platform Total</p>
          <p className="text-yellow-300 font-bold">{token.platformLocked.toLocaleString()} EONIC</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-2">
        <p className="text-gray-400">Total Portfolio Value</p>
        <p className="text-green-400 font-bold">${token.valueUSD.toLocaleString()} (+{token.change24h}% 24h)</p>
      </div>

      <div className="flex flex-col gap-2">
        <a href="https://app.streamflow.finance?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded transition-colors">
            Stake $EONIC
          </button>
        </a>
        <a href="https://token.clock.so/lock?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors">
            Lock $EONIC
          </button>
        </a>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>APY (Staking): {token.apy}%</span>
        <span>Lock Rewards: Up to 25%</span>
      </div>
    </div>
  );
} 