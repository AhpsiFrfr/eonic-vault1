'use client';

/**
 * Hook for managing voice socket connections
 * @dev-vault-component
 */

import { useState, useEffect, useCallback } from 'react';

export interface VoiceUser {
  id: string;
  name: string;
  profilePic: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  joinedAt: number;
}

export interface VoiceChannel {
  id: string;
  name: string;
  participants: VoiceUser[];
  isLocked: boolean;
}

export interface VoiceSocketState {
  connected: boolean;
  currentChannel: string | null;
  channels: VoiceChannel[];
  localMuted: boolean;
  localDeafened: boolean;
  error: string | null;
}

/**
 * Hook for managing voice socket connections
 * @param userId - The ID of the current user
 * @returns VoiceSocketState and methods for managing voice connections
 */
export function useVoiceSocket(userId: string) {
  const [state, setState] = useState<VoiceSocketState>({
    connected: false,
    currentChannel: null,
    channels: [
      {
        id: 'main',
        name: 'Main Room',
        participants: [],
        isLocked: false
      },
      {
        id: 'dev',
        name: 'Dev Room',
        participants: [
          {
            id: '1',
            name: 'DevLead',
            profilePic: '/avatar3.png',
            isSpeaking: false,
            isMuted: false,
            isDeafened: false,
            joinedAt: Date.now() - 3600000
          }
        ],
        isLocked: false
      },
      {
        id: 'cabal',
        name: 'Cabal War Room',
        participants: [],
        isLocked: true
      }
    ],
    localMuted: false,
    localDeafened: false,
    error: null
  });
  
  // Connect to voice socket
  useEffect(() => {
    // In a real implementation, this would connect to a WebSocket or LiveKit
    // For now, we'll simulate a connection
    
    const connectToVoice = async () => {
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          connected: true,
          error: null
        }));
        
        // Simulate other users joining/leaving and speaking
        const interval = setInterval(() => {
          setState(prev => {
            // Randomly update speaking status of existing participants
            const updatedChannels = prev.channels.map(channel => ({
              ...channel,
              participants: channel.participants.map(participant => ({
                ...participant,
                isSpeaking: Math.random() > 0.7
              }))
            }));
            
            return {
              ...prev,
              channels: updatedChannels
            };
          });
        }, 2000);
        
        return () => {
          clearInterval(interval);
          // In a real implementation, this would disconnect from the WebSocket
        };
      } catch (error) {
        setState(prev => ({
          ...prev,
          connected: false,
          error: 'Failed to connect to voice server'
        }));
      }
    };
    
    connectToVoice();
  }, [userId]);
  
  // Join a voice channel
  const joinChannel = useCallback((channelId: string) => {
    // Check if channel exists
    const channel = state.channels.find(c => c.id === channelId);
    if (!channel) {
      setState(prev => ({
        ...prev,
        error: `Channel ${channelId} not found`
      }));
      return;
    }
    
    // Check if channel is locked
    if (channel.isLocked) {
      setState(prev => ({
        ...prev,
        error: `Channel ${channel.name} is locked`
      }));
      return;
    }
    
    // In a real implementation, this would send a join request to the server
    // For now, we'll simulate joining
    
    // Create current user
    const currentUser: VoiceUser = {
      id: userId,
      name: 'DevUser',
      profilePic: '/avatar1.png',
      isSpeaking: false,
      isMuted: state.localMuted,
      isDeafened: state.localDeafened,
      joinedAt: Date.now()
    };
    
    // Update state
    setState(prev => {
      // Leave current channel if any
      const updatedChannels = prev.channels.map(c => {
        if (c.id === prev.currentChannel) {
          return {
            ...c,
            participants: c.participants.filter(p => p.id !== userId)
          };
        }
        if (c.id === channelId) {
          return {
            ...c,
            participants: [...c.participants, currentUser]
          };
        }
        return c;
      });
      
      return {
        ...prev,
        currentChannel: channelId,
        channels: updatedChannels,
        error: null
      };
    });
  }, [state.channels, state.currentChannel, state.localDeafened, state.localMuted, userId]);
  
  // Leave current channel
  const leaveChannel = useCallback(() => {
    if (!state.currentChannel) return;
    
    // In a real implementation, this would send a leave request to the server
    // For now, we'll simulate leaving
    
    setState(prev => {
      const updatedChannels = prev.channels.map(c => {
        if (c.id === prev.currentChannel) {
          return {
            ...c,
            participants: c.participants.filter(p => p.id !== userId)
          };
        }
        return c;
      });
      
      return {
        ...prev,
        currentChannel: null,
        channels: updatedChannels
      };
    });
  }, [state.currentChannel, userId]);
  
  // Toggle local mute
  const toggleMute = useCallback(() => {
    setState(prev => {
      // Update local state
      const newMuted = !prev.localMuted;
      
      // If in a channel, update participant state
      const updatedChannels = prev.channels.map(c => {
        if (c.id === prev.currentChannel) {
          return {
            ...c,
            participants: c.participants.map(p => {
              if (p.id === userId) {
                return {
                  ...p,
                  isMuted: newMuted
                };
              }
              return p;
            })
          };
        }
        return c;
      });
      
      return {
        ...prev,
        localMuted: newMuted,
        channels: updatedChannels
      };
    });
    
    // In a real implementation, this would send a mute update to the server
  }, [userId]);
  
  // Toggle local deafen
  const toggleDeafen = useCallback(() => {
    setState(prev => {
      // Update local state
      const newDeafened = !prev.localDeafened;
      
      // If in a channel, update participant state
      const updatedChannels = prev.channels.map(c => {
        if (c.id === prev.currentChannel) {
          return {
            ...c,
            participants: c.participants.map(p => {
              if (p.id === userId) {
                return {
                  ...p,
                  isDeafened: newDeafened,
                  // Being deafened implies being muted
                  isMuted: newDeafened ? true : prev.localMuted
                };
              }
              return p;
            })
          };
        }
        return c;
      });
      
      return {
        ...prev,
        localDeafened: newDeafened,
        // Being deafened implies being muted
        localMuted: newDeafened ? true : prev.localMuted,
        channels: updatedChannels
      };
    });
    
    // In a real implementation, this would send a deafen update to the server
  }, [userId]);
  
  return {
    ...state,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleDeafen
  };
}
