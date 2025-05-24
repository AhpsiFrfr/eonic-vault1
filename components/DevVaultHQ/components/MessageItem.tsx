import React, { useState } from 'react';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiMessageSquare, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface MessageItemProps {
  message: DevHQMessage;
  isFirstInGroup: boolean;
  currentUserId: string;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string, content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  status?: 'sent' | 'delivered' | 'seen';
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isFirstInGroup, 
  currentUserId,
  onReact, 
  onReply, 
  onEdit,
  onDelete,
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

  const handleEdit = () => {
    const newContent = prompt('Edit message:', message.content);
    if (newContent && newContent !== message.content) {
      onEdit?.(message.id, newContent);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this message?')) {
      onDelete?.(message.id);
    }
  };

  const handleReply = () => {
    onReply?.(message.id, '');
  };

  const isImageFile = (file: { type: string }) => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file: { type: string }) => {
    return file.type.startsWith('video/');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          {message.content && (
            <div className="whitespace-pre-wrap break-words mb-2">
              {message.content}
            </div>
          )}
        </div>

        {/* File attachments */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.files.map((file, index) => (
              <div key={index} className="file-attachment">
                {isImageFile(file) ? (
                  <div className="image-attachment">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="max-w-xs max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(file.url, '_blank')}
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {file.name} • {formatFileSize(file.size)}
                    </div>
                  </div>
                ) : isVideoFile(file) ? (
                  <div className="video-attachment">
                    <video 
                      src={file.url} 
                      controls
                      className="max-w-xs max-h-64 rounded-lg"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {file.name} • {formatFileSize(file.size)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-2 max-w-xs">
                    <div className="text-cyan-400">📎</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{file.name}</div>
                      <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Download"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                )}
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
                    ? 'bg-cyan-600/50 text-cyan-200 border border-cyan-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                <span>{emoji}</span>
                <span>{userIds.length}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        {showActions && (
          <div className={`absolute -top-3 ${
            isCurrentUser ? 'left-0' : 'right-0'
          } bg-gray-800 rounded-md shadow-lg flex p-1 border border-gray-600 z-10`}>
            <button 
              onClick={handleReply}
              className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors"
              title="Reply"
            >
              <FiMessageSquare size={14} />
            </button>
            
            {isCurrentUser && (
              <>
                <button 
                  onClick={handleEdit}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors"
                  title="Edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1 hover:bg-gray-700 rounded-md text-gray-300 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem; 