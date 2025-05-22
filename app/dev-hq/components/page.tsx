'use client';

import React, { useState } from 'react';

interface Component {
  name: string;
  status: 'Live' | 'In Dev' | 'Deprecated' | 'Cabal+';
  lastUpdated: string;
  description: string;
}

// Mock data for components
const mockComponents: Component[] = [
  {
    name: 'FeatureList',
    status: 'Live',
    lastUpdated: '2025-05-20',
    description: 'Displays a grid of feature cards with customizable layouts and filtering options.'
  },
  {
    name: 'IntegrationStatus',
    status: 'Live',
    lastUpdated: '2025-05-19',
    description: 'Shows connection status for various external services and APIs.'
  },
  {
    name: 'DevFeatureCard',
    status: 'Live',
    lastUpdated: '2025-05-18',
    description: 'Individual feature card component with title, description, and status indicators.'
  },
  {
    name: 'ChatRoom',
    status: 'In Dev',
    lastUpdated: '2025-05-22',
    description: 'Main container for the chat interface with channel sidebar and message panel.'
  },
  {
    name: 'MessagePanel',
    status: 'In Dev',
    lastUpdated: '2025-05-22',
    description: 'Displays chat messages and provides input field for sending new messages.'
  },
  {
    name: 'ChannelSidebar',
    status: 'In Dev',
    lastUpdated: '2025-05-21',
    description: 'Navigation sidebar for text channels with active state indicators.'
  },
  {
    name: 'VoiceChannelList',
    status: 'In Dev',
    lastUpdated: '2025-05-21',
    description: 'Lists available voice channels with user presence indicators.'
  },
  {
    name: 'DataVisualizer',
    status: 'Deprecated',
    lastUpdated: '2025-04-15',
    description: 'Legacy component for visualizing system metrics and performance data.'
  },
  {
    name: 'QuantumEngine',
    status: 'Cabal+',
    lastUpdated: '2025-05-10',
    description: 'Advanced computation engine with restricted access for Cabal members only.'
  }
];

export default function ComponentsPage() {
  const [statusFilter, setStatusFilter] = useState<'All' | Component['status']>('All');
  
  // Filter components based on selected status
  const filteredComponents = statusFilter === 'All' 
    ? mockComponents 
    : mockComponents.filter(component => component.status === statusFilter);

  // Get unique status values for filter dropdown
  const statusOptions = ['All', ...Array.from(new Set(mockComponents.map(component => component.status)))];

  // Status badge color mapping
  const getStatusColor = (status: Component['status']) => {
    switch(status) {
      case 'Live': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'In Dev': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Deprecated': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Cabal+': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-blue-300 mb-2">Components Registry</h1>
        <p className="text-gray-400">Browse and manage available Dev Vault components.</p>
      </header>

      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label htmlFor="statusFilter" className="text-sm text-gray-400">Filter by status:</label>
          <select 
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-400">
          Showing {filteredComponents.length} of {mockComponents.length} components
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <div 
            key={component.name}
            className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">{component.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(component.status)}`}>
                  {component.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{component.description}</p>
              <div className="text-xs text-gray-500">
                Last updated: {component.lastUpdated}
              </div>
            </div>
            <div className="bg-gray-900 px-5 py-3 flex justify-between items-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm">View Docs</button>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Import</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 