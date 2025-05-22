'use client';

/**
 * Utility for registering and discovering Dev Vault components
 * @dev-vault-component
 */

import { useEffect, useState } from 'react';

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  status: 'Live' | 'In Dev' | 'Deprecated' | 'Cabal+';
  lastUpdated: string;
  tags: string[];
  importPath: string;
  author: string;
  dependencies?: string[];
}

/**
 * Hook for accessing the Dev Vault component registry
 * @returns Registry state and methods
 */
export function useComponentRegistry() {
  const [components, setComponents] = useState<ComponentMetadata[]>([
    {
      id: 'feature-list',
      name: 'FeatureList',
      description: 'Grid layout for displaying core features with icons and descriptions',
      status: 'Live',
      lastUpdated: '2025-05-15',
      tags: ['UI', 'Dashboard'],
      importPath: '@/app/dashboard/dev-vault',
      author: 'DevTeam'
    },
    {
      id: 'integration-status',
      name: 'IntegrationStatus',
      description: 'Status panel showing connections to external services',
      status: 'Live',
      lastUpdated: '2025-05-15',
      tags: ['UI', 'Dashboard', 'Integration'],
      importPath: '@/app/dashboard/dev-vault',
      author: 'DevTeam'
    },
    {
      id: 'dev-feature-card',
      name: 'DevFeatureCard',
      description: 'Card component for displaying feature information',
      status: 'Live',
      lastUpdated: '2025-05-15',
      tags: ['UI', 'Card'],
      importPath: '@/app/dashboard/dev-vault',
      author: 'DevTeam'
    },
    {
      id: 'chat-room',
      name: 'ChatRoom',
      description: 'Main chat interface with channels, messages, and voice',
      status: 'In Dev',
      lastUpdated: '2025-05-22',
      tags: ['UI', 'Chat', 'Communication'],
      importPath: '@/app/dev-hq/chat-system',
      author: 'DevTeam'
    },
    {
      id: 'message-panel',
      name: 'MessagePanel',
      description: 'Panel for displaying and sending chat messages',
      status: 'In Dev',
      lastUpdated: '2025-05-22',
      tags: ['UI', 'Chat', 'Communication'],
      importPath: '@/app/dev-hq/chat-system',
      author: 'DevTeam'
    },
    {
      id: 'channel-sidebar',
      name: 'ChannelSidebar',
      description: 'Sidebar for navigating between text channels',
      status: 'In Dev',
      lastUpdated: '2025-05-22',
      tags: ['UI', 'Chat', 'Navigation'],
      importPath: '@/app/dev-hq/chat-system',
      author: 'DevTeam'
    },
    {
      id: 'voice-channel-list',
      name: 'VoiceChannelList',
      description: 'List of voice channels with active participants',
      status: 'In Dev',
      lastUpdated: '2025-05-22',
      tags: ['UI', 'Voice', 'Communication'],
      importPath: '@/app/dev-hq/chat-system',
      author: 'DevTeam',
      dependencies: ['useVoiceSocket', 'usePermissions']
    },
    {
      id: 'direct-message-panel',
      name: 'DirectMessagePanel',
      description: 'Panel for private 1:1 conversations',
      status: 'In Dev',
      lastUpdated: '2025-05-22',
      tags: ['UI', 'Chat', 'Communication'],
      importPath: '@/app/dev-hq/chat-system',
      author: 'DevTeam',
      dependencies: ['useDirectMessages']
    },
    {
      id: 'quantum-engine',
      name: 'QuantumEngine',
      description: 'Advanced quantum computation visualization',
      status: 'Cabal+',
      lastUpdated: '2025-05-10',
      tags: ['Quantum', 'Visualization', 'Cabal'],
      importPath: '@/app/quantum/engine',
      author: 'CabalTeam'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, this would fetch from an API
  useEffect(() => {
    // Simulated fetch already completed with initial state
  }, []);
  
  // Register a new component
  const registerComponent = async (component: Omit<ComponentMetadata, 'id'>) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call an API
      // For now, we'll simulate registration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComponent: ComponentMetadata = {
        ...component,
        id: component.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      setComponents(prev => [...prev, newComponent]);
      setError(null);
      
      return newComponent;
    } catch (err) {
      setError('Failed to register component');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing component
  const updateComponent = async (id: string, updates: Partial<ComponentMetadata>) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call an API
      // For now, we'll simulate updating
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComponents(prev => 
        prev.map(component => 
          component.id === id ? { ...component, ...updates } : component
        )
      );
      setError(null);
      
      return components.find(c => c.id === id);
    } catch (err) {
      setError('Failed to update component');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a component by ID
  const getComponent = (id: string) => {
    return components.find(c => c.id === id);
  };
  
  // Filter components by criteria
  const filterComponents = ({
    status,
    tags,
    search
  }: {
    status?: ComponentMetadata['status'];
    tags?: string[];
    search?: string;
  } = {}) => {
    return components.filter(component => {
      // Filter by status
      if (status && component.status !== status) {
        return false;
      }
      
      // Filter by tags (component must have ALL specified tags)
      if (tags && tags.length > 0) {
        if (!tags.every(tag => component.tags.includes(tag))) {
          return false;
        }
      }
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          component.name.toLowerCase().includes(searchLower) ||
          component.description.toLowerCase().includes(searchLower) ||
          component.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  };
  
  return {
    components,
    isLoading,
    error,
    registerComponent,
    updateComponent,
    getComponent,
    filterComponents
  };
}
