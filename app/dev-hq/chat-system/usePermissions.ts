'use client';

/**
 * Utility for managing permissions and role-based access control
 * @dev-vault-component
 */

import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'user' | 'moderator' | 'admin' | 'cabal';

export interface UserPermissions {
  canAccessVoiceChannels: boolean;
  canCreateChannels: boolean;
  canDeleteMessages: boolean;
  canPinMessages: boolean;
  canManageUsers: boolean;
  canAccessCabalRooms: boolean;
  canUseDebugTools: boolean;
  canExportData: boolean;
}

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  user: {
    canAccessVoiceChannels: true,
    canCreateChannels: false,
    canDeleteMessages: false,
    canPinMessages: false,
    canManageUsers: false,
    canAccessCabalRooms: false,
    canUseDebugTools: false,
    canExportData: false
  },
  moderator: {
    canAccessVoiceChannels: true,
    canCreateChannels: true,
    canDeleteMessages: true,
    canPinMessages: true,
    canManageUsers: false,
    canAccessCabalRooms: false,
    canUseDebugTools: true,
    canExportData: true
  },
  admin: {
    canAccessVoiceChannels: true,
    canCreateChannels: true,
    canDeleteMessages: true,
    canPinMessages: true,
    canManageUsers: true,
    canAccessCabalRooms: true,
    canUseDebugTools: true,
    canExportData: true
  },
  cabal: {
    canAccessVoiceChannels: true,
    canCreateChannels: true,
    canDeleteMessages: true,
    canPinMessages: true,
    canManageUsers: true,
    canAccessCabalRooms: true,
    canUseDebugTools: true,
    canExportData: true
  }
};

/**
 * Hook for managing user permissions
 * @param userId - The ID of the current user
 * @returns User role, permissions, and permission checking utilities
 */
export function usePermissions(userId: string) {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user role and permissions
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate a fetch with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, we'll set admin role for specific user IDs
        // In a real implementation, this would come from the server
        const mockRole: UserRole = 
          userId === '1' ? 'cabal' :
          userId === '2' ? 'admin' :
          userId === '3' ? 'moderator' :
          'user';
        
        setUserRole(mockRole);
        setPermissions(DEFAULT_PERMISSIONS[mockRole]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user permissions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRole();
  }, [userId]);
  
  // Check if user has a specific permission
  const hasPermission = useCallback((permission: keyof UserPermissions) => {
    return permissions[permission];
  }, [permissions]);
  
  // Check if user has a specific role or higher
  const hasRole = useCallback((role: UserRole) => {
    const roleHierarchy: UserRole[] = ['user', 'moderator', 'admin', 'cabal'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    
    return userRoleIndex >= requiredRoleIndex;
  }, [userRole]);
  
  return {
    userRole,
    permissions,
    isLoading,
    error,
    hasPermission,
    hasRole
  };
}
