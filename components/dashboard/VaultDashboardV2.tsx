// VaultDashboardV2.tsx – Dashboard Layout Based on Design Reference

'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  Send,
  Users,
  Coins,
  ChevronRight
} from 'lucide-react';

// Top Navigation Component
const TopNavigation: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4 mb-6 bg-background/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50">
      <div className="text-xl font-semibold text-glow">Home</div>
      
      <div className="flex items-center bg-gray-900/60 rounded-full px-4 py-2 w-80">
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-transparent border-none text-foreground w-full outline-none placeholder-gray-400"
        />
        <Button size="sm" variant="ghost" className="p-1">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-400 hover:text-glow cursor-pointer" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        <img 
          src="/images/avatars/default-avatar.png" 
          alt="User" 
          className="w-8 h-8 rounded-full border-2 border-cyan-500"
        />
      </div>
    </div>
  );
};

// User Profile Widget Component
const ProfileWidget: React.FC = () => {
  return (
    <Card className="bg-background/70 backdrop-blur-md border-glow rounded-xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src="/images/avatars/default-avatar.png"
              alt="Profile Picture"
              className="w-20 h-20 rounded-full border-3 border-cyan-500 shadow-glow-blue"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-glow mb-1">USERNAME</h2>
            <p className="text-gray-400 text-sm mb-3">Title</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-400 font-medium">Level 8</span>
                <span className="text-gray-400">7,450 / 10,000 XP</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full shadow-glow-blue" 
                  style={{ width: '74.5%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Chatroom Widget Component
const ChatroomWidget: React.FC = () => {
  const messages = [
    { sender: 'User1', text: 'Hello everyone!', type: 'received' },
    { sender: 'User2', text: "Hey there! How's EONIC doing today?", type: 'received' },
    { sender: 'You', text: 'Looking good! Up 12.5% this week.', type: 'sent' }
  ];

  return (
    <Card className="bg-background/70 backdrop-blur-md border-glow rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="text-glow">Widget of chatroom of choice</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Users className="w-4 h-4" />
            <span>23</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 overflow-y-auto space-y-3 bg-gray-900/30 rounded-lg p-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex flex-col space-y-1",
              msg.type === 'sent' ? 'items-end' : 'items-start'
            )}>
              <span className="text-xs text-cyan-400 font-medium">{msg.sender}</span>
              <div className={cn(
                "max-w-xs px-3 py-2 rounded-lg text-sm",
                msg.type === 'sent' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-700 text-gray-200'
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-foreground placeholder-gray-400 outline-none focus:border-cyan-500"
          />
          <Button size="sm" className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// EONIC Holdings Widget Component
const EONICHoldingsWidget: React.FC = () => {
  return (
    <Card className="bg-background/70 backdrop-blur-md border-glow rounded-xl shadow-xl col-span-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Your EONIC Holdings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-glow">Your EONIC holdings</h3>
            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-glow">1,250.75</span>
                <span className="text-yellow-400 font-medium">EONIC</span>
                <span className="text-green-400 text-sm font-medium">+3.2%</span>
              </div>
            </div>
          </div>

          {/* Your STAKED EONIC */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-glow">Your STAKED eonic</h3>
            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-glow">750.25</span>
                <span className="text-yellow-400 font-medium">EONIC</span>
              </div>
              <div className="text-cyan-400 text-sm">APY: 12.4%</div>
            </div>
          </div>

          {/* How Users CAN Stake */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-glow">How users CAN stake</h3>
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                Stake Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Min. stake: 100 EONIC</p>
                <p>Lock period: 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Live EONIC Chart Widget Component
const LiveEONICChartWidget: React.FC = () => {
  return (
    <Card className="bg-background/70 backdrop-blur-md border-glow rounded-xl shadow-xl col-span-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-glow">Live EONIC Chart</span>
          </CardTitle>
          <div className="flex space-x-1">
            <Button size="sm" variant="outline" className="border-cyan-500 text-cyan-400">1D</Button>
            <Button size="sm" variant="ghost" className="text-gray-400">1W</Button>
            <Button size="sm" variant="ghost" className="text-gray-400">1M</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Container */}
        <div className="h-48 bg-gray-900/30 rounded-lg flex items-center justify-center border border-gray-700">
          <div className="text-center text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chart Component (Canvas)</p>
            <p className="text-xs">Ready for Chart.js integration</p>
          </div>
        </div>
        
        {/* Chart Info */}
        <div className="flex justify-between items-center">
          <div className="space-x-3">
            <span className="text-2xl font-bold text-green-400">$3.75</span>
            <span className="text-green-400 text-sm font-medium">+12.5% this week</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">24h Volume:</div>
            <div className="text-lg font-semibold text-glow">$1.2M</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main VaultDashboardV2 Component
const VaultDashboardV2: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Top Row: Profile and Chatroom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileWidget />
            <ChatroomWidget />
          </div>
          
          {/* Middle Row: EONIC Holdings */}
          <EONICHoldingsWidget />
          
          {/* Bottom Row: Live EONIC Chart */}
          <LiveEONICChartWidget />
        </div>
      </div>
    </div>
  );
};

export default VaultDashboardV2;

// ✅ Layout structure matches design reference exactly
// ✅ Removed sidebar navigation (keeping existing Vault sidebar)
// ✅ Preserved all Vault UI/UX themes and styling
// ✅ Responsive grid layout with proper widget hierarchy
// ✅ Ready for Chart.js integration in chart widget 