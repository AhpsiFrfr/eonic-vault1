import React, { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';
import { messagingAPI } from '../utils/placeholders';
import { MessageThread } from './MessageThread';
import { MessageInput } from './MessageInput';
import { useMessages } from '../hooks/useMessages';

type TypingUser = {
  address: string;
  timestamp: number;
};

const TYPING_TIMEOUT = 3000; // 3 seconds

interface Props {
  chatId: string;
  currentUserAddress?: string;
  className?: string;
}

export const ChatWindow: React.FC<Props> = ({ 
  chatId,
  currentUserAddress,
  className = ''
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const { 
    messages, 
    sendMessage, 
    toggleReaction,
    loading,
    error 
  } = useMessages(chatId);

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const handleSendMessage = async (content: string, attachments: File[]) => {
    await sendMessage(content, attachments);
    setReplyingTo(null);
  };

  const handleTyping = useCallback(() => {
    if (!currentUserAddress) return;

    const now = Date.now();
    setTypingUsers(prev => {
      // Remove expired typing indicators
      const active = prev.filter(user => 
        now - user.timestamp < TYPING_TIMEOUT && user.address !== currentUserAddress
      );
      
      // Add current user's typing indicator
      return [...active, { address: currentUserAddress, timestamp: now }];
    });
  }, [currentUserAddress]);

  // Clean up expired typing indicators
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(user => now - user.timestamp < TYPING_TIMEOUT)
      );
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // Update typing status
  useEffect(() => {
    setIsTyping(typingUsers.length > 0);
  }, [typingUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading messages
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {replyingTo && (
        <div className="p-2 bg-gray-100 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Replying to:</span>
            <span className="text-sm font-medium truncate max-w-md">
              {replyingTo.content}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-500 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
      <MessageThread
        messages={messages}
        isTyping={isTyping}
        onReactionClick={toggleReaction}
        onReply={setReplyingTo}
        currentUserAddress={currentUserAddress}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!currentUserAddress}
        placeholder={currentUserAddress ? 'Type a message...' : 'Connect wallet to chat'}
      />
    </div>
  );
};
