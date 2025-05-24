'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Message {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
  reactions?: {
    emoji: string;
    count: number;
    reacted: boolean;
  }[];
}

export default function ChatView() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to VaultCord! Advanced voice features are now online.",
      author: {
        name: 'VAULTCORD_BOT',
        avatar: '/images/icons/system.svg',
      },
      timestamp: new Date(Date.now() - 3600000),
      reactions: [
        { emoji: '🎤', count: 5, reacted: false },
        { emoji: '🚀', count: 3, reacted: true }
      ]
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      author: {
        name: 'You',
        avatar: '/images/avatars/default.svg',
      },
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Channel Header */}
      <div className="flex h-12 items-center border-b border-cosmic-light/10 px-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-cosmic-light/70"
          >
            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
          </svg>
          <h3 className="font-medium text-cosmic-light">general</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="flex items-start gap-3">
              <img
                src={message.author.avatar}
                alt={message.author.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-cosmic-light">
                    {message.author.name}
                  </span>
                  <span className="text-xs text-cosmic-light/50">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-cosmic-light/90">{message.content}</p>
                {message.reactions && (
                  <div className="mt-2 flex gap-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm ${
                          reaction.reacted
                            ? 'bg-cosmic-accent/20 text-cosmic-accent'
                            : 'bg-cosmic-light/5 text-cosmic-light/70 hover:bg-cosmic-light/10'
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4">
        <div className="flex items-center gap-2 rounded-lg bg-cosmic-light/5 p-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cosmic-light/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-cosmic-light/70"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.5 9a.5.5 0 000 1h7a.5.5 0 000-1h-7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message #general"
            className="flex-1 bg-transparent text-cosmic-light outline-none placeholder:text-cosmic-light/50"
          />
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cosmic-light/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-cosmic-light/70"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a.75.75 0 001.061 0 3.5 3.5 0 014.95 0 .75.75 0 101.06-1.06 5 5 0 00-7.07 0 .75.75 0 000 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 