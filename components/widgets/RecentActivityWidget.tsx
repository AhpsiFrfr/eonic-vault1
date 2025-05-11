'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  event: string;
  timestamp: string;
  type: 'transaction' | 'nft' | 'stake' | 'governance';
}

function useVaultActivity() {
  const { publicKey } = useWallet();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!publicKey) {
      setActivity([]);
      setIsLoading(false);
      return;
    }
    
    // Mock data for now
    const mockActivity = [
      {
        id: '1',
        event: 'Staked 500 EONIC',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'stake' as const
      },
      {
        id: '2',
        event: 'Received 35 EONIC reward',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        type: 'transaction' as const
      },
      {
        id: '3',
        event: 'Minted Timepiece NFT',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'nft' as const
      },
      {
        id: '4',
        event: 'Voted on governance proposal #12',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'governance' as const
      }
    ];
    
    setTimeout(() => {
      setActivity(mockActivity);
      setIsLoading(false);
    }, 800);
    
    // In a real implementation, we would fetch from an API
    // const fetchActivity = async () => {
    //   try {
    //     const response = await fetch(`/api/activity?address=${publicKey}`);
    //     const data = await response.json();
    //     setActivity(data);
    //   } catch (error) {
    //     console.error('Error fetching activity:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchActivity();
  }, [publicKey]);
  
  return { activity, isLoading };
}

export default function RecentActivityWidget() {
  const { activity, isLoading } = useVaultActivity();
  const { publicKey } = useWallet();
  
  const getTypeIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'transaction':
        return '💰';
      case 'nft':
        return '🖼️';
      case 'stake':
        return '📈';
      case 'governance':
        return '🗳️';
      default:
        return '⚡';
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
      <div className="rounded-xl bg-gray-800 p-4 text-white shadow-xl">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Recent Activity
        </h2>
        <p className="text-sm text-gray-400">Connect wallet to view activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-800 p-4 text-white shadow-xl">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Activity className="w-4 h-4 mr-2" />
        Recent Activity
      </h2>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center">
              <div className="h-5 w-5 rounded-full bg-gray-700 mr-2"></div>
              <div>
                <div className="h-4 bg-gray-700 rounded w-40 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activity.length === 0 ? (
        <p className="text-sm text-gray-400">No activity yet</p>
      ) : (
        <ul className="text-sm space-y-3">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start">
              <span className="mr-2 text-lg">{getTypeIcon(item.type)}</span>
              <div>
                <p>{item.event}</p>
                <p className="text-xs text-gray-400">{formatTime(item.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 