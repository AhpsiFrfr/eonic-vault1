import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Log {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

interface DebugConsoleProps {
  logs: Log[];
  onClose: () => void;
  user: any; // Replace with your user type
}

const DebugConsole: React.FC<DebugConsoleProps> = ({ logs, onClose, user }) => {
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = search === '' || 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.level.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="debug-console">
      <div className="debug-header">
        <h2>ENIC.0 Debug Console</h2>
        <div className="debug-controls">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="debug-search"
          />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'info' | 'warning' | 'error')}
            className="debug-filter"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button onClick={onClose} className="debug-close">
            Close
          </button>
        </div>
      </div>

      <div className="debug-content">
        {filteredLogs.map((log, index) => (
          <motion.div
            key={log.timestamp}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`debug-log log-${log.level}`}
          >
            <span className="log-time">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`log-level log-level-${log.level}`}>
              {log.level.toUpperCase()}
            </span>
            <span className="log-message">{log.message}</span>
          </motion.div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="no-logs">
            No logs match your criteria
          </div>
        )}
      </div>

      <div className="debug-footer">
        <div className="debug-stats">
          <span>Total Logs: {logs.length}</span>
          <span>Filtered: {filteredLogs.length}</span>
          <span>Developer: {user?.displayName || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default DebugConsole; 