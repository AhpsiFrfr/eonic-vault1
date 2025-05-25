'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useDM } from '../../context/DMContext';
import { useRouter } from 'next/navigation';

interface StartDMButtonProps {
  userAddress: string;
  userName?: string;
  variant?: 'button' | 'icon' | 'menu-item';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function StartDMButton({
  userAddress,
  userName,
  variant = 'button',
  size = 'md',
  className = '',
  onClick
}: StartDMButtonProps) {
  const { startDM } = useDM();
  const router = useRouter();

  const handleStartDM = async () => {
    try {
      const threadId = await startDM(userAddress);
      router.push(`/dm/${userAddress}`);
      onClick?.();
    } catch (error) {
      console.error('Error starting DM:', error);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleStartDM}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          p-2 rounded-lg bg-egyptian-base/20 hover:bg-egyptian-base/30 
          border border-egyptian-glow/30 hover:border-egyptian-glow/50 
          text-egyptian-glow hover:text-white transition-all
          ${className}
        `}
        title={`Send DM to ${userName || userAddress.slice(0, 8) + '...'}`}
      >
        <MessageCircle className={iconSizes[size]} />
      </motion.button>
    );
  }

  if (variant === 'menu-item') {
    return (
      <motion.button
        onClick={handleStartDM}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full flex items-center space-x-2 px-3 py-2 text-left
          text-gray-300 hover:text-white hover:bg-marble-deep/30 
          rounded-lg transition-all
          ${className}
        `}
      >
        <MessageCircle className={iconSizes[size]} />
        <span>Send Direct Message</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleStartDM}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center space-x-2 ${sizeClasses[size]}
        bg-egyptian-base/20 hover:bg-egyptian-base/30 
        border border-egyptian-glow/30 hover:border-egyptian-glow/50 
        rounded-lg text-egyptian-glow hover:text-white 
        font-medium transition-all shadow-lg hover:shadow-glow-blue
        ${className}
      `}
    >
      <Send className={iconSizes[size]} />
      <span>Message {userName || userAddress.slice(0, 8) + '...'}</span>
    </motion.button>
  );
} 