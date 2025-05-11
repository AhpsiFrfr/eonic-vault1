import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

interface ShipOrbitSystemProps {
  onConnect: () => void;
  walletName: string | null;
  isConnected: boolean;
}

export default function ShipOrbitSystem({ onConnect, walletName, isConnected }: ShipOrbitSystemProps) {
  const [hoverWallet, setHoverWallet] = useState<string | null>(null);

  // Wallet ships configuration with updated positions
  const walletShips = [
    { name: 'Phantom', image: '/images/phantom-ship.png', position: { top: '-50px', left: '50%' } },
    { name: 'Solflare', image: '/images/solflare-ship.png', position: { top: '50%', right: '-50px' } },
    { name: 'Coinbase', image: '/images/coinbase-ship.png', position: { top: '50%', left: '-50px' } },
    { name: 'Metamask', image: '/images/metamask-ship.png', position: { bottom: '-50px', left: '50%' } }
  ];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] z-40">
      {/* Connection status indicator - moved above the EONIC ship */}
      <motion.div 
        className="absolute top-16 left-1/2 -translate-x-1/2 bg-purple-900/40 backdrop-blur-md px-5 py-2 rounded-lg text-sm flex flex-col items-center space-y-2 border border-purple-500/30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white">{isConnected ? (walletName || 'Connected') : 'Not Connected'}</span>
        </div>
        
        {isConnected ? (
          <Link href="/dashboard">
            <motion.button 
              className="bg-green-500 text-white font-medium px-5 py-2 rounded-lg w-full hover:bg-green-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Vault
            </motion.button>
          </Link>
        ) : (
          <motion.button 
            className="bg-purple-600 text-white font-medium px-5 py-2 rounded-lg w-full hover:bg-purple-700 transition-all duration-200"
            onClick={onConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect Wallet
          </motion.button>
        )}
      </motion.div>

      {/* Orbit ring - subtle blue glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-500/20 orbit-ring"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border-4 border-cyan-500/5 blur-sm"></div>

      {/* Central EONIC ship */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24"
        animate={{ 
          rotate: 360,
          scale: [1, 1.08, 1]
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 24, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Image
          src="/images/eonic-core-ship.png"
          alt="EONIC Vault Ship"
          width={96}
          height={96}
          className="drop-shadow-[0_0_15px_rgba(0,204,255,0.8)] ship-glow"
        />
      </motion.div>

      {/* Fixed positioned wallet ships */}
      {walletShips.map((ship, index) => {
        const isHovered = hoverWallet === ship.name;
        const orbitDuration = 60 + (index * 10); // Different speeds for each ship

        return (
          <motion.div
            key={ship.name}
            className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={ship.position}
            whileHover={{ scale: 1.15 }}
            animate={{ scale: isHovered ? 1.15 : 1 }}
            onHoverStart={() => setHoverWallet(ship.name)}
            onHoverEnd={() => setHoverWallet(null)}
          >
            <motion.div 
              animate={{ 
                rotate: 360
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: orbitDuration, ease: "linear" }
              }}
            >
              <Image
                src={ship.image}
                alt={`${ship.name} Wallet Ship`}
                width={56}
                height={56}
                className="drop-shadow-[0_0_10px_rgba(0,204,255,0.6)] ship-glow"
              />
            </motion.div>
            
            {/* Wallet name and "Click to launch" on hover */}
            {isHovered && (
              <motion.div 
                className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-sm flex flex-col items-center text-center rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-cyan-300 text-sm font-medium px-3 pt-1">{ship.name}</div>
                <div className="text-green-400 text-xs px-3 pb-1">Click to launch</div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
} 