import { useState } from 'react';
import { useVaultData } from '../hooks/useVaultData';

export const ReferralStats: React.FC = () => {
  const { referralStats } = useVaultData();
  const [copied, setCopied] = useState(false);

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Your Code:</span>
          <button
            onClick={copyReferralCode}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <span>{referralStats.referralCode}</span>
            <span className="text-gray-500">
              {copied ? '✓' : '📋'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Total Referrals</p>
          <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Active Referrals</p>
          <p className="text-2xl font-bold">{referralStats.activeReferrals}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Total Rewards</p>
          <p className="text-2xl font-bold">{referralStats.totalRewards} EONIC</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Pending Rewards</p>
          <p className="text-2xl font-bold">{referralStats.pendingRewards} EONIC</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <h3 className="font-medium text-gray-900">Share your referral link</h3>
          <p className="text-sm text-gray-500">Earn rewards for each successful referral</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Share Link
        </button>
      </div>
    </div>
  );
}; 