'use client';

import React, { useState } from 'react';

// @dev-vault-component
export default function NotificationSettings({ channelId, userId, onClose }) {
  const [settings, setSettings] = useState({
    muted: false,
    muteDuration: 'hour', // 'hour', 'day', 'week', 'forever'
    mentionsOnly: false,
    desktopNotifications: true,
    soundEnabled: true,
    previewEnabled: true
  });
  
  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleMuteDurationChange = (duration) => {
    setSettings(prev => ({
      ...prev,
      muteDuration: duration
    }));
  };
  
  const saveSettings = () => {
    // In a real implementation, this would call an API
    console.log('Saving notification settings:', settings);
    onClose();
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <h3 className="text-white font-medium">Notification Settings</h3>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Settings */}
      <div className="p-4 space-y-4">
        {/* Mute */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Mute</h4>
            <p className="text-sm text-zinc-400">Disable all notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.muted}
              onChange={() => handleToggle('muted')}
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {/* Mute Duration (only shown if muted) */}
        {settings.muted && (
          <div className="ml-4 mt-2">
            <h4 className="text-sm text-white mb-2">Mute Duration</h4>
            <div className="space-y-2">
              {[
                { value: 'hour', label: 'For 1 hour' },
                { value: 'day', label: 'For 1 day' },
                { value: 'week', label: 'For 1 week' },
                { value: 'forever', label: 'Until I turn it back on' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600 bg-zinc-700 border-zinc-600 focus:ring-blue-500"
                    checked={settings.muteDuration === option.value}
                    onChange={() => handleMuteDurationChange(option.value)}
                  />
                  <span className="ml-2 text-sm text-zinc-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Mentions Only */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Mentions Only</h4>
            <p className="text-sm text-zinc-400">Only notify when you're mentioned</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.mentionsOnly}
              onChange={() => handleToggle('mentionsOnly')}
              disabled={settings.muted}
            />
            <div className={`w-11 h-6 ${settings.muted ? 'bg-zinc-800 opacity-50' : 'bg-zinc-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
          </label>
        </div>
        
        {/* Desktop Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Desktop Notifications</h4>
            <p className="text-sm text-zinc-400">Show notifications on your desktop</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.desktopNotifications}
              onChange={() => handleToggle('desktopNotifications')}
              disabled={settings.muted}
            />
            <div className={`w-11 h-6 ${settings.muted ? 'bg-zinc-800 opacity-50' : 'bg-zinc-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
          </label>
        </div>
        
        {/* Sound */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Notification Sound</h4>
            <p className="text-sm text-zinc-400">Play a sound for new messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.soundEnabled}
              onChange={() => handleToggle('soundEnabled')}
              disabled={settings.muted}
            />
            <div className={`w-11 h-6 ${settings.muted ? 'bg-zinc-800 opacity-50' : 'bg-zinc-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
          </label>
        </div>
        
        {/* Message Preview */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Message Preview</h4>
            <p className="text-sm text-zinc-400">Show message content in notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.previewEnabled}
              onChange={() => handleToggle('previewEnabled')}
              disabled={settings.muted || !settings.desktopNotifications}
            />
            <div className={`w-11 h-6 ${settings.muted || !settings.desktopNotifications ? 'bg-zinc-800 opacity-50' : 'bg-zinc-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
          </label>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end p-3 border-t border-zinc-700">
        <button
          className="px-3 py-1 mr-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={saveSettings}
        >
          Save
        </button>
      </div>
    </div>
  );
}
