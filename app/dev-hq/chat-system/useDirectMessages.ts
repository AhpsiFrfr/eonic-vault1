'use client';

/**
 * Hook for managing direct messages
 * @dev-vault-component
 */

import { useState, useEffect, useCallback } from 'react';
import { generateFakeDM } from './generateFakeDM';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  profilePic: string;
  xpLevel: number;
  timepiece: string;
  reactions: Array<{emoji: string, count: number}>;
  edited: boolean;
  seen: boolean;
  replyTo?: string;
}

export interface User {
  id: string;
  name: string;
  status: string;
  lastSeen: string;
  profilePic: string;
  xpLevel: number;
  timepiece: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isMuted: boolean;
}

export interface DirectMessageState {
  user: User | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing direct messages with a specific user
 * @param userId - The ID of the user to chat with
 * @returns DirectMessageState and methods for managing the conversation
 */
export function useDirectMessages(userId: string) {
  const [state, setState] = useState<DirectMessageState>({
    user: null,
    messages: [],
    isLoading: true,
    error: null
  });
  
  // Load conversation data
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use the fake data generator
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API delay
      const timer = setTimeout(() => {
        const { user, messages } = generateFakeDM(userId, 15);
        setState({
          user,
          messages,
          isLoading: false,
          error: null
        });
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load conversation'
      }));
    }
  }, [userId]);
  
  // Send a message
  const sendMessage = useCallback((content: string, replyTo?: string) => {
    if (!content.trim() || !state.user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'DevUser',
      content,
      timestamp: Date.now(),
      profilePic: '/avatar1.png',
      xpLevel: 42,
      timepiece: 'active',
      reactions: [],
      edited: false,
      seen: false,
      replyTo
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    
    // In a real implementation, this would send to an API
    // For now, we'll simulate the message being seen after a delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id ? { ...msg, seen: true } : msg
        )
      }));
    }, 3000);
    
    return newMessage;
  }, [state.user]);
  
  // Edit a message
  const editMessage = useCallback((messageId: string, newContent: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId && msg.sender === 'DevUser'
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    }));
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Delete a message
  const deleteMessage = useCallback((messageId: string, forEveryone: boolean = false) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => 
        !(msg.id === messageId && (msg.sender === 'DevUser' || forEveryone))
      )
    }));
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Add reaction to a message
  const addReaction = useCallback((messageId: string, emoji: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1 }]
            };
          }
        }
        return msg;
      })
    }));
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Toggle block status
  const toggleBlockUser = useCallback(() => {
    if (!state.user) return;
    
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, isBlocked: !prev.user.isBlocked } : null
    }));
    
    // In a real implementation, this would send to an API
  }, [state.user]);
  
  // Toggle mute status
  const toggleMuteUser = useCallback(() => {
    if (!state.user) return;
    
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, isMuted: !prev.user.isMuted } : null
    }));
    
    // In a real implementation, this would send to an API
  }, [state.user]);
  
  // Clear conversation history
  const clearHistory = useCallback((forEveryone: boolean = false) => {
    setState(prev => ({
      ...prev,
      messages: []
    }));
    
    // In a real implementation, this would send to an API
  }, []);
  
  return {
    ...state,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    toggleBlockUser,
    toggleMuteUser,
    clearHistory
  };
}
