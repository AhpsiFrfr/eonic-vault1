'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Channel, Category, ChannelContextType, ChannelType } from '@/types/channel';

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

// Mock initial data
const initialChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'text',
    categoryId: 'text-channels',
    position: 0,
    unreadCount: 2,
    description: 'General discussion'
  },
  {
    id: 'dev-chat',
    name: 'dev-chat',
    type: 'text',
    categoryId: 'text-channels',
    position: 1,
    description: 'Development discussions'
  },
  {
    id: 'announcements',
    name: 'announcements',
    type: 'text',
    categoryId: 'text-channels',
    position: 2,
    isLocked: true,
    description: 'Important announcements'
  },
  {
    id: 'voice-general',
    name: 'General',
    type: 'voice',
    categoryId: 'voice-channels',
    position: 0,
    description: 'General voice chat'
  },
  {
    id: 'voice-coding',
    name: 'Coding Session',
    type: 'voice',
    categoryId: 'voice-channels',
    position: 1,
    description: 'Collaborative coding sessions'
  },
  {
    id: 'voice-music',
    name: 'Music & Chill',
    type: 'voice',
    categoryId: 'voice-channels',
    position: 2,
    description: 'Music listening party'
  }
];

const initialCategories: Category[] = [
  {
    id: 'text-channels',
    name: 'Text Channels',
    position: 0,
    collapsed: false
  },
  {
    id: 'voice-channels',
    name: 'Voice Channels',
    position: 1,
    collapsed: false
  }
];

interface ChannelProviderProps {
  children: ReactNode;
}

export function ChannelProvider({ children }: ChannelProviderProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeChannelId, setActiveChannelId] = useState<string | null>('general');
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState<string | null>(null);

  const setActiveChannel = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
  }, []);

  const setActiveVoiceChannel = useCallback((channelId: string | null) => {
    setActiveVoiceChannelId(channelId);
  }, []);

  const createChannel = useCallback((newChannel: Omit<Channel, 'id' | 'position'>) => {
    const id = `channel-${Date.now()}`;
    const categoryChannels = channels.filter(c => c.categoryId === newChannel.categoryId);
    const position = Math.max(...categoryChannels.map(c => c.position), -1) + 1;
    
    const channel: Channel = {
      ...newChannel,
      id,
      position
    };

    setChannels(prev => [...prev, channel]);
  }, [channels]);

  const updateChannel = useCallback((channelId: string, updates: Partial<Channel>) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, ...updates } : channel
    ));
  }, []);

  const deleteChannel = useCallback((channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    
    // If deleting active channel, switch to first available channel
    if (activeChannelId === channelId) {
      const remaining = channels.filter(c => c.id !== channelId && c.type === 'text');
      setActiveChannelId(remaining.length > 0 ? remaining[0].id : null);
    }
    
    if (activeVoiceChannelId === channelId) {
      setActiveVoiceChannelId(null);
    }
  }, [channels, activeChannelId, activeVoiceChannelId]);

  const reorderChannels = useCallback((newChannels: Channel[]) => {
    setChannels(newChannels);
  }, []);

  const createCategory = useCallback((newCategory: Omit<Category, 'id' | 'position'>) => {
    const id = `category-${Date.now()}`;
    const position = Math.max(...categories.map(c => c.position), -1) + 1;
    
    const category: Category = {
      ...newCategory,
      id,
      position
    };

    setCategories(prev => [...prev, category]);
  }, [categories]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    // Move channels to uncategorized
    setChannels(prev => prev.map(channel => 
      channel.categoryId === categoryId ? { ...channel, categoryId: undefined } : channel
    ));
    
    setCategories(prev => prev.filter(category => category.id !== categoryId));
  }, []);

  const reorderCategories = useCallback((newCategories: Category[]) => {
    setCategories(newCategories);
  }, []);

  const toggleCategoryCollapse = useCallback((categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, collapsed: !category.collapsed } : category
    ));
  }, []);

  const value: ChannelContextType = {
    channels,
    categories,
    activeChannelId,
    activeVoiceChannelId,
    setActiveChannel,
    setActiveVoiceChannel,
    createChannel,
    updateChannel,
    deleteChannel,
    reorderChannels,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    toggleCategoryCollapse
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannels() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannels must be used within a ChannelProvider');
  }
  return context;
} 