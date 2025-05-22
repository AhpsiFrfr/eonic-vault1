'use client';

/**
 * Hook for managing blocked users
 * @dev-vault-component
 */

import { useState, useEffect, useCallback } from 'react';

export interface BlockedUser {
  id: string;
  name: string;
  profilePic: string;
  blockedAt: number;
}

/**
 * Hook for managing blocked users
 * @returns Blocked users state and methods
 */
export function useBlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load blocked users
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll simulate loading blocked users
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        // Mock data - empty by default
        setBlockedUsers([]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load blocked users');
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Block a user
  const blockUser = useCallback((user: { id: string; name: string; profilePic: string }) => {
    // Check if already blocked
    if (blockedUsers.some(blocked => blocked.id === user.id)) {
      return;
    }
    
    const newBlockedUser: BlockedUser = {
      id: user.id,
      name: user.name,
      profilePic: user.profilePic,
      blockedAt: Date.now()
    };
    
    setBlockedUsers(prev => [...prev, newBlockedUser]);
    
    // In a real implementation, this would send to an API
  }, [blockedUsers]);
  
  // Unblock a user
  const unblockUser = useCallback((userId: string) => {
    setBlockedUsers(prev => prev.filter(user => user.id !== userId));
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Check if a user is blocked
  const isUserBlocked = useCallback((userId: string) => {
    return blockedUsers.some(user => user.id === userId);
  }, [blockedUsers]);
  
  return {
    blockedUsers,
    isLoading,
    error,
    blockUser,
    unblockUser,
    isUserBlocked
  };
}
