'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getMockProfile, createDefaultProfile, UserMetrics } from '../../utils/mock-data';

// Dashboard Components
interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const DashboardCard = ({ title, value, subtitle = '' }: DashboardCardProps) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)' }}
    className="bg-gradient-to-br from-[#1E1E2F] to-[#252538] p-5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all"
  >
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
    {subtitle && <p className="text-indigo-400 text-sm mt-1">{subtitle}</p>}
  </motion.div>
);

interface QuickLinkProps {
  label: string;
  href: string;
  icon: string;
}

const QuickLink = ({ label, href, icon }: QuickLinkProps) => (
  <Link href={href}>
    <motion.div 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-4 bg-[#1E1E2F] rounded-lg border border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
    >
      <div className="text-2xl">{icon}</div>
      <span className="font-medium">{label}</span>
    </motion.div>
  </Link>
);

export default function Dashboard() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';
  const [displayName, setDisplayName] = useState('Vault Member');
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    level: 1,
    currentXp: 0,
    eonicBalance: 0,
    referralCount: 0,
    hasTimepiece: false,
    timepieceImageUrl: '/timepiece-nft.svg',
    timepieceStage: 'Genesis',
    nftXp: 0
  });

  useEffect(() => {
    // In a real application, you would fetch user data from your API
    const fetchUserData = async () => {
      if (walletAddress) {
        // Try to get profile from mock data, or create a default one
        const profile = getMockProfile(walletAddress) || createDefaultProfile(walletAddress);
        
        // Update display name
        setDisplayName(profile.display_name || 'Vault Member');
        
        // Set mock metrics
        setUserMetrics({
          level: 3,
          currentXp: 2450,
          eonicBalance: 125,
          referralCount: 2,
          hasTimepiece: true,
          timepieceImageUrl: '/timepiece-nft.svg',
          timepieceStage: 'Genesis',
          nftXp: 750
        });
      }
    };

    fetchUserData();
  }, [walletAddress]);

  const { 
    level, 
    currentXp, 
    eonicBalance, 
    referralCount,
    hasTimepiece,
    timepieceImageUrl,
    timepieceStage,
    nftXp
  } = userMetrics;

  return (
    <div className="w-full px-4 py-6 space-y-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Welcome Back to the Vault, {displayName}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardCard title="Current Level" value={`Level ${level}`} subtitle={`${currentXp} XP`} />
        <DashboardCard title="$EONIC Held" value={`${eonicBalance} $EONIC`} />
        <DashboardCard title="Referrals" value={`${referralCount} Activated`} />
      </div>

      {hasTimepiece && (
        <div className="mt-6 bg-gradient-to-r from-indigo-800 to-violet-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Timepiece Evolution</h3>
          <img 
            src={timepieceImageUrl} 
            alt="Your NFT Timepiece" 
            className="w-full max-w-sm rounded-lg" 
          />
          <p className="text-sm mt-2">Stage: {timepieceStage} • XP: {nftXp}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink label="Customize EON-ID" href="/dashboard/eon-id" icon="🧬" />
        <QuickLink label="Enter Community" href="/dashboard/community" icon="💬" />
        <QuickLink label="Claim Rewards" href="/dashboard/vault" icon="🔌" />
      </div>
    </div>
  );
}
