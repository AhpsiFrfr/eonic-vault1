'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase, DirectMessage, subscribeToDirectMessages } from '../utils/supabase';

export interface DMThread {
  id: string;
  participantAddress: string;
  participantName?: string;
  participantAvatar?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface DMUser {
  address: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  xpLevel?: number;
  timepiece?: string;
}

interface DMContextType {
  // State
  threads: DMThread[];
  activeThread: string | null;
  activeMessages: DirectMessage[];
  isLoading: boolean;
  error: string | null;
  typingUsers: { [address: string]: boolean };
  
  // Actions
  setActiveThread: (threadId: string | null) => void;
  startDM: (userAddress: string) => Promise<string>;
  sendMessage: (content: string, recipientAddress: string, replyToId?: string) => Promise<void>;
  markAsRead: (threadId: string) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  setTyping: (recipientAddress: string, isTyping: boolean) => void;
  
  // Utility functions
  getUserInfo: (address: string) => DMUser | null;
  getDMThreadId: (userAddress: string) => string;
  refreshThreads: () => Promise<void>;
}

const DMContext = createContext<DMContextType | undefined>(undefined);

export function useDM() {
  const context = useContext(DMContext);
  if (context === undefined) {
    throw new Error('useDM must be used within a DMProvider');
  }
  return context;
}

export function DMProvider({ children }: { children: React.ReactNode }) {
  const { publicKey } = useWallet();
  const [threads, setThreads] = useState<DMThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [address: string]: boolean }>({});
  const [subscriptions, setSubscriptions] = useState<{ [threadId: string]: any }>({});

  // Generate DM thread ID from two addresses
  const getDMThreadId = useCallback((userAddress: string): string => {
    if (!publicKey) return '';
    return `dm:${[publicKey.toString(), userAddress].sort().join(':')}`;
  }, [publicKey]);

  // Load user's DM threads
  const refreshThreads = useCallback(async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      // Get all messages where user is sender or recipient
      const { data: messages, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_address.eq.${publicKey.toString()},recipient_address.eq.${publicKey.toString()}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by thread and get latest message for each
      const threadMap = new Map<string, DMThread>();
      
      (messages || []).forEach((message: DirectMessage) => {
        const otherUser = message.sender_address === publicKey.toString() 
          ? message.recipient_address 
          : message.sender_address;
        
        const threadId = getDMThreadId(otherUser);
        
        if (!threadMap.has(threadId)) {
          threadMap.set(threadId, {
            id: threadId,
            participantAddress: otherUser,
            participantName: otherUser.slice(0, 8) + '...',
            lastMessage: {
              content: message.content,
              timestamp: message.created_at,
              sender: message.sender_address === publicKey.toString() ? 'You' : 'Them'
            },
            unreadCount: 0, // TODO: Implement read tracking
            isOnline: false
          });
        }
      });

      setThreads(Array.from(threadMap.values()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, getDMThreadId]);

  // Load messages for active thread
  const loadActiveMessages = useCallback(async (threadId: string) => {
    if (!publicKey) return;
    
    const participantAddress = threadId.replace('dm:', '').split(':').find(addr => addr !== publicKey.toString());
    if (!participantAddress) return;

    try {
      const { data: messages, error } = await supabase
        .rpc('get_direct_messages', {
          p_user_address: publicKey.toString(),
          p_recipient_address: participantAddress
        })
        .select('*, attachments:direct_message_attachments(*)');

      if (error) throw error;
      setActiveMessages(messages || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, [publicKey]);

  // Start a new DM conversation
  const startDM = useCallback(async (userAddress: string): Promise<string> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    const threadId = getDMThreadId(userAddress);
    
    // Check if thread already exists
    const existingThread = threads.find(t => t.id === threadId);
    if (!existingThread) {
      // Add new thread to list
      const newThread: DMThread = {
        id: threadId,
        participantAddress: userAddress,
        participantName: userAddress.slice(0, 8) + '...',
        unreadCount: 0,
        isOnline: false
      };
      setThreads(prev => [newThread, ...prev]);
    }
    
    setActiveThread(threadId);
    return threadId;
  }, [publicKey, threads, getDMThreadId]);

  // Send a message
  const sendMessage = useCallback(async (content: string, recipientAddress: string, replyToId?: string) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content,
          sender_address: publicKey.toString(),
          recipient_address: recipientAddress,
          parent_id: replyToId || null
        });

      if (error) throw error;

      // Update thread's last message
      const threadId = getDMThreadId(recipientAddress);
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? {
              ...thread,
              lastMessage: {
                content,
                timestamp: new Date().toISOString(),
                sender: 'You'
              }
            }
          : thread
      ));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [publicKey, getDMThreadId]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_address', publicKey.toString());

      if (error) throw error;

      // Remove from active messages
      setActiveMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [publicKey]);

  // Mark thread as read
  const markAsRead = useCallback((threadId: string) => {
    setThreads(prev => prev.map(thread =>
      thread.id === threadId 
        ? { ...thread, unreadCount: 0 }
        : thread
    ));
  }, []);

  // Set typing status
  const setTyping = useCallback((recipientAddress: string, isTyping: boolean) => {
    setTypingUsers(prev => ({
      ...prev,
      [recipientAddress]: isTyping
    }));
  }, []);

  // Get user info by address
  const getUserInfo = useCallback((address: string): DMUser | null => {
    // In a real implementation, this would fetch from a user database
    return {
      address,
      name: address.slice(0, 8) + '...',
      avatar: '/default-avatar.png',
      isOnline: Math.random() > 0.5,
      xpLevel: Math.floor(Math.random() * 100) + 1,
      timepiece: ['active', 'restricted', 'quantum'][Math.floor(Math.random() * 3)]
    };
  }, []);

  // Set up real-time subscriptions when active thread changes
  useEffect(() => {
    if (!activeThread || !publicKey) return;

    const participantAddress = activeThread.replace('dm:', '').split(':').find(addr => addr !== publicKey.toString());
    if (!participantAddress) return;

    // Subscribe to new messages for this thread
    const channel = subscribeToDirectMessages(
      publicKey.toString(),
      participantAddress,
      (message) => {
        // Add to active messages if this is the active thread
        if (activeThread === getDMThreadId(participantAddress)) {
          setActiveMessages(prev => {
            const exists = prev.find(m => m.id === message.id);
            if (exists) return prev;
            return [...prev, message];
          });
        }

        // Update thread's last message
        const threadId = getDMThreadId(participantAddress);
        setThreads(prev => prev.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                lastMessage: {
                  content: message.content,
                  timestamp: message.created_at,
                  sender: message.sender_address === publicKey.toString() ? 'You' : 'Them'
                },
                unreadCount: thread.id === activeThread ? 0 : thread.unreadCount + 1
              }
            : thread
        ));
      }
    );

    setSubscriptions(prev => ({
      ...prev,
      [activeThread]: channel
    }));

    return () => {
      channel.unsubscribe();
      setSubscriptions(prev => {
        const newSubs = { ...prev };
        delete newSubs[activeThread];
        return newSubs;
      });
    };
  }, [activeThread, publicKey, getDMThreadId]);

  // Load active messages when thread changes
  useEffect(() => {
    if (activeThread) {
      loadActiveMessages(activeThread);
      markAsRead(activeThread);
    }
  }, [activeThread, loadActiveMessages, markAsRead]);

  // Load threads on mount
  useEffect(() => {
    if (publicKey) {
      refreshThreads();
    }
  }, [publicKey, refreshThreads]);

  const value: DMContextType = {
    threads,
    activeThread,
    activeMessages,
    isLoading,
    error,
    typingUsers,
    setActiveThread,
    startDM,
    sendMessage,
    markAsRead,
    deleteMessage,
    setTyping,
    getUserInfo,
    getDMThreadId,
    refreshThreads
  };

  return (
    <DMContext.Provider value={value}>
      {children}
    </DMContext.Provider>
  );
} 