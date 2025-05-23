'use client';

import { motion } from 'framer-motion';
import RadioPlayer from '../radio/RadioPlayer';
import { RadioProvider } from '../radio/RadioProvider';

export default function RadioPylon() {
  return (
    <div className="relative w-full max-w-md mx-auto p-6 rounded-2xl bg-[#181c20] border border-cyan-700 shadow-[0_0_32px_#00eaff44] flex flex-col items-center" style={{ boxShadow: '0 0 32px #00eaff44' }}>
      {/* Header Logo and Title */}
      <div className="flex flex-col items-center mb-4">
        <img src="/images/eonic-logo.png" alt="EONIC Logo" className="w-16 h-16 mb-2 drop-shadow-[0_0_12px_#00eaff]" />
        <h1 className="text-3xl font-bold text-cyan-400 tracking-widest drop-shadow-[0_0_8px_#00eaff]">EONIC</h1>
      </div>
      <RadioProvider>
        <RadioPlayer />
      </RadioProvider>
    </div>
  );
} 