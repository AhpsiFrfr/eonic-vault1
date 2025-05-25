'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Lock, Zap, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function EonicTokenOverviewPylon() {
  const handleStakeClick = () => {
    window.open('https://app.streamflow.finance?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump', '_blank');
  };

  const handleLockClick = () => {
    window.open('https://token.clock.so/lock?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-yellow-950/50 to-orange-950/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Coins className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-400">$EONIC Overview</h3>
            <p className="text-sm text-gray-400">Token Holdings & Actions</p>
          </div>
        </div>
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-yellow-300" />
        </div>
      </div>

      {/* Holdings Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 border border-emerald-700/50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <Label className="text-sm text-gray-400">Total Holdings</Label>
          </div>
          <p className="text-2xl font-bold text-emerald-400">123,456</p>
          <p className="text-xs text-gray-500">EONIC</p>
        </div>

        <div className="bg-black/40 border border-cyan-700/50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <Label className="text-sm text-gray-400">Staked</Label>
          </div>
          <p className="text-2xl font-bold text-cyan-400">42,000</p>
          <p className="text-xs text-gray-500">EONIC</p>
        </div>

        <div className="bg-black/40 border border-purple-700/50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <Label className="text-sm text-gray-400">Locked</Label>
          </div>
          <p className="text-2xl font-bold text-purple-400">18,500</p>
          <p className="text-xs text-gray-500">EONIC</p>
        </div>

        <div className="bg-black/40 border border-yellow-700/50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <Label className="text-sm text-gray-400">Platform Total</Label>
          </div>
          <p className="text-xl font-bold text-yellow-400">980.5K</p>
          <p className="text-xs text-gray-500">All-Time Locked</p>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm text-gray-400">Total Portfolio Value</Label>
            <p className="text-2xl font-bold text-yellow-400">$4,296.75</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-400">+$342.18 (8.7%)</div>
            <div className="text-xs text-gray-400">24h Change</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
          onClick={handleStakeClick}
        >
          <Zap className="w-4 h-4" />
          Stake $EONIC
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Button>
        
        <Button 
          className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
          onClick={handleLockClick}
        >
          <Lock className="w-4 h-4" />
          Lock $EONIC
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Button>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-yellow-500/20">
        <div className="text-center">
          <div className="text-xs text-gray-400">APY (Staking)</div>
          <div className="text-sm font-semibold text-cyan-300">12.5%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Lock Rewards</div>
          <div className="text-sm font-semibold text-purple-300">Up to 25%</div>
        </div>
      </div>
    </motion.div>
  );
} 