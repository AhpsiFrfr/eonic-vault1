'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';

interface TimepieceData {
  timepieceStage: number;
  daysUntilNextStage: number;
  evolution: number; // percentage to next stage
}

function useTimepieceData() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<TimepieceData>({
    timepieceStage: 0,
    daysUntilNextStage: 0,
    evolution: 0
  });
  
  useEffect(() => {
    if (!publicKey) return;
    
    // Mock data for now
    const mockData = {
      timepieceStage: 3,
      daysUntilNextStage: 14,
      evolution: 68
    };
    
    setTimeout(() => {
      setData(mockData);
    }, 800);
    
    // In a real implementation, we would fetch from an API
  }, [publicKey]);
  
  return data;
}

export default function TimepieceEvolutionWidget() {
  const { timepieceStage, daysUntilNextStage, evolution } = useTimepieceData();
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div className="rounded-xl bg-gradient-to-tr from-gray-900 to-black p-4 shadow-xl text-white">
        <h2 className="text-lg font-semibold mb-2">Timepiece Evolution</h2>
        <p className="text-sm text-gray-400">Connect wallet to view your timepiece</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-tr from-gray-900 to-black p-4 shadow-xl text-white flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Timepiece Evolution</h2>
      <div className="relative w-24 h-24 mb-3">
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{timepieceStage}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <motion.div 
          className="bg-indigo-500 h-2.5 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${evolution}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      <p className="text-sm text-gray-300">
        {evolution}% to Stage {timepieceStage + 1}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {daysUntilNextStage} days until next evolution
      </p>
    </div>
  );
} 