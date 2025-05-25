'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDM } from '../../context/DMContext';
import { MessageBubble } from '../MessageBubble';
import { useEnicBot } from '../../hooks/useEnicBot';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  Info, 
  Search,
  MoreVertical,
  Zap,
  Shield,
  Heart
} from 'lucide-react';

interface DirectMessageProps {
  className?: string;
}

export function DirectMessage({ className }: DirectMessageProps) {
  const { publicKey } = useWallet();
  const { 
    activeThread, 
    activeMessages, 
    sendMessage, 
    deleteMessage, 
    getUserInfo, 
    typingUsers,
    setTyping 
  } = useDM();
  
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { generateReply, getSuggestions, isProcessing } = useEnicBot();

  // Get participant info
  const participantAddress = activeThread?.replace('dm:', '').split(':')
    .find(addr => addr !== publicKey?.toString());
  const participantInfo = participantAddress ? getUserInfo(participantAddress) : null;

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, scrollToBottom]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (!participantAddress) return;
    
    if (!isTyping) {
      setIsTyping(true);
      setTyping(participantAddress, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(participantAddress, false);
    }, 1000);
  }, [participantAddress, isTyping, setTyping]);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    handleTyping();
  };

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !participantAddress) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      await sendMessage(content, participantAddress, replyingTo || undefined);
      setReplyingTo(null);

      // Get ENIC.0 suggestions for future replies
      if (content.toLowerCase().includes('@enic') || content.startsWith('/')) {
        const suggestions = await getSuggestions(content);
        
        if (suggestions) {
          setSuggestedReplies(suggestions);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle message reaction
  const handleReaction = async (messageId: string, emoji: string) => {
    // TODO: Implement message reactions for DMs
    console.log('React to message:', messageId, emoji);
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Handle ENIC.0 slash commands
  const handleSlashCommand = async (command: string) => {
    if (!participantAddress) return;

    let response = '';
    
    switch (command.toLowerCase()) {
      case '/summarize':
        response = '🤖 ENIC.0: Here\'s a summary of your conversation...';
        break;
      case '/clear':
        setMessageInput('');
        return;
      case '/help':
        response = '🤖 ENIC.0: Available commands: /summarize, /clear, /help, /suggest';
        break;
      case '/suggest':
        const suggestions = await getSuggestions('Generate suggestions');
        setSuggestedReplies(suggestions || []);
        return;
      default:
        response = '🤖 ENIC.0: Unknown command. Type /help for available commands.';
    }

    try {
      await sendMessage(response, participantAddress);
    } catch (error) {
      console.error('Error sending ENIC.0 response:', error);
    }
  };

  // Check for slash commands when input changes
  useEffect(() => {
    if (messageInput.startsWith('/') && messageInput.includes(' ')) {
      const command = messageInput.split(' ')[0];
      handleSlashCommand(command);
      setMessageInput('');
    }
  }, [messageInput]);

  if (!activeThread) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-obsidian text-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <Heart className="w-16 h-16 text-egyptian-glow mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Select a conversation</h2>
          <p className="text-gray-400">
            Choose an existing conversation or start a new one to begin messaging.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-obsidian ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-marble-deep/30 bg-marble-deep/10"
      >
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center">
              <span className="text-white font-bold">
                {participantInfo?.name?.charAt(0) || '?'}
              </span>
            </div>
            {participantInfo?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-obsidian" />
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-white font-semibold">
              {participantInfo?.name || 'Unknown User'}
            </h3>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`${participantInfo?.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                {participantInfo?.isOnline ? 'Online' : 'Offline'}
              </span>
              {participantInfo?.xpLevel && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-egyptian-glow">LVL {participantInfo.xpLevel}</span>
                </>
              )}
              {participantInfo?.timepiece && (
                <Zap className="w-3 h-3 text-egyptian-glow" />
              )}
            </div>
          </div>

          {/* Encryption Status */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-green-900/20 rounded-full">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs font-medium">Encrypted</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <Video className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {activeMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <MessageBubble
                content={message.content}
                isOwn={message.sender_address === publicKey?.toString()}
                reactions={[]} // TODO: Implement DM reactions
                messageId={message.id}
                timestamp={new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                onReaction={(emoji, event) => handleReaction(message.id, emoji)}
                onReply={() => setReplyingTo(message.id)}
                onEdit={message.sender_address === publicKey?.toString() ? () => console.log('Edit') : undefined}
                onDelete={message.sender_address === publicKey?.toString() ? () => handleDeleteMessage(message.id) : undefined}
                isEdited={false}
                isPinned={false}
                senderAddress={message.sender_address}
                parentId={message.parent_id}
                replyCount={message.thread_count || 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {participantAddress && typingUsers[participantAddress] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-gray-400"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-egyptian-glow rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-egyptian-glow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-egyptian-glow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-sm">{participantInfo?.name} is typing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Replies */}
      <AnimatePresence>
        {suggestedReplies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 border-t border-marble-deep/30"
          >
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 mb-1">ENIC.0 Suggestions:</span>
              {suggestedReplies.slice(0, 3).map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMessageInput(suggestion)}
                  className="px-3 py-1 bg-egyptian-base/20 hover:bg-egyptian-base/30 border border-egyptian-glow/30 rounded-full text-egyptian-glow text-xs transition-all"
                >
                  {suggestion.slice(0, 40)}...
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-4 border-t border-marble-deep/30">
        {/* Reply Preview */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 bg-marble-deep/20 rounded-lg border-l-4 border-egyptian-glow"
            >
              <div className="flex items-center justify-between">
                <span className="text-egyptian-glow text-sm font-medium">Replying to message</span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-3">
          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (Use / for ENIC.0 commands)"
              className="w-full bg-marble-deep/20 border border-marble-deep/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-egyptian-glow/50 focus:ring-1 focus:ring-egyptian-glow/30 transition-colors"
            />
            
            {/* Slash Command Indicator */}
            {messageInput.startsWith('/') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Zap className="w-4 h-4 text-egyptian-glow animate-pulse" />
              </div>
            )}
          </div>

          {/* Emoji Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          >
            <Smile className="w-5 h-5" />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isProcessing}
            className={`p-2 rounded-lg transition-all ${
              messageInput.trim() && !isProcessing
                ? 'bg-egyptian-base hover:bg-egyptian-glow text-white shadow-glow-blue'
                : 'bg-marble-deep/20 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
} 