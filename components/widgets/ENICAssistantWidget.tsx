'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ENICAssistantWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{role: 'system' | 'user', content: string}[]>([
    { role: 'system', content: "Welcome to EONIC Vault. How can I assist you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const responses = [
        "I can help you track your timepiece evolution progress. Would you like to learn more about accelerating your evolution?",
        "Your current EONIC balance is growing steadily! Consider staking more to earn higher rewards.",
        "Did you know you can connect with other EONIC holders in the community section? It's a great way to learn more about the project.",
        "I noticed you haven't claimed your latest rewards. Would you like me to guide you through the process?",
        "Based on your activity, you might be interested in the upcoming governance proposals. Would you like to review them?"
      ];
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: responses[Math.floor(Math.random() * responses.length)] 
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-800 p-4 text-white shadow-xl">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Bot className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">ENIC.0 Assistant</h2>
        <div className="ml-auto text-xs opacity-75">
          {isExpanded ? 'Close' : 'Open'} 
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="bg-gray-900 bg-opacity-20 rounded-lg p-2 h-48 overflow-y-auto mb-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                    message.role === 'user' 
                      ? 'ml-auto bg-emerald-700' 
                      : 'bg-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              
              {isTyping && (
                <div className="bg-gray-800 p-2 rounded-lg max-w-[80%] animate-pulse">
                  ENIC.0 is thinking...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask ENIC.0 anything..."
                className="flex-1 bg-gray-900 bg-opacity-20 border-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit" 
                className="p-2 bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <p className="text-sm italic mt-2">"How can I help evolve your business today?"</p>
      )}
    </div>
  );
} 