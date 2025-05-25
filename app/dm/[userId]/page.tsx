'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDM } from '../../../context/DMContext';
import { DMList } from '../../../components/dm/DMList';
import VaultChat from '../../../components/shared/VaultChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

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
  attachments?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
}

export default function DMPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const { startDM, activeThread, activeMessages, sendMessage, getUserInfo } = useDM();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (userId) {
      startDM(userId);
    }
  }, [userId, startDM]);

  // Convert DM messages to VaultChat format
  useEffect(() => {
    if (activeMessages) {
      const formattedMessages = activeMessages.map(msg => ({
        id: msg.id,
        user: msg.sender_address?.slice(0, 8) + '...' || 'User',
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        type: msg.sender_address === 'ENIC.0' ? 'assistant' as const : 'user' as const,
        userId: msg.sender_address || 'unknown',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: msg.thread_count || 0
      }));
      setMessages(formattedMessages);
    }
  }, [activeMessages]);

  const handleSendMessage = async (content: string, parentId?: string) => {
    if (!userId) return;
    try {
      await sendMessage(content, userId, parentId);
    } catch (error) {
      console.error('Error sending DM:', error);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        const userWallet = 'current-user'; // Replace with actual wallet address
        if (reactions[emoji] && reactions[emoji].includes(userWallet)) {
          reactions[emoji] = reactions[emoji].filter(id => id !== userWallet);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          reactions[emoji] = [...(reactions[emoji] || []), userWallet];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handlePin = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isPinned: !msg.isPinned };
      }
      return { ...msg, isPinned: false }; // Only one pinned message
    }));
  };

  const handleViewThread = (messageId: string) => {
    console.log('View thread for message:', messageId);
    // Navigate to thread view
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Handle file upload
  };

  const participantInfo = userId ? getUserInfo(userId) : null;
  const participantName = participantInfo?.name || `${userId.slice(0, 8)}...`;

  return (
    <div className="h-screen flex bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Direct Messages</h2>
        </div>
        <DMList />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {userId ? (
          <div className="flex-1 p-6">
            <VaultChat
              messages={messages}
              onSendMessage={handleSendMessage}
              title={`${participantName}`}
              subtitle="Direct Message"
              placeholder={`Message ${participantName}...`}
              accentColor="purple"
              headerIcon={<Users className="w-5 h-5" />}
              maxHeight="80vh"
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
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card variant="glow" className="max-w-md">
              <CardContent className="text-center p-8">
                <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Select a Conversation</h2>
                <p className="text-gray-400">Choose a contact from the sidebar to start messaging</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 