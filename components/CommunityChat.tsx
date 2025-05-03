import { useEffect, useState, useRef } from "react";
import { supabase, subscribeToChannel, unsubscribeFromChannel } from "../utils/supabase";
import { Smile, Edit3, Trash2, Pin, CornerDownRight } from "lucide-react";

interface CommunityMessage {
  id: string;
  content: string;
  sender_address: string;
  room: string;
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
}

interface Props {
  userWalletAddress: string;
  roomId: string;
}

export default function CommunityChat({ userWalletAddress, roomId }: Props): JSX.Element {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [pinnedMsg, setPinnedMsg] = useState<CommunityMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [currentRoom] = useState(roomId);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ wallet_address: string }>>([]);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load existing messages and setup realtime subscription
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("community_messages")
          .select("*")
          .eq("room", currentRoom)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          setError(error.message);
          return;
        }

        // Find pinned message
        const pinned = data?.find(m => m.pinned);
        setPinnedMsg(pinned || null);
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("public:community_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_messages",
          filter: `room=eq.${currentRoom}`,
        },
        (payload) => {
          console.log("Received realtime update:", payload);
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as CommunityMessage]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => 
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new as CommunityMessage : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentRoom]);

  const handleDeleteMessage = async (messageId: string) => {
    if (deleteConfirm !== messageId) {
      setDeleteConfirm(messageId);
      return;
    }

    try {
      const { error } = await supabase
        .from("community_messages")
        .delete()
        .match({ id: messageId, sender_address: userWalletAddress });

      if (error) {
        console.error('Error deleting message:', error);
        return;
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      if (editing) {
        const { error } = await supabase
          .from("community_messages")
          .update({ content: message })
          .match({ id: editing, sender_address: userWalletAddress });

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from("community_messages")
          .insert([
            {
              content: message,
              sender_address: userWalletAddress,
              room_id: currentRoom,
              created_at: new Date().toISOString(),
              edited_at: null,
              reply_to: replyTo,
              reactions: [],
              pinned: false,
              attachments: [],
              thread_count: 0,
            },
          ]);

        if (error) throw error;
        setReplyTo(null);
      }

      setMessage("");
    } catch (error) {
      console.error("Error with message:", error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    const newReactions = msg.reactions.includes(emoji)
      ? msg.reactions.filter((e) => e !== emoji)
      : [...msg.reactions, emoji];

    try {
      await supabase
        .from("community_messages")
        .update({ reactions: newReactions })
        .match({ id: messageId });
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  };

  const handlePin = async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    try {
      // If we're pinning this message, unpin any existing pinned message
      if (!msg.pinned) {
        await supabase
          .from("community_messages")
          .update({ pinned: false })
          .eq("room", currentRoom)
          .eq("pinned", true);
      }

      // Pin/unpin the selected message
      const { error } = await supabase
        .from("community_messages")
        .update({ pinned: !msg.pinned })
        .match({ id: messageId });

      if (error) {
        console.error("Error pinning message:", error);
        return;
      }

      // Update local state
      if (!msg.pinned) {
        setPinnedMsg({ ...msg, pinned: true });
      } else {
        setPinnedMsg(null);
      }

      // Update the message in the list
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, pinned: !m.pinned } : m)
      );
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userWalletAddress}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      await supabase.from("community_messages").insert([
        {
          content: message || '📎 Attachment',
          sender_address: userWalletAddress,
          room_id: currentRoom,
          attachments: [{
            url: publicUrl,
            type: file.type,
            filename: file.name
          }]
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Load online users
  useEffect(() => {
    const loadOnlineUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('online_users')
          .select('wallet_address')
          .eq('room_id', currentRoom)
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        if (error) {
          console.error('Error loading online users:', error);
          return;
        }

        setOnlineUsers(data || []);
      } catch (error) {
        console.error('Error loading online users:', error);
      }
    };

    loadOnlineUsers();
    const interval = setInterval(loadOnlineUsers, 30000);

    return () => clearInterval(interval);
  }, [currentRoom]);

  // Update presence
  useEffect(() => {
    const updatePresence = async () => {
      try {
        await supabase
          .from('online_users')
          .upsert({
            wallet_address: userWalletAddress,
            room: currentRoom,
            last_seen: new Date().toISOString()
          }, {
            onConflict: 'wallet_address',
            ignoreDuplicates: false
          });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => clearInterval(interval);
  }, [userWalletAddress, currentRoom]);

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {pinnedMsg && (
          <div className="absolute top-0 left-0 right-0 bg-indigo-900/90 backdrop-blur-sm text-indigo-200 px-6 py-3 border-b-2 border-indigo-500/50 shadow-lg z-40 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Pin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <p className="text-sm truncate">
                <span className="font-medium text-indigo-300">Pinned:</span>{' '}
                {pinnedMsg.content}
              </p>
            </div>
            {pinnedMsg.sender_address === userWalletAddress && (
              <button
                onClick={() => handlePin(pinnedMsg.id)}
                className="ml-4 text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0"
              >
                <span className="text-xs">Unpin</span>
              </button>
            )}
          </div>
        )}
        {/* rooms.map(room => (
          <div key={room.id} className="relative group">
            <button
              onClick={() => setCurrentRoom(room.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                // Show online users modal or tooltip
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${currentRoom === room.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {room.name}
            </button>
            <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 p-2 bg-gray-800 rounded-lg shadow-lg z-50">
              <div className="text-sm text-gray-300">
                Online Users ({onlineUsers.length}):
                {onlineUsers.map(user => (
                  <div key={user.wallet_address} className="text-xs text-gray-400 mt-1">
                    {user.wallet_address.slice(0, 8)}...
                  </div>
                ))}
              </div>
            </div>
          </div>
        )) */}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-indigo-400 text-sm">Loading messages...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/50 text-red-200 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs text-red-300 hover:text-red-200 underline mt-2"
            >
              Try refreshing the page
            </button>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender_address === userWalletAddress ? 'justify-end' : ''} ${msg.pinned ? 'bg-gray-800/30 rounded-xl p-2' : ''}`}
            onMouseEnter={() => setHoveredMessage(msg.id)}
            onMouseLeave={() => {
              setHoveredMessage(null);
              if (deleteConfirm === msg.id) {
                setDeleteConfirm(null);
              }
              setShowEmojiPicker(null);
            }}
          >
            {msg.sender_address !== userWalletAddress && (
              <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                <span className="text-sm text-indigo-400 font-mono">
                  {msg.sender_address.slice(0, 4)}
                </span>
              </div>
            )}
            <div className="group relative max-w-[70%]">
              {msg.reply_to && (
                <div className="mb-1 text-sm text-gray-400 flex items-center space-x-1">
                  <CornerDownRight className="w-3 h-3" />
                  <span className="italic truncate">
                    {messages.find(m => m.id === msg.reply_to)?.content || "Message not found"}
                  </span>
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${msg.sender_address === userWalletAddress
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-100'
                  } transition-all duration-200 ${hoveredMessage === msg.id ? 'shadow-lg' : ''}`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>

                {msg.attachments?.map((attachment, index) => (
                  <div key={index} className="mt-2">
                    {attachment.type.startsWith('image/') ? (
                      <img 
                        src={attachment.url} 
                        alt={attachment.filename}
                        className="max-w-full rounded-lg"
                      />
                    ) : (
                      <a 
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1"
                      >
                        📎 {attachment.filename}
                      </a>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                    {msg.edited_at && (
                      <span className="italic">(edited)</span>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center space-x-1">
                    {msg.reactions?.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => handleReaction(msg.id, reaction)}
                        className="hover:scale-110 transition-transform"
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {hoveredMessage === msg.id && (
                <div className="fixed transform opacity-0 group-hover:opacity-100 flex items-center space-x-2 bg-gray-800 rounded-lg px-2 py-1 shadow-lg transition-opacity duration-200"
                  style={{
                    top: 'var(--menu-top, 0px)',
                    left: 'var(--menu-left, 0px)',
                    zIndex: 50
                  }}
                  ref={(el) => {
                    if (el) {
                      const rect = el.getBoundingClientRect();
                      const parentRect = el.parentElement?.getBoundingClientRect();
                      if (parentRect) {
                        const top = parentRect.top - rect.height - 8;
                        const left = Math.min(
                          parentRect.left,
                          window.innerWidth - rect.width - 16
                        );
                        el.style.setProperty('--menu-top', `${top}px`);
                        el.style.setProperty('--menu-left', `${left}px`);
                      }
                    }
                  }}>
                  <button
                    onClick={() => setShowEmojiPicker(msg.id)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setReplyTo(msg.id)}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <CornerDownRight className="w-4 h-4" />
                  </button>
                  {msg.sender_address === userWalletAddress && (
                    <>
                      <button
                        onClick={() => {
                          setMessage(msg.content);
                          setEditing(msg.id);
                        }}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        {deleteConfirm === msg.id ? '✓' : <Trash2 className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handlePin(msg.id)}
                    className={`transition-colors ${msg.pinned ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Emoji picker */}
              {showEmojiPicker === msg.id && (
                <div className="absolute top-0 right-0 transform -translate-y-full bg-gray-800 rounded-lg p-2 shadow-lg z-10">
                  <div className="grid grid-cols-6 gap-1">
                    {['👍', '❤️', '😂', '🎉', '🤔', '👀'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          handleReaction(msg.id, emoji);
                          setShowEmojiPicker(null);
                        }}
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        {replyTo && (
          <div className="mb-2 text-sm text-indigo-400 flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <CornerDownRight className="w-4 h-4" />
              <span className="italic truncate">
                {messages.find(m => m.id === replyTo)?.content || "Message not found"}
              </span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={editing ? "Edit message..." : "Type a message..."}
              className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition-colors"
            >
              📎
            </button>
            <button
              type="submit"
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {editing ? "Update" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
