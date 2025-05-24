import React, { useState, useRef, useEffect } from 'react';
import { useDevHQ } from '../../../context/DevHQContext';
import { useChannels } from '../../../context/ChannelContext';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiUsers, FiSettings, FiSearch, FiSmile } from 'react-icons/fi';

const DevHQChat: React.FC = () => {
  const { 
    currentUser, 
    messages, 
    addMessage, 
    addReaction, 
    removeReaction 
  } = useDevHQ();
  
  const { channels, activeChannelId } = useChannels();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current channel info
  const activeChannel = channels.find(c => c.id === activeChannelId);
  
  // Filter messages by channel (for now, we'll simulate this)
  const channelMessages = messages.filter(message => {
    // In a real app, messages would have a channelId property
    // For now, we'll show different messages based on channel
    if (activeChannelId === 'dev-chat') {
      return message.senderId === 'ENIC.0' || message.content.toLowerCase().includes('dev');
    }
    return true; // Show all messages for other channels
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const handleSendMessage = (content: string, files?: File[]) => {
    if (!currentUser) return;

    const newMessage: DevHQMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: Date.now(),
      reactions: {},
      type: 'text',
      channelId: activeChannelId || 'general', // Add channel association
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
          type: 'system',
          channelId: activeChannelId || 'general'
        };
        addMessage(enicoResponse);
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;

    const message = channelMessages.find(m => m.id === messageId);
    if (!message) return;

    const userReacted = message.reactions[emoji]?.includes(currentUser.id);
    
    if (userReacted) {
      removeReaction(messageId, emoji, currentUser.id);
    } else {
      addReaction(messageId, emoji, currentUser.id);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    // TODO: Implement edit message functionality
    console.log('Edit message:', messageId, newContent);
  };

  const handleDeleteMessage = (messageId: string) => {
    // TODO: Implement delete message functionality
    console.log('Delete message:', messageId);
  };

  const handleQuickReaction = (messageId: string, emoji: string) => {
    handleReaction(messageId, emoji);
    setShowEmojiPicker(false);
    setSelectedMessageForReaction(null);
  };

  const handleMembersClick = () => {
    // TODO: Show members panel/modal
    console.log('Show members for channel:', activeChannelId);
  };

  const handleSettingsClick = () => {
    // TODO: Show channel settings
    console.log('Show settings for channel:', activeChannelId);
  };

  const filteredMessages = channelMessages.filter(message =>
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

  // Quick emoji reactions
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">
              {activeChannel?.type === 'voice' ? '🔊' : '#'}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {activeChannel?.name || 'DevHQ Chat'}
            </h1>
            <p className="text-sm text-gray-400">
              {activeChannel?.description || 'Development Discussion'}
            </p>
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
          
          <button 
            onClick={handleMembersClick}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Members"
          >
            <FiUsers size={20} />
          </button>
          
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Settings"
          >
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p>No messages in #{activeChannel?.name || 'this channel'}</p>
              {searchQuery && (
                <p className="text-sm mt-2">Try adjusting your search query</p>
              )}
            </div>
          </div>
        ) : (
          groupedMessages.map(({ message, isFirstInGroup }) => (
            <div key={message.id} className="relative group">
              <MessageItem
                message={message}
                isFirstInGroup={isFirstInGroup}
                currentUserId={currentUser?.id || ''}
                onReact={handleReaction}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReply={(messageId, content) => {
                  console.log('Reply to:', messageId, content);
                }}
              />
              
              {/* Quick reaction button */}
              <button
                onClick={() => {
                  setSelectedMessageForReaction(message.id);
                  setShowEmojiPicker(!showEmojiPicker);
                }}
                className="absolute top-0 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 p-1 rounded"
                title="Add reaction"
              >
                <FiSmile size={16} />
              </button>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {/* Emoji Picker */}
        {showEmojiPicker && selectedMessageForReaction && (
          <div className="absolute bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-10 right-4 top-16">
            <div className="flex gap-1">
              {quickEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleQuickReaction(selectedMessageForReaction, emoji)}
                  className="hover:bg-gray-700 p-2 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder={`Message #${activeChannel?.name || 'channel'}...`}
        disabled={!currentUser}
      />
    </div>
  );
};

export default DevHQChat; 