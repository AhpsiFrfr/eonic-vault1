'use client';

import React, { createContext, useContext, useState } from 'react';

interface Theme {
  name: 'cosmic' | 'cyberpunk' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    glow: {
      primary: string;
      secondary: string;
    };
  };
  effects: {
    glowIntensity: number;
    animationSpeed: number;
  };
}

const themes: Record<Theme['name'], Theme> = {
  cosmic: {
    name: 'cosmic',
    colors: {
      primary: '#4F46E5',
      secondary: '#2563EB',
      accent: '#10B981',
      background: '#0F0F1A',
      text: '#FFFFFF',
      glow: {
        primary: 'rgba(79, 70, 229, 0.5)',
        secondary: 'rgba(37, 99, 235, 0.5)'
      }
    },
    effects: {
      glowIntensity: 0.5,
      animationSpeed: 1
    }
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      primary: '#FF0080',
      secondary: '#7928CA',
      accent: '#00FF00',
      background: '#000000',
      text: '#FFFFFF',
      glow: {
        primary: 'rgba(255, 0, 128, 0.5)',
        secondary: 'rgba(121, 40, 202, 0.5)'
      }
    },
    effects: {
      glowIntensity: 0.7,
      animationSpeed: 1.2
    }
  },
  minimal: {
    name: 'minimal',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#059669',
      background: '#1F2937',
      text: '#F3F4F6',
      glow: {
        primary: 'rgba(59, 130, 246, 0.3)',
        secondary: 'rgba(30, 64, 175, 0.3)'
      }
    },
    effects: {
      glowIntensity: 0.3,
      animationSpeed: 0.8
    }
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (name: Theme['name']) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme['name']>('cosmic');

  const value = {
    theme: themes[currentTheme],
    setTheme: (name: Theme['name']) => setCurrentTheme(name)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 