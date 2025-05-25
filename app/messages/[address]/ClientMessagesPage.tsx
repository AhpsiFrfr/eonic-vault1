'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import VaultChat from '../../../components/shared/VaultChat';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

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

interface ClientMessagesPageProps {
  address: string;
}

export default function ClientMessagesPage({ address }: ClientMessagesPageProps) {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'You',
      content: 'Hello! Starting a conversation with this wallet address.',
      timestamp: Date.now() - 3600000,
      type: 'user',
      userId: publicKey?.toString() || 'current-user',
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    },
    {
      id: '2',
      user: address.slice(0, 8) + '...',
      content: 'Hey there! Thanks for reaching out.',
      timestamp: Date.now() - 1800000,
      type: 'user',
      userId: address,
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    },
    {
      id: '3',
      user: 'ENIC.0',
      content: 'I can facilitate this conversation and provide assistance if needed!',
      timestamp: Date.now() - 900000,
      type: 'assistant',
      userId: 'ENIC.0',
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    }
  ]);

  const handleSendMessage = (content: string, parentId?: string) => {
    if (!publicKey) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      content,
      timestamp: Date.now(),
      type: 'user',
      userId: publicKey.toString(),
      parentId,
      parentContent: parentId ? messages.find(m => m.id === parentId)?.content : undefined,
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate response from the other user or ENIC.0
    if (content.toLowerCase().includes('enic') || content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: 'ENIC.0',
          content: 'I\'m here to help with your conversation! This unified chat interface now has all advanced features.',
          timestamp: Date.now(),
          type: 'assistant',
          userId: 'ENIC.0',
          reactions: {},
          isEdited: false,
          isPinned: false,
          replyCount: 0
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        const userWallet = publicKey?.toString() || 'current-user';
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
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <Card variant="glow">
          <CardContent className="text-center p-8">
            <MessageSquare className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
            <p className="text-gray-400">Please connect your wallet to start messaging</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      <VaultChat
        messages={messages}
        onSendMessage={handleSendMessage}
        title={`Message ${address.slice(0, 8)}...${address.slice(-4)}`}
        subtitle="Wallet-to-Wallet Communication"
        placeholder={`Message ${address.slice(0, 8)}...`}
        accentColor="cyan"
        headerIcon={<MessageSquare className="w-5 h-5" />}
        maxHeight="85vh"
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
  );
} 