'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function PinnedMessages({ channelId, onClose }) {
  // In a real implementation, this would fetch from an API
  // For now, we'll use mock data
  const [pinnedMessages, setPinnedMessages] = useState([
    {
      id: '1',
      sender: 'DevLead',
      content: 'Important: All team members must update their local dev environment to the latest version before the next sprint.',
      timestamp: Date.now() - 86400000 * 3, // 3 days ago
      pinnedBy: 'DevLead',
      pinnedAt: Date.now() - 86400000 * 3
    },
    {
      id: '2',
      sender: 'ENIC.0',
      content: 'Quantum engine integration documentation: https://docs.eonic.dev/quantum-integration',
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      pinnedBy: 'DevLead',
      pinnedAt: Date.now() - 86400000 * 2
    },
    {
      id: '3',
      sender: 'CabalMember',
      content: 'Weekly dev meeting scheduled for Friday at 2pm UTC in the Main Room voice channel.',
      timestamp: Date.now() - 86400000, // 1 day ago
      pinnedBy: 'DevLead',
      pinnedAt: Date.now() - 86400000
    }
  ]);
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  
  const unpinMessage = (messageId) => {
    setPinnedMessages(pinnedMessages.filter(msg => msg.id !== messageId));
    // In a real implementation, this would call an API
  };
  
  const jumpToMessage = (messageId) => {
    // In a real implementation, this would scroll to the message in the chat
    console.log(`Jumping to message ${messageId}`);
    onClose();
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-white font-medium">Pinned Messages</h3>
        </div>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Messages List */}
      <div className="max-h-96 overflow-y-auto">
        {pinnedMessages.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            No pinned messages in this channel.
          </div>
        ) : (
          <div className="divide-y divide-zinc-700">
            {pinnedMessages.map(message => (
              <div key={message.id} className="p-3 hover:bg-zinc-700/50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="font-medium text-white">{message.sender}</span>
                    <span className="ml-2 text-xs text-zinc-400">{formatDate(message.timestamp)}</span>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700 mr-1"
                      onClick={() => jumpToMessage(message.id)}
                      title="Jump to message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button 
                      className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700"
                      onClick={() => unpinMessage(message.id)}
                      title="Unpin message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-zinc-300 text-sm">{message.content}</p>
                <div className="mt-1 text-xs text-zinc-500">
                  Pinned by {message.pinnedBy} on {formatDate(message.pinnedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-zinc-700 text-xs text-zinc-400 flex justify-between">
        <span>{pinnedMessages.length} pinned {pinnedMessages.length === 1 ? 'message' : 'messages'}</span>
        <button 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => setPinnedMessages([])}
          disabled={pinnedMessages.length === 0}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
