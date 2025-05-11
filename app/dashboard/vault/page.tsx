'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AppCardProps {
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, icon, comingSoon = false, onClick }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)' }}
    whileTap={{ scale: 0.98 }}
    className={`relative bg-[#1E1E2F] p-6 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all ${comingSoon ? 'opacity-70' : 'cursor-pointer'}`}
    onClick={!comingSoon ? onClick : undefined}
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
    
    {comingSoon && (
      <div className="absolute top-4 right-4 bg-indigo-600 text-xs py-1 px-2 rounded text-white">
        Coming Soon
      </div>
    )}
  </motion.div>
);

export default function VaultPage() {
  const apps = [
    {
      title: "Timepiece Visualizer",
      description: "Interactive explorer for EONIC timepiece NFTs with detailed metadata",
      icon: "⏱️",
      comingSoon: false
    },
    {
      title: "Blockchain Browser",
      description: "Explore the Solana blockchain with an intuitive interface",
      icon: "🔍",
      comingSoon: false
    },
    {
      title: "NFT Gallery",
      description: "Browse and organize your NFT collection",
      icon: "🖼️",
      comingSoon: false
    },
    {
      title: "Transaction Analyzer",
      description: "Detailed history and analytics of your blockchain transactions",
      icon: "📊",
      comingSoon: true
    },
    {
      title: "Token Dashboard",
      description: "Manage and track your EONIC tokens and rewards",
      icon: "💰",
      comingSoon: true
    },
    {
      title: "Notifications API",
      description: "Configure blockchain event notifications and webhooks",
      icon: "🔔",
      comingSoon: true
    }
  ];

  return (
    <div className="w-full px-4 py-6 space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">EONIC Vault</h2>
        <div className="text-sm text-gray-400">
          <span>6 apps available</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <AppCard
            key={index}
            title={app.title}
            description={app.description}
            icon={app.icon}
            comingSoon={app.comingSoon}
            onClick={() => console.log(`Opening ${app.title}`)}
          />
        ))}
      </div>
    </div>
  );
} 