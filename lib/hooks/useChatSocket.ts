import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  reactions?: {
    emoji: string;
    count: number;
    userReacted: boolean;
  }[];
}

interface ChatSocket {
  messages: Message[];
  sendMessage: (content: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  isConnected: boolean;
  error: string | null;
}

export function useChatSocket(channelId: string): ChatSocket {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock implementation for development
  const sendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: {
        id: user?.id || 'unknown',
        name: user?.displayName || 'Anonymous',
        avatar: user?.avatar || '/images/avatars/default.svg'
      },
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
  }, [user]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id !== messageId) return message;

      const reactions = message.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        existingReaction.count++;
        existingReaction.userReacted = true;
        return { ...message, reactions };
      }

      return {
        ...message,
        reactions: [...reactions, { emoji, count: 1, userReacted: true }]
      };
    }));
  }, []);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id !== messageId) return message;

      const reactions = message.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        if (existingReaction.count > 1) {
          existingReaction.count--;
          existingReaction.userReacted = false;
          return { ...message, reactions };
        } else {
          return {
            ...message,
            reactions: reactions.filter(r => r.emoji !== emoji)
          };
        }
      }

      return message;
    }));
  }, []);

  // Simulate connection
  useEffect(() => {
    setIsConnected(true);
    return () => setIsConnected(false);
  }, [channelId]);

  return {
    messages,
    sendMessage,
    addReaction,
    removeReaction,
    isConnected,
    error
  };
} 