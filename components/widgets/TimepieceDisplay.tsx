import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import timepieceStages from "../../data/timepieceStages";

export default function TimepieceDisplay() {
  const [evolutionLevel, setEvolutionLevel] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setEvolutionLevel(prev => (prev + 1) % timepieceStages.length);
      // Reset image error state when changing to a new stage
      setImageError(false);
    }, 8000); // Change stage every 8 seconds for demo
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4 }}
      style={{ animation: "widgetPulse 4s ease-in-out infinite" }}
    >
      <h2 className="text-sm mb-1">Genesis Timepiece</h2>
      
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Stationary outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 animate-pulse" 
               style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 animate-pulse" 
               style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
          
          {/* Timepiece container */}
          <div className="absolute inset-4 rounded-full bg-[#000e19] flex items-center justify-center overflow-hidden">
            {/* Rotating timepiece image */}
            <motion.div
              key={evolutionLevel}
              initial={{ scale: 0.7, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: 360
              }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                rotate: { 
                  repeat: Infinity, 
                  duration: 24, 
                  ease: "linear" 
                }
              }}
              className="relative"
            >
              <Image
                src={imageError ? "/timepiece-nft.svg" : timepieceStages[evolutionLevel]}
                alt={`Timepiece Stage ${evolutionLevel}`}
                width={80}
                height={80}
                className="object-contain drop-shadow-[0_0_8px_rgba(0,204,255,0.8)]"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(0, 204, 255, 0.7))',
                  background: 'transparent',
                  mixBlendMode: 'lighten' // This helps remove dark backgrounds
                }}
                onError={() => {
                  setImageError(true);
                }}
              />
            </motion.div>
          </div>
          
          {/* Energy particles */}
          <motion.div 
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ top: '20%', left: '10%' }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{ top: '70%', left: '20%' }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ top: '30%', right: '15%' }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
            style={{ bottom: '20%', right: '10%' }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          />
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-cyan-400 text-xs font-medium">STAGE: {evolutionLevel + 1}/6</p>
          <p className="text-xs text-gray-400">Rarity: {9.3 + (evolutionLevel * 0.2)}/10</p>
        </div>
      </div>
      
      <div className="mt-2 bg-cyan-900/20 rounded-lg p-2 text-xs">
        <div className="text-center text-gray-400">
          Next: <span className="text-cyan-400">{Math.max(0, 14 - (evolutionLevel * 2))} days</span>
        </div>
      </div>
    </motion.div>
  );
} 