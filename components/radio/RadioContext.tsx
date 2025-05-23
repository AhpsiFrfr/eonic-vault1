'use client';

import { createContext, useContext } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  source: 'youtube' | 'local' | 'soundcloud';
  thumbnailUrl?: string;
}

export interface RadioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addTrack: (url: string) => Promise<void>;
  playlist: Track[];
  setCurrentTrack: (track: Track) => void;
  removeTrack: (id: string) => void;
}

export const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within RadioProvider');
  }
  return context;
}; 