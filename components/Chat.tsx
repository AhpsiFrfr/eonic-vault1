'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { startPresenceHeartbeat } from '../utils/presence';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../utils/supabase';
import { ChatMessage, DirectMessage, MessageAttachment, getMessages, sendMessage, deleteMessage, subscribeToDirectMessages, subscribeToMessages, toggleReaction } from '../utils/supabase';
import { EmojiPicker } from './EmojiPicker';
import { FileUpload } from './FileUpload';
import { MessageContextMenu } from './MessageContextMenu';
import { useEnicBot } from '../hooks/useEnicBot';
import type { ChatMessage as TypesChatMessage } from '../utils/types';
import type { ChatMessage as SupabaseChatMessage } from '../utils/supabase';

// Using the imported DirectMessage interface

interface Props {
  room: string;
  parentId?: string;
  isDM?: boolean;
  recipientAddress?: string;
}

export default function Chat({ room = 'general', parentId, isDM, recipientAddress }: Props) {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: ChatMessage } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateReply, getSuggestions, isProcessing } = useEnicBot();
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async () => {
    try {
      if (isDM && publicKey && recipientAddress) {
        // Query for direct messages between the two users
        const { data: messages, error } = await supabase
          .rpc('get_direct_messages', {
            p_user_address: publicKey.toString(),
            p_recipient_address: recipientAddress
          })
          .select('*, attachments:direct_message_attachments(*)');

        if (error) throw error;

        // Convert DM format to ChatMessage format
        const formattedMessages: ChatMessage[] = (messages || []).map((dm: DirectMessage) => ({
          ...dm,
          room: `dm:${[dm.sender_address, dm.recipient_address].sort().join(':')}`,
          attachments: dm.attachments || []
        }));
        
        setMessages(formattedMessages);
      } else {
        const messages = await getMessages(room, 50, parentId);
        setMessages(messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  }, [room, parentId, isDM, publicKey, recipientAddress]);

  useEffect(() => {
    if (!publicKey) return;
    
    // Start presence heartbeat
    const cleanup = startPresenceHeartbeat(room, publicKey.toString());
    return () => cleanup();
  }, [room, publicKey]);

  useEffect(() => {
    loadMessages();

    // Subscribe to messages and their changes
    let cleanup: () => void;
    
    if (isDM && publicKey && recipientAddress) {
      // For DMs, use the dedicated DM subscription
      const channel = subscribeToDirectMessages(
        publicKey.toString(),
        recipientAddress,
        async (message) => {
          setMessages(prev => {
            const messageIndex = prev.findIndex(m => m.id === message.id);
            if (messageIndex >= 0) {
              // Update existing message
              const newMessages = [...prev];
              newMessages[messageIndex] = {
                ...message,
                room: `dm:${[message.sender_address, message.recipient_address].sort().join(':')}`
              };
              return newMessages;
            } else {
              // Add new message
              return [...prev, {
                ...message,
                room: `dm:${[message.sender_address, message.recipient_address].sort().join(':')}`
              }];
            }
          });
          scrollToBottom();
        }
      );

      cleanup = () => channel.unsubscribe();
    } else {
      // For regular chat rooms
      const channel = subscribeToMessages(room, (message) => {
        if (parentId ? message.parent_id === parentId : !message.parent_id) {
          setMessages((prev) => {
            const messageIndex = prev.findIndex(m => m.id === message.id);
            if (messageIndex >= 0) {
              // Update existing message
              const newMessages = [...prev];
              newMessages[messageIndex] = message;
              return newMessages;
            } else {
              // Add new message
              return [...prev, message];
            }
          });
          scrollToBottom();
        }
      });

      cleanup = () => channel.unsubscribe();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [loadMessages, room, isDM, publicKey, recipientAddress, parentId]);

  useEffect(() => {
    const handleNewMessage = async (message: SupabaseChatMessage) => {
      // Only process messages from other users
      if (message.sender_address === publicKey?.toString() || 
          message.sender_address === 'ENIC_BOT') {
        return;
      }

      // Convert Supabase message format to Types format
      const typedMessage: TypesChatMessage = {
        ...message,
        reactions: message.reactions?.reduce((acc, reaction) => {
          const { emoji, sender_address } = reaction;
          if (!acc[emoji]) acc[emoji] = [];
          acc[emoji].push(sender_address);
          return acc;
        }, {} as Record<string, string[]>),
        attachments: message.attachments?.map(attachment => ({
          ...attachment,
          type: attachment.type.startsWith('image/') ? 'image' : 'file',
          created_at: new Date().toISOString()
        }))
      };

      const response = await generateReply(typedMessage);
      if (response?.suggestions) {
        setSuggestedReplies(response.suggestions);
      }
    };

    // Subscribe to new messages
    const channel = supabase
      .channel('new_message')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room=eq.${room}`,
        },
        (payload) => {
          handleNewMessage(payload.new as SupabaseChatMessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [room, publicKey, generateReply]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !publicKey) return;

    try {
      const { data: message, error } = await sendMessage(
        newMessage,
        publicKey.toString(),
        room,
        replyingTo?.id || parentId,
        attachments
      );
      
      if (error) {
        throw error;
      }
      
      if (message) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        setAttachments([]);
        setReplyingTo(null);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!publicKey) return;

    const result = await toggleReaction(
      messageId,
      publicKey.toString(),
      emoji
    );

    if ('error' in result) {
      console.error('Error toggling reaction:', result.error);
      return;
    }

    // Update messages with new reactions
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, reactions: result }
          : msg
      )
    );
  };

  const handleFileSelect = (files: FileList) => {
    setAttachments(Array.from(files));
  };

  const handleSuggestedReply = async (suggestion: string) => {
    if (!publicKey) return;
    
    try {
      const { data: message, error } = await sendMessage(
        suggestion,
        publicKey.toString(),
        room,
        parentId || undefined,
        []
      );
      
      if (error) throw error;
      
      if (message) {
        setMessages(prev => [...prev, message]);
        setSuggestedReplies([]); // Clear suggestions after use
      }
    } catch (error) {
      console.error('Error sending suggested reply:', error);
    }
  };

  const handleGifSelect = async (gifUrl: string) => {
    if (!publicKey) return;
    
    try {
      const replyContent = `🎬 GIF Reply\n${gifUrl}`;
      const { data: message, error } = await sendMessage(
        replyContent,
        publicKey.toString(),
        room,
        contextMenu?.message.id,
        []
      );
      
      if (error) throw error;
      
      if (message) {
        setMessages(prev => [...prev, message]);
        setContextMenu(null);
      }
    } catch (error) {
      console.error('Error sending GIF reply:', error);
    }
  };

  const handleStickerSelect = async (stickerUrl: string) => {
    if (!publicKey) return;
    
    try {
      const replyContent = `🎭 Sticker\n${stickerUrl}`;
      const { data: message, error } = await sendMessage(
        replyContent,
        publicKey.toString(),
        room,
        contextMenu?.message.id,
        []
      );
      
      if (error) throw error;
      
      if (message) {
        setMessages(prev => [...prev, message]);
        setContextMenu(null);
      }
    } catch (error) {
      console.error('Error sending sticker:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!publicKey) return;

    try {
      const { error } = await deleteMessage(messageId, publicKey.toString());
      
      if (error) {
        console.error('Error deleting message:', error);
        return;
      }

      // Remove the message from the local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender_address === 'ENIC_BOT';
    const isCurrentUser = message.sender_address === publicKey?.toString();
    const smartActionIcon = message.smart_action && {
      rephrase: '🔄',
      summarize: '📝',
      idea: '💡',
      task: '✅',
      translate: '🌐'
    }[message.smart_action];

    // Check if this is a transaction message
    const isTransaction = message.content.startsWith('🧾');

  return (
          <div 
            key={message.id} 
        className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-sm space-y-2">
              <div
                onContextMenu={(e) => handleContextMenu(e, message)}
            className={`rounded-lg p-3 ${
              isTransaction
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : isBot 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                  : isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
            } cursor-pointer`}
              >
                <div className="flex items-center space-x-2 mb-1">
              {isBot ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold">ENIC.0</span>
                  {smartActionIcon && (
                    <span className="text-sm" title={message.smart_action}>
                      {smartActionIcon}
                    </span>
                  )}
                </div>
              ) : (
                  <span className="text-xs opacity-75">
                    {message.sender_address?.slice(0, 4)}...{message.sender_address?.slice(-4)}
                  </span>
              )}
                  <span className="text-xs opacity-75">
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </span>
                </div>

                {message.parent_id && (
                  <div className="text-sm opacity-75 mb-2">
                    Replying to message...
                  </div>
                )}

            <p className={`whitespace-pre-wrap break-words ${
              isTransaction ? 'font-medium' : ''
            }`}>{message.content}</p>

                {message.attachments?.map((attachment: MessageAttachment) => (
                  <div key={attachment.id} className="mt-2">
                    {attachment.type.startsWith('image/') ? (
                      <div className="relative w-full">
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="rounded-lg w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center space-x-2"
                      >
                        📎 <span>{attachment.filename}</span>
                        <span className="text-sm opacity-75">({Math.round(attachment.size / 1024)}KB)</span>
                      </a>
                    )}
                  </div>
                ))}

              {message.reactions && message.reactions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
                    const count = message.reactions?.filter(r => r.emoji === emoji).length || 0;
                    const hasReacted = message.reactions?.some(
                      r => r.emoji === emoji && r.sender_address === publicKey?.toString()
                    );
                    
                    return (
                      <button
                        key={`${message.id}-${emoji}`}
                        onClick={() => handleReaction(message.id, emoji)}
                        className={`px-2 py-0.5 rounded-full text-sm transition-colors ${
                          hasReacted
                            ? 'bg-blue-100 hover:bg-blue-200'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {emoji} {count > 1 && count}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
      </div>
    );
  };

  const handleContextMenu = (e: React.MouseEvent, message: ChatMessage) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message
    });
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {suggestedReplies.length > 0 && (
        <div className="absolute bottom-20 left-0 right-0 p-2 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedReplies.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedReply(suggestion)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="p-4">
          {replyingTo && (
            <div className="mb-2 flex items-center text-sm text-gray-400">
              <span>Replying to: {replyingTo.content.slice(0, 50)}...</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-2 text-gray-500 hover:text-gray-300"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <FileUpload onFileSelect={(files) => setAttachments(Array.from(files))} />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(true)}
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              😊
            </button>
            <button
              type="submit"
              disabled={!publicKey || (!newMessage.trim() && attachments.length === 0)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          onSelect={(emoji) => {
            if (replyingTo) {
              handleReaction(replyingTo.id, emoji);
            }
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          message={contextMenu.message}
          onReply={() => {
            setReplyingTo(contextMenu.message);
            setContextMenu(null);
          }}
          onPin={() => {
            // TODO: Implement pin functionality
            setContextMenu(null);
          }}
          onCopy={() => {
            handleCopyText(contextMenu.message.content);
            setContextMenu(null);
          }}
          onForward={() => {
            // TODO: Implement forward functionality
            setContextMenu(null);
          }}
          onDelete={() => {
            handleDeleteMessage(contextMenu.message.id);
            setContextMenu(null);
          }}
          onSelect={() => {
            // TODO: Implement select functionality
            setContextMenu(null);
          }}
          onReaction={(emoji) => {
            handleReaction(contextMenu.message.id, emoji);
            setContextMenu(null);
          }}
          onGifSelect={handleGifSelect}
          onStickerSelect={handleStickerSelect}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
