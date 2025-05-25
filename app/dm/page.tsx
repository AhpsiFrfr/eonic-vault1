'use client';

import React from 'react';
import { DMList } from '../../components/dm/DMList';
import { DirectMessage } from '../../components/dm/DirectMessage';

export default function DMMainPage() {
  return (
    <div className="flex h-screen bg-obsidian">
      {/* DM Sidebar */}
      <DMList className="flex-shrink-0" />
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <DirectMessage />
      </div>
    </div>
  );
} 