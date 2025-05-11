'use client';
import React from 'react';

type Props = {
  currentXP: number;
  xpGoal: number;
  level: number;
};

export default function XPLevelTracker({ currentXP, xpGoal, level }: Props) {
  const progress = Math.min((currentXP / xpGoal) * 100, 100);

  return (
    <div className="bg-[#1a1d26] text-white rounded-xl p-4 shadow-lg border border-blue-500">
      <h2 className="text-xl font-semibold mb-2">XP & Level</h2>
      <p className="text-sm text-blue-300 mb-1">Level {level}</p>
      <div className="w-full h-3 rounded bg-[#2c2f3a] overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">{currentXP} / {xpGoal} XP</p>
    </div>
  );
} 