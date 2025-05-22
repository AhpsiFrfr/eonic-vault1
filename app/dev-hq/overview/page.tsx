'use client';

import React from 'react';
import { FeatureList, IntegrationStatus, type Feature, type Integration } from '@/app/dashboard/dev-vault';
import '@/styles/featureAnimations.css';

// Mock data for development
const mockFeatures: Feature[] = [
  {
    id: 'feature-1',
    title: 'Discord Integration',
    description: 'Real-time chat and community management through Discord API',
    icon: '🎮',
    status: 'active'
  },
  {
    id: 'feature-2',
    title: 'Developer Tools',
    description: 'Debug console and development utilities',
    icon: '🛠',
    status: 'development'
  },
  {
    id: 'feature-3',
    title: 'Documentation',
    description: 'Interactive documentation and guides',
    icon: '📚',
    status: 'pending'
  }
];

const mockIntegrations: Integration[] = [
  {
    name: 'Discord Bot',
    status: 'connected',
    lastSync: '2 minutes ago',
    details: 'All systems operational'
  },
  {
    name: 'GitHub',
    status: 'connected',
    lastSync: '5 minutes ago',
    details: 'Webhook active'
  },
  {
    name: 'Notion API',
    status: 'disconnected',
    details: 'Requires reauthorization'
  }
];

const VaultOverview: React.FC = () => {
  const handleFeatureSelect = (feature: Feature) => {
    console.log('Selected feature:', feature);
  };

  return (
    <main className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2 glow">EONIC Dev Vault Preview</h1>
        <p className="text-gray-400">Explore your active Vault components in one place.</p>
      </header>

      <section>
        <IntegrationStatus integrations={mockIntegrations} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
        <FeatureList features={mockFeatures} onFeatureSelect={handleFeatureSelect} />
      </section>
    </main>
  );
};

export default VaultOverview; 