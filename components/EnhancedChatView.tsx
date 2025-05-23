'use client';

import { useState, useRef, useEffect } from 'react';
import { useChannels } from '@/context/ChannelContext';
import { Channel } from '@/types/channel';
import { FiHash, FiVolume2, FiSmile, FiPaperclip, FiSend } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    color?: string;
  };
  timestamp: Date;
  channelId: string;
  reactions?: {
    emoji: string;
    count: number;
    reacted: boolean;
  }[];
}

// Mock messages for different channels
const mockMessages: Record<string, Message[]> = {
  'general': [
    {
      id: '1',
      content: 'Welcome to the general channel! This is where we discuss everything.',
      author: {
        name: 'EONIC Bot',
        avatar: '/images/icons/system.png',
        color: '#00FFAA'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      channelId: 'general',
      reactions: [
        { emoji: '👋', count: 5, reacted: true },
        { emoji: '🚀', count: 3, reacted: false },
      ],
    },
    {
      id: '2',
      content: 'The new features are looking great! Really excited about the direction.',
      author: {
        name: 'DevUser',
        avatar: '/images/avatars/default.png',
        color: '#3B82F6'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      channelId: 'general'
    }
  ],
  'dev-chat': [
    {
      id: '3',
      content: 'Just pushed the latest updates to the staging branch. Ready for review!',
      author: {
        name: 'TechLead',
        avatar: '/images/avatars/default.png',
        color: '#F59E0B'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      channelId: 'dev-chat',
      reactions: [
        { emoji: '✅', count: 2, reacted: false },
        { emoji: '🔥', count: 1, reacted: true },
      ],
    },
    {
      id: '4',
      content: 'The performance improvements look solid. Database queries are 40% faster.',
      author: {
        name: 'BackendDev',
        avatar: '/images/avatars/default.png',
        color: '#10B981'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      channelId: 'dev-chat'
    }
  ],
  'announcements': [
    {
      id: '5',
      content: '🎉 EONIC Vault v2.0 is now live! Check out the new features in the dashboard.',
      author: {
        name: 'Admin',
        avatar: '/images/avatars/default.png',
        color: '#EF4444'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      channelId: 'announcements',
      reactions: [
        { emoji: '🎉', count: 12, reacted: true },
        { emoji: '🚀', count: 8, reacted: false },
        { emoji: '❤️', count: 6, reacted: false },
      ],
    }
  ]
};

export function EnhancedChatView() {
  const { channels, activeChannelId } = useChannels();
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const currentMessages = activeChannelId ? messages[activeChannelId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChannelId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      author: {
        name: 'You',
        avatar: '/images/avatars/default.png',
        color: '#8B5CF6'
      },
      timestamp: new Date(),
      channelId: activeChannelId,
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));
    setInputValue('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!activeChannelId) return;

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: prev[activeChannelId]?.map(message => {
        if (message.id !== messageId) return message;

        const reactions = message.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);

        if (existingReaction) {
          if (existingReaction.reacted) {
            // Remove reaction
            existingReaction.count--;
            existingReaction.reacted = false;
            if (existingReaction.count === 0) {
              return {
                ...message,
                reactions: reactions.filter(r => r.emoji !== emoji)
              };
            }
          } else {
            // Add reaction
            existingReaction.count++;
            existingReaction.reacted = true;
          }
          return { ...message, reactions };
        }

        // Add new reaction
        return {
          ...message,
          reactions: [...reactions, { emoji, count: 1, reacted: true }]
        };
      }) || []
    }));
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  if (!activeChannel) {
    return (
      <div className="flex h-full items-center justify-center bg-[#36393f]">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No channel selected</div>
          <div className="text-gray-500 text-sm">Select a channel from the sidebar to start chatting</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#36393f]">
      {/* Channel Header */}
      <div className="flex h-12 items-center border-b border-gray-600 px-4 bg-[#2f3349]">
        <div className="flex items-center gap-2">
          {activeChannel.type === 'text' ? (
            <FiHash className="h-5 w-5 text-gray-400" />
          ) : (
            <FiVolume2 className="h-5 w-5 text-gray-400" />
          )}
          <h3 className="font-semibold text-white">{activeChannel.name}</h3>
          {activeChannel.description && (
            <>
              <div className="w-px h-4 bg-gray-600 mx-2" />
              <span className="text-sm text-gray-400">{activeChannel.description}</span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">
              {activeChannel.type === 'text' ? '💬' : '🎙️'}
            </div>
            <div className="text-white text-xl font-semibold mb-2">
              Welcome to #{activeChannel.name}!
            </div>
            <div className="text-gray-400 text-sm max-w-md">
              {activeChannel.description || `This is the beginning of the ${activeChannel.name} channel.`}
            </div>
          </div>
        ) : (
          <>
            {currentMessages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start gap-3">
                  <img
                    src={message.author.avatar}
                    alt={message.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-semibold text-white"
                        style={{ color: message.author.color }}
                      >
                        {message.author.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-200 break-words">{message.content}</p>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            className={`flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors ${
                              reaction.reacted
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/50'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-transparent'
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                          </button>
                        ))}
                        
                        {/* Add Reaction Button */}
                        <button
                          onClick={() => handleReaction(message.id, '👍')}
                          className="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <FiSmile className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      {activeChannel.type === 'text' && (
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 p-3">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <FiPaperclip className="h-4 w-4" />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message #${activeChannel.name}`}
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 outline-none"
            />
            
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <FiSmile className="h-4 w-4" />
            </button>
            
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 