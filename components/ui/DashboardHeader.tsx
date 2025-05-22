'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGlowLevel } from '@/context/GlowLevelContext';
import { useUser } from '@/lib/hooks/useUser';
import { useWallet } from '@solana/wallet-adapter-react';

interface DashboardHeaderProps {
  userName: string;
  userTitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userTitle
}) => {
  const { glowLevel } = useGlowLevel();
  const { wallet, disconnectWallet } = useUser();
  const { connected } = useWallet();
  
  return (
    <motion.header 
      className="flex items-center justify-between mb-8 px-6 py-4 bg-gradient-to-r from-obsidian to-[rgba(10,10,15,0.95)] border-b border-egyptian-base"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo and title */}
      <div className="flex items-center">
        <div className="mr-4 relative">
          <div className="w-10 h-10 relative">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#1C45F4" strokeWidth="1" />
              <circle cx="20" cy="20" r="15" fill="none" stroke="#F5D16F" strokeWidth="0.5" />
              {/* Sacred geometry elements */}
              <path
                d="M20,5 L20,35 M5,20 L35,20"
                stroke="#F5D16F"
                strokeWidth="0.3"
                opacity="0.5"
              />
              <polygon
                points="20,12 28,20 20,28 12,20"
                fill="none"
                stroke="#F5D16F"
                strokeWidth="0.3"
                opacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-gold font-orbitron text-xl">E</div>
            {/* Glow effect */}
            <div 
              className="absolute -inset-2 rounded-full opacity-50"
              style={{ 
                background: 'radial-gradient(circle, rgba(28,69,244,0.3) 0%, rgba(28,69,244,0) 70%)',
                filter: 'blur(4px)'
              }}
            />
          </div>
        </div>
        <div>
          <h1 className="text-white-marble font-orbitron text-2xl tracking-wider">THE VAULT</h1>
          <p className="text-egyptian-glow text-sm font-sora mt-1">Secure • Evolve • Transcend</p>
        </div>
      </div>
      
      {/* User info and Wallet Status */}
      <div className="flex items-center space-x-6">
        {/* Wallet Status */}
        <div className="flex items-center bg-obsidian/50 px-4 py-2 rounded-lg border border-egyptian-base">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
          <p className="text-sm font-mono text-egyptian-glow">
            {wallet && connected ? (
              <>
                <span className="text-green-400">{wallet.slice(0, 4)}...{wallet.slice(-4)}</span>
                <button
                  onClick={disconnectWallet}
                  className="ml-3 text-red-400 hover:text-red-300 transition-colors text-xs"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <span className="text-red-400">Not Connected</span>
            )}
          </p>
        </div>

        {/* User info */}
        <div className="text-right">
          <p className="text-white-marble font-sora">{userName}</p>
          <p className="text-egyptian-glow text-sm font-sora">{userTitle}</p>
        </div>
        
        {/* Level indicator */}
        <div className="relative w-12 h-12">
          {/* Background circle */}
          <svg className="absolute inset-0" width="48" height="48" viewBox="0 0 48 48">
            <circle 
              cx="24" 
              cy="24" 
              r="23" 
              fill="none" 
              stroke="#1034A6" 
              strokeWidth="1" 
            />
            <circle 
              cx="24" 
              cy="24" 
              r="20" 
              fill="none" 
              stroke="#F5D16F" 
              strokeWidth="0.5" 
              opacity="0.5" 
            />
          </svg>
          
          {/* Progress circle */}
          <svg className="absolute inset-0" width="48" height="48" viewBox="0 0 48 48">
            <circle 
              cx="24" 
              cy="24" 
              r="20" 
              fill="none" 
              stroke="#F5D16F" 
              strokeWidth="2" 
              strokeDasharray="125.6" 
              strokeDashoffset={125.6 - (125.6 * (glowLevel / 100))} 
              transform="rotate(-90 24 24)" 
              strokeLinecap="round"
            />
          </svg>
          
          {/* Level display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold font-orbitron text-lg">{Math.floor(glowLevel)}</span>
          </div>
          
          {/* Glow effect */}
          <div 
            className="absolute -inset-2 rounded-full opacity-30"
            style={{ 
              background: 'radial-gradient(circle, rgba(245,209,111,0.3) 0%, rgba(245,209,111,0) 70%)',
              filter: 'blur(4px)'
            }}
          />
        </div>
      </div>
    </motion.header>
  );
}; 