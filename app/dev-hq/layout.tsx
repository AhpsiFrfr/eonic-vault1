'use client'

import React from 'react';
import DevHQNav from '@/components/DevVaultHQ/components/DevHQNav';

export default function DevVaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <DevHQNav />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
} 