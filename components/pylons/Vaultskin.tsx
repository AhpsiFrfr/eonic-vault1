import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, Download, Upload, Settings } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  preview: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'cosmic-blue',
    name: 'Cosmic Blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7', 
      accent: '#06b6d4',
      background: '#0f172a'
    },
    preview: 'bg-gradient-to-br from-sky-500 to-blue-600'
  },
  {
    id: 'void-purple',
    name: 'Void Purple', 
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a855f7',
      background: '#1e1b31'
    },
    preview: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    id: 'cyber-green',
    name: 'Cyber Green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#064e3b'
    },
    preview: 'bg-gradient-to-br from-emerald-500 to-green-600'
  },
  {
    id: 'solar-gold',
    name: 'Solar Gold',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#451a03'
    },
    preview: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 'crimson-red',
    name: 'Crimson Red',
    colors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      background: '#450a0a'
    },
    preview: 'bg-gradient-to-br from-red-500 to-red-600'
  }
];

export default function Vaultskin() {
  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0]);
  const [customMode, setCustomMode] = useState(false);
  const [opacity, setOpacity] = useState(85);
  const [glowIntensity, setGlowIntensity] = useState(75);

  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme);
    // Here you would apply the theme to the vault
  };

  const handleCustomColor = (colorType: keyof ThemeOption['colors'], value: string) => {
    setSelectedTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  return (
    <div className="pylon relative overflow-hidden">
      {/* Theme preview background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className={`absolute inset-0 rounded-2xl ${selectedTheme.preview}`}
          style={{ opacity: opacity / 100 }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            Vaultskin
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`p-1 rounded transition-colors ${
                customMode ? 'text-orange-400 bg-orange-400/20' : 'text-gray-400 bg-gray-400/20'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-gray-400 bg-gray-400/20 hover:text-white transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!customMode ? (
          /* Theme Selection */
          <div className="space-y-4">
            <div className="text-sm text-gray-300 mb-3">Choose a theme:</div>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    selectedTheme.id === theme.id 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-full h-8 rounded ${theme.preview} mb-2`} />
                  <div className="text-xs text-gray-300">{theme.name}</div>
                  {selectedTheme.id === theme.id && (
                    <motion.div
                      className="absolute inset-0 border-2 border-cyan-400 rounded-lg"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Global Settings */}
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Interface Opacity</span>
                  <span>{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Glow Intensity</span>
                  <span>{glowIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Custom Theme Editor */
          <div className="space-y-4">
            <div className="text-sm text-gray-300 mb-3">Custom theme editor:</div>
            
            {Object.entries(selectedTheme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border border-gray-600 overflow-hidden">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleCustomColor(key as keyof ThemeOption['colors'], e.target.value)}
                    className="w-full h-full cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-300 capitalize flex-1">{key.replace('_', ' ')}</span>
                <span className="text-xs font-mono text-gray-500">{value}</span>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Apply Theme
              </button>
              <button className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors">
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <button className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
            <Download className="w-3 h-3" />
            Export
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
            <Upload className="w-3 h-3" />
            Import
          </button>
        </div>

        {/* Current theme info */}
        <div className="mt-4 p-2 bg-gray-800/30 rounded text-xs text-gray-400">
          Active: <span className="text-gray-300">{selectedTheme.name}</span>
        </div>
      </div>
    </div>
  );
} 