'use client';

import React from 'react';
import { useEONIDStore } from '@/state/eonidStore';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function EonIDIdentityDisplay() {
  const { profile, orbitalModules } = useEONIDStore();

  if (!profile) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 p-6 bg-gradient-to-br from-black to-gray-900 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Extract XP and level from timepiece module
  const timepieceModule = orbitalModules.find(module => module.type === 'timepiece');
  const xp = timepieceModule?.data?.xp || 2750;
  const level = timepieceModule?.data?.level || 3;

  return (
    <motion.div 
      className="rounded-2xl border border-cyan-500/50 p-6 bg-gradient-to-br from-black to-gray-900 shadow-glow-blue"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-glow flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          Your EON-ID
        </h3>
        <Link href="/dashboard/eon-id">
          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Identity Info */}
      <div className="space-y-4">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500 shadow-glow-blue">
              <img
                src={profile.avatarUrl || '/images/avatars/default-avatar.png'}
                className="w-full h-full object-cover"
                alt="Profile Picture"
              />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold text-glow">{profile.displayName}</h2>
            <p className="text-gray-400">{profile.title}</p>
            <div className="text-yellow-400 font-mono text-sm">@{profile.domain}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{xp.toLocaleString()}</div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{level}</div>
            <div className="text-xs text-gray-400">Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {profile.socialLinks ? Object.values(profile.socialLinks).filter(link => link).length : 0}
            </div>
            <div className="text-xs text-gray-400">Links</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">✓</div>
            <div className="text-xs text-gray-400">Verified</div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="p-3 bg-gray-800/20 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link href="/dashboard/eon-id" className="flex-1">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Customize Profile
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 