'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { startPresenceHeartbeat } from '../utils/presence';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../utils/supabase';
import { ChatMessage, DirectMessage, MessageAttachment, getMessages, sendMessage, subscribeToDirectMessages, subscribeToMessages, toggleReaction } from '../utils/supabase';
import { EmojiPicker } from './EmojiPicker';
import { FileUpload } from './FileUpload';
import { MessageContextMenu } from './MessageContextMenu';

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

  const renderAttachment = (attachment: MessageAttachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <img
          src={attachment.url}
          alt={attachment.filename}
          className="max-w-sm rounded-lg shadow-md"
        />
      );
    }
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{attachment.filename}</span>
        <span className="text-sm text-gray-500">({Math.round(attachment.size / 1024)}KB)</span>
      </a>
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
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender_address === publicKey?.toString() ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-sm space-y-2">
              <div
                onContextMenu={(e) => handleContextMenu(e, message)}
                className={`rounded-lg p-3 ${message.sender_address === publicKey?.toString() ? 'bg-blue-500 text-white' : 'bg-white'} cursor-pointer`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs opacity-75">
                    {message.sender_address?.slice(0, 4)}...{message.sender_address?.slice(-4)}
                  </span>
                  <span className="text-xs opacity-75">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.parent_id && (
                  <div className="text-sm opacity-75 mb-2">
                    Replying to message...
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words">{message.content}</p>

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
              </div>

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
        ))}
        <div ref={messagesEndRef} />
      </div>

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
            // TODO: Implement delete functionality
            setContextMenu(null);
          }}
          onSelect={() => {
            // TODO: Implement select functionality
            setContextMenu(null);
          }}
          onAddReaction={() => {
            setShowEmojiPicker(true);
            setReplyingTo(contextMenu.message);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
