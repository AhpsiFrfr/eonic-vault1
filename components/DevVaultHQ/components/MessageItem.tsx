import React, { useState } from 'react';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiMessageSquare, FiEdit2, FiTrash2, FiDownload, FiSmile, FiMoreHorizontal } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageItemProps {
  message: DevHQMessage;
  isFirstInGroup: boolean;
  currentUserId: string;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string, content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onEnicSummarize?: (messageId: string) => void;
  onEnicSuggest?: (messageId: string) => void;
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
  onEnicSummarize,
  onEnicSuggest,
  status = 'sent' 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const isCurrentUser = message.senderId === currentUserId;

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowEmojiPicker(false);
  };

  const handleEdit = () => {
    const newContent = prompt('Edit message:', message.content);
    if (newContent && newContent !== message.content) {
      onEdit?.(message.id, newContent);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this message?')) {
      onDelete?.(message.id);
    }
    setShowMenu(false);
  };

  const handleReply = () => {
    onReply?.(message.id, '');
    setShowMenu(false);
  };

  const handleEnicSummarize = () => {
    onEnicSummarize?.(message.id);
    setShowMenu(false);
  };

  const handleEnicSuggest = () => {
    onEnicSuggest?.(message.id);
    setShowMenu(false);
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

  // Telegram-style emoji reactions
  const quickEmojis = ['👍', '👎', '❤️', '🔥', '🥰', '👏', '😂', '😮', '😢', '😡', '🤔', '🎉'];

  return (
    <div className="group relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isCurrentUser ? 'justify-end' : ''}`}
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
        </div>

        {/* Quick Action Buttons - Telegram Style */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-0 ${
                isCurrentUser ? '-left-24' : '-right-24'
              } bg-gray-800 rounded-lg shadow-lg flex items-center p-1 border border-gray-600 z-20`}
            >
              {/* Reply */}
              <button 
                onClick={handleReply}
                className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors"
                title="Reply"
              >
                <FiMessageSquare size={16} />
              </button>

              {/* React */}
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-yellow-400 transition-colors"
                title="React"
              >
                <FiSmile size={16} />
              </button>

              {/* More Menu */}
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors"
                title="More"
              >
                <FiMoreHorizontal size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Emoji Picker - Telegram Style */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              isCurrentUser ? 'right-0' : 'left-0'
            } top-0 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-30 min-w-0`}
          >
            <div className="grid grid-cols-6 gap-1 max-w-xs">
              {quickEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="hover:bg-gray-700 p-2 rounded text-lg transition-colors hover:scale-110"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu - Telegram Style */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              isCurrentUser ? 'right-0' : 'left-0'
            } top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-30 min-w-48`}
          >
            <div className="py-1">
              <button
                onClick={handleReply}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FiMessageSquare size={16} />
                Reply
              </button>

              {isCurrentUser && (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2 text-red-400"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                  <hr className="border-gray-600 my-1" />
                </>
              )}

              <button
                onClick={handleEnicSummarize}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2 text-cyan-400"
              >
                <span className="text-sm font-bold">🤖</span>
                ENIC.0 Summarize
              </button>

              <button
                onClick={handleEnicSuggest}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2 text-cyan-400"
              >
                <span className="text-sm font-bold">💡</span>
                ENIC.0 Suggest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(showMenu || showEmojiPicker) && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowMenu(false);
            setShowEmojiPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default MessageItem; 