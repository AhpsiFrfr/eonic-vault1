'use client';
import { useEffect, useState } from 'react';
import { FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import { useGlowLevel } from '../../context/GlowLevelContext';

export default function XPTrackerPylon() {
  const [xp, setXP] = useState(7450);
  const maxXP = 10000;
  const level = Math.floor(xp / 1000) + 1; // Simple level calculation
  const progressPercent = (xp / maxXP) * 100;
  const { calculateGlowLevel, setGlowLevel } = useGlowLevel();

  // Update global glow level when XP changes
  useEffect(() => {
    const newGlowLevel = calculateGlowLevel(xp);
    setGlowLevel(newGlowLevel);
  }, [xp, calculateGlowLevel, setGlowLevel]);

  const adjustXP = (amount: number) => {
    setXP(prev => Math.max(0, Math.min(maxXP, prev + amount)));
  };

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-5 relative text-white w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaStar className="text-[#00d4ff] text-xl animate-pulse" />
          <h2 className="text-xl font-semibold glow-text">XP Tracker</h2>
        </div>
        <div className="text-sm text-gray-400">Level {level}</div>
      </div>
      {/* XP Bar */}
      <div className="w-full h-4 bg-[#1c1c1c] rounded-full overflow-hidden relative">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00d4ff] to-[#00aaff] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,212,255,0.7)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      {/* XP Text and Controls */}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-gray-300 tracking-wide">
          XP: {xp.toLocaleString()} / {maxXP.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => adjustXP(-1000)}
            className="p-1.5 rounded-lg bg-[#1c1c1c] text-cyan-400 hover:bg-cyan-900/30 transition-colors"
          >
            <FaMinus size={12} />
          </button>
          <button 
            onClick={() => adjustXP(1000)}
            className="p-1.5 rounded-lg bg-[#1c1c1c] text-cyan-400 hover:bg-cyan-900/30 transition-colors"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
      {/* Footer Status */}
      <div className="text-[10px] text-right text-[#00d4ff] mt-1 italic">
        Synced · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}