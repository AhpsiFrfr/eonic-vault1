import { useState, useCallback } from 'react';

type ThemeType = 'default' | 'quantum' | 'voidwalker' | 'golden' | 'emerald';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  glow: {
    blue: string;
    purple: string;
    gold: string;
    green: string;
  };
}

const themeColors: Record<ThemeType, ThemeColors> = {
  default: {
    primary: '#1C45F4',
    secondary: '#3A1C8E',
    accent: '#7B2682',
    glow: {
      blue: 'rgba(28, 69, 244, 0.5)',
      purple: 'rgba(58, 28, 142, 0.5)',
      gold: 'rgba(245, 209, 111, 0.5)',
      green: 'rgba(0, 168, 107, 0.5)'
    }
  },
  quantum: {
    primary: '#00FFFF',
    secondary: '#0088FF',
    accent: '#0044FF',
    glow: {
      blue: 'rgba(0, 255, 255, 0.5)',
      purple: 'rgba(0, 136, 255, 0.5)',
      gold: 'rgba(245, 209, 111, 0.5)',
      green: 'rgba(0, 168, 107, 0.5)'
    }
  },
  voidwalker: {
    primary: '#7000FF',
    secondary: '#4400FF',
    accent: '#2200FF',
    glow: {
      blue: 'rgba(112, 0, 255, 0.5)',
      purple: 'rgba(68, 0, 255, 0.5)',
      gold: 'rgba(245, 209, 111, 0.5)',
      green: 'rgba(0, 168, 107, 0.5)'
    }
  },
  golden: {
    primary: '#F5D16F',
    secondary: '#F5A623',
    accent: '#FF6600',
    glow: {
      blue: 'rgba(245, 209, 111, 0.5)',
      purple: 'rgba(245, 166, 35, 0.5)',
      gold: 'rgba(255, 102, 0, 0.5)',
      green: 'rgba(0, 168, 107, 0.5)'
    }
  },
  emerald: {
    primary: '#00A86B',
    secondary: '#1C8E5A',
    accent: '#F5D16F',
    glow: {
      blue: 'rgba(0, 168, 107, 0.5)',
      purple: 'rgba(28, 142, 90, 0.5)',
      gold: 'rgba(245, 209, 111, 0.5)',
      green: 'rgba(0, 168, 107, 0.5)'
    }
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>('default');

  const getGlowColor = useCallback((color: keyof ThemeColors['glow'], opacity?: number) => {
    const glowColor = themeColors[theme].glow[color];
    if (opacity !== undefined) {
      return glowColor.replace(/[\d.]+\)$/g, `${opacity})`);
    }
    return glowColor;
  }, [theme]);

  const getPrimaryColor = useCallback(() => themeColors[theme].primary, [theme]);
  const getSecondaryColor = useCallback(() => themeColors[theme].secondary, [theme]);
  const getAccentColor = useCallback(() => themeColors[theme].accent, [theme]);

  return {
    theme,
    setTheme,
    getGlowColor,
    getPrimaryColor,
    getSecondaryColor,
    getAccentColor,
    themeColors: themeColors[theme]
  };
}; 