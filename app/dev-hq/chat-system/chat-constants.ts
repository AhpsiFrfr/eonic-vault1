'use client';

/**
 * Shared constants and theme settings for the chat system
 * @dev-vault-component
 */

export const CHAT_CONSTANTS = {
  // Color scheme
  colors: {
    primary: '#3b82f6', // Blue
    secondary: '#10b981', // Green
    danger: '#ef4444', // Red
    warning: '#f59e0b', // Amber
    info: '#6366f1', // Indigo
    cabal: '#8b5cf6', // Purple
    
    // Dark theme
    background: {
      primary: '#18181b', // zinc-900
      secondary: '#27272a', // zinc-800
      tertiary: '#3f3f46', // zinc-700
    },
    text: {
      primary: '#ffffff', // white
      secondary: '#d4d4d8', // zinc-300
      muted: '#71717a', // zinc-500
    },
    border: {
      primary: '#3f3f46', // zinc-700
      secondary: '#52525b', // zinc-600
    }
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Glow effects
  glow: {
    primary: '0 0 10px rgba(59, 130, 246, 0.5)', // Blue glow
    secondary: '0 0 10px rgba(16, 185, 129, 0.5)', // Green glow
    danger: '0 0 10px rgba(239, 68, 68, 0.5)', // Red glow
    cabal: '0 0 10px rgba(139, 92, 246, 0.5)', // Purple glow
  },
  
  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Message types
  messageTypes: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system',
    VOICE: 'voice',
    GIF: 'gif',
  },
  
  // Default settings
  defaults: {
    messageLimit: 50,
    typingTimeout: 3000, // ms
    messageMaxLength: 2000,
    fileMaxSize: 10 * 1024 * 1024, // 10MB
    imageMaxSize: 5 * 1024 * 1024, // 5MB
  },
  
  // Voice settings
  voice: {
    channels: {
      maxUsers: 25,
      defaultQuality: 'medium', // low, medium, high
    },
    codecs: ['opus', 'vp8'],
  },
  
  // Permissions
  permissions: {
    roles: ['user', 'moderator', 'admin', 'cabal'],
    defaultRole: 'user',
  },
  
  // Feature flags
  features: {
    voiceEnabled: true,
    gifEnabled: true,
    fileUploadEnabled: true,
    markdownEnabled: true,
    emojiEnabled: true,
    threadedRepliesEnabled: true,
    debugEnabled: true,
  },
  
  // CSS class names for consistent styling
  cssClasses: {
    // Containers
    container: 'bg-zinc-900 text-white rounded-md shadow-lg border border-zinc-700',
    modalContainer: 'bg-zinc-800 border border-zinc-700 rounded-md shadow-lg',
    
    // Buttons
    primaryButton: 'px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white',
    secondaryButton: 'px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300',
    dangerButton: 'px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white',
    iconButton: 'text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700',
    
    // Inputs
    input: 'w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500',
    select: 'bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500',
    
    // Text
    heading: 'text-white font-medium',
    subheading: 'text-zinc-300 font-medium',
    bodyText: 'text-zinc-300',
    mutedText: 'text-zinc-500 text-sm',
    
    // Status indicators
    onlineStatus: 'w-2 h-2 rounded-full bg-green-500',
    offlineStatus: 'w-2 h-2 rounded-full bg-zinc-500',
    
    // Animations
    fadeIn: 'animate-fadeIn',
    slideIn: 'animate-slideIn',
    pulse: 'animate-pulse',
    
    // Responsive
    mobileOnly: 'block md:hidden',
    desktopOnly: 'hidden md:block',
  }
};

// Export individual constants for convenience
export const { colors, animation, glow, breakpoints, messageTypes, defaults, voice, permissions, features, cssClasses } = CHAT_CONSTANTS;

export default CHAT_CONSTANTS;
