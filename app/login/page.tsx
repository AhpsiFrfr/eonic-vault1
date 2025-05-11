'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletButton } from '../../components/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { HyperspeedTransition } from '../../components/animations/HyperspeedTransition';

// Ship decorations with correct path references
const walletShips = [
  {
    name: 'Phantom',
    logo: '/images/phantom-ship.png',
    color: 'violet',
    orbit: '-top-6 left-1/2 -translate-x-1/2',
  },
  {
    name: 'Coinbase',
    logo: '/images/coinbase-ship.png',
    color: 'blue',
    orbit: 'bottom-12 left-[40%]',
  },
  {
    name: 'Solflare',
    logo: '/images/solflare-ship.png',
    color: 'orange',
    orbit: 'bottom-12 right-[40%]',
  },
  {
    name: 'MetaMask',
    logo: '/images/metamask-ship.png',
    color: 'yellow',
    orbit: 'top-1/2 right-12 -translate-y-1/2',
  },
];

export default function LoginPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHyperspace, setShowHyperspace] = useState(false);

  // Clean direct navigation to dashboard
  const goToDashboard = () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    console.log('⚡ Manual dashboard navigation triggered');
    setIsNavigating(true);
    
    // Add a brief pre-animation effect to the button
    setTimeout(() => {
      // Reset animation flag to ensure it plays
      localStorage.removeItem('hyperspeedAnimationCompleted');
      
      // Trigger hyperspace animation
      setShowHyperspace(true);
      
      // Clear any existing redirect flags
      localStorage.removeItem('preventLoginRedirect');
      localStorage.removeItem('walletConnected');
      
      console.log('⚡ Animation triggered, flags cleared for clean navigation');
    }, 300); // Small delay for button animation
  };

  // Auto-redirect when wallet is connected - remove this automatic redirect
  useEffect(() => {
    // Clear previous animation completion flag when wallet connects
    if (connected) {
      localStorage.removeItem('hyperspeedAnimationCompleted');
    }
  }, [connected]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Animated starfield background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[url('/images/star-pattern.png')] bg-cover opacity-30 animate-pulse" 
             style={{ animationDuration: '15s' }} />
      </div>
      
      {/* Orbital ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-500/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-blue-400/10 rounded-full animate-spin-slow" />
      
      {/* EONIC Core Ship */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Image
            src="/images/eonic-core-ship.png"
            alt="Eonic Core Ship"
            width={160}
            height={160}
            priority
            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
        </motion.div>
      </motion.div>
      
      {/* Energy beams from core ship to wallet ships */}
      <svg className="absolute inset-0 w-full h-full z-5 opacity-30">
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {walletShips.map((wallet, i) => {
          // Hard-coded path values to avoid client-side window reference
          const centerX = 500; // Approximate center X
          const centerY = 300; // Approximate center Y
          const pathPoints = [
            { x: centerX, y: centerY - 100 }, // Core ship position
            { x: centerX + (i % 2 === 0 ? 150 : -150), y: centerY + (i < 2 ? -80 : 80) } // Ship position
          ];
          
          return (
            <motion.path
              key={wallet.name}
              d={`M ${pathPoints[0].x},${pathPoints[0].y} Q ${centerX + (i % 2 === 0 ? 50 : -50)},${centerY} ${pathPoints[1].x},${pathPoints[1].y}`}
              stroke="url(#beam-gradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            />
          );
        })}
      </svg>

      {/* Title & Instruction */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 text-center z-10">
        <motion.h1 
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 tracking-wider mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          EONIC VAULT
        </motion.h1>
        <motion.p 
          className="text-sm text-blue-300 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect your wallet to access the quantum vault
        </motion.p>
      </div>

      {/* Wallet Connect Button */}
      <div className="absolute top-[68%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <WalletButton className="!py-3 !px-6 !text-lg !font-medium" />
        </motion.div>
        
        {/* Dashboard Button (visible when connected) */}
        <AnimatePresence>
          {connected && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}
              transition={{ duration: 0.3 }}
              onClick={goToDashboard}
              disabled={isNavigating}
              className={`mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-all ${isNavigating ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}`}
            >
              {isNavigating ? 'Initializing Jump...' : 'Enter Vault'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Wallet Ships orbiting with glow effects */}
      {walletShips.map((wallet) => (
        <motion.div
          key={wallet.name}
          className={`absolute ${wallet.orbit} z-20 cursor-pointer`}
          whileHover={{ scale: 1.15, rotate: 3 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: `drop-shadow(0 0 5px ${wallet.color})`
          }}
          transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
          onClick={() => {
            if (connected && !isNavigating) {
              goToDashboard();
            }
          }}
        >
          <Image
            src={wallet.logo}
            alt={`${wallet.name} Ship`}
            width={90}
            height={90}
            className={`hover:drop-shadow-[0_0_15px_${wallet.color}] transition duration-300`}
          />
          <p className="text-center text-xs mt-1 text-blue-200 font-medium">{wallet.name}</p>
          {connected && (
            <p className="text-center text-[10px] mt-0.5 text-green-300 animate-pulse">Click to launch</p>
          )}
        </motion.div>
      ))}
      
      {/* Hyperspace transition overlay */}
      {showHyperspace && (
        <HyperspeedTransition 
          onComplete={() => {
            console.log('⚡ Hyperspace animation completed, navigating to dashboard');
            router.push('/dashboard');
          }} 
        />
      )}
    </div>
  );
}
