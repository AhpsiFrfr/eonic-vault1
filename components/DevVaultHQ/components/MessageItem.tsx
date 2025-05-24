import React, { useState, useRef, useCallback } from 'react';
import { DevHQMessage } from '../../../types/devhq-chat';
import { FiMessageSquare, FiEdit2, FiTrash2, FiDownload, FiSmile, FiMoreHorizontal } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import MessageActionsMenu from './MessageActionsMenu';
import ReactionsBar from './ReactionsBar';

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
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const isCurrentUser = message.senderId === currentUserId;

  // Get user's current reactions for this message
  const currentUserReactions = Object.entries(message.reactions)
    .filter(([_, userIds]) => userIds.includes(currentUserId))
    .map(([emoji]) => emoji);

  // Handle cursor-based menu positioning
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    // On desktop, show menu on hover
    if (window.innerWidth > 768) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({ 
        x: e.clientX || rect.right - 50, 
        y: e.clientY || rect.top - 10 
      });
      setShowMenu(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Hide menu when mouse leaves, but with a small delay to allow interaction
    setTimeout(() => {
      if (!document.querySelector('[data-menu-hover="true"]')) {
        setShowMenu(false);
      }
    }, 150);
  }, []);

  // Long press for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      setMenuPosition({ x: touch.clientX, y: touch.clientY });
      setShowMenu(true);
      navigator.vibrate?.(50); // Haptic feedback if available
    }, 500);
    setLongPressTimer(timer);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // Action handlers
  const handleReaction = useCallback((emoji: string) => {
    onReact?.(message.id, emoji);
  }, [message.id, onReact]);

  const handleReply = useCallback(() => {
    onReply?.(message.id, '');
    setShowMenu(false);
  }, [message.id, onReply]);

  const handleEdit = useCallback(() => {
    const newContent = prompt('Edit message:', message.content);
    if (newContent && newContent !== message.content) {
      onEdit?.(message.id, newContent);
    }
    setShowMenu(false);
  }, [message.id, message.content, onEdit]);

  const handleDelete = useCallback(() => {
    if (confirm('Delete this message?')) {
      onDelete?.(message.id);
    }
    setShowMenu(false);
  }, [message.id, onDelete]);

  const handleEnicSummarize = useCallback(() => {
    onEnicSummarize?.(message.id);
    setShowMenu(false);
  }, [message.id, onEnicSummarize]);

  const handleEnicSuggest = useCallback(() => {
    onEnicSuggest?.(message.id);
    setShowMenu(false);
  }, [message.id, onEnicSuggest]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(`${window.location.origin}/message/${message.id}`);
    setShowMenu(false);
  }, [message.id]);

  const handleCopyText = useCallback(() => {
    navigator.clipboard?.writeText(message.content);
    setShowMenu(false);
  }, [message.content]);

  const handleForward = useCallback(() => {
    console.log('Forward message:', message.id);
    setShowMenu(false);
  }, [message.id]);

  const handleReport = useCallback(() => {
    console.log('Report message:', message.id);
    setShowMenu(false);
  }, [message.id]);

  const handleSelect = useCallback(() => {
    console.log('Select message:', message.id);
    setShowMenu(false);
  }, [message.id]);

  // File helper functions
  const isImageFile = (file: { type: string }) => file.type.startsWith('image/');
  const isVideoFile = (file: { type: string }) => file.type.startsWith('video/');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <motion.div
        ref={messageRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group flex ${isCurrentUser ? 'justify-end' : ''} relative`}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`max-w-[80%] ${
          isCurrentUser 
            ? 'bg-cyan-900/40 text-white' 
            : 'bg-gray-800 text-white'
        } rounded-lg p-3 relative transition-all duration-200 hover:shadow-lg cursor-pointer`}>
          
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

          {/* Existing Reactions Display */}
          {Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(emoji)}
                  className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors ${
                    userIds.includes(currentUserId)
                      ? 'bg-cyan-600/50 text-cyan-200 border border-cyan-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{userIds.length}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Menu Portal */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Overlay to close menu */}
            <div 
              className="fixed inset-0 z-[9998]"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu Container */}
            <div 
              data-menu-hover="true"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
              style={{ position: 'fixed', zIndex: 9999 }}
            >
              {/* Reactions Bar */}
              <div style={{
                position: 'fixed',
                left: menuPosition.x,
                top: menuPosition.y - 80,
                zIndex: 9999
              }}>
                <ReactionsBar 
                  onReact={handleReaction}
                  currentUserReactions={currentUserReactions}
                />
              </div>

              {/* Actions Menu */}
              <MessageActionsMenu
                position={menuPosition}
                isCurrentUser={isCurrentUser}
                onReply={handleReply}
                onEnicSummarize={handleEnicSummarize}
                onEnicSuggest={handleEnicSuggest}
                onCopyLink={handleCopyLink}
                onCopyText={handleCopyText}
                onForward={handleForward}
                onReport={handleReport}
                onSelect={handleSelect}
                onEdit={isCurrentUser ? handleEdit : undefined}
                onDelete={isCurrentUser ? handleDelete : undefined}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageItem; 