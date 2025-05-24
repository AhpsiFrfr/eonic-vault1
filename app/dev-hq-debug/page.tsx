'use client';

import React, { useState } from 'react';
import { DevHQProvider, useDevHQ } from '../../context/DevHQContext';

function DebugContent() {
  const { 
    currentUser, 
    messages, 
    addMessage, 
    addReaction 
  } = useDevHQ();
  
  const [testMessage, setTestMessage] = useState('');

  const testAddMessage = () => {
    if (!testMessage.trim() || !currentUser) return;
    
    addMessage({
      id: `test-${Date.now()}`,
      senderId: currentUser.id,
      content: testMessage,
      timestamp: Date.now(),
      reactions: {},
      type: 'text'
    });
    setTestMessage('');
  };

  const testReaction = () => {
    if (messages.length > 0 && currentUser) {
      addReaction(messages[0].id, '🎉', currentUser.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">DevHQ Debug Page</h1>
      
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current User:</h2>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{currentUser.username[0]}</span>
              </div>
              <div>
                <p>ID: {currentUser.id}</p>
                <p>Username: {currentUser.username}</p>
                <p>Status: {currentUser.status}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-400">❌ No current user found</p>
          )}
        </div>

        {/* Messages */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Messages ({messages.length}):</h2>
          {messages.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className="bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-300">From: {msg.senderId}</p>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-400">
                    Reactions: {Object.keys(msg.reactions).length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-yellow-400">⚠️ No messages found</p>
          )}
        </div>

        {/* Test Controls */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Controls:</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Test message..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
              <button
                onClick={testAddMessage}
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
              >
                Send Test Message
              </button>
            </div>
            <button
              onClick={testReaction}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Add 🎉 Reaction to First Message
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Other Pages:</h2>
          <div className="flex gap-2">
            <a href="/dev-hq-test" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Full DevHQ Test
            </a>
            <a href="/simple-test" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Simple Test
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DevHQDebugPage() {
  return (
    <DevHQProvider>
      <DebugContent />
    </DevHQProvider>
  );
} 