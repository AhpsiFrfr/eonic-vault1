'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaGlobe, FaTwitter } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';
import { getMockProfile } from '../utils/mock-data';

// Define style variations
const styleMap: Record<string, string> = {
  intern: 'border-blue-400 bg-[#0a0a0a]/90',
  secretary: 'border-pink-500 bg-[#1a0a1a]/90',
  management: 'border-green-400 bg-[#0a1a0a]/90',
  ceo: 'border-purple-600 bg-[#0a0a1a]/90',
  paul_allen: 'border-[#eeeeee] bg-[#f8f6f2]/90 font-serif',
};

// Define text colors for each style
const textStyleMap: Record<string, string> = {
  intern: 'text-blue-200',
  secretary: 'text-pink-200',
  management: 'text-green-100',
  ceo: 'text-purple-200',
  paul_allen: 'text-black',
};

interface EonIDPanelProps {
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

export function EonIDPanel({ isOpen, onClose, userData }: EonIDPanelProps) {
  // Get user's selected style from their profile
  const profile = getMockProfile(userData.walletAddress);
  const cardStyle = profile?.card_style || 'intern';
  const styleClass = styleMap[cardStyle] || styleMap.intern;
  const textStyle = textStyleMap[cardStyle] || textStyleMap.intern;
  
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

          {/* EON-ID Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-96 backdrop-blur-xl border-l shadow-2xl z-50 ${styleClass}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <RiCloseLine size={24} />
            </button>

            {/* Content */}
            <div className={`p-8 space-y-6 ${textStyle}`}>
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-current">
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
                  <h2 className="text-2xl font-bold">
                    {userData.username}
                  </h2>
                  {userData.ensName && userData.ensName !== userData.username && (
                    <span className="text-opacity-80 text-sm">
                      {userData.ensName}
                    </span>
                  )}
                </div>
              </div>

              {/* Wallet Address */}
              <div>
                <div className={`bg-black/20 rounded-lg p-3 font-mono text-sm text-opacity-70 break-all`}>
                  {userData.walletAddress}
                </div>
              </div>

              {/* Role & Stage */}
              {(userData.role || userData.timepieceStage) && (
                <div className="mb-6 space-y-2">
                  {userData.role && (
                    <div className="text-opacity-90">{userData.role}</div>
                  )}
                  {userData.timepieceStage && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm opacity-70">Evolution Stage:</span>
                      <span>{userData.timepieceStage}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Looking For */}
              {userData.lookingFor && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium opacity-80 mb-2">Looking for</h3>
                  <div className="bg-black/20 rounded-lg p-3">
                    {userData.lookingFor}
                  </div>
                </div>
              )}

              {/* External Links */}
              {userData.links && Object.values(userData.links).some(link => !!link) && (
                <div className="pt-4 border-t border-current border-opacity-20">
                  <h3 className="text-sm font-medium opacity-80 mb-2">Links</h3>
                  <div className="flex space-x-4">
                    {userData.links.github && (
                      <a
                        href={userData.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                    {userData.links.website && (
                      <a
                        href={userData.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <FaGlobe size={20} />
                      </a>
                    )}
                    {userData.links.twitter && (
                      <a
                        href={userData.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <FaTwitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* Paul Allen Quote Easter Egg */}
              {cardStyle === 'paul_allen' && (
                <div className="text-xs mt-6 italic opacity-70 text-center">
                  "Look at that subtle coloring... the tasteful thickness of it..."
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export old name for backward compatibility
export const BusinessCardPanel = EonIDPanel; 