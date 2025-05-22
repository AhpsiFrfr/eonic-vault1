import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlowLevel } from '@/context/GlowLevelContext';
import { playSFX } from '@/utils/audio';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'enic';
  timestamp: Date;
}

interface ENIC0PanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ENIC0Panel: React.FC<ENIC0PanelProps> = ({
  isOpen,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome, Eon. How may I assist you today?',
      sender: 'enic',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { glowLevel } = useGlowLevel();
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      playSFX('modal_open');
    }
  }, [messages, isOpen]);
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    playSFX('click');
    
    // Simulate ENIC.0 response
    setTimeout(() => {
      const enicMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I am analyzing your request. My systems are processing the optimal response based on your Eon status and current objectives.',
        sender: 'enic' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, enicMessage]);
      setIsTyping(false);
      playSFX('chime');
    }, 1500);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 w-96 h-[500px] rounded-lg overflow-hidden z-50"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Glow effect */}
          <div 
            className="absolute -inset-1 rounded-lg opacity-70"
            style={{ 
              background: 'radial-gradient(circle, rgba(28,69,244,0.3) 0%, rgba(28,69,244,0) 70%)',
              filter: 'blur(8px)',
              pointerEvents: 'none'
            }}
          />
          
          {/* Main container */}
          <div className="relative w-full h-full bg-gradient-to-b from-obsidian to-[rgba(10,10,15,0.95)] border border-egyptian-base rounded-lg overflow-hidden">
            {/* Header */}
            <div className="h-12 px-4 flex items-center justify-between bg-gradient-to-r from-egyptian-base to-egyptian-glow bg-opacity-20">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 relative">
                  <div className="absolute inset-0 rounded-full bg-egyptian-base opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#F5D16F" strokeWidth="1" />
                      <path d="M4 8H12" stroke="#F5D16F" strokeWidth="1" />
                      <path d="M8 4V12" stroke="#F5D16F" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white-marble font-orbitron text-sm uppercase tracking-wider">
                  ENIC.0
                </h3>
              </div>
              
              <button 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white-marble hover:bg-egyptian-base transition-colors"
                onClick={() => {
                  playSFX('modal_close');
                  onClose();
                }}
              >
                ×
              </button>
            </div>
            
            {/* Messages container */}
            <div className="h-[calc(100%-96px)] p-4 overflow-y-auto">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[80%] p-3 rounded-lg
                      ${message.sender === 'user' 
                        ? 'bg-egyptian-base text-white-marble' 
                        : 'bg-[rgba(245,209,111,0.1)] border border-gold text-white-marble'
                      }
                    `}
                  >
                    <p className="text-sm font-sora">{message.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-[rgba(245,209,111,0.1)] border border-gold text-white-marble p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form 
              className="h-20 p-4 border-t border-egyptian-base"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ENIC.0..."
                  className="w-full h-12 px-4 pr-12 bg-[rgba(10,10,15,0.5)] border border-egyptian-base rounded-lg text-white-marble placeholder-gray-500 focus:outline-none focus:border-egyptian-glow"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full bg-egyptian-base hover:bg-egyptian-glow transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14 8L2 14V2L14 8Z" stroke="#F5D16F" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 