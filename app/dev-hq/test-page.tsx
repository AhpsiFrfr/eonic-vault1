'use client';

import { useRouter } from 'next/navigation';
import { ChannelProvider } from '@/context/ChannelContext';
import { EnhancedChannelList } from '@/components/Sidebar/EnhancedChannelList';
import { EnhancedChatView } from '@/components/EnhancedChatView';
import { AffirmationPylon } from '@/components/pylons/AffirmationPylon';

export default function DevHQTestPage() {
  const router = useRouter();

  return (
    <ChannelProvider>
      <div className="flex h-screen bg-[#0e1525]">
        {/* Enhanced Channel List */}
        <div className="w-64">
          <EnhancedChannelList 
            showVoiceRooms={false}
            serverName="Dev HQ [TESTING]"
            logoSrc="/images/devhq-logo.svg"
            logoAlt="Dev HQ Logo"
          />
        </div>

        {/* Main chat area */}
        <div className="flex flex-col flex-1 bg-[#111827]">
          {/* Chat Header with Return Button */}
          <div className="h-16 bg-[#0e1525] border-b border-gray-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white">Dev HQ Chat</h1>
              <div className="px-3 py-1 bg-cyan-600/20 border border-cyan-600/30 rounded-full">
                <span className="text-cyan-400 text-xs font-medium">TESTING MODE</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-3 px-5 py-3 bg-[#172a45] hover:bg-[#203651] rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <img src="/images/eonic-vault-ship.png" alt="Return to Vault" className="w-6 h-6" />
              Return to The Vault
            </button>
          </div>

          {/* Enhanced Chat View */}
          <div className="flex-1">
            <EnhancedChatView />
          </div>
        </div>

        {/* Right sidebar with voice channels and pylon */}
        <div className="w-80 bg-[#0e1525] border-l border-gray-700 flex flex-col">
          {/* Voice Channels Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-[#2f3349] rounded-lg p-4 mb-4 border border-gray-600">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-400">🎙️</span>
                Voice Channels
              </h2>
              
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium flex items-center">
                      <span className="text-indigo-400 mr-2">🔊</span>
                      General Voice
                    </h3>
                    <button 
                      onClick={() => router.push('/vaultcord')}
                      className="text-blue-400 hover:text-blue-300 text-sm bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1 rounded transition-colors"
                    >
                      Join VaultCord
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <p className="text-sm text-gray-500">No one is here yet</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium flex items-center">
                      <span className="text-indigo-400 mr-2">🔊</span>
                      Cabal Meeting
                    </h3>
                    <button 
                      onClick={() => router.push('/vaultcord')}
                      className="text-blue-400 hover:text-blue-300 text-sm bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1 rounded transition-colors"
                    >
                      Join VaultCord
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <p className="text-sm text-gray-500">No one is here yet</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium flex items-center">
                      <span className="text-indigo-400 mr-2">🔊</span>
                      Code Review
                    </h3>
                    <button 
                      onClick={() => router.push('/vaultcord')}
                      className="text-blue-400 hover:text-blue-300 text-sm bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1 rounded transition-colors"
                    >
                      Join VaultCord
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-green-400">2 developers online</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Access to VaultCord */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                  🎙️ Enhanced Voice Experience
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Join VaultCord for advanced voice features, spatial audio, and real-time collaboration tools.
                </p>
                <button
                  onClick={() => router.push('/vaultcord')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  🚀 Launch VaultCord
                </button>
              </div>
            </div>

            {/* Development Tools */}
            <div className="bg-[#2f3349] rounded-lg p-4 mb-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-green-400">⚡</span>
                Dev Tools
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-[#3d4450] hover:bg-[#4a525f] rounded-lg transition-colors text-left">
                  <span className="text-yellow-400">📊</span>
                  <span className="text-gray-300 text-sm">Performance Monitor</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-[#3d4450] hover:bg-[#4a525f] rounded-lg transition-colors text-left">
                  <span className="text-red-400">🐛</span>
                  <span className="text-gray-300 text-sm">Bug Tracker</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-[#3d4450] hover:bg-[#4a525f] rounded-lg transition-colors text-left">
                  <span className="text-blue-400">📝</span>
                  <span className="text-gray-300 text-sm">Documentation</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* ENIC.0 Affirmation Pylon */}
          <div className="p-4 border-t border-gray-700">
            <AffirmationPylon />
          </div>
        </div>
      </div>
    </ChannelProvider>
  );
} 