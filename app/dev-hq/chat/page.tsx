'use client';

import React, { useState } from 'react';
import VaultChat from '@/components/shared/VaultChat';
import DevHQVoiceLounge from '../components/DevHQVoiceLounge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Hash, Users, Volume2, Settings, Plus } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  type: 'user' | 'assistant' | 'system';
  userId: string;
  reactions?: Record<string, string[]>;
  isEdited?: boolean;
  isPinned?: boolean;
  parentId?: string;
  parentContent?: string;
  replyCount?: number;
}

export default function DevVaultChatPage() {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState('general');
  
  // Separate message state for each channel
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>({
    'general': [
      {
        id: '1',
        user: 'Developer',
        content: 'Welcome to the General channel! This is now using the standardized VaultChat interface.',
        timestamp: Date.now() - 3600000,
        type: 'user',
        userId: 'dev-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'TeamLead',
        content: 'Great work on the unified chat system! Much more consistent.',
        timestamp: Date.now() - 1800000,
        type: 'user',
        userId: 'dev-2',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'ENIC.0',
        content: 'I can assist with development questions here as well! Each channel now has its own conversation.',
        timestamp: Date.now() - 900000,
        type: 'assistant',
        userId: 'ENIC.0',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    'development': [
      {
        id: 'dev1',
        user: 'CoreDev',
        content: 'Welcome to the Development channel! Let\'s discuss code, bugs, and features here.',
        timestamp: Date.now() - 7200000,
        type: 'user',
        userId: 'dev-core',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: 'dev2',
        user: 'ENIC.0',
        content: 'I can help with code reviews, debugging, and development best practices in this channel!',
        timestamp: Date.now() - 3600000,
        type: 'assistant',
        userId: 'ENIC.0',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    'design': [
      {
        id: 'design1',
        user: 'UIDesigner',
        content: 'Welcome to the Design channel! Share UI/UX ideas, mockups, and design feedback here.',
        timestamp: Date.now() - 5400000,
        type: 'user',
        userId: 'designer-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: 'design2',
        user: 'ENIC.0',
        content: 'I can provide design suggestions and help evaluate user experience patterns!',
        timestamp: Date.now() - 2700000,
        type: 'assistant',
        userId: 'ENIC.0',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ]
  });

  // Get current channel messages
  const currentMessages = channelMessages[activeChannel] || [];

  const channels: Channel[] = [
    { id: 'general', name: 'general', type: 'text', description: 'General discussion' },
    { id: 'development', name: 'development', type: 'text', description: 'Dev-related topics' },
    { id: 'design', name: 'design', type: 'text', description: 'UI/UX discussions' },
    { id: 'voice-lounge', name: 'Voice Lounge', type: 'voice', description: 'Casual voice chat' }
  ];

  const users = [
    { id: 'dev-1', username: 'Developer', status: 'online' as const },
    { id: 'dev-2', username: 'TeamLead', status: 'online' as const },
    { id: 'dev-3', username: 'Designer', status: 'away' as const },
    { id: 'ENIC.0', username: 'ENIC.0', status: 'online' as const },
  ];

  const onlineUsers = ['dev-1', 'dev-2', 'ENIC.0'];

  const handleSendMessage = (content: string, parentId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'Developer',
      content,
      timestamp: Date.now(),
      type: 'user',
      userId: 'dev-1',
      parentId,
      parentContent: parentId ? currentMessages.find(m => m.id === parentId)?.content : undefined,
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    };
    
    // Update messages for the current channel only
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    // Simulate ENIC.0 response for demo
    if (content.toLowerCase().includes('enic') || content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: 'ENIC.0',
          content: `I'm here to help with development in the ${activeChannel} channel! This unified chat interface is now used across the entire Vault platform.`,
          timestamp: Date.now(),
          type: 'assistant',
          userId: 'ENIC.0',
          reactions: {},
          isEdited: false,
          isPinned: false,
          replyCount: 0
        };
        setChannelMessages(prev => ({
          ...prev,
          [activeChannel]: [...(prev[activeChannel] || []), aiResponse]
        }));
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          const userId = 'dev-1'; // Current user
          if (reactions[emoji] && reactions[emoji].includes(userId)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== userId);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji] = [...(reactions[emoji] || []), userId];
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    }));
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    }));
  };

  const handleDelete = (messageId: string) => {
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).filter(msg => msg.id !== messageId)
    }));
  };

  const handlePin = (messageId: string) => {
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isPinned: !msg.isPinned };
        }
        return { ...msg, isPinned: false }; // Only one pinned per channel
      })
    }));
  };

  const handleViewThread = (messageId: string) => {
    console.log('View thread for message:', messageId);
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  const getChannelAccentColor = (channelId: string) => {
    switch (channelId) {
      case 'development': return 'green';
      case 'design': return 'purple';
      default: return 'blue';
    }
  };

  const currentChannel = channels.find(c => c.id === activeChannel);
  const accentColor = getChannelAccentColor(activeChannel);

  return (
    <div className="h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="flex h-full">
        {/* Channel Sidebar */}
        <div className="w-64 bg-gray-900/50 border-r border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="text-lg font-bold">Dev HQ Channels</h2>
          </div>
          <div className="p-2">
            {channels.map((channel) => {
              // Show unread count for non-active channels with messages
              const hasMessages = channelMessages[channel.id]?.length > 0;
              const isActive = activeChannel === channel.id;
              const unreadCount = !isActive && hasMessages ? channelMessages[channel.id]?.length : 0;
              
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                    activeChannel === channel.id 
                      ? 'bg-blue-600/20 text-blue-300' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span className="flex-1">{channel.name}</span>
                    {channel.type === 'voice' && <Volume2 className="w-3 h-3" />}
                    {unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {channel.description && (
                    <div className="text-xs text-gray-500 mt-1">{channel.description}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="bg-gray-900/50 border-b border-gray-700/50 p-4">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold">{currentChannel?.name}</h2>
              {currentChannel?.description && (
                <div className="text-sm text-gray-400">
                  {currentChannel.description}
                </div>
              )}
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex">
            <div className="flex-1 p-6">
              {activeChannel === 'voice-lounge' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-glow mb-2">🎙️ Voice Lounge</h2>
                    <p className="text-muted-foreground">Join the voice chat for real-time collaboration</p>
                  </div>
                  <DevHQVoiceLounge />
                </div>
              ) : (
                <VaultChat
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  title={`#${currentChannel?.name || 'general'}`}
                  subtitle={currentChannel?.description}
                  placeholder={`Message #${currentChannel?.name || 'general'}`}
                  accentColor={accentColor}
                  headerIcon={<Hash className="w-5 h-5" />}
                  enableReactions={true}
                  onReaction={handleReaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPin={handlePin}
                  onViewThread={handleViewThread}
                  enableFileUpload={true}
                  onFileUpload={handleFileUpload}
                  enableGifPicker={true}
                  onGifSelect={(gifUrl) => {
                    console.log('GIF selected:', gifUrl);
                  }}
                  maxHeight="65vh"
                />
              )}
            </div>

            {/* Users Sidebar */}
            <div className="w-64 bg-gray-900/50 border-l border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xs">
                        {user.username === 'ENIC.0' ? '🤖' : user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
                        onlineUsers.includes(user.id) ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className={`text-xs ${
                        onlineUsers.includes(user.id) ? 'text-green-400' : 'text-gray-500'
                      }`}>
                        {user.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 