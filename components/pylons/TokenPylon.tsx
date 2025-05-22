'use client';
import { FaCoins } from 'react-icons/fa';

export default function TokenPylon() {
  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-4 shadow-[0_0_25px_3px_rgba(255,215,0,0.15)] hover:shadow-[0_0_35px_4px_rgba(255,215,0,0.25)] transition-all duration-500 ease-in-out relative text-white w-full max-w-md min-h-[140px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FaCoins className="text-yellow-400 text-xl animate-spin-slow" />
          <h2 className="text-xl font-semibold glow-text">Token</h2>
        </div>
        <div className="text-sm text-gray-400">Level 12</div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="text-lg font-bold text-[#00ff88] mb-1">$EONIC</div>
        <div className="text-sm text-green-400 mb-1">+12.5% this week</div>
        <div className="text-sm text-red-400">-3.12% EUR</div>
      </div>
      
      {/* Footer */}
      <div className="text-[10px] text-right text-yellow-400 mt-1 italic">Balance: 77,777</div>
    </div>
  );
} 