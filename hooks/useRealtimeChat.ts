import { useState, useCallback, useEffect } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  type: 'user' | 'assistant' | 'system';
  userId: string;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
}

export const useRealtimeChat = (projectId: string, channel: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  // Initialize with some sample messages for the DEV-EON channel
  useEffect(() => {
    if (channel === 'dev-eon') {
      const initialMessages: ChatMessage[] = [
        {
          id: 'init-1',
          user: 'ENIC.0',
          content: 'DevHQ Collaborative Workspace initialized! All team members can now collaborate with me on development tasks.',
          timestamp: Date.now() - 3600000,
          type: 'system',
          userId: 'ENIC.0'
        },
        {
          id: 'init-2',
          user: 'TeamLead',
          content: 'Perfect! Let\'s start working on the component library.',
          timestamp: Date.now() - 1800000,
          type: 'user',
          userId: 'user-2'
        }
      ];
      setMessages(initialMessages);
    } else if (channel === 'team-chat') {
      const teamMessages: ChatMessage[] = [
        {
          id: 'team-1',
          user: 'Developer',
          content: 'The new collaborative DEV-EON is amazing!',
          timestamp: Date.now() - 900000,
          type: 'user',
          userId: 'user-1'
        },
        {
          id: 'team-2',
          user: 'Designer',
          content: 'Love the real-time features 🎨',
          timestamp: Date.now() - 600000,
          type: 'user',
          userId: 'user-3'
        }
      ];
      setMessages(teamMessages);
    }

    // Mock connected users
    setConnectedUsers([
      { id: 'user-1', username: 'Developer' },
      { id: 'user-2', username: 'TeamLead' },
      { id: 'user-3', username: 'Designer' },
      { id: 'ENIC.0', username: 'ENIC.0' }
    ]);
  }, [channel]);

  const sendPrompt = useCallback(async (prompt: string, user: any) => {
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: user?.username || 'User',
      content: prompt,
      timestamp: Date.now(),
      type: 'user',
      userId: user?.id || 'unknown'
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Call the DEV-EON API
      const response = await fetch('/api/dev-eon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `[DevHQ Collaborative Context] ${prompt}`,
          context: 'team-collaboration'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add ENIC.0 response
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        user: 'ENIC.0',
        content: data.result || 'I apologize, but I encountered an issue processing your request.',
        timestamp: Date.now(),
        type: 'assistant',
        userId: 'ENIC.0'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending prompt:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        user: 'ENIC.0',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: Date.now(),
        type: 'system',
        userId: 'ENIC.0'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback((message: string, user: any) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: user?.username || 'User',
      content: message,
      timestamp: Date.now(),
      type: 'user',
      userId: user?.id || 'unknown'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate real-time delivery with slight delay
    setTimeout(() => {
      // In a real implementation, this would broadcast to other clients
      console.log(`Message sent to ${channel}:`, newMessage);
    }, 100);
  }, [channel]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    connectedUsers,
    sendPrompt,
    sendMessage,
    clearChat
  };
}; 