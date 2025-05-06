import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaGlobe, FaTwitter } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';

interface BusinessCardProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username: string;
    ensName?: string;
    walletAddress: string;
    role?: string;
    timepieceStage?: string;
    lookingFor?: string;
    avatar_url?: string;
    links?: {
      github?: string;
      website?: string;
      twitter?: string;
    };
    isCabal?: boolean;
  };
}

export function BusinessCardPanel({ isOpen, onClose, userData }: BusinessCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Card Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-50"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <RiCloseLine size={24} />
            </button>

            {/* Card Content */}
            <div className="p-6 h-full overflow-y-auto">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30">
                  <img 
                    src={userData.avatar_url || '/default-avatar.png'} 
                    alt={userData.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </div>
              
              {/* Header */}
              <div className="relative mb-6 text-center">
                <div className="flex items-center justify-center space-x-3 flex-wrap">
                  {userData.isCabal && (
                    <div className="absolute -top-2 -right-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 p-1 rounded-full"
                      >
                        <span className="text-xs">ENIC.0</span>
                      </motion.div>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white">
                    {userData.username}
                  </h2>
                  {userData.ensName && userData.ensName !== userData.username && (
                    <span className="text-gray-400 text-sm">
                      {userData.ensName}
                    </span>
                  )}
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-gray-300 break-all">
                  {userData.walletAddress}
                </div>
              </div>

              {/* Role & Stage */}
              {(userData.role || userData.timepieceStage) && (
                <div className="mb-6 space-y-2">
                  {userData.role && (
                    <div className="text-gray-300">{userData.role}</div>
                  )}
                  {userData.timepieceStage && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Evolution Stage:</span>
                      <span className="text-gray-200">{userData.timepieceStage}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Looking For */}
              {userData.lookingFor && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Looking for</h3>
                  <div className="bg-gray-800/30 rounded-lg p-3 text-gray-300">
                    {userData.lookingFor}
                  </div>
                </div>
              )}

              {/* External Links */}
              {userData.links && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    {userData.links.github && (
                      <a
                        href={userData.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                    {userData.links.website && (
                      <a
                        href={userData.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaGlobe size={20} />
                      </a>
                    )}
                    {userData.links.twitter && (
                      <a
                        href={userData.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaTwitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 