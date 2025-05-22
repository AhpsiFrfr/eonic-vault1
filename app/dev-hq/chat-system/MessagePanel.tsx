// @dev-vault-component
'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useUser } from '@/lib/hooks/useUser';
import MessageInput from './MessageInput';

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

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Just deployed the new feature to staging 🚀',
    sender: {
      id: '1',
      name: 'DevLead',
      avatar: '/images/avatars/default.svg'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    reactions: [
      { emoji: '🚀', count: 3, userReacted: true },
      { emoji: '👍', count: 2, userReacted: false }
    ]
  },
  {
    id: '2',
    content: 'Great work! The performance improvements are noticeable.',
    sender: {
      id: '2',
      name: 'QAEngineer',
      avatar: '/images/avatars/default.svg'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    reactions: [
      { emoji: '💯', count: 1, userReacted: false }
    ]
  }
];

const MessagePanel: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (content: string) => {
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

    setMessages([...messages, newMessage]);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id !== messageId) return message;

      const reactions = message.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        if (existingReaction.userReacted) {
          // Remove reaction
          existingReaction.count--;
          existingReaction.userReacted = false;
        } else {
          // Add reaction
          existingReaction.count++;
          existingReaction.userReacted = true;
        }
        return { ...message, reactions };
      }

      // Add new reaction
      return {
        ...message,
        reactions: [...reactions, { emoji, count: 1, userReacted: true }]
      };
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Channel header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white"># general</h2>
        <p className="text-sm text-gray-400">Main development discussion</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group flex items-start space-x-3 hover:bg-gray-900/50 p-2 rounded-lg">
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{message.sender.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-200 mt-1">{message.content}</p>
              
              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                        reaction.userReacted
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-800">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default MessagePanel; 