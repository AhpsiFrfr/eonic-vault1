'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

function useVaultNotifications() {
  const { publicKey } = useWallet();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!publicKey) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    // Mock data for now
    const mockNotifications = [
      {
        id: '1',
        message: 'Timepiece evolution accelerated by 10%',
        type: 'success' as const,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: '2',
        message: 'New airdrop available in your vault',
        type: 'info' as const,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: '3',
        message: 'Community milestone reached: 10,000 tokens staked',
        type: 'info' as const,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];
    
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 800);
    
    // In a real implementation, we would fetch from an API
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await fetch(`/api/notifications?address=${publicKey}`);
    //     const data = await response.json();
    //     setNotifications(data);
    //   } catch (error) {
    //     console.error('Error fetching notifications:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchNotifications();
  }, [publicKey]);
  
  return { notifications, isLoading };
}

export default function VaultNotificationsWidget() {
  const { notifications, isLoading } = useVaultNotifications();
  const { publicKey } = useWallet();
  
  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 text-green-300';
      case 'warning':
        return 'border-yellow-500 text-yellow-300';
      case 'error':
        return 'border-red-500 text-red-300';
      default:
        return 'border-indigo-500 text-indigo-300';
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (!publicKey) {
    return (
      <div className="rounded-xl bg-gray-900 p-4 text-white shadow-xl">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Vault Notifications
        </h2>
        <p className="text-sm text-gray-400">Connect wallet to view notifications</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-900 p-4 text-white shadow-xl">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Bell className="w-4 h-4 mr-2" />
        Vault Notifications
      </h2>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-400">No notifications yet</p>
      ) : (
        <ul className="text-sm space-y-3">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`border-l-2 pl-2 ${getTypeStyles(notification.type)} ${notification.read ? 'opacity-70' : ''}`}
            >
              <p>{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 