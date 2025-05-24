import React, { createContext, useContext, useState, useCallback } from 'react';
import { DevHQUser, DevHQMessage, DevHQThread, DevHQMessageStatus } from '../types/devhq-chat';

interface DevHQContextType {
  currentUser: DevHQUser | null;
  messages: DevHQMessage[];
  threads: DevHQThread[];
  activeThread: string | null;
  messageStatuses: { [key: string]: DevHQMessageStatus };
  setActiveThread: (threadId: string | null) => void;
  addMessage: (message: DevHQMessage) => void;
  updateMessageStatus: (messageId: string, status: DevHQMessageStatus['status']) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
}

const DevHQContext = createContext<DevHQContextType | undefined>(undefined);

// Mock data
const mockUser: DevHQUser = {
  id: 'user-1',
  username: 'Developer',
  avatar: '/images/avatars/default.svg',
  status: 'online'
};

const mockMessages: DevHQMessage[] = [
  {
    id: 'msg-1',
    senderId: 'ENIC.0',
    content: 'Welcome to DevHQ! I\'m here to assist with development tasks.',
    timestamp: Date.now() - 3600000,
    reactions: { '👋': ['user-2'], '🚀': ['user-1', 'user-3'] },
    type: 'system'
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    content: 'Thanks ENIC.0! The new chat system looks great.',
    timestamp: Date.now() - 1800000,
    reactions: { '💯': ['ENIC.0'] },
    type: 'text'
  }
];

export const DevHQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<DevHQUser>(mockUser);
  const [messageList, setMessageList] = useState<DevHQMessage[]>(mockMessages);
  const [threadList, setThreadList] = useState<DevHQThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<{ [key: string]: DevHQMessageStatus }>({});

  const addMessage = useCallback((message: DevHQMessage) => {
    setMessageList(prev => [...prev, message]);
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: DevHQMessageStatus['status']) => {
    setStatuses(prev => ({
      ...prev,
      [messageId]: {
        messageId,
        status,
        timestamp: Date.now()
      }
    }));
  }, []);

  const addReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setMessageList(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          if (!reactions[emoji].includes(userId)) {
            reactions[emoji] = [...reactions[emoji], userId];
          }
        } else {
          reactions[emoji] = [userId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  }, []);

  const removeReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setMessageList(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          reactions[emoji] = reactions[emoji].filter(id => id !== userId);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  }, []);

  return (
    <DevHQContext.Provider
      value={{
        currentUser,
        messages: messageList,
        threads: threadList,
        activeThread: activeThreadId,
        messageStatuses: statuses,
        setActiveThread: setActiveThreadId,
        addMessage,
        updateMessageStatus,
        addReaction,
        removeReaction
      }}
    >
      {children}
    </DevHQContext.Provider>
  );
};

export const useDevHQ = () => {
  const context = useContext(DevHQContext);
  if (context === undefined) {
    throw new Error('useDevHQ must be used within a DevHQProvider');
  }
  return context;
}; 