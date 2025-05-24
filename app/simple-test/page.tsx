'use client';

import { useState } from 'react';

export default function SimpleTest() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleAddMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, message]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">🧪 Simple Interactive Test</h1>
      
      <div className="space-y-6">
        {/* Counter Test */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Counter Test:</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCount(count - 1)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              - Decrease
            </button>
            <span className="text-2xl font-bold text-cyan-400">{count}</span>
            <button 
              onClick={() => setCount(count + 1)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              + Increase
            </button>
          </div>
        </div>

        {/* Message Test */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Message Input Test:</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message and press Enter..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
            <button
              onClick={handleAddMessage}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
            >
              Add Message
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm text-gray-400">Messages ({messages.length}):</h3>
            {messages.length === 0 ? (
              <p className="text-gray-500 italic">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded">
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Status:</h2>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${count !== 0 ? 'text-green-400' : 'text-yellow-400'}`}>
              <span>{count !== 0 ? '✅' : '⏳'}</span>
              <span>Counter buttons {count !== 0 ? 'working' : 'not tested yet'}</span>
            </div>
            <div className={`flex items-center gap-2 ${messages.length > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
              <span>{messages.length > 0 ? '✅' : '⏳'}</span>
              <span>Message input {messages.length > 0 ? 'working' : 'not tested yet'}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
          <div className="flex gap-2">
            <a href="/dev-hq-test" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Try DevHQ Test
            </a>
            <a href="/test-migration" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Migration Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 