'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, ExternalLink, Activity } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function EonicTokenPricePylon() {
  const [resolution, setResolution] = useState('1h');

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResolution(e.target.value);
    console.log('Chart resolution changed to:', e.target.value);
  };

  const openAxiomChart = () => {
    window.open('https://axiom.trade/meme/DoULfTfdSZStqM7dzzmNyCnARZJyBFqqQn9KYWibYkQB', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-emerald-950/50 to-green-950/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">$EONIC Price</h3>
            <p className="text-sm text-gray-400">Live Market Data</p>
          </div>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-emerald-300" />
        </div>
      </div>

      {/* Mock Chart Area */}
      <div className="bg-black/40 border border-emerald-700/50 rounded-xl p-4 mb-4 relative overflow-hidden">
        {/* Mock Chart Background */}
        <div className="relative h-48 flex items-end justify-between px-2">
          {/* Mock candlestick bars */}
          {Array.from({ length: 24 }, (_, i) => {
            const height = Math.random() * 120 + 20;
            const isGreen = Math.random() > 0.5;
            return (
              <div
                key={i}
                className={`w-2 ${isGreen ? 'bg-green-400' : 'bg-red-400'} rounded-sm opacity-70`}
                style={{ height: `${height}px` }}
              />
            );
          })}
          
          {/* Trending line overlay */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M20,140 Q80,120 140,100 T240,90 T340,85"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
              className="opacity-80"
            />
          </svg>
        </div>
        
        {/* Chart overlay with call-to-action */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={openAxiomChart}
            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            View Full Chart on Axiom
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Label className="text-sm text-gray-400 mb-2 block">Candle Resolution</Label>
          <Select name="resolution" value={resolution} onChange={handleResolutionChange}>
            <SelectItem value="5m">5 Minutes</SelectItem>
            <SelectItem value="15m">15 Minutes</SelectItem>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="4h">4 Hours</SelectItem>
            <SelectItem value="1d">1 Day</SelectItem>
          </Select>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-lg font-bold text-emerald-400">$0.0234</div>
          <div className="text-xs text-green-400">+12.5% (24h)</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-500/20">
        <div className="text-center">
          <div className="text-xs text-gray-400">24h Volume</div>
          <div className="text-sm font-semibold text-emerald-300">$45,230</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Market Cap</div>
          <div className="text-sm font-semibold text-emerald-300">$1.2M</div>
        </div>
      </div>

      {/* Direct Link to Axiom */}
      <div className="mt-4 pt-4 border-t border-emerald-500/20">
        <Button
          onClick={openAxiomChart}
          variant="outline"
          className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Open Advanced Chart on Axiom
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
} 