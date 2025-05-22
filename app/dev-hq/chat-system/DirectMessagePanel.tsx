'use client';
import React, { useState, useRef, useEffect } from 'react';

// @dev-vault-component
export default function DirectMessagePanel({ userId = '1' }) {
  const [user, setUser] = useState({
    id: userId,
    name: 'CabalMember',
    status: 'online',
    lastSeen: 'Just now',
    profilePic: '/avatar2.png',
    xpLevel: 87,
    timepiece: 'restricted',
    isAdmin: true,
    isBlocked: false,
    isMuted: false
  });
  
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      sender: 'CabalMember', 
      content: 'Hey, have you seen the latest quantum engine results?', 
      timestamp: Date.now() - 3600000,
      profilePic: '/avatar2.png',
      xpLevel: 87,
      timepiece: 'restricted',
      reactions: [],
      edited: false,
      seen: true
    },
    { 
      id: '2', 
      sender: 'DevUser', 
      content: 'Not yet, still working on the integration tests.', 
      timestamp: Date.now() - 3500000,
      profilePic: '/avatar1.png',
      xpLevel: 42,
      timepiece: 'active',
      reactions: [{emoji: '👍', count: 1}],
      edited: false,
      seen: true
    },
    { 
      id: '3', 
      sender: 'CabalMember', 
      content: 'I\'ll send you the access codes when they\'re ready. The preliminary results look promising.', 
      timestamp: Date.now() - 900000,
      profilePic: '/avatar2.png',
      xpLevel: 87,
      timepiece: 'restricted',
      reactions: [],
      edited: true,
      seen: true
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remoteIsTyping, setRemoteIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [encryptionActive, setEncryptionActive] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate typing indicator
  useEffect(() => {
    let timeout;
    if (isTyping) {
      timeout = setTimeout(() => setIsTyping(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping]);
  
  // Simulate remote typing
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldType = Math.random() > 0.7;
      if (shouldType) {
        setRemoteIsTyping(true);
        setTimeout(() => setRemoteIsTyping(false), 2000 + Math.random() * 3000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'DevUser',
        content: input,
        timestamp: Date.now(),
        profilePic: '/avatar1.png',
        xpLevel: 42,
        timepiece: 'active',
        reactions: [],
        edited: false,
        seen: false
      };
      
      setMessages([...messages, newMessage]);
      setInput('');
      setShowEmojiPicker(false);
      
      // Simulate message being seen after a delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? {...msg, seen: true} : msg
          )
        );
      }, 3000);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const addReaction = (messageId, emoji) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? {...r, count: r.count + 1} : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, {emoji, count: 1}]
          };
        }
      }
      return msg;
    }));
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleBlockUser = () => {
    setUser({...user, isBlocked: !user.isBlocked});
    setShowOptions(false);
  };
  
  const toggleMuteUser = () => {
    setUser({...user, isMuted: !user.isMuted});
    setShowOptions(false);
  };
  
  const deleteChat = (forBoth = false) => {
    setMessages([]);
    setShowOptions(false);
    // In a real implementation, this would call an API to delete messages
    // If forBoth is true, it would delete for both users
  };
  
  const simulateNotification = () => {
    // This would trigger a notification in a real implementation
    alert('Notification simulated: New message from ' + user.name);
  };
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-zinc-950 text-white">
      {/* DM Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden mr-3">
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium">{user.name}</span>
              {user.isAdmin && (
                <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-300 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
              <span className="ml-2 text-xs bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded">
                LVL {user.xpLevel}
              </span>
            </div>
            <div className="text-xs text-zinc-400 flex items-center">
              <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-zinc-500'} mr-1`}></span>
              {user.status === 'online' ? 'Online' : `Last seen ${user.lastSeen}`}
              {encryptionActive && (
                <span className="ml-2 flex items-center text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Encrypted
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="relative">
            <button 
              className="text-zinc-400 hover:text-white"
              onClick={() => setShowOptions(!showOptions)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {/* Options Menu */}
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => toggleMuteUser()}
                    >
                      {user.isMuted ? 'Unmute' : 'Mute'} {user.name}
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => toggleBlockUser()}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'} {user.name}
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => deleteChat(false)}
                    >
                      Delete chat for me
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => deleteChat(true)}
                    >
                      Delete chat for everyone
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => simulateNotification()}
                    >
                      Simulate Notification
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                      onClick={() => setEncryptionActive(!encryptionActive)}
                    >
                      {encryptionActive ? 'Disable' : 'Enable'} Encryption
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 border-l border-r border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-950">
        {user.isBlocked && (
          <div className="bg-red-900/20 text-red-300 p-4 rounded-md text-center">
            You have blocked this user. Unblock to send and receive messages.
          </div>
        )}
        
        {!user.isBlocked && messages.length === 0 && (
          <div className="text-center text-zinc-500 py-8">
            No messages yet. Start a conversation!
          </div>
        )}
        
        {!user.isBlocked && messages.map((message) => {
          const isOwnMessage = message.sender === 'DevUser';
          
          return (
            <div key={message.id} className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start">
                  {!isOwnMessage && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                          {message.sender.charAt(0)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex-1 min-w-0 ${isOwnMessage ? 'bg-blue-900/20' : 'bg-zinc-800/80'} p-3 rounded-lg shadow-sm border ${isOwnMessage ? 'border-blue-800/30' : 'border-zinc-700/30'}`}>
                    <div className="flex items-center">
                      <span className="font-medium">{message.sender}</span>
                      <span className="ml-2 text-xs text-zinc-400">
                        {formatTimestamp(message.timestamp)}
                        {message.edited && <span className="ml-1">(edited)</span>}
                      </span>
                    </div>
                    
                    <div className="mt-1 text-white">{message.content}</div>
                    
                    {message.reactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.reactions.map((reaction, idx) => (
                          <button 
                            key={idx} 
                            className="bg-zinc-800 hover:bg-zinc-700 rounded-full px-2 py-0.5 text-sm flex items-center"
                            onClick={() => addReaction(message.id, reaction.emoji)}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="ml-1 text-xs">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {isOwnMessage && message.seen && (
                      <div className="mt-1 text-right">
                        <span className="text-xs text-blue-400">Seen</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'mr-3 order-1' : 'ml-3 order-2'}`}>
                    <div className="flex space-x-1">
                      <button 
                        className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
                        onClick={() => setShowEmojiPicker(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      {isOwnMessage && (
                        <button className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {remoteIsTyping && !user.isBlocked && (
          <div className="text-xs text-zinc-400 flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <
(Content truncated due to size limit. Use line ranges to read in chunks)