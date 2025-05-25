'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useReactionAnimation } from '../hooks/useReactionAnimation';
import { EonIDPanel } from './EonIDPanel';
import { useState, useEffect, useRef } from 'react';
import { Heart, Reply, Edit3, Pin, Copy, Link, Share, Trash2, CheckCircle, MessageSquare, Image, Smile } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  reactions: string[];
  messageId: string;
  timestamp: string;
  onReaction: (emoji: string, event: React.MouseEvent) => void;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isEdited?: boolean;
  isPinned?: boolean;
  showBusinessCard?: boolean;
  businessCard?: {
    ensName?: string;
    role?: string;
    timepieceStage?: string;
    lookingFor?: string;
    links?: {
      github?: string;
      website?: string;
      twitter?: string;
    };
  };
  senderAddress: string;
  parentId?: string;
  parentContent?: string;
  replyCount?: number;
  onViewThread?: (messageId: string) => void;
}

const reactionEmojis = ['❤️', '👍', '🙌', '😂', '😭', '🌭', '🔥'];

export function MessageBubble({
  content,
  isOwn,
  reactions = [],
  messageId,
  timestamp,
  onReaction,
  onReply,
  onEdit,
  onPin,
  onDelete,
  isEdited,
  isPinned,
  showBusinessCard,
  businessCard,
  senderAddress,
  parentId,
  parentContent,
  replyCount = 0,
  onViewThread
}: MessageBubbleProps) {
  const { triggerReaction } = useReactionAnimation();
  const [showProfile, setShowProfile] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Reset delete confirmation when menu closes
  useEffect(() => {
    if (!showContextMenu) {
      setDeleteConfirmation(false);
    }
  }, [showContextMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
        setShowReactionBar(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Extract GIF URL if present in the message
  useEffect(() => {
    if (content) {
      // Check for different GIF URL patterns
      
      // Check for "GIF:" prefix
      const gifPrefix = "GIF: ";
      if (content.startsWith(gifPrefix)) {
        const url = content.substring(gifPrefix.length).split(' ')[0];
        setGifUrl(url);
      }

      // Check for any Giphy URL pattern (with media or i.giphy.com patterns)
      const giphyPatterns = [
        /https?:\/\/media\d?\.giphy\.com\/media\/[a-zA-Z0-9]+\/giphy\.gif/i,
        /https?:\/\/i\.giphy\.com\/[a-zA-Z0-9]+\.gif/i,
        /https?:\/\/giphy\.com\/gifs\/[a-zA-Z0-9-]+/i,
        /cid=.+giphy\.gif/i
      ];
      
      for (const pattern of giphyPatterns) {
        const match = content.match(pattern);
        if (match && match[0]) {
          setGifUrl(match[0]);
          break;
        }
      }
    }
  }, [content]);

  const handleReaction = (emoji: string, event: React.MouseEvent) => {
    // Choose animation type based on emoji
    let animationType: 'float' | 'burst' | 'bounce' | 'spin' = 'float';
    
    // Map specific emojis to animation types for more interesting effects
    if (emoji === '🔥' || emoji === '❤️' || emoji === '😍') {
      animationType = 'burst';
    } else if (emoji === '😂' || emoji === '🤣' || emoji === '😭') {
      animationType = 'bounce';
    } else if (emoji === '🙌' || emoji === '👍' || emoji === '🎉') {
      animationType = 'spin';
    }
    
    // Pass the animation type to the reaction handler
    const reactionEvent = {
      ...event,
      animationType
    };
    
    triggerReaction(messageId, emoji, event);
    onReaction(emoji, event);
    setShowReactionBar(false);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't show context menu if clicking on a button or link
    if ((e.target as HTMLElement).tagName === 'BUTTON' || 
        (e.target as HTMLElement).tagName === 'A') {
      return;
    }
    
    setShowContextMenu(true);
  };

  const handleCopyText = () => {
    if (displayContent) {
      navigator.clipboard.writeText(displayContent);
    }
    setShowContextMenu(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(`${url}?msg=${messageId}`);
    setShowContextMenu(false);
  };

  const handleForward = () => {
    // Implement forwarding functionality
    setShowContextMenu(false);
  };

  // Format the content for display - aggressively remove all URL patterns
  const displayContent = (() => {
    if (!content) return "";
    
    let processed = content;
    
    // Remove various GIF URL formats including the cid format
    processed = processed.replace(/GIF: .+?(?=\s|$)/g, '')
                         .replace(/https?:\/\/media\d?\.giphy\.com\/media\/[a-zA-Z0-9]+\/giphy\.gif/gi, '')
                         .replace(/https?:\/\/i\.giphy\.com\/[a-zA-Z0-9]+\.gif/gi, '')
                         .replace(/https?:\/\/giphy\.com\/gifs\/[a-zA-Z0-9-]+/gi, '')
                         .replace(/cid=.+giphy\.gif.*/gi, '')
                         .replace(/cid=.+gif&ct=.*/gi, '')
                         .replace(/v1_gifs_search.+/g, '');
    
    // Clean up spaces and return
    return processed.replace(/\s+/g, ' ').trim();
  })();

  const handleDeleteClick = () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
    } else {
      onDelete && onDelete(messageId);
      setShowContextMenu(false);
      setDeleteConfirmation(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group relative flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-full w-[100%] md:max-w-[75%] mb-6`}
      >
        {/* Parent message reference (if this is a reply) */}
        {parentId && parentContent && (
          <motion.div 
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            className={`
              ${isOwn ? 'text-right' : 'text-left'}
              px-4 py-1 mb-1 text-xs text-gray-400
              cursor-pointer hover:underline
            `}
            onClick={() => onViewThread && onViewThread(parentId)}
          >
            <span className="flex items-center gap-1">
              <Reply className="h-3 w-3" />
              Replying to: {parentContent.length > 50 ? parentContent.substring(0, 50) + "..." : parentContent}
            </span>
          </motion.div>
        )}
      
        <motion.div
          ref={messageRef}
          whileHover={{ scale: 1.01 }}
          className={`
            relative px-4 py-3 rounded-3xl max-w-full overflow-hidden cursor-pointer
            ${isOwn 
              ? 'bg-gradient-to-br from-indigo-600/90 to-indigo-800/90 text-white' 
              : 'bg-[#1E1E2F] text-gray-100'
            }
            shadow-lg backdrop-blur-sm
            border ${isPinned ? 'border-indigo-500' : 'border-white/5'}
          `}
          onClick={handleMessageClick}
        >
          {/* Sender info with profile indicator */}
          {!isOwn && showBusinessCard && (
            <div 
              className="flex items-center space-x-2 mb-1 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <span className="text-sm font-medium text-indigo-400">
                {senderAddress.slice(0, 8)}...
              </span>
              <span className="text-xs text-indigo-400/60">View Profile</span>
            </div>
          )}

          {/* Message content */}
          {displayContent && displayContent !== "" && (
            <p className="text-sm whitespace-pre-wrap break-words overflow-hidden max-w-full">
              {displayContent}
            </p>
          )}

          {/* GIF display */}
          {gifUrl && (
            <div className="mt-2 rounded-lg overflow-hidden max-w-full">
              <img 
                src={gifUrl.startsWith('cid=') 
                  ? `https://media.giphy.com/media/${gifUrl.split('cid=')[1].split('&')[0]}/giphy.gif`
                  : gifUrl} 
                alt="GIF" 
                className="max-w-full h-auto object-contain rounded-lg"
                onError={(e) => {
                  // Try alternative URL format if the original fails
                  if (!gifUrl.includes('media.giphy.com')) {
                    // Extract ID from various formats and try media.giphy.com format
                    let giphyId = '';
                    
                    if (gifUrl.includes('cid=')) {
                      giphyId = gifUrl.split('cid=')[1].split('&')[0];
                    } else if (gifUrl.includes('giphy.com/gifs/')) {
                      giphyId = gifUrl.split('giphy.com/gifs/')[1].split('-').pop() || '';
                    } else if (gifUrl.includes('i.giphy.com/')) {
                      giphyId = gifUrl.split('i.giphy.com/')[1].split('.')[0];
                    }
                    
                    if (giphyId) {
                      const fallbackUrl = `https://media.giphy.com/media/${giphyId}/giphy.gif`;
                      e.currentTarget.src = fallbackUrl;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>
          )}

          {/* Timestamp and edited indicator */}
          <div className="flex items-center mt-1 space-x-2 text-xs opacity-60">
            <span>{new Date(timestamp).toLocaleTimeString()}</span>
            {isEdited && <span>(edited)</span>}
            {isPinned && <Pin className="w-3 h-3" />}
          </div>

          {/* Thread indicator (if this message has replies) */}
          {replyCount > 0 && (
            <div className="mt-2 flex items-center text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewThread && onViewThread(messageId);
                }}
                className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded"
              >
                <MessageSquare className="h-3 w-3" />
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'} - View thread
              </button>
            </div>
          )}

          {/* Active reactions - Updated with grouping and animation */}
          {reactions && reactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                flex items-center space-x-1 mt-2 p-1
                bg-[#1E1E2F]/50 backdrop-blur-sm rounded-full
                border border-white/5
                ${isOwn ? 'justify-end' : 'justify-start'}
              `}
            >
              {Array.from(new Set(reactions)).map((emoji) => {
                const count = reactions.filter(r => r === emoji).length;
                return (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleReaction(emoji, e)}
                    className="flex items-center px-2 py-1 hover:bg-white/10 rounded-full transition-colors"
                    layout
                  >
                    <motion.span 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      {emoji}
                    </motion.span>
                    {count > 1 && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-1 text-xs bg-white/10 px-1 rounded-full"
                      >
                        {count}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Reaction bar - Updated with better animations */}
        <AnimatePresence>
          {showReactionBar && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-0 left-0 right-0 mx-auto w-max bg-[#1A1A2E] rounded-full shadow-lg border border-white/10 p-1 flex items-center space-x-1 z-50"
            >
              {reactionEmojis.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={(e) => handleReaction(emoji, e)}
                  className="p-2 hover:bg-white/10 rounded-full text-xl transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context Menu */}
        <AnimatePresence>
          {showContextMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-full mt-2 right-0 bg-[#1A1A2E] rounded-lg shadow-xl border border-white/10 py-1 z-50 w-56"
            >
              <div className="border-b border-white/10 py-1">
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={() => {
                    setShowContextMenu(false);
                    setShowReactionBar(true);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  React
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={() => {
                    onReply && onReply(messageId);
                    setShowContextMenu(false);
                  }}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={() => {
                    setShowContextMenu(false);
                    // This would open a GIF picker in a real implementation
                    alert("GIF picker would open here!");
                  }}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Send GIF
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={() => {
                    setShowContextMenu(false);
                    // This would open an emoji picker in a real implementation
                    alert("Emoji picker would open here!");
                  }}
                >
                  <Smile className="w-4 h-4 mr-2" />
                  Add Emoji
                </button>
                {replyCount > 0 && (
                  <button 
                    className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                    onClick={() => {
                      onViewThread && onViewThread(messageId);
                      setShowContextMenu(false);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View thread
                  </button>
                )}
              </div>

              {isOwn && (
                <div className="border-b border-white/10 py-1">
                  <button 
                    className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                    onClick={() => {
                      onEdit && onEdit(messageId);
                      setShowContextMenu(false);
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button 
                    className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                    onClick={() => {
                      onPin && onPin(messageId);
                      setShowContextMenu(false);
                    }}
                  >
                    <Pin className="w-4 h-4 mr-2" />
                    {isPinned ? 'Unpin' : 'Pin'}
                  </button>
                </div>
              )}

              <div className="py-1">
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={handleCopyText}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={handleCopyLink}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Copy Message Link
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={handleForward}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Forward
                </button>
              </div>

              {isOwn && (
                <div className="border-t border-white/10 py-1">
                  <button 
                    className={`flex items-center w-full px-4 py-2 text-left transition-colors
                      ${deleteConfirmation 
                        ? 'bg-green-500/30 text-white hover:bg-green-500/40' 
                        : 'text-red-400 hover:bg-red-500/20'}`}
                    onClick={handleDeleteClick}
                  >
                    {deleteConfirmation ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ARE YOU SURE?
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="border-t border-white/10 py-1">
                <button 
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-indigo-500/20 transition-colors"
                  onClick={() => setShowContextMenu(false)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Business Card Panel */}
      {showProfile && showBusinessCard && (
        <EonIDPanel
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userData={{
            username: senderAddress.slice(0, 8) + '...',
            walletAddress: senderAddress,
            ...businessCard
          }}
        />
      )}
    </>
  );
} 