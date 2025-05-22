'use client';

import React, { useState } from 'react';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'System initialization complete',
    source: 'ENIC.0'
  },
  {
    id: '2',
    timestamp: new Date().toISOString(),
    level: 'warning',
    message: 'High memory usage detected',
    source: 'System Monitor'
  },
  {
    id: '3',
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'Failed to connect to external API',
    source: 'Integration Service'
  }
];

const LogsPage: React.FC = () => {
  const [logs] = useState<Log[]>(mockLogs);

  const getLevelColor = (level: Log['level']) => {
    switch (level) {
      case 'info':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-300 mb-4">System Logs</h1>
        <p className="text-gray-400">View and analyze system activity logs.</p>
      </header>
      
      <div className="bg-gray-800 border border-blue-900/30 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-200">Recent Activity</h2>
          <div className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
            Live Updates
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          {logs.map((log) => (
            <div 
              key={log.id}
              className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border border-blue-900/20"
            >
              <div className="min-w-[100px] text-sm text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
              <div className={`min-w-[80px] text-sm font-medium ${getLevelColor(log.level)}`}>
                {log.level.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white">{log.message}</p>
                <p className="text-sm text-gray-500 mt-1">{log.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsPage; 