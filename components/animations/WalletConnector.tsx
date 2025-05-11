'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ParallaxStarfield } from './ParallaxStarfield';
import { WalletButton } from '../WalletButton';
import { HyperspeedTransition } from './HyperspeedTransition';

interface WalletConnectorProps {
  onConnect?: () => void;
  detectedWallets: string[];
  isConnected: boolean;
}

// Wallet options and icons with enhanced colors
const walletOptions = [
  { name: 'Phantom', icon: '/wallets/phantom.svg', color: '#7B61FF', frequency: 1.2 },
  { name: 'Solflare', icon: '/wallets/solflare.svg', color: '#FC822B', frequency: 0.8 },
  { name: 'MetaMask', icon: '/wallets/metamask.svg', color: '#F6851B', frequency: 1.5 },
  { name: 'Coinbase', icon: '/wallets/coinbase.svg', color: '#0052FF', frequency: 1.0 }
];

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  onConnect,
  detectedWallets = [],
  isConnected = false,
}) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectionPhase, setConnectionPhase] = useState<'idle' | 'selecting' | 'freezing' | 'syncing' | 'launching' | 'connected'>('idle');
  const [sigilRotation, setSigilRotation] = useState(0);
  const [sigilScale, setSigilScale] = useState(1);
  const [sigilEnergy, setSigilEnergy] = useState(0);
  const [starSpeed, setStarSpeed] = useState(1);
  const sigilRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Handle initial animation
  useEffect(() => {
    // Start showing wallet options after initial animation
    const timer = setTimeout(() => {
      setConnectionPhase('selecting');
      setShowWalletOptions(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animate the sigil
  useEffect(() => {
    const animateSigil = () => {
      setSigilRotation(prev => (prev + (connectionPhase === 'freezing' ? 0 : 0.2)) % 360);
      
      // Pulse energy based on connection phase
      let energyLevel = Math.sin(Date.now() / 800) * 0.3 + 0.8; // Increased pulse visibility
      
      if (connectionPhase === 'syncing') {
        energyLevel = Math.sin(Date.now() / 300) * 0.3 + 1.2; // Faster, stronger pulsing
      } else if (connectionPhase === 'launching') {
        energyLevel = 2; // Maximum energy
      } else if (connectionPhase === 'freezing') {
        energyLevel = 1.5; // Fixed high energy
      }
      
      setSigilEnergy(energyLevel);
      
      // Scale effect
      if (connectionPhase === 'syncing') {
        const scaleEffect = Math.sin(Date.now() / 200) * 0.1 + 1.1;
        setSigilScale(scaleEffect);
      } else if (connectionPhase === 'launching') {
        setSigilScale(prev => Math.min(prev + 0.02, 2.5));
      } else if (connectionPhase === 'freezing') {
        setSigilScale(1.2);
      } else {
        setSigilScale(1 + Math.sin(Date.now() / 800) * 0.08); // Increased scale animation
      }
      
      animationRef.current = requestAnimationFrame(animateSigil);
    };
    
    animationRef.current = requestAnimationFrame(animateSigil);
    return () => cancelAnimationFrame(animationRef.current);
  }, [connectionPhase]);

  // Update star speed based on connection phase
  useEffect(() => {
    if (connectionPhase === 'launching') {
      // If wallet is already connected, navigate with less animation
      const isAlreadyConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (isAlreadyConnected) {
        // Skip to connected phase directly
        console.log('🌟 Wallet already connected, skipping animations');
        setConnectionPhase('connected');
        if (onConnect) onConnect();
        return;
      }
      
      // Set flag to remember wallet was connected
      localStorage.setItem('walletConnected', 'true');
      
      // Short delay before redirecting to provide time for the hyperspeed animation
      setTimeout(() => {
        setConnectionPhase('connected');
        if (onConnect) onConnect();
      }, 2500);
    }
  }, [connectionPhase, onConnect]);
  
  // Handle wallet selection
  const handleWalletSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    
    // Time freeze effect
    setConnectionPhase('freezing');
    
    // Syncing phase
    setTimeout(() => {
      setConnectionPhase('syncing');
      
      // Launching phase - trigger hyperspeed
      setTimeout(() => {
        setConnectionPhase('launching');
        
        // Connected phase - after hyperspeed animation completes
        setTimeout(() => {
          setConnectionPhase('connected');
          if (onConnect) onConnect();
        }, 2800);
      }, 2000);
    }, 1500);
  };
  
  // Calculate positions for wallet icons in a circle
  const getWalletIconPosition = (index: number, total: number) => {
    const radius = 220; // Increased distance from center
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // Start from top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return { x, y };
  };
  
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#050a14] overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 z-0">
        <ParallaxStarfield 
          starCount={connectionPhase === 'launching' ? 300 : 200}
          maxStarSize={connectionPhase === 'launching' ? 6 : 3}
          depth={4}
        />
      </div>
      
      {/* Hexagonal background glow */}
      <div 
        className="absolute z-10"
        style={{ 
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, rgba(59, 130, 246, ${sigilEnergy * 0.1}) 0%, rgba(7, 18, 36, 0) 70%)`,
          transform: `scale(${sigilScale * 1.5})`,
          transition: 'transform 0.5s ease-out',
        }}
      />
      
      {/* Center Vault Sigil */}
      <motion.div 
        ref={sigilRef}
        className="relative z-20 mb-8 flex justify-center items-center"
        style={{ 
          transform: `scale(${sigilScale})`,
          transition: connectionPhase === 'freezing' ? 'transform 0.5s ease-out' : 'none'
        }}
      >
        {/* Hexagonal border layers */}
        <div className="absolute w-64 h-64 border-2 border-[#1E90FF]/50 rounded-[30%] rotate-0 animate-pulse" />
        <div className="absolute w-60 h-60 border-2 border-[#1E90FF]/60 rounded-[30%] rotate-15 animate-pulse" style={{animationDelay: "0.2s"}} />
        <div className="absolute w-56 h-56 border-2 border-[#1E90FF]/70 rounded-[30%] rotate-30 animate-pulse" style={{animationDelay: "0.4s"}} />
        
        {/* Central Golden E Logo */}
        <div 
          className="relative w-48 h-48 flex items-center justify-center"
          style={{ 
            filter: `drop-shadow(0 0 ${sigilEnergy * 20}px rgba(255, 215, 0, 0.85))`,
          }}
        >
          <div className="absolute inset-0 bg-black rounded-full" />
          <motion.img
            src="/images/eonic-ship-glow.png"
            alt="EONIC Ship"
            width={144}
            height={144}
            className="object-contain w-36 h-36 relative"
            style={{
              filter: `brightness(${sigilEnergy * 150}%)`,
              transform: connectionPhase === 'syncing' ? `scale(${1 + Math.sin(Date.now() / 200) * 0.05})` : 'scale(1)',
              transformStyle: 'preserve-3d',
            }}
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
        </div>
        
        {/* Energy particles */}
        {connectionPhase === 'syncing' && (
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.7, 0],
                  x: [0, Math.cos(i / 12 * Math.PI * 2) * 150],
                  y: [0, Math.sin(i / 12 * Math.PI * 2) * 150],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-400"
                style={{ 
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px 2px rgba(59, 130, 246, 0.7)',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Platform Name */}
      <div className="relative z-20 text-center mb-16">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 tracking-wider">
          EONIC VAULT
        </h1>
        {connectionPhase === 'idle' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-blue-400 mt-2"
          >
            Initializing connection sequence...
          </motion.p>
        )}
        {connectionPhase === 'selecting' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-400 mt-2"
          >
            Select your wallet to connect
          </motion.p>
        )}
        {connectionPhase === 'freezing' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-400 mt-2"
          >
            Time matrix locked...
          </motion.p>
        )}
        {connectionPhase === 'syncing' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-400 mt-2"
          >
            Syncing with blockchain identity...
          </motion.p>
        )}
        {connectionPhase === 'launching' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-400 mt-2"
          >
            Preparing for quantum leap...
          </motion.p>
        )}
        {connectionPhase === 'connected' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 mt-2"
          >
            Connection established!
          </motion.p>
        )}
      </div>
      
      {/* Circular Wallet Options */}
      <div className="relative z-10" style={{ height: '600px', width: '600px' }}>
        {/* Orbit trails */}
        {connectionPhase === 'selecting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[440px] h-[440px] rounded-full border border-blue-500/30 animate-pulse" />
            <div className="absolute w-[445px] h-[445px] rounded-full border border-indigo-500/20" 
                 style={{ animationDelay: '0.5s' }} />
          </div>
        )}
        
        <AnimatePresence>
          {showWalletOptions && connectionPhase === 'selecting' && (
            <>
              {walletOptions.map((wallet, index) => {
                const position = getWalletIconPosition(index, walletOptions.length);
                // Always mark wallets as available for demo purposes
                const isDetected = true; // Force all wallets to display as available
                
                return (
                  <motion.div
                    key={wallet.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: position.x, 
                      y: position.y,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      delay: index * 0.1,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                    onClick={() => handleWalletSelect(wallet.name)}
                    style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` }}
                  >
                    {/* Glowing trail behind wallet */}
                    <div className="absolute w-full h-full -z-10">
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-40"
                        style={{ 
                          background: `radial-gradient(circle, ${wallet.color} 0%, transparent 70%)`,
                          animation: 'pulse 2s infinite',
                        }}
                      />
                    </div>
                    
                    {/* Wallet Icon */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1], 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2, 
                        ease: "easeInOut" 
                      }}
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 border-2 relative"
                      style={{ 
                        borderColor: wallet.color,
                        boxShadow: `0 0 20px ${wallet.color}`,
                      }}
                    >
                      <div className="relative w-10 h-10">
                        <Image 
                          src={wallet.icon} 
                          alt={wallet.name} 
                          width={40} 
                          height={40} 
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Wallet Name */}
                    <div className="mt-2 text-sm text-blue-300 font-medium">{wallet.name}</div>
                    
                    {/* Connection Status */}
                    <div className="mt-1 text-xs">
                      <span className="text-green-400">Available</span>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Standard Wallet Connection Button */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8">
                <WalletButton className="!py-3 !px-6 !text-lg !font-medium" />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* Hyperspeed transition - must be at a high z-index */}
      {connectionPhase === 'launching' && !localStorage.getItem('hyperspeedAnimationCompleted') && (
        <div className="fixed inset-0 z-50">
          <HyperspeedTransition />
        </div>
      )}
      
      {/* Connected animation */}
      {connectionPhase === 'connected' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="mb-4 text-5xl">✓</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Connected Successfully</h2>
            <p className="text-blue-300">Redirecting to EONIC Vault...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}; 