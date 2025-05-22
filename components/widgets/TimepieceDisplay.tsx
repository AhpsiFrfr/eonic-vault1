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
                src={imageError ? "/images/timepiece-nft.png" : timepieceStages[evolutionLevel]}
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
        </div>
      </div>
    </motion.div>
  );
}