import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ChatMessage, sendMessage, subscribeToMessages, getMessages } from '../utils/supabase';

export const Chat: React.FC = () => {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load existing messages
    getMessages(room).then((existingMessages) => {
      setMessages(existingMessages.reverse());
      scrollToBottom();
    });

    // Subscribe to new messages
    const subscription = subscribeToMessages(room, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [room]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !publicKey) return;

    try {
      await sendMessage(newMessage, publicKey.toString(), room);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const rooms = ['general', 'nft-chat', 'cabal'];

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-md">
      {/* Room Selection */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex space-x-2">
          {rooms.map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`px-3 py-1 rounded-full text-sm ${r === room
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              #{r}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender_address === publicKey?.toString()
              ? 'ml-auto'
              : 'mr-auto'}`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs ${message.sender_address === publicKey?.toString()
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100'}`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {message.sender_address.slice(0, 8)}...{' • '}
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${room}...`}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
