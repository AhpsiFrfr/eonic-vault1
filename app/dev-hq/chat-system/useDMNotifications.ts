'use client';

/**
 * Hook for managing DM notifications
 * @dev-vault-component
 */

import { useState, useEffect, useCallback } from 'react';
import { simulateNotification } from './generateFakeDM';

export interface DMNotification {
  id: string;
  type: string;
  sender: {
    id: string;
    name: string;
    profilePic: string;
    xpLevel: number;
    timepiece: string;
    isAdmin: boolean;
  };
  content: string;
  timestamp: number;
  read: boolean;
}

/**
 * Hook for managing direct message notifications
 * @returns Notification state and methods
 */
export function useDMNotifications() {
  const [notifications, setNotifications] = useState<DMNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load initial notifications
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll simulate some initial notifications
    const initialNotifications: DMNotification[] = [];
    
    // Generate 0-3 random notifications
    const count = Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const userId = (i + 1).toString();
      const notification = simulateNotification(userId);
      initialNotifications.push({
        ...notification,
        read: false
      } as DMNotification);
    }
    
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.length);
    
    // Simulate receiving new notifications periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new notification
        const userId = Math.floor(Math.random() * 4 + 1).toString();
        const newNotification = simulateNotification(userId);
        
        setNotifications(prev => [
          {
            ...newNotification,
            read: false
          } as DMNotification,
          ...prev
        ]);
        
        setUnreadCount(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark a notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === notificationId && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Clear a notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    
    // In a real implementation, this would send to an API
  }, []);
  
  // Simulate a new notification (for testing)
  const simulateNewNotification = useCallback((userId?: string) => {
    const newNotification = simulateNotification(userId);
    
    setNotifications(prev => [
      {
        ...newNotification,
        read: false
      } as DMNotification,
      ...prev
    ]);
    
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    simulateNewNotification
  };
}
