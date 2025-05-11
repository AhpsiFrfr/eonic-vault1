'use client';

import { useState, useEffect } from 'react';

interface XPLevelCardProps {
  userWalletAddress?: string;
}

export function XPLevelCard({ userWalletAddress }: XPLevelCardProps) {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);

  useEffect(() => {
    if (userWalletAddress) {
      // Mock data - this would come from an API in production
      setLevel(3);
      setXp(275);
      setNextLevelXp(400);
    }
  }, [userWalletAddress]);

  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.floor((xp / nextLevelXp) * 100));

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">XP Level</h3>
      <div className="flex items-center mb-2">
        <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {level}
        </div>
        <div>
          <div className="text-white font-medium">Level {level}</div>
          <div className="text-xs text-gray-400">{xp} / {nextLevelXp} XP</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
} 