import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function XPMeter() {
  // Starting XP and target for animation
  const [targetXP, setTargetXP] = useState(1337);
  
  // Use Framer Motion's spring animation for smooth XP counting
  const springXP = useSpring(0, { stiffness: 100, damping: 30 });
  const displayXP = useTransform(springXP, Math.round);
  const [displayedXP, setDisplayedXP] = useState(0);
  
  // Update displayed XP when the motion value changes
  useEffect(() => {
    const unsubscribe = displayXP.onChange(latest => {
      setDisplayedXP(latest);
    });
    return unsubscribe;
  }, [displayXP]);
  
  // Derived values
  const level = Math.floor(targetXP / 1000);
  const nextLevel = level + 1;
  const progressToNext = (targetXP % 1000) / 10; // Convert to percentage (0-100)

  // Simulate XP gain periodically
  useEffect(() => {
    // Set initial XP with animation
    springXP.set(targetXP);
    
    // Simulate periodic XP gains
    const interval = setInterval(() => {
      const xpGain = Math.floor(Math.random() * 50) + 10; // Random XP between 10-60
      setTargetXP(prev => {
        const newXP = prev + xpGain;
        // Animate to new value
        springXP.set(newXP);
        return newXP;
      });
    }, 8000); // Gain XP every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update spring animation when targetXP changes
  useEffect(() => {
    springXP.set(targetXP);
  }, [targetXP]);

  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-sm mb-1">Experience Level</h2>
      
      <div className="flex items-center justify-center">
        <motion.div 
          className="relative w-20 h-20 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-cyan-800/30"></div>
          <svg viewBox="0 0 100 100" className="absolute inset-0">
            <circle 
              cx="50" cy="50" r="38" 
              fill="none" 
              stroke="rgba(0, 204, 255, 0.2)" 
              strokeWidth="3" 
            />
            <motion.circle 
              cx="50" cy="50" r="38" 
              fill="none" 
              stroke="#00CFFF" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="239.5"
              initial={{ strokeDashoffset: 239.5 }}
              animate={{ strokeDashoffset: 239.5 - (239.5 * progressToNext / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Level display with glow effect */}
          <motion.div 
            className="text-cyan-400 text-2xl font-bold"
            animate={{ 
              textShadow: ["0 0 8px rgba(0, 204, 255, 0.5)", "0 0 16px rgba(0, 204, 255, 0.8)", "0 0 8px rgba(0, 204, 255, 0.5)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {level}
          </motion.div>
        </motion.div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between mb-1 text-xs">
          <span className="text-cyan-400">XP Total</span>
          <span className="text-white">
            {displayedXP} XP
          </span>
        </div>
        
        <div className="h-1.5 bg-cyan-900/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <div className="text-xs text-gray-400">
            {1000 - (targetXP % 1000)} XP until Lvl {nextLevel}
          </div>
          <div 
            className="text-xs text-cyan-400"
          >
            {progressToNext.toFixed(0)}%
          </div>
        </div>
        
        {/* Recent XP gain indicator - made more compact */}
        <div className="mt-2 bg-cyan-900/20 rounded-lg p-2 text-xs text-gray-400">
          <div className="flex justify-between items-center">
            <span>Recent:</span>
            <span 
              className="text-cyan-400"
            >
              +{targetXP % 100} XP
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 