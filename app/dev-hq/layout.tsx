'use client'

import React from 'react';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';
import { DevHQProvider } from '@/context/DevHQContext';

export default function DevVaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <DevHQProvider>
      <VaultSidebarLayout>
        {children}
      </VaultSidebarLayout>
    </DevHQProvider>
  );
} 