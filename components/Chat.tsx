'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage, MessageReaction } from '../utils/supabase';
import UserProfile from './UserProfile';
import { ArrowUturnLeftIcon, FaceSmileIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import ProfileSettings from './ProfileSettings';

type MessageAttachment = {
  url: string;
  type: 'image' | 'file';
  filename: string;
  size: number;
};

const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface ChatProps {
  walletAddress: string;
  room: string;
  threadId?: string;
}

type MessageAction = 'reply' | 'pin' | 'copy' | 'forward' | 'delete' | 'select';

interface MessageContextMenu {
  messageId: string | null;
  position: { x: number; y: number } | null;
}

const commonReactions = ['❤️', '😤', '🙈', '🌭', '🔥', '👍'];

export default function Chat({ walletAddress, room, threadId }: ChatProps) {
  if (!walletAddress) return null;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [contextMenu, setContextMenu] = useState<MessageContextMenu>({ messageId: null, position: null });
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [threadMessage, setThreadMessage] = useState<ChatMessage | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastTypedRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          attachments:message_attachments(*),
          reactions:message_reactions(*),
          user_profile:user_profiles!user_profiles_user_address_fkey(*),
          reply_count:messages!thread_id(count)
        `)
        .eq('room', room)
        .eq('thread_id', threadId || null)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleNewMessage = (payload: any) => {
    const newMessage = payload.new;
    setMessages(messages => [...messages, newMessage]);
    scrollToBottom();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      // Insert message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_address: walletAddress,
          room: room || 'general',
          thread_id: threadId || replyTo?.id || null
        })
        .select(`
          *,
          attachments:message_attachments(*),
          reactions:message_reactions(*),
          user_profile:user_profiles!user_profiles_user_address_fkey(*)
        `)
        .single();

      if (messageError) {
        console.error('Error sending message:', messageError);
        return;
      }

      // Insert attachments if any
      if (message && attachments.length > 0) {
        const { error: attachmentsError } = await supabase
          .from('message_attachments')
          .insert(
            attachments.map(file => ({
              message_id: message.id,
              type: file.type,
              url: file.url,
              filename: file.filename,
              size: file.size
            }))
          );

        if (attachmentsError) {
          console.error('Error adding attachments:', attachmentsError);
          return;
        }
      }

      // Create user profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_address: walletAddress,
          display_name: walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4),
          status: 'online',
          last_seen: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      setNewMessage('');
      setAttachments([]);
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          attachments:message_attachments(*),
          reactions:message_reactions(*),
          user_profile:user_profiles!user_profiles_user_address_fkey(*),
          reply_count:messages!thread_id(count)
        `)
        .eq('room', room)
        .eq('thread_id', threadId || null)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    loadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${room}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `room=eq.${room} and thread_id=eq.${threadId || null}` 
      }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const { data: newMessage } = await supabase
            .from('messages')
            .select(`
              *,
              attachments:message_attachments(*),
              reactions:message_reactions(*),
              user_profile:user_profiles!user_profiles_user_address_fkey(*),
              reply_count:messages!thread_id(count)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
          }
        } else if (payload.eventType === 'UPDATE') {
          const { data: updatedMessage } = await supabase
            .from('messages')
            .select(`
              *,
              attachments:message_attachments(*),
              reactions:message_reactions(*),
              user_profile:user_profiles!user_profiles_user_address_fkey(*),
              reply_count:messages!thread_id(count)
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedMessage) {
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, threadId]);

  const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    setContextMenu({
      messageId,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleAction = async (action: MessageAction, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    switch (action) {
      case 'reply':
        setReplyTo(message);
        break;
      case 'pin':
        // TODO: Implement pin functionality
        break;
      case 'copy':
        navigator.clipboard.writeText(message.content);
        break;
      case 'forward':
        // TODO: Implement forward functionality
        break;
      case 'delete':
        if (message.sender_address === walletAddress) {
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);
          if (error) console.error('Error deleting message:', error);
        }
        break;
      case 'select':
        // TODO: Implement select functionality
        break;
    }
    setContextMenu({ messageId: null, position: null });
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_address', walletAddress)
        .eq('emoji', emoji)
        .single();

      if (existingReaction) {
        // Remove reaction
        await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);
      } else {
        // Add reaction
        await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_address: walletAddress,
            emoji
          });
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu({ messageId: null, position: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle typing indicators
  const handleTyping = () => {
    const now = Date.now();
    if (now - lastTypedRef.current > 1000) { // Only update every second
      lastTypedRef.current = now;
      if (!isTyping) {
        setIsTyping(true);
        supabase
          .from('typing_indicators')
          .upsert({
            user_address: walletAddress,
            room,
            last_typed: new Date().toISOString()
          });
      }
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(async () => {
        setIsTyping(false);
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('user_address', walletAddress)
          .eq('room', room);
      }, 2000);
    }
  };

  // Subscribe to typing indicators
  useEffect(() => {
    const channel = supabase
      .channel('typing-indicators')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `room=eq.${room}`
      }, (payload: any) => {
        if (payload.eventType === 'DELETE') {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(payload.old.user_address);
            return next;
          });
        } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.add(payload.new.user_address);
            return next;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  // Handle read receipts
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender_address !== walletAddress) {
        supabase
          .from('read_receipts')
          .upsert({
            message_id: lastMessage.id,
            user_address: walletAddress,
            read_at: new Date().toISOString()
          });
      }
    }
  }, [messages]);

  // Handle message editing
  const handleEdit = async (messageId: string, newContent: string) => {
    const { error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        edited_at: new Date().toISOString(),
        edited_by: walletAddress
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error editing message:', error);
    } else {
      setEditingMessage(null);
      setEditedContent('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 h-full flex flex-col bg-gray-800 rounded-lg overflow-hidden relative">
      {/* Profile Settings Button */}
      <button
        onClick={() => setShowProfileSettings(true)}
        className="absolute top-4 right-4 p-2 text-white hover:bg-gray-700 rounded-full"
        title="Profile Settings"
      >
        <UserCircleIcon className="w-6 h-6" />
      </button>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <ProfileSettings
            walletAddress={walletAddress}
            onClose={() => setShowProfileSettings(false)}
          />
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group flex items-start gap-3 ${message.sender_address === walletAddress ? 'flex-row-reverse' : 'flex-row'}`}
            onContextMenu={(e) => handleContextMenu(e, message.id)}
            onDoubleClick={() => {
              if (message.sender_address === walletAddress) {
                setEditingMessage(message.id);
                setEditedContent(message.content);
              }
            }}
          >
            <UserProfile userAddress={message.sender_address} size="sm" showStatus />
            <div className={`relative max-w-[70%] ${message.sender_address === walletAddress ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'} rounded-lg p-4 shadow`}>
              {/* Message Actions Button */}
              <button
                onClick={(e) => handleContextMenu(e, message.id)}
                className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-600 text-white"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {/* Message content */}
              {editingMessage === message.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(message.id, editedContent);
                }}>
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-1 bg-gray-700 text-white rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditingMessage(null);
                        setEditedContent('');
                      }
                    }}
                  />
                </form>
              ) : (
                <div>
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  {message.edited_at && (
                    <span className="text-xs text-white opacity-50 ml-2">(edited)</span>
                  )}
                </div>
              )}
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map((attachment) => (
                    attachment.type === 'image' ? (
                      <div key={attachment.id} className="relative">
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="max-w-full rounded-lg shadow-sm"
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                        />
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{attachment.filename}</span>
                          <span>({Math.round(attachment.size / 1024)}KB)</span>
                        </div>
                      </div>
                    ) : (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded ${message.sender_address === walletAddress ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm truncate">{attachment.filename}</span>
                        <span className="text-xs opacity-75">({Math.round(attachment.size / 1024)}KB)</span>
                      </a>
                    )
                  ))}
                </div>
              )}
              
              {/* Thread indicator */}
              {(message.reply_count > 0 || message.thread_id) && (
                <button
                  onClick={() => setThreadMessage(message.thread_id ? messages.find(m => m.id === message.thread_id)! : message)}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {message.thread_id ? 'View thread' : `${message.reply_count} ${message.reply_count === 1 ? 'reply' : 'replies'}`}
                </button>
              )}

              {/* Message metadata */}
              <div className="mt-2 text-xs text-white opacity-75 flex items-center justify-between">
                <span>{truncateAddress(message.sender_address)}</span>
                <span>{new Date(message.created_at).toLocaleTimeString()}</span>
              </div>

              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="absolute -bottom-6 left-0 flex gap-1">
                  {Object.entries(message.reactions.reduce((acc, reaction) => {
                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(message.id, emoji)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs
                        ${message.reactions?.some(r => r.emoji === emoji && r.user_address === walletAddress)
                          ? 'bg-blue-900'
                          : 'bg-gray-800'}
                        hover:bg-blue-900 text-white transition-colors`}
                    >
                      <span>{emoji}</span>
                      <span className="text-white">{count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add reaction button */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex items-center">
              <div className="relative">
                <button
                  onClick={() => setSelectedEmoji(selectedEmoji === message.id ? null : message.id)}
                  className="p-1.5 rounded hover:bg-gray-600 text-white"
                >
                  <FaceSmileIcon className="w-4 h-4 text-white" />
                </button>

                {/* Emoji picker */}
                {selectedEmoji === message.id && (
                  <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 rounded-lg shadow-lg flex gap-1 z-10">
                    {commonReactions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          handleReaction(message.id, emoji);
                          setSelectedEmoji(null);
                        }}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors text-white"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="text-xs text-white opacity-75 p-2">
            {Array.from(typingUsers)
              .filter(addr => addr !== walletAddress)
              .map(addr => (
                <div key={addr} className="flex items-center gap-2">
                  <UserProfile userAddress={addr} size="sm" />
                  <span>is typing...</span>
                </div>
              ))}
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Thread modal */}
        {threadMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Thread</h3>
                <button
                  onClick={() => setThreadMessage(null)}
                  className="text-white opacity-75 hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <UserProfile userAddress={threadMessage.sender_address} showStatus />
                    <div className="flex-1">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-white whitespace-pre-wrap break-words">{threadMessage.content}</p>
                      </div>
                      <div className="mt-1 text-xs text-white opacity-75">
                        {new Date(threadMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Chat
                  walletAddress={walletAddress}
                  room={room}
                  threadId={threadMessage.id}
                />
              </div>
            </div>
          </div>
        )}

        {/* Context Menu */}
        {contextMenu.messageId && contextMenu.position && (
          <div
            ref={contextMenuRef}
            style={{
              position: 'fixed',
              top: contextMenu.position.y,
              left: contextMenu.position.x,
              zIndex: 50
            }}
            className="bg-gray-800 rounded-lg shadow-lg py-1 min-w-[160px] text-white"
          >
            <button
              onClick={() => handleAction('reply', contextMenu.messageId!)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>

            <button
              onClick={() => handleAction('pin', contextMenu.messageId!)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Pin
            </button>

            <button
              onClick={() => handleAction('copy', contextMenu.messageId!)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Copy Text
            </button>

            <button
              onClick={() => handleAction('forward', contextMenu.messageId!)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Forward
            </button>

            {messages.find(m => m.id === contextMenu.messageId)?.sender_address === walletAddress && (
              <button
                onClick={() => handleAction('delete', contextMenu.messageId!)}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {/* Reply indicator */}
        {replyTo && (
          <div className="mb-2 p-2 bg-gray-700 rounded-lg flex items-center justify-between text-white">
            <div className="flex items-center text-sm text-white opacity-75">
              <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
              <span>Replying to {truncateAddress(replyTo.sender_address)}</span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Message input form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={handleTyping}
            />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() && attachments.length === 0}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          
          {/* File upload and attachments */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-white">
                <FileUpload 
                  onUploadComplete={(files) => setAttachments(files)}
                  multiple
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  maxSize={10 * 1024 * 1024} // 10MB
                />
              </div>
            </div>
            {attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-white opacity-75">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{attachments.length} file(s) attached</span>
                <button
                  type="button"
                  onClick={() => setAttachments([])}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
