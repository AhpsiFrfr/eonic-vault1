'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevHQContext } from '@/context/DevHQContext';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { 
  FaBrain, 
  FaUsers, 
  FaCode, 
  FaRocket, 
  FaComments, 
  FaClock,
  FaCircle,
  FaPaperPlane,
  FaRobot
} from 'react-icons/fa';
import { Bot, Users, MessageSquare, Zap, Clock, Send } from 'lucide-react';
import VaultChat from '../../../components/shared/VaultChat';

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

const DevEonDevHQ = () => {
  const { projectId, currentUser, teamMembers, onlineMembers } = useDevHQContext();
  const { messages: hookMessages, sendPrompt, loading } = useRealtimeChat(projectId, 'dev-eon');
  const { messages: teamMessages, sendMessage: sendChatMessage } = useRealtimeChat(projectId, 'team-chat');
  const [input, setInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Developer',
      content: 'Welcome to DEV-EON Collaborative Workspace! This is using the standardized VaultChat interface.',
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
      user: 'ENIC.0',
      content: 'I\'m your collaborative AI assistant! This workspace now has complete chat functionality including reactions, threading, and all advanced features.',
      timestamp: Date.now() - 1800000,
      type: 'assistant',
      userId: 'ENIC.0',
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const teamChatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  useEffect(() => {
    teamChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages]);

  const handlePromptSubmit = async () => {
    if (!input.trim() || loading) return;
    await sendPrompt(input, currentUser);
    setInput('');
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput, currentUser);
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'prompt' | 'chat') => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (type === 'prompt') {
        handlePromptSubmit();
      } else {
        handleChatSubmit();
      }
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <FaRobot className="w-4 h-4 text-purple-400" />;
      case 'assistant':
        return <Bot className="w-4 h-4 text-cyan-400" />;
      default:
        return <FaUsers className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleSendMessage = async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: 'Developer',
      content: content,
      timestamp: Date.now(),
      type: 'user',
      userId: 'current-user',
      parentId,
      parentContent: parentId ? localMessages.find(m => m.id === parentId)?.content : undefined,
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    };

    setLocalMessages(prev => [...prev, userMessage]);
    sendPrompt(content, currentUser);

    // ENIC.0 response simulation
    if (content.toLowerCase().includes('enic') || content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const enicResponse: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          user: 'ENIC.0',
          content: 'I\'m your collaborative AI assistant! This workspace now has complete chat functionality including reactions, threading, and all advanced features.',
          timestamp: Date.now(),
          type: 'assistant',
          userId: 'ENIC.0',
          reactions: {},
          isEdited: false,
          isPinned: false,
          replyCount: 0
        };
        setLocalMessages(prev => [...prev, enicResponse]);
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setLocalMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        const userId = 'current-user'; // Current user
        if (reactions[emoji] && reactions[emoji].includes(userId)) {
          reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          reactions[emoji] = [...(reactions[emoji] || []), userId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setLocalMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
  };

  const handleDelete = (messageId: string) => {
    setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handlePin = (messageId: string) => {
    setLocalMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isPinned: !msg.isPinned };
      }
      return { ...msg, isPinned: false }; // Only one pinned message
    }));
  };

  const handleViewThread = (messageId: string) => {
    console.log('View thread for message:', messageId);
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Add file message to chat
    const fileMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: 'Developer',
      content: `📁 Uploaded file: ${file.name}`,
      timestamp: Date.now(),
      type: 'user',
      userId: 'current-user',
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    };
    setLocalMessages(prev => [...prev, fileMessage]);
  };

  // Convert team messages to display format
  const formatTeamMessages = (messages: any[]) => {
    return messages.map((msg: any) => ({
      id: msg.id,
      user: msg.user,
      content: msg.content || msg.message,
      timestamp: new Date(msg.timestamp).getTime()
    }));
  };

  const formattedTeamMessages = formatTeamMessages(teamMessages);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6 space-y-6">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-pulse">
              <FaBrain className="text-white text-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              DEV-EON – DevHQ Collaborative Workspace
            </h1>
            <p className="text-sm text-gray-400">Project: {projectId} • Team collaboration enabled</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main DEV-EON Chat Area */}
        <div className="lg:col-span-3 space-y-6">
          <VaultChat
            messages={localMessages}
            onSendMessage={handleSendMessage}
            title="DEV-EON Collaborative Assistant"
            subtitle="AI-powered development workspace"
            placeholder="Ask DEV-EON to build, fix, or explain something for the whole team..."
            accentColor="cyan"
            headerIcon={<FaRobot className="w-5 h-5" />}
            maxHeight="60vh"
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
            loading={loading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Status */}
          <Card variant="outlined">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <FaUsers className="w-4 h-4" />
                Team Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const isOnline = onlineMembers.includes(member.id);
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xs">
                          {member.username === 'ENIC.0' ? '🤖' : member.username.slice(0, 2).toUpperCase()}
                        </div>
                        <FaCircle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                          isOnline ? 'text-green-500' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{member.username}</div>
                        <div className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                          {isOnline ? 'Online' : 'Away'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Chat */}
          <Card variant="outlined" className="h-[50vh] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <MessageSquare className="w-4 h-4" />
                Team Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {formattedTeamMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium text-cyan-300">{msg.user}</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-200 bg-gray-800/30 p-2 rounded">
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={teamChatEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'chat')}
                  placeholder="Share idea with team..."
                  variant="glow"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChatSubmit}
                  disabled={!chatInput.trim()}
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-3">
        <p>DEV-EON DevHQ Edition • Real-time collaboration enabled • ENIC.0 powered</p>
      </div>
    </div>
  );
};

export default DevEonDevHQ; 