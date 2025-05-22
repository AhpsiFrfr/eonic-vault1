import React from 'react';
import { motion } from 'framer-motion';

interface EonIDCardProps {
  displayName: string;
  title: string;
  domain: string;
  tokenHoldings: number;
  timepieceStage: string;
  cardStyle?: 'intern' | 'secretary' | 'management' | 'ceo' | 'paul_allen';
}

const styleMap: Record<string, string> = {
  intern: 'border-blue-400 text-blue-200 bg-[#0a0a0a]',
  secretary: 'border-pink-500 text-pink-200 bg-[#1a0a1a]',
  management: 'border-green-400 text-green-100 bg-[#0a1a0a]',
  ceo: 'border-purple-600 text-purple-200 bg-[#0a0a1a]',
  paul_allen: 'border-[#eeeeee] text-[#ddd] bg-[#f8f6f2] font-serif italic text-black',
};

export default function EonIDCard({
  displayName,
  title,
  domain,
  tokenHoldings,
  timepieceStage,
  cardStyle = 'intern'
}: EonIDCardProps) {
  const styles = styleMap[cardStyle];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg p-6 border shadow-lg backdrop-blur-sm ${styles}`}
    >
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xs opacity-60">{domain}.vault.sol</p>
      </div>

      {/* Token Holdings Section */}
      <div className="mb-4 p-3 rounded-md bg-black/20 border border-current/20">
        <div className="flex items-center justify-between">
          <span className="text-sm">EONIC Holdings</span>
          <span className="font-mono">{tokenHoldings.toLocaleString()} $EONIC</span>
        </div>
      </div>

      {/* Timepiece Stage Section */}
      <div className="relative">
        <div className="absolute -top-2 -right-2">
          <div className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-medium">
            {timepieceStage}
          </div>
        </div>
        <div className="h-24 rounded-md bg-black/20 border border-current/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-current/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-current/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-current/5 to-transparent opacity-50" />
      </div>
    </motion.div>
  );
} 