'use client';

import { useProfile } from '@/hooks/useProfile';

interface XPLevelCardProps {
  userWalletAddress?: string;
}

export function XPLevelCard({ userWalletAddress }: XPLevelCardProps) {
  const { profile, isLoading } = useProfile();

  // Calculate level based on XP (this could be moved to a utility function)
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const xp = profile?.timepiece_xp || 0;
  const level = calculateLevel(xp);
  const nextLevelXp = level * 100;
  const progressPercent = Math.min(100, Math.floor((xp % 100) * 100 / 100));

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm text-gray-400 mb-1">XP Level</h3>
        <div className="animate-pulse">
          <div className="flex items-center mb-2">
            <div className="bg-gray-700 w-10 h-10 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

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