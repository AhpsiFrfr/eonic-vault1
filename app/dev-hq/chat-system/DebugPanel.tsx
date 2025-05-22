'use client';

import React, { useState } from 'react';

// @dev-vault-component
export default function DebugPanel({ onClose }) {
  const [debugMode, setDebugMode] = useState(false);
  const [logLevel, setLogLevel] = useState('info');
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationSettings, setSimulationSettings] = useState({
    userCount: 5,
    messageRate: 'medium', // slow, medium, fast
    duration: 5, // minutes
    includeErrors: true,
    includeMedia: true
  });
  const [logs, setLogs] = useState([
    { level: 'info', message: 'Debug panel initialized', timestamp: Date.now() }
  ]);
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    addLog(newMode ? 'info' : 'warn', `Debug mode ${newMode ? 'enabled' : 'disabled'}`);
  };
  
  // Change log level
  const changeLogLevel = (level) => {
    setLogLevel(level);
    addLog('info', `Log level changed to ${level}`);
  };
  
  // Add a log entry
  const addLog = (level, message) => {
    setLogs(prev => [
      { level, message, timestamp: Date.now() },
      ...prev.slice(0, 99) // Keep only the last 100 logs
    ]);
  };
  
  // Update simulation settings
  const updateSimulationSetting = (key, value) => {
    setSimulationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Start simulation
  const startSimulation = () => {
    setSimulationActive(true);
    addLog('info', `Starting user simulation with ${simulationSettings.userCount} users at ${simulationSettings.messageRate} rate for ${simulationSettings.duration} minutes`);
    
    // In a real implementation, this would start a simulation process
    // For now, we'll just add some mock logs
    
    const messageIntervals = {
      slow: 10000, // 10 seconds
      medium: 5000, // 5 seconds
      fast: 1000 // 1 second
    };
    
    const interval = setInterval(() => {
      const randomUser = `User${Math.floor(Math.random() * simulationSettings.userCount) + 1}`;
      const actions = ['sent a message', 'reacted to a message', 'edited a message', 'deleted a message', 'joined voice channel', 'left voice channel'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      addLog('info', `${randomUser} ${randomAction}`);
      
      // Occasionally add errors if enabled
      if (simulationSettings.includeErrors && Math.random() < 0.1) {
        const errors = ['failed to send message', 'disconnected from voice', 'failed to load profile', 'permission denied'];
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        addLog('error', `${randomUser} ${randomError}`);
      }
      
      // Occasionally add media logs if enabled
      if (simulationSettings.includeMedia && Math.random() < 0.2) {
        const media = ['uploaded an image', 'shared a GIF', 'sent a voice message', 'shared a file'];
        const randomMedia = media[Math.floor(Math.random() * media.length)];
        addLog('info', `${randomUser} ${randomMedia}`);
      }
    }, messageIntervals[simulationSettings.messageRate]);
    
    // Stop simulation after the specified duration
    setTimeout(() => {
      clearInterval(interval);
      setSimulationActive(false);
      addLog('info', 'Simulation completed');
    }, simulationSettings.duration * 60 * 1000);
  };
  
  // Stop simulation
  const stopSimulation = () => {
    setSimulationActive(false);
    addLog('warn', 'Simulation stopped manually');
    
    // In a real implementation, this would stop the simulation process
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([{ level: 'info', message: 'Logs cleared', timestamp: Date.now() }]);
  };
  
  // Export logs
  const exportLogs = () => {
    const logText = logs.map(log => `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] ${log.message}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-vault-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLog('info', 'Logs exported');
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-4xl h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 className="text-white font-medium">Dev Vault Debug Panel</h3>
        </div>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-64 border-r border-zinc-700 p-4 overflow-y-auto">
          <h4 className="text-white font-medium mb-3">Debug Controls</h4>
          
          {/* Debug Mode Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-300 text-sm">Debug Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={debugMode}
                  onChange={toggleDebugMode}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-xs text-zinc-500">Enable detailed logging and development features</p>
          </div>
          
          {/* Log Level */}
          <div className="mb-4">
            <label className="text-zinc-300 text-sm block mb-2">Log Level</label>
            <select
              className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={logLevel}
              onChange={(e) => changeLogLevel(e.target.value)}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="border-t border-zinc-700 my-4 pt-4">
            <h4 className="text-white font-medium mb-3">User Simulation</h4>
            
            {/* User Count */}
            <div className="mb-3">
              <label className="text-zinc-300 text-sm block mb-1">User Count</label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={simulationSettings.userCount}
                onChange={(e) => updateSimulationSetting('userCount', parseInt(e.target.value) || 1)}
                disabled={simulationActive}
              />
            </div>
            
            {/* Message Rate */}
            <div className="mb-3">
              <label className="text-zinc-300 text-sm block mb-1">Message Rate</label>
              <select
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={simulationSettings.messageRate}
                onChange={(e) => updateSimulationSetting('messageRate', e.target.value)}
                disabled={simulationActive}
              >
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            </div>
            
            {/* Duration */}
            <div className="mb-3">
              <label className="text-zinc-300 text-sm block mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={simulationSettings.duration}
                onChange={(e) => updateSimulationSetting('duration', parseInt(e.target.value) || 1)}
                disabled={simulationActive}
              />
            </div>
            
            {/* Include Errors */}
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="includeErrors"
                className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                checked={simulationSettings.includeErrors}
                onChange={(e) => updateSimulationSetting('includeErrors', e.target.checked)}
                disabled={simulationActive}
              />
              <label htmlFor="includeErrors" className="ml-2 text-sm text-zinc-300">
                Include Errors
              </label>
            </div>
            
            {/* Include Media */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="includeMedia"
                className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                checked={simulationSettings.includeMedia}
                onChange={(e) => updateSimulationSetting('includeMedia', e.target.checked)}
                disabled={simulationActive}
              />
              <label htmlFor="includeMedia" className="ml-2 text-sm text-zinc-300">
                Include Media
              </label>
            </div>
            
            {/* Simulation Controls */}
            <div className="flex space-x-2">
              {!simulationActive ? (
                <button
                  className="flex-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
                  onClick={startSimulation}
                >
                  Start Simulation
                </button>
              ) : (
                <button
                  className="flex-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
                  onClick={stopSimulation}
                >
                  Stop Simulation
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Panel - Logs */}
        <div className="flex-1 flex flex-col">
          {/* Log Controls */}
          <div className="p-2 border-b border-zinc-700 flex justify-between items-center">
            <h4 className="text-white font-medium">Activity Logs</h4>
            <div className="flex space-x-2">
              <button
                className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                onClick={clearLogs}
              >
                Clear
              </button>
              <button
                className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                onClick={exportLogs}
              >
                Export
              </button>
            </div>
          </div>
          
          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.level === 'error' ? 'text-red-400' :
                log.level === 'warn' ? 'text-yellow-400' :
                log.level === 'debug' ? 'text-purple-400' :
                'text-zinc-300'
              }`}>
                <span className="text-zinc-500">[{formatTimestamp(log.timestamp)}]</span>{' '}
                <span className="uppercase">[{log.level}]</span>{' '}
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
