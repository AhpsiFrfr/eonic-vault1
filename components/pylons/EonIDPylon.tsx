import { useEONIDStore } from '@/state/eonidStore';
import { ExternalLink, User, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function EonIDPylon() {
  const { profile, orbitalModules, fetchProfile, isLoading } = useEONIDStore();

  useEffect(() => {
    // Load profile if not already loaded
    if (!profile) {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      fetchProfile(mockWalletAddress);
    }
  }, [profile, fetchProfile]);

  // Loading state
  if (isLoading || !profile) {
    return (
      <div className="pylon relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            EON-ID Profile
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <motion.div
            className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  // Extract XP and level data from timepiece module
  const timepieceModule = orbitalModules.find(module => module.type === 'timepiece');
  const xp = timepieceModule?.data?.xp || 2750;
  const level = timepieceModule?.data?.level || 3;

  return (
    <div className="pylon relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          EON-ID Profile
        </h3>
        <Link href="/dashboard/eon-id">
          <button className="p-1 rounded text-gray-400 bg-gray-400/20 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Profile Display */}
      <div className="space-y-4">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500 shadow-glow-blue">
              <img
                src={profile.avatarUrl || '/images/avatars/default-avatar.png'}
                className="w-full h-full object-cover"
                alt="Profile Picture"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-bold text-glow pulse-glow">{profile.displayName}</h2>
            <p className="text-sm text-gray-400 pulse-glow">{profile.title}</p>
            <div className="text-yellow-400 font-mono text-sm">@{profile.domain}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-800/30 rounded-lg">
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
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="space-y-2">
            <div className="text-sm text-gray-300 bg-gray-800/30 rounded-lg p-3 leading-relaxed">
              {profile.bio}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
          <div className="space-y-2">
            <span className="text-sm text-gray-300">Connected</span>
            <div className="flex gap-3 text-xs">
              {profile.socialLinks.twitter && (
                <motion.a 
                  href={profile.socialLinks.twitter} 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  Twitter
                </motion.a>
              )}
              {profile.socialLinks.github && (
                <motion.a 
                  href={profile.socialLinks.github} 
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  GitHub
                </motion.a>
              )}
              {profile.socialLinks.discord && (
                <span className="text-indigo-400">{profile.socialLinks.discord}</span>
              )}
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span>Profile Active</span>
        </div>
      </div>
    </div>
  );
} 