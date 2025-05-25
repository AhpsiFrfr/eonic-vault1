import React from 'react';
import DevEonAppShell from '@/components/dev-eon/DevEonAppShell';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';

export const metadata = {
  title: 'DEV-EON Assistant | Eonic Vault',
  description: 'AI-powered development companion for React, Next.js, and TypeScript projects',
};

const DevEonPage = () => {
  return (
    <VaultSidebarLayout>
      <DevEonAppShell />
    </VaultSidebarLayout>
  );
};

export default DevEonPage; 