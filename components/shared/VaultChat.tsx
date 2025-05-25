'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaUsers, 
  FaCircle,
  FaClock,
  FaHashtag,
  FaReply,
  FaEdit,
  FaTrashAlt,
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaFire
} from 'react-icons/fa';
import { 
  Bot, 
  Users, 
  MessageSquare, 
  Send, 
  Hash, 
  Smile, 
  Image, 
  MoreVertical,
  Reply,
  Edit3,
  Trash2,
  Pin,
  Copy,
  Link,
  Share,
  CheckCircle,
  Heart,
  Search,
  FileUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  type: 'user' | 'assistant' | 'system';
  userId: string;
  avatar?: string;
  reactions?: { [emoji: string]: string[] };
  isEdited?: boolean;
  isPinned?: boolean;
  parentId?: string;
  parentContent?: string;
  replyCount?: number;
  attachments?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
}

interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
}

interface VaultChatProps {
  // Required props
  messages: ChatMessage[];
  onSendMessage: (message: string, parentId?: string) => void;
  
  // Optional props
  title?: string;
  subtitle?: string;
  placeholder?: string;
  showUsers?: boolean;
  users?: ChatUser[];
  onlineUsers?: string[];
  loading?: boolean;
  showTimestamps?: boolean;
  enableMarkdown?: boolean;
  maxHeight?: string;
  variant?: 'default' | 'compact' | 'fullscreen';
  
  // Advanced features
  onUserMention?: (userId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onViewThread?: (messageId: string) => void;
  enableReactions?: boolean;
  enableFileUpload?: boolean;
  onFileUpload?: (file: File) => void;
  enableGifPicker?: boolean;
  onGifSelect?: (gifUrl: string) => void;
  
  // Styling
  headerIcon?: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'green' | 'red' | 'blue';
}

const reactionEmojis = ['❤️', '👍', '🙌', '😂', '😭', '🔥', '🎉'];

// ENIC.0 Analysis Helper Functions
const getContextualSuggestion = (content: string): string => {
  if (content.toLowerCase().includes('help') || content.includes('?')) {
    return "I recommend providing a clear, detailed response with specific examples or resources that directly address their question.";
  }
  if (content.toLowerCase().includes('problem') || content.toLowerCase().includes('issue')) {
    return "Consider asking clarifying questions to better understand the scope, then provide step-by-step troubleshooting guidance.";
  }
  if (content.toLowerCase().includes('idea') || content.toLowerCase().includes('suggest')) {
    return "Build on their idea by exploring potential implementations, benefits, and any considerations they should keep in mind.";
  }
  if (content.toLowerCase().includes('thank') || content.toLowerCase().includes('appreciate')) {
    return "Acknowledge their gratitude warmly and offer continued support or additional resources if relevant.";
  }
  return "Engage meaningfully by asking thoughtful follow-up questions or sharing relevant insights based on their message.";
};

const analyzeTone = (content: string): string => {
  if (content.includes('!') && content.includes('amazing')) return "Enthusiastic and positive";
  if (content.includes('?')) return "Inquisitive and seeking information";
  if (content.toLowerCase().includes('problem') || content.toLowerCase().includes('issue')) return "Concerned or problem-focused";
  if (content.toLowerCase().includes('thank') || content.toLowerCase().includes('appreciate')) return "Grateful and appreciative";
  if (content.includes('!')) return "Excited or emphatic";
  return "Neutral and informative";
};

const analyzeIntent = (content: string): string => {
  if (content.includes('?')) return "Seeking information or clarification";
  if (content.toLowerCase().includes('help')) return "Requesting assistance";
  if (content.toLowerCase().includes('share') || content.toLowerCase().includes('show')) return "Sharing information or resources";
  if (content.toLowerCase().includes('idea') || content.toLowerCase().includes('suggest')) return "Proposing concepts or suggestions";
  if (content.toLowerCase().includes('update') || content.toLowerCase().includes('news')) return "Providing updates or announcements";
  return "General communication or discussion";
};

const extractKeyTopics = (content: string): string => {
  const topics = [];
  if (content.toLowerCase().includes('feature') || content.toLowerCase().includes('functionality')) topics.push("Feature discussion");
  if (content.toLowerCase().includes('ui') || content.toLowerCase().includes('interface')) topics.push("User interface");
  if (content.toLowerCase().includes('bug') || content.toLowerCase().includes('error')) topics.push("Technical issues");
  if (content.toLowerCase().includes('token') || content.toLowerCase().includes('nft')) topics.push("Cryptocurrency/NFTs");
  if (content.toLowerCase().includes('community') || content.toLowerCase().includes('member')) topics.push("Community engagement");
  if (content.toLowerCase().includes('development') || content.toLowerCase().includes('code')) topics.push("Development");
  
  return topics.length > 0 ? topics.join(", ") : "General conversation";
};

const analyzeComplexity = (content: string): string => {
  const wordCount = content.split(' ').length;
  const hasTechnicalTerms = /\b(api|database|algorithm|implementation|architecture|framework)\b/i.test(content);
  
  if (wordCount > 50 || hasTechnicalTerms) return "High - Detailed or technical content";
  if (wordCount > 20) return "Medium - Moderate detail level";
  return "Low - Brief and straightforward";
};

const getContextualBreakdown = (content: string): string => {
  if (content.toLowerCase().includes('new') && content.toLowerCase().includes('feature')) {
    return "This appears to be discussing new functionality or capabilities being introduced.";
  }
  if (content.toLowerCase().includes('problem') || content.toLowerCase().includes('issue')) {
    return "The user is identifying or reporting a problem that needs attention or resolution.";
  }
  if (content.includes('?')) {
    return "This is an inquiry that would benefit from a comprehensive, helpful response.";
  }
  return "This message contributes to the ongoing conversation and maintains engagement.";
};

const getCommunicationInsights = (content: string): string => {
  const insights = [];
  
  if (content.length > 100) insights.push("Detailed message showing high engagement");
  if (content.includes('!')) insights.push("Expressive communication style");
  if (content.includes('?')) insights.push("Seeking interaction and response");
  if (content.toLowerCase().includes('we') || content.toLowerCase().includes('us')) insights.push("Collaborative mindset");
  if (content.toLowerCase().includes('thank') || content.toLowerCase().includes('appreciate')) insights.push("Positive and grateful communication");
  
  return insights.length > 0 ? insights.join(" • ") : "Standard conversational communication";
};

const VaultChat: React.FC<VaultChatProps> = ({
  messages,
  onSendMessage,
  title = "Chat",
  subtitle,
  placeholder = "Type a message...",
  showUsers = false,
  users = [],
  onlineUsers = [],
  loading = false,
  showTimestamps = true,
  maxHeight = "60vh",
  variant = "default",
  headerIcon,
  accentColor = "cyan",
  enableReactions = false,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onViewThread,
  enableFileUpload = false,
  onFileUpload,
  enableGifPicker = false,
  onGifSelect,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: ChatMessage } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showReactionBar, setShowReactionBar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [enicPopup, setEnicPopup] = useState<{
    type: 'summary' | 'suggest';
    messageId: string;
    messageContent: string;
    response: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    
    if (editingMessage) {
      // Handle edit
      onEdit?.(editingMessage.id, input);
      setEditingMessage(null);
    } else {
      // Handle new message or reply
      onSendMessage(input, replyingTo?.id);
      setReplyingTo(null);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === 'Escape') {
      setReplyingTo(null);
      setEditingMessage(null);
      setContextMenu(null);
      setShowEmojiPicker(null);
      setShowReactionBar(null);
      setEnicPopup(null);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <FaRobot className="w-4 h-4 text-purple-400" />;
      case 'assistant':
        return <Bot className="w-4 h-4 text-cyan-400" />;
      default:
        return <FaUsers className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, message: ChatMessage) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message
    });
  };

  const handleReaction = (messageId: string, emoji: string) => {
    onReaction?.(messageId, emoji);
    setShowReactionBar(null);
    setShowEmojiPicker(null);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    setContextMenu(null);
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message);
    setInput(message.content);
    setContextMenu(null);
  };

  const handleDelete = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete?.(messageId);
    }
    setContextMenu(null);
  };

  const handlePin = (messageId: string) => {
    onPin?.(messageId);
    setContextMenu(null);
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setContextMenu(null);
  };

  const handleCopyLink = (messageId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?msg=${messageId}`;
    navigator.clipboard.writeText(url);
    setContextMenu(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const accentColors = {
    cyan: {
      primary: 'text-cyan-300',
      border: 'border-cyan-500/20',
      bg: 'from-cyan-900/30 to-blue-900/30',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      button: 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/20'
    },
    purple: {
      primary: 'text-purple-300',
      border: 'border-purple-500/20',
      bg: 'from-purple-900/30 to-indigo-900/30',
      glow: 'shadow-[0_0_20px_rgba(147,51,234,0.1)]',
      button: 'border-purple-500/30 text-purple-300 hover:bg-purple-600/20'
    },
    green: {
      primary: 'text-green-300',
      border: 'border-green-500/20',
      bg: 'from-green-900/30 to-emerald-900/30',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.1)]',
      button: 'border-green-500/30 text-green-300 hover:bg-green-600/20'
    },
    red: {
      primary: 'text-red-300',
      border: 'border-red-500/20',
      bg: 'from-red-900/30 to-rose-900/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
      button: 'border-red-500/30 text-red-300 hover:bg-red-600/20'
    },
    blue: {
      primary: 'text-blue-300',
      border: 'border-blue-500/20',
      bg: 'from-blue-900/30 to-indigo-900/30',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]',
      button: 'border-blue-500/30 text-blue-300 hover:bg-blue-600/20'
    }
  };

  const colors = accentColors[accentColor];

  const chatLayout = variant === 'compact' ? 'h-[40vh]' : variant === 'fullscreen' ? 'h-[80vh]' : `h-[${maxHeight}]`;

  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.user.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col space-y-6">
      {/* Chat Area */}
      <Card variant="glow" className={`${chatLayout} flex flex-col ${colors.glow}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-3 ${colors.primary}`}>
              {headerIcon || <MessageSquare className="w-5 h-5" />}
              {title}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <div className="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full" />
                  Processing...
                </div>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-400 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
          {showSearch && (
            <div className="mt-3">
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border-gray-600/50"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                {/* Reply indicator */}
                {msg.parentId && msg.parentContent && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 pl-4 border-l-2 border-gray-600">
                    <Reply className="w-3 h-3" />
                    <span>Replying to: {msg.parentContent.slice(0, 50)}...</span>
                  </div>
                )}

                {showTimestamps && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {getMessageTypeIcon(msg.type)}
                    <span className="font-medium">{msg.user}</span>
                    <span className="text-gray-500">•</span>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.isEdited && <span className="text-yellow-400">(edited)</span>}
                    {msg.isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
                  </div>
                )}
                
                <div 
                  className={`relative group p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    msg.type === 'assistant' 
                      ? `bg-gradient-to-br ${colors.bg} border ${colors.border}`
                      : msg.type === 'system'
                      ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20'
                      : 'bg-gray-800/50 border border-gray-600/30 hover:bg-gray-800/70'
                  }`}
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Message attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                          <FileUp className="w-4 h-4" />
                          <span>{attachment.filename}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-sm hover:bg-gray-700 transition-colors"
                        >
                          <span>{emoji}</span>
                          <span className="text-xs">{users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Thread indicator */}
                  {msg.replyCount && msg.replyCount > 0 && (
                    <button
                      onClick={() => onViewThread?.(msg.id)}
                      className="flex items-center gap-1 mt-2 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>{msg.replyCount} {msg.replyCount === 1 ? 'reply' : 'replies'}</span>
                    </button>
                  )}

                  {/* Quick actions on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 bg-gray-900/80 rounded-lg p-1">
                      {enableReactions && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-gray-400 hover:text-white"
                          onClick={() => setShowReactionBar(showReactionBar === msg.id ? null : msg.id)}
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-white"
                        onClick={() => handleReply(msg)}
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-white"
                        onClick={(e) => handleContextMenu(e, msg)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Reaction Bar */}
                <AnimatePresence>
                  {showReactionBar === msg.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1 bg-gray-900/90 rounded-lg p-2 mx-4"
                    >
                      {reactionEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="p-2 hover:bg-gray-700 rounded-lg text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Reply/Edit Bar */}
      <AnimatePresence>
        {(replyingTo || editingMessage) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {editingMessage ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Editing message</span>
                  </>
                ) : (
                  <>
                    <Reply className="w-4 h-4" />
                    <span>Replying to {replyingTo?.user}: {replyingTo?.content.slice(0, 50)}...</span>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setEditingMessage(null);
                  setInput('');
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <Card variant="glow" className={colors.glow}>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {enableFileUpload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-white self-end"
              >
                <FileUp className="w-4 h-4" />
              </Button>
            )}
            {enableGifPicker && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white self-end"
              >
                <Image className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(showEmojiPicker ? null : 'input')}
              className="text-gray-400 hover:text-white self-end"
            >
              <Smile className="w-4 h-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={replyingTo ? `Reply to ${replyingTo.user}...` : editingMessage ? 'Edit message...' : placeholder}
              variant="glow"
              rows={variant === 'compact' ? 2 : 3}
              className="resize-none flex-1"
              disabled={loading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className={`${colors.button} self-end`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300">Ctrl+Enter</kbd> to send • <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300">Esc</kbd> to cancel
          </div>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 py-1 z-50 min-w-[200px]"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 220),
              top: Math.min(contextMenu.y, window.innerHeight - 300)
            }}
          >
            <button
              onClick={() => {
                setShowReactionBar(contextMenu.message.id);
                setContextMenu(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Heart className="w-4 h-4" />
              React
            </button>
            <button
              onClick={() => handleReply(contextMenu.message)}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
            {contextMenu.message.replyCount && contextMenu.message.replyCount > 0 && (
              <button
                onClick={() => {
                  onViewThread?.(contextMenu.message.id);
                  setContextMenu(null);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                View Replies
              </button>
            )}
            {contextMenu.message.userId === 'current-user' && (
              <>
                <button
                  onClick={() => handleEdit(contextMenu.message)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handlePin(contextMenu.message.id)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                >
                  <Pin className="w-4 h-4" />
                  {contextMenu.message.isPinned ? 'Unpin' : 'Pin'}
                </button>
              </>
            )}
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
              onClick={() => {
                // Handle GIF picker
                setContextMenu(null);
              }}
            >
              <Image className="w-4 h-4" />
              Send GIF
            </button>
            <button
              onClick={() => {
                setShowEmojiPicker(contextMenu.message.id);
                setContextMenu(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Smile className="w-4 h-4" />
              Add Emoji
            </button>
            <hr className="border-gray-700 my-1" />
            <button
              onClick={() => handleCopyText(contextMenu.message.content)}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Text
            </button>
            <button
              onClick={() => handleCopyLink(contextMenu.message.id)}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              Copy Message Link
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
            >
              <Share className="w-4 h-4" />
              Forward
            </button>
            <hr className="border-gray-700 my-1" />
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-cyan-300 hover:bg-cyan-600/20 transition-colors"
              onClick={() => {
                const suggestion = `Based on "${contextMenu.message.content.slice(0, 50)}...", here's my intelligent response:\n\n${getContextualSuggestion(contextMenu.message.content)}\n\nThis suggestion takes into account the context and provides actionable guidance for your conversation.`;
                
                setEnicPopup({
                  type: 'suggest',
                  messageId: contextMenu.message.id,
                  messageContent: contextMenu.message.content,
                  response: suggestion
                });
                setContextMenu(null);
              }}
            >
              <Bot className="w-4 h-4" />
              📘 ENIC.0 Suggest
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-cyan-300 hover:bg-cyan-600/20 transition-colors"
              onClick={() => {
                const summary = `📋 **Message Breakdown & Analysis:**\n\n**Original Message:** "${contextMenu.message.content}"\n\n**Length:** ${contextMenu.message.content.length} characters\n**Word Count:** ${contextMenu.message.content.split(' ').length} words\n\n**Content Analysis:**\n• **Tone:** ${analyzeTone(contextMenu.message.content)}\n• **Intent:** ${analyzeIntent(contextMenu.message.content)}\n• **Key Topics:** ${extractKeyTopics(contextMenu.message.content)}\n• **Complexity:** ${analyzeComplexity(contextMenu.message.content)}\n\n**Context Understanding:**\n${getContextualBreakdown(contextMenu.message.content)}\n\n**Communication Insights:**\n${getCommunicationInsights(contextMenu.message.content)}`;
                
                setEnicPopup({
                  type: 'summary',
                  messageId: contextMenu.message.id,
                  messageContent: contextMenu.message.content,
                  response: summary
                });
                setContextMenu(null);
              }}
            >
              <Bot className="w-4 h-4" />
              🧠 ENIC.0 Summary
            </button>
            <hr className="border-gray-700 my-1" />
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
              onClick={() => {
                console.log('Select message:', contextMenu.message.id);
                setContextMenu(null);
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Select
            </button>
            {contextMenu.message.userId === 'current-user' && (
              <>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={() => handleDelete(contextMenu.message.id)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      {enableFileUpload && (
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
      )}

      {/* Users Sidebar (optional) */}
      {showUsers && users.length > 0 && (
        <Card variant="outlined" className="max-h-[30vh] overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className={`flex items-center gap-2 ${colors.primary}`}>
              <FaUsers className="w-4 h-4" />
              Online Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {users.filter(user => onlineUsers.includes(user.id)).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xs">
                      {user.username === 'ENIC.0' ? '🤖' : user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <FaCircle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                      user.status === 'online' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{user.username}</div>
                    <div className={`text-xs ${user.status === 'online' ? 'text-green-400' : 'text-gray-500'}`}>
                      {user.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close menus */}
      {(contextMenu || showReactionBar || showEmojiPicker || enicPopup) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setContextMenu(null);
            setShowReactionBar(null);
            setShowEmojiPicker(null);
            setEnicPopup(null);
          }}
        />
      )}

      {/* ENIC.0 Popup */}
      <AnimatePresence>
        {enicPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        ENIC.0 {enicPopup.type === 'summary' ? 'Message Analysis' : 'Intelligent Suggestion'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {enicPopup.type === 'summary' ? 'Detailed breakdown of the message' : 'AI-powered response suggestion'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEnicPopup(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Original Message Reference */}
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Original Message:</h4>
                  <p className="text-sm text-gray-100 bg-gray-700/30 rounded p-3">
                    {enicPopup.messageContent}
                  </p>
                </div>

                {/* ENIC.0 Response */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-300">ENIC.0 Response</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-100 font-sans leading-relaxed">
                      {enicPopup.response}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800/50 p-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {enicPopup.type === 'summary' ? 'This analysis is only visible to you' : 'This suggestion is only visible to you'}
                  </div>
                  <div className="flex items-center gap-3">
                    {enicPopup.type === 'suggest' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Send the suggestion as a message
                          onSendMessage(`ENIC.0 suggested: ${getContextualSuggestion(enicPopup.messageContent)}`);
                          setEnicPopup(null);
                        }}
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/20"
                      >
                        📤 Reply With Suggestion
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEnicPopup(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultChat; 