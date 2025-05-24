import React, { useState } from 'react';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiMessageSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface MessageItemProps {
  message: DevHQMessage;
  isFirstInGroup: boolean;
  currentUserId: string;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string, content: string) => void;
  status?: 'sent' | 'delivered' | 'seen';
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isFirstInGroup, 
  currentUserId,
  onReact, 
  onReply, 
  status = 'sent' 
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const isCurrentUser = message.senderId === currentUserId;

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative flex ${isCurrentUser ? 'justify-end' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[80%] ${
        isCurrentUser 
          ? 'bg-cyan-900/40 text-white' 
          : 'bg-gray-800 text-white'
      } rounded-lg p-3 relative`}>
        {isFirstInGroup && (
          <div className="flex items-center mb-1">
            <span className="font-semibold text-sm text-cyan-400">
              {message.senderId}
            </span>
            <span className="text-xs text-gray-400 ml-2">{formattedTime}</span>
            {message.isEdited && (
              <span className="text-xs text-gray-400 ml-2">(edited)</span>
            )}
          </div>
        )}
        
        <div className="message-content">
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* File attachments */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.files.map((file, index) => (
              <div key={index} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">
                📎 {file.name} ({(file.size / 1024).toFixed(1)}KB)
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        {Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors ${
                  userIds.includes(currentUserId)
                    ? 'bg-cyan-600/50 text-cyan-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{emoji}</span>
                <span>{userIds.length}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className={`absolute ${showActions ? 'opacity-100' : 'opacity-0'} transition-opacity -top-3 ${
          isCurrentUser ? 'left-0' : 'right-0'
        } bg-gray-800 rounded-md shadow-lg flex p-1`}>
          <button 
            onClick={() => onReply?.(message.id, '')}
            className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white"
            title="Reply"
          >
            <FiMessageSquare size={14} />
          </button>
          
          {isCurrentUser && (
            <>
              <button 
                className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white"
                title="Edit"
              >
                <FiEdit2 size={14} />
              </button>
              <button 
                className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-red-400"
                title="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem; 