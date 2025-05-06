import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessCardPanel } from './BusinessCardPanel';

interface UserContextMenuProps {
  x: number;
  y: number;
  user: {
    username: string;
    walletAddress: string;
    showBusinessCard?: boolean;
    isConnected?: boolean;
    // Mock data for business card
    businessCard?: {
      ensName?: string;
      role?: string;
      timepieceStage?: string;
      lookingFor?: string;
      links?: {
        github?: string;
        website?: string;
        twitter?: string;
      };
      isCabal?: boolean;
    };
  };
  onClose: () => void;
}

export function UserContextMenu({ x, y, user, onClose }: UserContextMenuProps) {
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const canViewBusinessCard = user.isConnected && user.showBusinessCard;

  return (
    <>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ left: x, top: y }}
        className="fixed z-50 min-w-[200px] bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700/50"
      >
        <div className="py-2">
          {/* User Info Header */}
          <div className="px-4 py-2 border-b border-gray-700/50">
            <div className="font-medium text-white">{user.username}</div>
            <div className="text-xs text-gray-400 truncate">{user.walletAddress}</div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {canViewBusinessCard && (
              <button
                onClick={() => setShowBusinessCard(true)}
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700/50 flex items-center space-x-2"
              >
                <span>👔</span>
                <span>View Business Card</span>
              </button>
            )}
            {/* Add other menu items here */}
          </div>
        </div>
      </motion.div>

      {/* Business Card Panel */}
      <BusinessCardPanel
        isOpen={showBusinessCard}
        onClose={() => {
          setShowBusinessCard(false);
          onClose();
        }}
        userData={{
          username: user.username,
          walletAddress: user.walletAddress,
          ...user.businessCard
        }}
      />
    </>
  );
} 