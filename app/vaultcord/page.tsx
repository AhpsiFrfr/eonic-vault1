'use client';

import React, { useState } from 'react';
import VaultChat from '@/components/shared/VaultChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FaHashtag, 
  FaVolumeUp, 
  FaUserFriends, 
  FaCog,
  FaPlus,
  FaLock,
  FaMicrophone
} from 'react-icons/fa';
import { Hash, Volume2, Users, Settings, Plus, Lock, Mic } from 'lucide-react';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  isPrivate: boolean;
  unreadCount?: number;
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

const VaultCord = () => {
  const [activeChannel, setActiveChannel] = useState('general');
  
  // Separate message state for each channel
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>({
    'general': [
      {
        id: '1',
        user: 'Developer',
        content: 'Welcome to the General channel! This is using the new standardized chat UI.',
        timestamp: Date.now() - 3600000,
        type: 'user',
        userId: 'user-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'TeamLead',
        content: 'The new interface looks amazing! Much more consistent across the platform.',
        timestamp: Date.now() - 1800000,
        type: 'user',
        userId: 'user-2',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'ENIC.0',
        content: 'I can assist with questions here! The chat system is now unified across all Vault features.',
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
        user: 'CoreDeveloper',
        content: 'Welcome to the Development channel! Let\'s discuss code, features, and technical issues here.',
        timestamp: Date.now() - 7200000,
        type: 'user',
        userId: 'dev-lead',
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
        content: 'Welcome to the Design channel! Share mockups, UI/UX feedback, and design ideas here.',
        timestamp: Date.now() - 5400000,
        type: 'user',
        userId: 'designer',
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
    ],
    'announcements': [
      {
        id: 'ann1',
        user: 'ProjectManager',
        content: '📢 Welcome to the Announcements channel! Important updates and news will be posted here.',
        timestamp: Date.now() - 10800000,
        type: 'user',
        userId: 'pm-1',
        reactions: {},
        isEdited: false,
        isPinned: true,
        replyCount: 0
      },
      {
        id: 'ann2',
        user: 'ENIC.0',
        content: 'I\'ll help keep you updated with important announcements and system notifications!',
        timestamp: Date.now() - 7200000,
        type: 'assistant',
        userId: 'ENIC.0',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    'private-dev': [
      {
        id: 'priv1',
        user: 'SeniorDev',
        content: '🔒 Welcome to the Private Dev channel! Sensitive development discussions happen here.',
        timestamp: Date.now() - 14400000,
        type: 'user',
        userId: 'senior-dev',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: 'priv2',
        user: 'ENIC.0',
        content: 'I can assist with confidential development matters in this secure channel.',
        timestamp: Date.now() - 10800000,
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
    { id: 'general', name: 'general', type: 'text', isPrivate: false, unreadCount: 0 },
    { id: 'development', name: 'development', type: 'text', isPrivate: false, unreadCount: 3 },
    { id: 'design', name: 'design', type: 'text', isPrivate: false, unreadCount: 1 },
    { id: 'announcements', name: 'announcements', type: 'text', isPrivate: false, unreadCount: 0 },
    { id: 'private-dev', name: 'private-dev', type: 'text', isPrivate: true, unreadCount: 0 },
    { id: 'voice-lounge', name: 'Voice Lounge', type: 'voice', isPrivate: false },
    { id: 'dev-meeting', name: 'Dev Meeting', type: 'voice', isPrivate: false }
  ];

  const users = [
    { id: 'user-1', username: 'Developer', status: 'online' as const },
    { id: 'user-2', username: 'TeamLead', status: 'online' as const },
    { id: 'user-3', username: 'Designer', status: 'away' as const },
    { id: 'user-4', username: 'ProductManager', status: 'online' as const },
    { id: 'ENIC.0', username: 'ENIC.0', status: 'online' as const },
  ];

  const onlineUsers = ['user-1', 'user-2', 'user-4', 'ENIC.0'];

  const handleSendMessage = (content: string, parentId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'Developer',
      content,
      timestamp: Date.now(),
      type: 'user',
      userId: 'user-1',
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
          content: `I'm here to help in the #${activeChannel} channel! This new chat interface is now standardized across the entire Vault platform. What can I assist you with?`,
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
          const userId = 'user-1'; // Current user
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
      case 'development': return 'cyan';
      case 'design': return 'purple';
      case 'announcements': return 'blue';
      case 'private-dev': return 'red';
      default: return 'green';
    }
  };

  const currentChannel = channels.find(c => c.id === activeChannel);
  const accentColor = getChannelAccentColor(activeChannel);

  return (
    <VaultSidebarLayout>
      <div className="h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="flex h-full">
          {/* Server/Channel Sidebar */}
          <div className="w-72 bg-gray-900/50 border-r border-gray-700/50 flex flex-col">
            {/* Server Header */}
            <div className="p-4 border-b border-gray-700/50">
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-300 to-cyan-400 bg-clip-text text-transparent">
                VaultCord
              </h1>
              <p className="text-xs text-gray-400">Unified Communication Platform</p>
      </div>

            {/* Text Channels */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Text Channels</h3>
                <div className="space-y-1">
                  {channels.filter(c => c.type === 'text').map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                        activeChannel === channel.id 
                          ? 'bg-green-600/20 text-green-300' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span>{channel.name}</span>
                        {channel.isPrivate && <Lock className="w-3 h-3" />}
                      </div>
                      {(channel.unreadCount && channel.unreadCount > 0) && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
      </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Voice Channels</h3>
                <div className="space-y-1">
                  {channels.filter(c => c.type === 'voice').map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{channel.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Channel Header */}
            <div className="bg-gray-900/50 border-b border-gray-700/50 p-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">{currentChannel?.name}</h2>
                {currentChannel?.isPrivate && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Private</span>
                  </div>
                )}
              </div>
        </div>

        {/* Chat Content */}
            <div className="flex-1 flex">
              <div className="flex-1 p-6">
                <VaultChat
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  title={`#${currentChannel?.name || 'general'}`}
                  subtitle={currentChannel?.isPrivate ? 'Private Channel' : 'Public Channel'}
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
                  maxHeight="70vh"
                  showUsers={true}
                  users={users}
                  onlineUsers={onlineUsers}
          />
        </div>
            </div>
          </div>
        </div>
      </div>
    </VaultSidebarLayout>
  );
};

export default VaultCord; 