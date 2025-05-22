'use client';

import React, { useState, useRef, useEffect } from 'react';

// @dev-vault-component
export default function ThreadedReplies({ parentMessage, onClose }) {
  const [replies, setReplies] = useState([
    {
      id: '1',
      sender: 'DevUser',
      content: 'I think we should approach this differently.',
      timestamp: Date.now() - 3600000,
      profilePic: '/avatar1.png',
      xpLevel: 42,
      reactions: []
    },
    {
      id: '2',
      sender: 'ENIC.0',
      content: 'Based on previous implementations, I recommend using the quantum approach.',
      timestamp: Date.now() - 1800000,
      profilePic: '/enic.png',
      xpLevel: 999,
      reactions: [{emoji: '👍', count: 2}]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new replies arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);
  
  const sendReply = () => {
    if (input.trim()) {
      const newReply = {
        id: Date.now().toString(),
        sender: 'DevUser',
        content: input,
        timestamp: Date.now(),
        profilePic: '/avatar1.png',
        xpLevel: 42,
        reactions: []
      };
      
      setReplies([...replies, newReply]);
      setInput('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const addReaction = (messageId, emoji) => {
    setReplies(replies.map(reply => {
      if (reply.id === messageId) {
        const existingReaction = reply.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...reply,
            reactions: reply.reactions.map(r => 
              r.emoji === emoji ? {...r, count: r.count + 1} : r
            )
          };
        } else {
          return {
            ...reply,
            reactions: [...reply.reactions, {emoji, count: 1}]
          };
        }
      }
      return reply;
    }));
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <h3 className="text-white font-medium">Thread</h3>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Parent Message */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                {parentMessage.sender.charAt(0)}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="font-medium text-white">{parentMessage.sender}</span>
              <span className="ml-2 text-xs text-zinc-400">
                {formatTimestamp(parentMessage.timestamp)}
              </span>
            </div>
            <div className="mt-1 text-zinc-300">{parentMessage.content}</div>
          </div>
        </div>
      </div>
      
      {/* Replies */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="group">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                    {reply.sender.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span className="font-medium text-white">{reply.sender}</span>
                  <span className="ml-2 text-xs text-zinc-400">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                </div>
                <div className="mt-1 text-zinc-300">{reply.content}</div>
                
                {reply.reactions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reply.reactions.map((reaction, idx) => (
                      <button 
                        key={idx} 
                        className="bg-zinc-700 hover:bg-zinc-600 rounded-full px-2 py-0.5 text-sm flex items-center"
                        onClick={() => addReaction(reply.id, reaction.emoji)}
                      >
                        <span>{reaction.emoji}</span>
                        <span className="ml-1 text-xs">{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button 
                    className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700"
                    onClick={() => addReaction(reply.id, '👍')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-zinc-700">
        <div className="relative">
          <textarea
            className="w-full bg-zinc-700 text-white rounded-md px-3 py-2 pr-10 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Reply to thread..."
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsTyping(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="absolute right-2 bottom-2 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-600"
            onClick={sendReply}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
