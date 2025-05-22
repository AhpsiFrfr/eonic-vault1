'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the XP thresholds for each glow level
const XP_THRESHOLDS = [0, 1000, 3000, 6000, 10000, 15000];

// Define the glow intensities for each level
export const GLOW_INTENSITIES = {
  1: 'shadow-[0_0_4px_rgba(0,212,255,0.2)]',
  2: 'shadow-[0_0_8px_rgba(0,212,255,0.3)]',
  3: 'shadow-[0_0_12px_rgba(0,212,255,0.4)]',
  4: 'shadow-[0_0_16px_rgba(0,212,255,0.5)]',
  5: 'shadow-[0_0_20px_rgba(0,212,255,0.6)]',
  6: 'shadow-[0_0_24px_rgba(0,212,255,0.7)]'
};

interface GlowLevelContextType {
  glowLevel: number;
  setGlowLevel: (level: number) => void;
  getGlowClass: () => string;
  calculateGlowLevel: (xp: number) => number;
}

const GlowLevelContext = createContext<GlowLevelContextType | undefined>(undefined);

export function GlowLevelProvider({ children }: { children: React.ReactNode }) {
  const [glowLevel, setGlowLevel] = useState(1);

  const calculateGlowLevel = (xp: number): number => {
    let level = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
      if (xp >= XP_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  };

  const getGlowClass = () => {
    return GLOW_INTENSITIES[glowLevel] || GLOW_INTENSITIES[1];
  };

  // Initialize glow level based on user XP (example value)
  useEffect(() => {
    const userXP = 7450; // This should be fetched from your user data
    const calculatedLevel = calculateGlowLevel(userXP);
    setGlowLevel(calculatedLevel);
  }, []);

  return (
    <GlowLevelContext.Provider value={{ glowLevel, setGlowLevel, getGlowClass, calculateGlowLevel }}>
      {children}
    </GlowLevelContext.Provider>
  );
}

export function useGlowLevel() {
  const context = useContext(GlowLevelContext);
  if (context === undefined) {
    throw new Error('useGlowLevel must be used within a GlowLevelProvider');
  }
  return context;
} 