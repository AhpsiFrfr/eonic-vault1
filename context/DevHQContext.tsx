import React, { createContext, useContext, useState, useCallback } from 'react';
import { DevHQUser, DevHQMessage, DevHQThread, DevHQMessageStatus } from '../types/devhq-chat';

interface DevHQContextType {
  currentUser: DevHQUser | null;
  messages: DevHQMessage[];
  threads: DevHQThread[];
  activeThread: string | null;
  messageStatuses: { [key: string]: DevHQMessageStatus };
  projectId: string;
  // Enhanced for collaborative features
  teamMembers: DevHQUser[];
  onlineMembers: string[];
  setActiveThread: (threadId: string | null) => void;
  addMessage: (message: DevHQMessage) => void;
  updateMessageStatus: (messageId: string, status: DevHQMessageStatus['status']) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  // Collaborative features
  setUserTyping: (userId: string, isTyping: boolean) => void;
  typingUsers: string[];
}

const DevHQContext = createContext<DevHQContextType | undefined>(undefined);

// Mock data
const mockUser: DevHQUser = {
  id: 'user-1',
  username: 'Developer',
  avatar: '/images/avatars/default.svg',
  status: 'online'
};

const mockTeamMembers: DevHQUser[] = [
  {
    id: 'user-1',
    username: 'Developer',
    avatar: '/images/avatars/default.svg',
    status: 'online'
  },
  {
    id: 'user-2',
    username: 'TeamLead',
    avatar: '/images/avatars/default.svg',
    status: 'online'
  },
  {
    id: 'ENIC.0',
    username: 'ENIC.0',
    avatar: '/images/enico-icon.png',
    status: 'online'
  },
  {
    id: 'user-3',
    username: 'Designer',
    avatar: '/images/avatars/default.svg',
    status: 'away'
  }
];

const mockMessages: DevHQMessage[] = [
  {
    id: 'msg-1',
    senderId: 'ENIC.0',
    content: 'Welcome to DevHQ Collaborative Workspace! I\'m here to assist with development tasks for the entire team.',
    timestamp: Date.now() - 3600000,
    reactions: { '👋': ['user-2'], '🚀': ['user-1', 'user-3'] },
    type: 'system'
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    content: 'Great! Let\'s work on the new component library together.',
    timestamp: Date.now() - 1800000,
    reactions: { '💯': ['ENIC.0', 'user-1'] },
    type: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    content: 'ENIC.0, can you help us create a shared component for user profiles?',
    timestamp: Date.now() - 900000,
    reactions: { '👍': ['ENIC.0', 'user-2'] },
    type: 'text'
  }
];

export const DevHQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<DevHQUser>(mockUser);
  const [messageList, setMessageList] = useState<DevHQMessage[]>(mockMessages);
  const [threadList, setThreadList] = useState<DevHQThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<{ [key: string]: DevHQMessageStatus }>({});
  const [teamMembers] = useState<DevHQUser[]>(mockTeamMembers);
  const [onlineMembers] = useState<string[]>(['user-1', 'user-2', 'ENIC.0']);
  const [projectId] = useState<string>('eonic-vault-dev');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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

  const setUserTyping = useCallback((userId: string, isTyping: boolean) => {
    setTypingUsers(prev => {
      if (isTyping && !prev.includes(userId)) {
        return [...prev, userId];
      } else if (!isTyping) {
        return prev.filter(id => id !== userId);
      }
      return prev;
    });
  }, []);

  return (
    <DevHQContext.Provider
      value={{
        currentUser,
        messages: messageList,
        threads: threadList,
        activeThread: activeThreadId,
        messageStatuses: statuses,
        projectId,
        teamMembers,
        onlineMembers,
        typingUsers,
        setActiveThread: setActiveThreadId,
        addMessage,
        updateMessageStatus,
        addReaction,
        removeReaction,
        setUserTyping
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

// Alias for compatibility with the new component
export const useDevHQContext = useDevHQ; 