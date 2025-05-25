'use client';

import React from 'react';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Package, Layers, Puzzle } from 'lucide-react';

export default function DevHQComponentsPage() {
  const componentCategories = [
    {
      title: 'UI Components',
      icon: <Layers className="w-6 h-6" />,
      description: 'Reusable interface elements',
      components: ['VaultChat', 'DevHQSidebarSubmenu', 'EONIDContainer', 'PylonComponents']
    },
    {
      title: 'Pylons',
      icon: <Package className="w-6 h-6" />,
      description: 'Modular dashboard widgets',
      components: ['XPTracker', 'TokenPylon', 'VaultReputation', 'TimepieceEvolution']
    },
    {
      title: 'Shared',
      icon: <Puzzle className="w-6 h-6" />,
      description: 'Cross-platform components',
      components: ['VaultSidebarLayout', 'ENIC0Panel', 'AudioControls', 'ThemeProvider']
    }
  ];

  return (
    <VaultSidebarLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-glow mb-2">📦 Component Library</h1>
            <p className="text-gray-400">Manage and explore EONIC Vault components</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {componentCategories.map((category, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.components.map((component, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 p-2 rounded bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      >
                        <Code className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{component}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle>🚀 Component Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                This page is ready for component management tools, live previews, and documentation.
              </p>
              <div className="text-sm text-blue-400">
                Coming soon: Interactive component playground and documentation
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VaultSidebarLayout>
  );
} 