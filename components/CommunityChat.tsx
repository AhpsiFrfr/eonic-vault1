import { useEffect, useState, useRef, useCallback } from "react";
import { Smile, Edit3, Trash2, Pin, CornerDownRight, Image, Users, Search } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from "./MessageBubble";
import { MembersPanel } from "./MembersPanel";
import MessageSearch from "./MessageSearch";
import { v4 as uuidv4 } from 'uuid';
import { getMockProfile } from "../utils/mock-data";
import { FileUpload } from './FileUpload';
import { ReactionAnimationsContainer } from './ReactionAnimationsContainer';
import { useReactionAnimation } from '../hooks/useReactionAnimation';
import { GifPickerModal } from './GifPickerModal';

// Mock data structure
interface CommunityMessage {
  id: string;
  content: string;
  sender_address: string;
  room: string;
  channel: string;
  created_at: string;
  edited_at?: string;
  reply_to?: string;
  reactions: string[];
  pinned: boolean;
  attachments: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
  parent_id?: string;
  thread_count: number;
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
}

interface Props {
  userWalletAddress: string;
  roomId: string;
  channel: string;
  viewMode?: 'web' | 'mobile';
}

type ViewMode = 'web' | 'mobile';

// Generate mock data based on the room
const generateMockMessages = (room: string, channel: string): CommunityMessage[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  
  // Different content for different rooms
  const mockContent: Record<string, string[]> = {
    community: [
      "Welcome to the EONIC community!",
      "Has anyone seen the new features in the vault?",
      "The timepiece NFTs look amazing!",
      "I'm excited about the upcoming features."
    ],
    lounge: [
      "Holders only! This is the exclusive lounge.",
      "What are your thoughts on the latest EON token performance?",
      "I love the new benefits for holders.",
      "Anyone planning to increase their holdings?"
    ],
    cabal: [
      "Top secret Cabal discussion here.",
      "NFT + token holders unite!",
      "When is the next exclusive event?",
      "The Cabal grows stronger every day."
    ],
    board: [
      "Team update: New roadmap coming next week.",
      "Development progress is on track.",
      "Marketing campaign starting soon.",
      "Admin discussion for upcoming changes."
    ]
  };
  
  // Default to community chat content if room not found
  const content = mockContent[room] || mockContent.community;
  
  // Generate mock messages
  return [
    {
      id: uuidv4(),
      content: content[0],
      sender_address: "0x1234...5678", // Mock admin address
      room,
      channel,
      created_at: twoHoursAgo.toISOString(),
      reactions: ["👍", "❤️"],
      pinned: true,
      attachments: [],
      thread_count: 0,
      showBusinessCard: true,
      businessCard: {
        ensName: "EONIC.Admin",
        role: "Admin",
        timepieceStage: "Genesis",
        lookingFor: "Community Growth",
        links: {
          website: "https://eonic.com"
        }
      }
    },
    {
      id: uuidv4(),
      content: content[1],
      sender_address: "0xabcd...efgh", 
      room,
      channel,
      created_at: oneHourAgo.toISOString(),
      reactions: ["🔥"],
      pinned: false,
      attachments: [],
      thread_count: 0
    },
    {
      id: uuidv4(),
      content: content[2],
      sender_address: "0x7890...1234",
      room,
      channel,
      created_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      reactions: [],
      pinned: false,
      attachments: [],
      thread_count: 0
    },
    {
      id: uuidv4(),
      content: content[3],
      sender_address: "0xijkl...mnop",
      room,
      channel,
      created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      reactions: ["👀"],
      pinned: false,
      attachments: [],
      thread_count: 0
    }
  ];
};

// Mock user data
const mockOnlineUsers = [
  { wallet_address: "0x1234...5678", display_name: "EONIC.Admin", avatar_url: "/default-avatar.png" },
  { wallet_address: "0xabcd...efgh", display_name: "TokenHolder1", avatar_url: "/default-avatar.png" },
  { wallet_address: "0x7890...1234", display_name: "NFTCollector", avatar_url: "/default-avatar.png" }
];

const mockCommunityUsers = [
  { id: "1", username: "EONIC.Admin", display_name: "EONIC.Admin", wallet_address: "0x1234...5678", last_seen: new Date().toISOString(), avatar_url: "/default-avatar.png" },
  { id: "2", username: "TokenHolder1", display_name: "TokenHolder1", wallet_address: "0xabcd...efgh", last_seen: new Date().toISOString(), avatar_url: "/default-avatar.png" },
  { id: "3", username: "NFTCollector", display_name: "NFTCollector", wallet_address: "0x7890...1234", last_seen: new Date().toISOString(), avatar_url: "/default-avatar.png" },
  { id: "4", username: "CommunityMember", display_name: "CommunityMember", wallet_address: "0xijkl...mnop", last_seen: new Date().toISOString(), avatar_url: "/default-avatar.png" }
];

export default function CommunityChat({ userWalletAddress, roomId, channel, viewMode = 'web' }: Props): JSX.Element {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<CommunityMessage[]>([]);
  const [pinnedMsg, setPinnedMsg] = useState<CommunityMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const { triggerReaction, addReaction } = useReactionAnimation();
  
  // Load mock messages
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        const mockMessages = generateMockMessages(roomId, channel);
        setMessages(mockMessages);
        
        // Find pinned message
        const pinned = mockMessages.find(m => m.pinned);
        setPinnedMsg(pinned || null);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading mock messages:", error);
        setError("Failed to load messages. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [roomId, channel]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteMessage = async (messageId: string) => {
    // Only allow deleting messages sent by the current user
    const msgToDelete = messages.find(m => m.id === messageId);
    if (!msgToDelete) {
      setError('Message not found');
      return;
    }

    if (msgToDelete.sender_address !== userWalletAddress) {
      setError('You can only delete your own messages');
      return;
    }

    // Update local state by removing the message
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setDeleteConfirm(null);
  };

  const handleEditMessage = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;
    
    setEditing(messageId);
    setMessage(msg.content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      if (editing) {
        // Edit existing message
        const editMsg = messages.find(m => m.id === editing);
        if (!editMsg) {
          setEditing(null);
          return;
        }
        
        // Update the message locally
        setMessages(prev => 
          prev.map(msg => 
            msg.id === editing 
              ? { ...msg, content: message, edited_at: new Date().toISOString() } 
              : msg
          )
        );
        
        setEditing(null);
      } else {
        // Create new message
        const newMessage: CommunityMessage = {
          id: uuidv4(),
          content: message,
          sender_address: userWalletAddress,
          room: roomId,
          channel: channel || 'community-chat',
          created_at: new Date().toISOString(),
          reactions: [],
          pinned: false,
          attachments: [],
          thread_count: 0
        };
        
        // Add to local state
        setMessages(prev => [...prev, newMessage]);
      }
      
      // Clear input
      setMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error with message:", error);
      setError("Failed to send message");
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    // Manually trigger animation at center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    addReaction({
      messageId,
      emoji,
      position: { x: centerX, y: centerY },
      animationType: Math.random() > 0.5 ? 'burst' : 'spin'
    });

    const newReactions = msg.reactions.includes(emoji)
      ? msg.reactions.filter((e) => e !== emoji)
      : [...msg.reactions, emoji];
    
    // Update local state
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, reactions: newReactions } : m)
    );
  };

  const handlePin = async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    // If pinning this message, unpin any currently pinned message
    if (!msg.pinned) {
      setMessages(prev =>
        prev.map(m => m.pinned ? { ...m, pinned: false } : m)
      );
    }
    
    // Toggle pin state for the selected message
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, pinned: !m.pinned } : m)
    );
    
    // Update pinned message reference
    if (!msg.pinned) {
      setPinnedMsg({ ...msg, pinned: true });
    } else {
      setPinnedMsg(null);
    }
  };

  // Handle search
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const q = query.toLowerCase();
    setFilteredMessages(
      messages.filter(m => 
        m.content.toLowerCase().includes(q) || 
        m.sender_address.toLowerCase().includes(q)
      )
    );
  }, [messages]);

  // Update filtered messages when messages change
  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

  // Add this function to handle GIF selection
  const handleGifSelect = (gifUrl: string) => {
    setShowGifPicker(false);
    
    // Create a new message with the GIF
    const newMessage: CommunityMessage = {
      id: uuidv4(),
      content: `GIF: ${gifUrl}`,
      sender_address: userWalletAddress,
      room: roomId,
      channel: channel || 'community-chat',
      created_at: new Date().toISOString(),
      reactions: [],
      pinned: false,
      attachments: [],
      thread_count: 0
    };
    
    // Add to local state
    setMessages(prev => [...prev, newMessage]);
    setError("GIF added successfully!");
    setTimeout(() => setError(null), 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-[#0F0F1A] relative ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
      {/* Header with members toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#1E1E2F]/30 backdrop-blur-sm">
        <h2 className="text-lg font-medium text-white">
          {roomId.charAt(0).toUpperCase() + roomId.slice(1)} Chat
        </h2>
        <div className="flex items-center space-x-3">
          {/* Test button to demonstrate reaction animations */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Demo reactions with random emojis
              const emojis = ['❤️', '👍', '🙌', '😂', '😭', '🌭', '🔥'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              if (messages.length > 0) {
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                handleReaction(randomMsg.id, randomEmoji);
              }
            }}
            className="p-2 rounded-lg transition-colors hover:bg-white/5 text-gray-400 hover:text-indigo-400"
            title="Demo Reactions"
          >
            <span className="text-xl">😀</span>
          </motion.button>
          
          {/* Test button to demonstrate GIF picker */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGifPicker(true)}
            className="p-2 rounded-lg transition-colors hover:bg-white/5 text-gray-400 hover:text-indigo-400"
            title="Demo GIF Picker"
          >
            <span className="text-xl">🖼️</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearchBox(!showSearchBox)}
            className={`p-2 rounded-lg transition-colors ${
              showSearchBox 
                ? 'bg-indigo-500/20 text-indigo-400' 
                : 'hover:bg-white/5 text-gray-400 hover:text-indigo-400'
            }`}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMembersPanel(!showMembersPanel)}
            className={`p-2 rounded-lg transition-colors ${
              showMembersPanel 
                ? 'bg-indigo-500/20 text-indigo-400' 
                : 'hover:bg-white/5 text-gray-400 hover:text-indigo-400'
            }`}
          >
            <Users className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Search Box */}
      <AnimatePresence>
        {showSearchBox && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MessageSearch onSearch={handleSearch} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 mx-auto w-[90%] max-w-md bg-red-500/90 text-white p-3 rounded-lg shadow-lg z-50 flex justify-between items-center"
          >
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-red-200"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Members Panel */}
      <MembersPanel
        isOpen={showMembersPanel}
        onClose={() => setShowMembersPanel(false)}
        onlineUsers={[
          // Current user first
          {
            id: userWalletAddress,
            username: getMockProfile(userWalletAddress)?.display_name || `${userWalletAddress.slice(0, 4)}...${userWalletAddress.slice(-4)}`,
            wallet_address: userWalletAddress,
            last_seen: new Date().toISOString(),
            showBusinessCard: true,
            avatar_url: getMockProfile(userWalletAddress)?.avatar_url || "/default-avatar.png"
          },
          // Other online users
          ...mockOnlineUsers
            .filter(user => user.wallet_address !== userWalletAddress)
            .map(user => ({
              id: user.wallet_address,
              username: user.display_name || `${user.wallet_address.slice(0, 4)}...${user.wallet_address.slice(-4)}`,
              wallet_address: user.wallet_address,
              last_seen: new Date().toISOString(),
              avatar_url: user.avatar_url
            }))
        ]}
        communityUsers={mockCommunityUsers.filter(user => 
          !mockOnlineUsers.some(onlineUser => onlineUser.wallet_address === user.wallet_address) &&
          user.wallet_address !== userWalletAddress
        )}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Pinned Message */}
        {pinnedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 mb-4"
          >
            <div className="flex items-center text-xs text-indigo-400 mb-1">
              <Pin className="w-3 h-3 mr-1" />
              Pinned Message
            </div>
            <div className="text-sm text-white">{pinnedMsg.content}</div>
          </motion.div>
        )}

        {/* Messages */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="mb-2">No messages found</p>
            <p className="text-sm">Try a different search or clear your filter</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="relative group mb-4">
                <MessageBubble
                  messageId={msg.id}
                  content={msg.content}
                  isOwn={msg.sender_address === userWalletAddress}
                  reactions={msg.reactions || []}
                  timestamp={msg.created_at}
                  isEdited={!!msg.edited_at}
                  isPinned={!!msg.pinned}
                  onReaction={(emoji) => handleReaction(msg.id, emoji)}
                  onReply={(msgId) => setReplyTo(msgId)}
                  onEdit={(msgId) => handleEditMessage(msgId)}
                  onPin={(msgId) => handlePin(msgId)}
                  onDelete={(msgId) => handleDeleteMessage(msgId)}
                  showBusinessCard={msg.showBusinessCard}
                  businessCard={msg.businessCard}
                  senderAddress={msg.sender_address}
                />
              </div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/5 bg-[#1E1E2F]/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-2">
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center justify-between bg-[#1E1E2F]/50 backdrop-blur-sm rounded-xl p-2 border border-white/5"
            >
              <div className="flex items-center space-x-2 text-sm text-indigo-300">
                <CornerDownRight className="w-4 h-4" />
                <span className="italic truncate">
                  {messages.find(m => m.id === replyTo)?.content || "Message not found"}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                ×
              </motion.button>
            </motion.div>
          )}

          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={editing ? "Edit message..." : "Type a message..."}
              className="flex-1 p-3 bg-[#1E1E2F]/80 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <div className="flex items-center">
              <div className="p-2 text-gray-400 hover:text-indigo-400 rounded-xl transition-colors bg-[#1E1E2F]/80 border border-white/5">
                <FileUpload 
                  onFileSelect={(files) => {
                    // Handle file selection in mock mode by showing a preview toast
                    const fileNames = Array.from(files).map(f => f.name).join(', ');
                    setError(`Mock mode: Would upload ${fileNames}`);
                    setTimeout(() => setError(null), 3000);
                  }}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl hover:from-indigo-500 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              {editing ? "Update" : "Send"}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Reaction animations container */}
      <ReactionAnimationsContainer />

      {/* Add GIF Picker Modal */}
      <AnimatePresence>
        {showGifPicker && (
          <GifPickerModal
            onClose={() => setShowGifPicker(false)}
            onSelect={handleGifSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
