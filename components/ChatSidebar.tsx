import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
}

interface OnlineUser {
  id: string;
  username: string;
  wallet_address: string;
  last_seen: string;
}

interface ContextMenuPosition {
  x: number;
  y: number;
  roomId: string;
}

interface ChatSidebarProps {
  rooms: Room[];
  currentRoom: string;
  onRoomSelect: (roomId: string) => void;
  getOnlineUsers: (roomId: string) => Promise<OnlineUser[]>;
}

const ChatSidebar = ({ rooms, currentRoom, onRoomSelect, getOnlineUsers }: ChatSidebarProps) => {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const handleRightClick = async (event: React.MouseEvent, roomId: string) => {
    event.preventDefault();
    setLoading(true);
    try {
      const users = await getOnlineUsers(roomId);
      setOnlineUsers(users);
      setContextMenu({ 
        x: event.clientX, 
        y: event.clientY, 
        roomId 
      });
    } catch (error) {
      console.error('Error fetching online users:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu && !(event.target as Element).closest('.context-menu')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu, closeMenu]);
  const startDM = (user: OnlineUser) => {
    closeMenu();
    router.push(`/messages/${user.wallet_address}`);
  };

  return (
    <aside className="w-64 bg-black text-white border-r border-gray-800 p-4 relative">
      <motion.h2 
        className="text-xl font-bold mb-6 text-indigo-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Chat Rooms
      </motion.h2>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <motion.li
            key={room.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`cursor-pointer p-3 rounded-lg font-medium transition-all duration-200 ${
              currentRoom === room.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => onRoomSelect(room.id)}
            onContextMenu={(e) => handleRightClick(e, room.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {room.name}
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="context-menu fixed z-50 bg-gray-900/90 backdrop-blur-sm border border-indigo-500/30 rounded-xl shadow-xl overflow-hidden"
            style={{
              top: Math.min(contextMenu.y, window.innerHeight - 200),
              left: Math.min(contextMenu.x, window.innerWidth - 250),
              width: '240px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
            }}
          >
            <motion.div 
              className="p-3 border-b border-indigo-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-sm font-semibold text-indigo-300">Online Users</h4>
            </motion.div>
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
              {loading ? (
                <div className="p-3 text-sm text-gray-400">Loading...</div>
              ) : onlineUsers.length > 0 ? (
                <ul className="p-1 space-y-1">
                  {onlineUsers.map((user) => (
                    <motion.li
                      key={user.id}
                      className="group flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-all duration-200 hover:bg-indigo-500/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ x: 4 }}
                      onHoverStart={() => setHoveredUser(user.id)}
                      onHoverEnd={() => setHoveredUser(null)}
                    >
                      <span>{user.username || user.wallet_address.slice(0, 8) + '...'}</span>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: hoveredUser === user.id ? 1 : 0,
                          scale: hoveredUser === user.id ? 1 : 0.8
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startDM(user);
                        }}
                        className="p-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                        title={`Message ${user.username || user.wallet_address.slice(0, 8)}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-indigo-300" />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 text-sm text-gray-400"
                >
                  No users online
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default ChatSidebar;
