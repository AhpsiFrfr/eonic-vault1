'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StartDMButton } from '../shared/StartDMButton';
import { MessageCircle, Users, Settings, MoreHorizontal } from 'lucide-react';

/**
 * Example component demonstrating how to integrate DM functionality
 * into existing chat interfaces like VaultCord or DevHQ
 */
export function DMIntegrationExample() {
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Example user data
  const exampleUsers = [
    {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      name: 'CabalMember',
      avatar: '/avatar2.png',
      isOnline: true,
      xpLevel: 87
    },
    {
      address: 'AbCdEfGhIjKlMnOpQrStUvWxYz1234567890ABCDEF',
      name: 'DevLead',
      avatar: '/avatar3.png',
      isOnline: false,
      xpLevel: 120
    },
    {
      address: 'XyZ987654321FeDcBa0ZyXwVuTsRqPoNmLkJiHgFeD',
      name: 'QATester',
      avatar: '/avatar4.png',
      isOnline: true,
      xpLevel: 65
    }
  ];

  const handleUserClick = (userAddress: string) => {
    setSelectedUser(userAddress);
    setShowUserCard(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-obsidian text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-egyptian-glow mb-2">
          DM System Integration Examples
        </h2>
        <p className="text-gray-400">
          Examples of how the DM system integrates into existing Vault components
        </p>
      </div>

      {/* Example 1: User List with DM Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-egyptian-glow" />
          1. User List Integration (VaultCord Style)
        </h3>
        
        <div className="bg-marble-deep/20 rounded-lg p-4 border border-marble-deep/30">
          <div className="space-y-3">
            {exampleUsers.map((user) => (
              <div
                key={user.address}
                className="flex items-center justify-between p-3 bg-marble-deep/10 rounded-lg hover:bg-marble-deep/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center">
                      <span className="text-white font-bold">{user.name.charAt(0)}</span>
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-obsidian" />
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">LVL {user.xpLevel}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Different button variants */}
                  <StartDMButton
                    userAddress={user.address}
                    userName={user.name}
                    variant="icon"
                    size="sm"
                  />
                  
                  <button
                    onClick={() => handleUserClick(user.address)}
                    className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Example 2: Message Context Menu Integration */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-egyptian-glow" />
          2. Message Context Menu Integration
        </h3>
        
        <div className="bg-marble-deep/20 rounded-lg p-4 border border-marble-deep/30">
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">
              Right-click or long-press simulation (in real implementation, this would be in MessageContextMenu.tsx):
            </p>
          </div>
          
          <div className="bg-marble-deep/10 rounded-lg p-3 mb-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">CabalMember</div>
                <div className="text-gray-300">Hey, have you seen the latest updates to the quantum engine?</div>
              </div>
            </div>
          </div>

          {/* Simulated Context Menu */}
          <div className="bg-obsidian border border-egyptian-glow/30 rounded-lg p-2 w-64">
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-marble-deep/30 rounded-lg transition-all">
                <span>Reply</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-marble-deep/30 rounded-lg transition-all">
                <span>React</span>
              </button>
              <StartDMButton
                userAddress={exampleUsers[0].address}
                userName={exampleUsers[0].name}
                variant="menu-item"
                size="sm"
              />
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-marble-deep/30 rounded-lg transition-all">
                <span>Copy Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Example 3: Quick Action Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-egyptian-glow" />
          3. Quick Action Button Variants
        </h3>
        
        <div className="bg-marble-deep/20 rounded-lg p-4 border border-marble-deep/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Full Button */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Full Button</h4>
              <StartDMButton
                userAddress={exampleUsers[0].address}
                userName={exampleUsers[0].name}
                variant="button"
                size="md"
              />
            </div>

            {/* Icon Only */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Icon Only</h4>
              <StartDMButton
                userAddress={exampleUsers[0].address}
                userName={exampleUsers[0].name}
                variant="icon"
                size="md"
              />
            </div>

            {/* Large Button */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Large Button</h4>
              <StartDMButton
                userAddress={exampleUsers[0].address}
                userName={exampleUsers[0].name}
                variant="button"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Card Modal */}
      <AnimatePresence>
        {showUserCard && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUserCard(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-obsidian border border-egyptian-glow/30 rounded-lg p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const user = exampleUsers.find(u => u.address === selectedUser);
                if (!user) return null;

                return (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-2xl font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{user.name}</h3>
                      <p className="text-gray-400 text-sm">LVL {user.xpLevel}</p>
                    </div>

                    <div className="space-y-3">
                      <StartDMButton
                        userAddress={user.address}
                        userName={user.name}
                        variant="button"
                        size="lg"
                        className="w-full justify-center"
                        onClick={() => setShowUserCard(false)}
                      />
                      
                      <button className="w-full py-2 px-4 bg-marble-deep/20 hover:bg-marble-deep/40 border border-marble-deep/50 rounded-lg text-gray-300 hover:text-white transition-all">
                        View Profile
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Instructions */}
      <div className="mt-8 p-6 bg-egyptian-base/10 border border-egyptian-glow/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-egyptian-glow">Integration Instructions</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>1. Import the components:</strong></p>
          <code className="block bg-marble-deep/20 p-2 rounded text-xs">
            {`import { StartDMButton } from '../shared/StartDMButton';`}
          </code>
          
          <p className="pt-2"><strong>2. Add to existing user interactions:</strong></p>
          <code className="block bg-marble-deep/20 p-2 rounded text-xs">
            {`<StartDMButton userAddress="..." userName="..." variant="icon" />`}
          </code>
          
          <p className="pt-2"><strong>3. The DM system is automatically available since DMProvider is in the root layout.</strong></p>
        </div>
      </div>
    </div>
  );
} 