'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import VaultChat from '../../../components/shared/VaultChat';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, Crown, Shield, Hash } from 'lucide-react';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';

type ViewMode = 'web' | 'mobile';

// Define access requirements for future implementation
interface AccessRequirement {
  tokenHolding?: number;    // Minimum token amount required
  nftRequired?: boolean;    // Whether an NFT is required
  isAdmin?: boolean;        // Whether admin access is required
}

interface CommunityTab {
  id: string;
  name: string;
  channel: string;
  requirements?: AccessRequirement;
  description: string;
  accentColor: 'cyan' | 'purple' | 'green' | 'red' | 'blue';
  icon: React.ReactNode;
}

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  type: 'user' | 'assistant' | 'system';
  userId: string;
  parentId?: string;
  parentContent?: string;
  reactions: Record<string, string[]>;
  isEdited: boolean;
  isPinned: boolean;
  replyCount: number;
}

// Mock messages for each community tab
const generateMockMessages = (tabId: string): ChatMessage[] => {
  const baseTime = Date.now();
  
  const mockContent: Record<string, ChatMessage[]> = {
    community: [
      {
        id: '1',
        user: 'EONIC.Admin',
        content: 'Welcome to the EONIC Community! Share ideas, ask questions, and connect with fellow members.',
        timestamp: baseTime - 7200000,
        type: 'system',
        userId: 'admin',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'CommunityMember',
        content: 'Has anyone seen the new features in the vault? The UI looks incredible!',
        timestamp: baseTime - 3600000,
        type: 'user',
        userId: 'user-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'NFTCollector',
        content: 'The timepiece NFTs are amazing! Can\'t wait to see what\'s next.',
        timestamp: baseTime - 1800000,
        type: 'user',
        userId: 'user-2',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '4',
        user: 'ENIC.0',
        content: 'I\'m here to help answer any questions about EONIC features and development!',
        timestamp: baseTime - 900000,
        type: 'assistant',
        userId: 'ENIC.0',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    lounge: [
      {
        id: '1',
        user: 'EONIC.Admin',
        content: 'Welcome to the Holders Lounge! Exclusive space for EON token holders.',
        timestamp: baseTime - 7200000,
        type: 'system',
        userId: 'admin',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'TokenHolder1',
        content: 'What are everyone\'s thoughts on the latest EON token performance?',
        timestamp: baseTime - 3600000,
        type: 'user',
        userId: 'holder-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'WhaleInvestor',
        content: 'I love the new benefits for holders. The staking rewards are fantastic!',
        timestamp: baseTime - 1800000,
        type: 'user',
        userId: 'holder-2',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '4',
        user: 'TokenAnalyst',
        content: 'Anyone planning to increase their holdings? This looks like a great opportunity.',
        timestamp: baseTime - 900000,
        type: 'user',
        userId: 'holder-3',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    cabal: [
      {
        id: '1',
        user: 'EONIC.Admin',
        content: 'Welcome to the Cabal! Elite space for token + NFT holders only.',
        timestamp: baseTime - 7200000,
        type: 'system',
        userId: 'admin',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'CabalMember',
        content: 'The inner circle grows stronger. When is the next exclusive event?',
        timestamp: baseTime - 3600000,
        type: 'user',
        userId: 'cabal-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'EliteHolder',
        content: 'NFT + token combo is paying off! Love the exclusive alpha.',
        timestamp: baseTime - 1800000,
        type: 'user',
        userId: 'cabal-2',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '4',
        user: 'CabalLeader',
        content: 'Big announcements coming for Cabal members only. Stay tuned! 👑',
        timestamp: baseTime - 900000,
        type: 'user',
        userId: 'cabal-3',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ],
    board: [
      {
        id: '1',
        user: 'EONIC.Admin',
        content: 'Board Room: Admin and developer discussions for EONIC governance.',
        timestamp: baseTime - 7200000,
        type: 'system',
        userId: 'admin',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '2',
        user: 'CoreDev',
        content: 'Team update: New roadmap will be published next week with exciting features.',
        timestamp: baseTime - 3600000,
        type: 'user',
        userId: 'dev-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '3',
        user: 'ProjectManager',
        content: 'Development progress is on track. Q1 milestones looking good!',
        timestamp: baseTime - 1800000,
        type: 'user',
        userId: 'pm-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: '4',
        user: 'MarketingLead',
        content: 'Marketing campaign for Phase 2 starting soon. Community engagement is key.',
        timestamp: baseTime - 900000,
        type: 'user',
        userId: 'marketing-1',
        reactions: {},
        isEdited: false,
        isPinned: false,
        replyCount: 0
      }
    ]
  };
  
  return mockContent[tabId] || mockContent.community;
};

const communityTabs: CommunityTab[] = [
  {
    id: 'community',
    name: 'Community Chat',
    channel: 'community-chat',
    description: 'Open discussion for all community members',
    requirements: {}, // No requirements
    accentColor: 'cyan',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'lounge',
    name: 'Holders Lounge',
    channel: 'community-lounge',
    description: 'Token holders discussion space',
    requirements: {
      tokenHolding: 1 // Will require minimum 1 token in future
    },
    accentColor: 'purple',
    icon: <Users className="w-4 h-4" />
  },
  {
    id: 'cabal',
    name: 'Cabal Chat',
    channel: 'community-cabal',
    description: 'Exclusive chat for token + NFT holders',
    requirements: {
      tokenHolding: 100,
      nftRequired: true
    },
    accentColor: 'red',
    icon: <Crown className="w-4 h-4" />
  },
  {
    id: 'board',
    name: 'Board Room',
    channel: 'community-board',
    description: 'Admin and developer discussion',
    requirements: {
      isAdmin: true
    },
    accentColor: 'green',
    icon: <Shield className="w-4 h-4" />
  }
];

export default function CommunityPage() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState(communityTabs[0].id);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const userWalletAddress = publicKey?.toString() || '';

  // Initialize messages for each tab
  useState(() => {
    const initialMessages: Record<string, ChatMessage[]> = {};
    communityTabs.forEach(tab => {
      initialMessages[tab.id] = generateMockMessages(tab.id);
    });
    setMessages(initialMessages);
  });

  const currentTab = communityTabs.find(tab => tab.id === activeTab)!;
  const currentMessages = messages[activeTab] || [];

  // TODO: Implement access control checks
  const checkAccess = (tab: CommunityTab) => {
    // For now, return true for all tabs
    // This will be replaced with actual checks when implementing gating
    return true;
  };

  const handleSendMessage = (content: string, parentId?: string) => {
    if (!userWalletAddress) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      content,
      timestamp: Date.now(),
      type: 'user',
      userId: userWalletAddress,
      parentId,
      parentContent: parentId ? messages[activeTab]?.find(m => m.id === parentId)?.content : undefined,
      reactions: {},
      isEdited: false,
      isPinned: false,
      replyCount: 0
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage]
    }));

    // Simulate ENIC.0 response for demo
    if (content.toLowerCase().includes('enic') || content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: 'ENIC.0',
          content: `I'm here to help in the ${currentTab.name}! What would you like to know about EONIC?`,
          timestamp: Date.now(),
          type: 'assistant',
          userId: 'ENIC.0',
          reactions: {},
          isEdited: false,
          isPinned: false,
          replyCount: 0
        };
        setMessages(prev => ({
          ...prev,
          [activeTab]: [...(prev[activeTab] || []), aiResponse]
        }));
      }, 1000);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (reactions[emoji] && reactions[emoji].includes(userWalletAddress)) {
            // Remove reaction
            reactions[emoji] = reactions[emoji].filter(id => id !== userWalletAddress);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            // Add reaction
            reactions[emoji] = [...(reactions[emoji] || []), userWalletAddress];
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    }));
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    }));
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(msg => msg.id !== messageId)
    }));
  };

  const handlePin = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isPinned: !msg.isPinned };
        }
        // Unpin other messages in this tab (only one pinned per tab)
        return { ...msg, isPinned: false };
      })
    }));
  };

  const handleViewThread = (messageId: string) => {
    // In a real implementation, this would navigate to thread view
    console.log('View thread for message:', messageId);
  };

  const getTabActiveClasses = (accentColor: string) => {
    switch (accentColor) {
      case 'cyan': return 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/20';
      case 'purple': return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20';
      case 'red': return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20';
      case 'green': return 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/20';
      case 'blue': return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20';
      default: return 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/20';
    }
  };

  if (!publicKey) {
    return (
      <VaultSidebarLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
          <Card variant="glow" className="max-w-md">
            <CardContent className="text-center p-8">
              <MessageSquare className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
              <p className="text-gray-400">Please connect your wallet to access community chats</p>
            </CardContent>
          </Card>
        </div>
      </VaultSidebarLayout>
    );
  }

  return (
    <VaultSidebarLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Tab switcher */}
        <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-6">
        <div className="flex space-x-2">
          {communityTabs.map((tab) => (
            <button
              key={tab.id}
                className={`group relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                    ? getTabActiveClasses(tab.accentColor)
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
              disabled={!checkAccess(tab)}
            >
                <div className="flex items-center gap-2">
                  {tab.icon}
              {tab.name}
                </div>
              {/* Tooltip for requirements */}
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap z-10">
                {tab.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Community chat for selected channel */}
        <div className="p-6">
          <VaultChat
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            title={currentTab.name}
            subtitle={currentTab.description}
            placeholder={`Share your thoughts in ${currentTab.name}...`}
            accentColor={currentTab.accentColor}
            headerIcon={currentTab.icon}
            maxHeight="75vh"
            enableReactions={true}
            onReaction={handleReaction}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPin={handlePin}
            onViewThread={handleViewThread}
            enableFileUpload={true}
            onFileUpload={(file) => {
              console.log('File uploaded:', file.name);
              // Handle file upload
            }}
            enableGifPicker={true}
            onGifSelect={(gifUrl) => {
              console.log('GIF selected:', gifUrl);
              // Handle GIF selection
            }}
        />
      </div>
    </div>
    </VaultSidebarLayout>
  );
} 