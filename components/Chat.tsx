'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { startPresenceHeartbeat } from '../utils/presence';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../utils/supabase';
import { ChatMessage, DirectMessage, MessageAttachment, getMessages, sendMessage, deleteMessage, subscribeToDirectMessages, subscribeToMessages, toggleReaction } from '../utils/supabase';
import { EmojiPicker } from './EmojiPicker';
import { FileUpload } from './FileUpload';
import { MessageContextMenu } from './MessageContextMenu';
import { MessageBubble } from './MessageBubble';
import { useEnicBot } from '../hooks/useEnicBot';
import { TypingIndicator } from './TypingIndicator';
import MessageSearch from './MessageSearch';
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
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: ChatMessage } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateReply, getSuggestions, isProcessing } = useEnicBot();
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState<{[key: string]: {typing: boolean, username: string}}>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageCache, setMessageCache] = useState<{[id: string]: ChatMessage}>({});

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const q = query.toLowerCase();
    setFilteredMessages(
      messages.filter(m => 
        (m.content || '').toLowerCase().includes(q) || 
        (m.sender_address || '').toLowerCase().includes(q)
      )
    );
  }, [messages]);

  // Update filtered messages when messages change
  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

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
      const parentMessageId = replyingTo?.id || (activeThread || undefined);
      
      const { data: message, error } = await sendMessage(
        newMessage,
        publicKey.toString(),
        room,
        attachments,
        parentMessageId
      );
      
      if (error) throw error;

      // Update thread counts for the parent message
      if (parentMessageId) {
        await supabase
          .rpc('increment_thread_count', { message_id: parentMessageId });
      }

        setNewMessage('');
        setAttachments([]);
        setReplyingTo(null);
        scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
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
      <div key={message.id} className={`message-container ${isCurrentUser ? 'own-message' : 'other-message'} mb-6`}>
        <MessageBubble
          content={message.content}
          isOwn={isCurrentUser}
          reactions={message.reactions}
          messageId={message.id}
          timestamp={new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
          onReaction={(emoji, event) => handleReaction(message.id, emoji)}
          onReply={() => setReplyingTo(message)}
          onEdit={isCurrentUser ? () => console.log('Edit message', message.id) : undefined}
          onPin={() => console.log('Pin message', message.id)}
          onDelete={isCurrentUser ? () => handleDeleteMessage(message.id) : undefined}
          isEdited={message.edited_at !== null}
          isPinned={false} // TODO: Implement pinned messages
          showBusinessCard={true}
          senderAddress={message.sender_address}
          parentId={message.parent_id}
          parentContent={message.parent_id ? getParentContent(message.parent_id) : undefined}
          replyCount={message.thread_count || 0}
          onViewThread={(id) => loadThread(id)}
        />
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

  // New function to broadcast typing status
  const broadcastTypingStatus = useCallback(async (typing: boolean) => {
    if (!publicKey) return;
    
    const userAddress = publicKey.toString();
    
    try {
      await supabase
        .from('typing_indicators')
        .upsert([
          {
            user_address: userAddress,
            room: room,
            is_typing: typing,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'user_address, room' });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [publicKey, room]);

  // Add effect to handle input change for typing indicator
  useEffect(() => {
    if (!newMessage || !publicKey) return;
    
    setIsTyping(true);
    broadcastTypingStatus(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to clear typing status after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      broadcastTypingStatus(false);
    }, 3000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, publicKey, broadcastTypingStatus]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!publicKey) return;
    
    const channel = supabase
      .channel('typing_indicators')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `room=eq.${room}`
        },
        (payload) => {
          const data = payload.new;
          // Don't show current user's typing status
          if (data.user_address === publicKey.toString()) return;
          
          setUsersTyping(prev => ({
            ...prev,
            [data.user_address]: {
              typing: data.is_typing,
              username: data.user_address.slice(0, 6) + '...'
            }
          }));
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [room, publicKey]);

  // Load messages in a thread
  const loadThread = useCallback(async (messageId: string) => {
    try {
      if (!messageId) return;
      
      // If we're already looking at a thread, go back to main view
      if (activeThread === messageId) {
        setActiveThread(null);
        return loadMessages();
      }
      
      // First, get the parent message if not in cache
      if (!messageCache[messageId]) {
        const { data: parentMessage, error: parentError } = await supabase
          .from('messages')
          .select('*, reactions:message_reactions(*), attachments:message_attachments(*)')
          .eq('id', messageId)
          .single();
          
        if (parentError) throw parentError;
        
        // Add to cache
        if (parentMessage) {
          setMessageCache(prev => ({
            ...prev,
            [messageId]: parentMessage
          }));
        }
      }
      
      // Then get all replies to this message
      const { data: threadMessages, error: threadError } = await supabase
        .from('messages')
        .select('*, reactions:message_reactions(*), attachments:message_attachments(*)')
        .eq('parent_id', messageId)
        .order('created_at', { ascending: true });
        
      if (threadError) throw threadError;
      
      // Combine parent message with replies
      const allThreadMessages = [
        messageCache[messageId] || {}, 
        ...(threadMessages || [])
      ].filter(m => m && m.id);
      
      setMessages(allThreadMessages as ChatMessage[]);
      setActiveThread(messageId);
      
    } catch (error) {
      console.error('Error loading thread:', error);
    }
  }, [activeThread, messageCache, loadMessages]);

  // Get parent message content
  const getParentContent = useCallback((parentId: string) => {
    // Check the cache first
    if (messageCache[parentId]) {
      return messageCache[parentId].content;
    }
    
    // If not in cache, return a placeholder and fetch it
    fetchParentMessage(parentId);
    return "Loading...";
  }, [messageCache]);
  
  const fetchParentMessage = useCallback(async (parentId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content')
        .eq('id', parentId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setMessageCache(prev => ({
          ...prev,
          [parentId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching parent message:', error);
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative">
      {activeThread && (
        <div className="bg-gray-800 p-2 flex items-center text-sm">
          <button 
            onClick={() => {
              setActiveThread(null);
              loadMessages();
            }}
            className="hover:bg-gray-700 rounded px-2 py-1 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to messages
          </button>
          <span className="ml-2 text-gray-400">Viewing thread</span>
        </div>
      )}
      
      {/* Add message search at the top */}
      <MessageSearch onSearch={handleSearch} />
      
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {filteredMessages.map(renderMessage)}
        
        {/* Typing indicators */}
        {Object.values(usersTyping)
          .filter(user => user.typing)
          .map(user => (
            <TypingIndicator key={user.username} user={user.username} />
          ))}
          
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
          {activeThread && !replyingTo && (
            <div className="mb-2 text-sm text-gray-400">
              Replying in thread
            </div>
          )}
          <div className="flex items-center space-x-2">
            <FileUpload onFileSelect={(files) => setAttachments(Array.from(files))} />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={activeThread ? "Reply in thread..." : "Type a message..."}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={() => {
                setIsTyping(false);
                broadcastTypingStatus(false);
              }}
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
