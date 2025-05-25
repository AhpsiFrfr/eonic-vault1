'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PylonContextType {
  activePylons: string[];
  draftPylons: string[];
  togglePylon: (pylonId: string) => void;
  isActive: (pylonId: string) => boolean;
  isDraft: (pylonId: string) => boolean;
  resetToDefaults: () => void;
  savePylons: () => void;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
}

const PylonContext = createContext<PylonContextType | undefined>(undefined);

// Default active pylons (what appears on dashboard by default)
const DEFAULT_ACTIVE_PYLONS = [
  'eon-id',
  'phase-pulse-monitor',
  'refra-gate',
  'radio',
  'aether-feed',
  'vaultskin',
  'token',
  'xp-tracker',
  'vault-reputation',
  'timepiece-evolution',
  'announcements',
  'glow-level-tester',
  'affirmation'
];

export function PylonProvider({ children }: { children: ReactNode }) {
  const [activePylons, setActivePylons] = useState<string[]>(DEFAULT_ACTIVE_PYLONS);
  const [draftPylons, setDraftPylons] = useState<string[]>(DEFAULT_ACTIVE_PYLONS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eonic-active-pylons');
    if (saved) {
      try {
        const parsedPylons = JSON.parse(saved);
        if (Array.isArray(parsedPylons)) {
          setActivePylons(parsedPylons);
          setDraftPylons(parsedPylons); // Initialize draft with saved state
        }
      } catch (error) {
        console.warn('Failed to parse saved pylons, using defaults');
      }
    }
  }, []);

  const togglePylon = (pylonId: string) => {
    setDraftPylons(prev => 
      prev.includes(pylonId) 
        ? prev.filter(id => id !== pylonId)
        : [...prev, pylonId]
    );
  };

  const isActive = (pylonId: string) => {
    return activePylons.includes(pylonId);
  };

  const isDraft = (pylonId: string) => {
    return draftPylons.includes(pylonId);
  };

  const resetToDefaults = () => {
    setDraftPylons(DEFAULT_ACTIVE_PYLONS);
  };

  const savePylons = () => {
    setActivePylons(draftPylons);
    localStorage.setItem('eonic-active-pylons', JSON.stringify(draftPylons));
  };

  const discardChanges = () => {
    setDraftPylons(activePylons);
  };

  const hasUnsavedChanges = JSON.stringify(activePylons.sort()) !== JSON.stringify(draftPylons.sort());

  return (
    <PylonContext.Provider value={{ 
      activePylons, 
      draftPylons,
      togglePylon, 
      isActive,
      isDraft, 
      resetToDefaults,
      savePylons,
      discardChanges,
      hasUnsavedChanges
    }}>
      {children}
    </PylonContext.Provider>
  );
}

export function usePylonContext() {
  const context = useContext(PylonContext);
  if (context === undefined) {
    throw new Error('usePylonContext must be used within a PylonProvider');
  }
  return context;
} 