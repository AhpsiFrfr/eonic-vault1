'use client';

import { useProfile } from '@/hooks/useProfile';

interface DisplayNameCardProps {
  userWalletAddress?: string;
}

export function DisplayNameCard({ userWalletAddress }: DisplayNameCardProps) {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm text-gray-400 mb-1">Display Name</h3>
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-6 bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-1">Display Name</h3>
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-white">{profile?.display_name || 'Anonymous User'}</div>
        {profile?.title && <div className="text-sm bg-gray-700 px-2 py-0.5 rounded text-gray-300">{profile.title}</div>}
      </div>
    </div>
  );
} 