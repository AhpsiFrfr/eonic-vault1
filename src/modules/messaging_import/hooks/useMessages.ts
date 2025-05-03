import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { messagingAPI } from '../utils/placeholders';

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedMessages = await messagingAPI.fetchMessages(chatId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (content: string, attachments?: File[]) => {
    try {
      const message = await messagingAPI.sendMessage(content, chatId, undefined, attachments);
      setMessages(prev => [...prev, message]);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('Failed to send message')
      };
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    try {
      await messagingAPI.toggleReaction(messageId, emoji);
      // Optimistically update the UI
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const hasReaction = msg.reactions?.some(
            r => r.emoji === emoji && r.sender_address === 'current_user_address'
          );
          
          if (hasReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.filter(
                r => !(r.emoji === emoji && r.sender_address === 'current_user_address')
              )
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                {
                  id: Math.random().toString(36).substring(7),
                  message_id: messageId,
                  sender_address: 'current_user_address',
                  emoji
                }
              ]
            };
          }
        }
        return msg;
      }));
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    toggleReaction,
    refreshMessages: fetchMessages
  };
};
