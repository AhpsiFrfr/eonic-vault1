import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { BusinessCardPanel } from './BusinessCardPanel';
import { useState } from 'react';
import { getMockProfile } from '../utils/mock-data';

interface User {
  id: string;
  username: string;
  wallet_address: string;
  last_seen: string;
  avatar_url?: string;
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

interface MembersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onlineUsers: User[];
  communityUsers: User[];
}

export function MembersPanel({ isOpen, onClose, onlineUsers, communityUsers }: MembersPanelProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    const profile = getMockProfile(user.wallet_address);
    const hasBusinessCard = user.showBusinessCard || (profile && profile.show_business_card);
    
    if (hasBusinessCard) {
      setSelectedUser(user);
    }
  };

  const userHasBusinessCard = (user: User) => {
    const profile = getMockProfile(user.wallet_address);
    return user.showBusinessCard || (profile && profile.show_business_card);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 right-4 w-64 bg-[#1E1E2F]/95 backdrop-blur-lg rounded-xl border border-white/5 shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-medium text-white">Members</h3>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {/* Online Users */}
              <div className="p-3">
                <h4 className="text-xs font-medium text-indigo-400 mb-2">Online</h4>
                <div className="space-y-1">
                  {onlineUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleUserClick(user)}
                      className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-white/5 ${
                        userHasBusinessCard(user) ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center overflow-hidden">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.username}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/default-avatar.png';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1E1E2F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white truncate block">
                          {user.username}
                        </span>
                        {userHasBusinessCard(user) && (
                          <span className="text-xs text-indigo-400">View Profile</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Community Users */}
              <div className="p-3">
                <h4 className="text-xs font-medium text-gray-400 mb-2">Community</h4>
                <div className="space-y-1">
                  {communityUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleUserClick(user)}
                      className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-white/5 ${
                        userHasBusinessCard(user) ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.username}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/default-avatar.png';
                            }}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-400 truncate block">
                          {user.username}
                        </span>
                        {userHasBusinessCard(user) && (
                          <span className="text-xs text-indigo-400">View Profile</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Business Card Panel */}
          {selectedUser && (
            <BusinessCardPanel
              isOpen={!!selectedUser}
              onClose={() => setSelectedUser(null)}
              userData={{
                username: selectedUser.username,
                walletAddress: selectedUser.wallet_address,
                ensName: getMockProfile(selectedUser.wallet_address)?.display_name || selectedUser.username,
                role: getMockProfile(selectedUser.wallet_address)?.title || 'Community Member',
                timepieceStage: 'Genesis',
                lookingFor: getMockProfile(selectedUser.wallet_address)?.tagline || 'Connecting with the community',
                avatar_url: getMockProfile(selectedUser.wallet_address)?.avatar_url || selectedUser.avatar_url || '/default-avatar.png',
                links: {
                  github: getMockProfile(selectedUser.wallet_address)?.social_links.github,
                  website: getMockProfile(selectedUser.wallet_address)?.social_links.website,
                  twitter: getMockProfile(selectedUser.wallet_address)?.social_links.twitter
                },
                ...(selectedUser.businessCard || {})
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
} 