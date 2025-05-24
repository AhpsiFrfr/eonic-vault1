import React, { useState, useRef, useEffect } from 'react';
import { useDevHQ } from '../../../context/DevHQContext';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiUsers, FiSettings, FiSearch } from 'react-icons/fi';

const DevHQChat: React.FC = () => {
  const { 
    currentUser, 
    messages, 
    addMessage, 
    addReaction, 
    removeReaction 
  } = useDevHQ();
  
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, files?: File[]) => {
    if (!currentUser) return;

    const newMessage: DevHQMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: Date.now(),
      reactions: {},
      type: 'text',
      files: files?.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      }))
    };

    addMessage(newMessage);

    // Simulate ENIC.0 response for certain keywords
    if (content.toLowerCase().includes('help') || content.toLowerCase().includes('enic')) {
      setTimeout(() => {
        const enicoResponse: DevHQMessage = {
          id: `msg-${Date.now()}-enic`,
          senderId: 'ENIC.0',
          content: `I'm here to help! You mentioned: "${content}". How can I assist you with your development tasks?`,
          timestamp: Date.now(),
          reactions: {},
          type: 'system'
        };
        addMessage(enicoResponse);
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const userReacted = message.reactions[emoji]?.includes(currentUser.id);
    
    if (userReacted) {
      removeReaction(messageId, emoji, currentUser.id);
    } else {
      addReaction(messageId, emoji, currentUser.id);
    }
  };

  const filteredMessages = messages.filter(message =>
    searchQuery === '' || 
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.senderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMessages = filteredMessages.reduce((groups, message, index) => {
    const prevMessage = filteredMessages[index - 1];
    const isFirstInGroup = !prevMessage || 
      prevMessage.senderId !== message.senderId ||
      message.timestamp - prevMessage.timestamp > 300000; // 5 minutes

    groups.push({ message, isFirstInGroup });
    return groups;
  }, [] as { message: DevHQMessage; isFirstInGroup: boolean }[]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">DH</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">DevHQ Chat</h1>
            <p className="text-sm text-gray-400">Development Discussion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-cyan-500 w-48"
            />
            <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
            <FiUsers size={20} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p>No messages found</p>
              {searchQuery && (
                <p className="text-sm mt-2">Try adjusting your search query</p>
              )}
            </div>
          </div>
        ) : (
          groupedMessages.map(({ message, isFirstInGroup }) => (
            <MessageItem
              key={message.id}
              message={message}
              isFirstInGroup={isFirstInGroup}
              currentUserId={currentUser?.id || ''}
              onReact={handleReaction}
              onReply={(messageId, content) => {
                // Handle reply functionality
                console.log('Reply to:', messageId, content);
              }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder="Type a message to DevHQ..."
        disabled={!currentUser}
      />
    </div>
  );
};

export default DevHQChat; 