export interface PylonDefinition {
  id: string;
  name: string;
  description: string;
  category: 'identity' | 'monitoring' | 'social' | 'utility' | 'customization';
  icon?: string;
  isCore?: boolean; // Core pylons that shouldn't be disabled
}

export const availablePylons: PylonDefinition[] = [
  // Identity Layer (Top Row)
  {
    id: 'eon-id',
    name: 'EON-ID Profile',
    description: 'Your digital identity and profile information',
    category: 'identity',
    icon: '🆔',
    isCore: true
  },
  {
    id: 'phase-pulse-monitor',
    name: 'Phase Pulse Monitor',
    description: 'Real-time dimensional stability and phase monitoring',
    category: 'monitoring',
    icon: '📡'
  },

  // Gateway & Portal Systems
  {
    id: 'refra-gate',
    name: 'RefraGate',
    description: 'Dimensional gateway control and portal management',
    category: 'utility',
    icon: '🌀'
  },

  // Communication & Social
  {
    id: 'radio',
    name: 'Radio Pylon',
    description: 'Cosmic radio frequencies and audio control',
    category: 'social',
    icon: '📻'
  },
  {
    id: 'aether-feed',
    name: 'Aether Feed',
    description: 'Live feed of cosmic events and dimensional activity',
    category: 'social',
    icon: '🌌'
  },

  // Customization & Themes
  {
    id: 'vaultskin',
    name: 'Vaultskin',
    description: 'Customize your dashboard theme and visual style',
    category: 'customization',
    icon: '🎨'
  },

  // Financial & Assets
  {
    id: 'token',
    name: 'Token Holdings',
    description: 'View and manage your cryptocurrency tokens',
    category: 'utility',
    icon: '💰'
  },
  {
    id: 'eonic-token-price',
    name: 'EONIC Token Price',
    description: 'Live $EONIC price chart and market data',
    category: 'utility',
    icon: '📈'
  },
  {
    id: 'eonic-token-overview',
    name: 'EONIC Token Overview',
    description: 'Portfolio overview, staking, and locking actions',
    category: 'utility',
    icon: '🪙'
  },

  // Progress & Achievements
  {
    id: 'xp-tracker',
    name: 'XP Tracker',
    description: 'Track your experience points and level progression',
    category: 'utility',
    icon: '⭐'
  },
  {
    id: 'vault-reputation',
    name: 'Vault Reputation',
    description: 'Your reputation score and community standing',
    category: 'social',
    icon: '🏆'
  },
  {
    id: 'timepiece-evolution',
    name: 'Timepiece Evolution',
    description: 'NFT timepiece progression and evolution tracking',
    category: 'utility',
    icon: '⌚'
  },

  // Information & Updates
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Latest news and updates from the EONIC ecosystem',
    category: 'social',
    icon: '📢'
  },

  // Development & Testing
  {
    id: 'glow-level-tester',
    name: 'Glow Level Tester',
    description: 'Test and adjust visual glow effects',
    category: 'customization',
    icon: '✨'
  },
  {
    id: 'affirmation',
    name: 'Daily Affirmation',
    description: 'Motivational quotes and daily inspiration',
    category: 'utility',
    icon: '💫'
  }
];

export const getPylonsByCategory = (category: PylonDefinition['category']) => {
  return availablePylons.filter(pylon => pylon.category === category);
};

export const getCorePylons = () => {
  return availablePylons.filter(pylon => pylon.isCore);
};

export const getPylonById = (id: string) => {
  return availablePylons.find(pylon => pylon.id === id);
}; 