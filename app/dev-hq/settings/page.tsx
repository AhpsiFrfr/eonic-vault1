'use client';

import React, { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value: string | boolean;
  options?: string[];
}

const mockSettings: Setting[] = [
  {
    id: 'debug-mode',
    label: 'Debug Mode',
    description: 'Enable detailed logging and development features',
    type: 'toggle',
    value: true
  },
  {
    id: 'theme',
    label: 'Interface Theme',
    description: 'Select your preferred UI theme',
    type: 'select',
    value: 'cosmic',
    options: ['cosmic', 'cyberpunk', 'minimal']
  },
  {
    id: 'api-key',
    label: 'API Key',
    description: 'Your development API key for testing',
    type: 'input',
    value: 'sk_test_...'
  }
];

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>(mockSettings);

  const handleSettingChange = (id: string, newValue: string | boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value: newValue } : setting
      )
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-300 mb-4">Dev HQ Settings</h1>
        <p className="text-gray-400">Configure your development environment preferences.</p>
      </header>
      
      <div className="bg-gray-800 border border-blue-900/30 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-blue-200 mb-6">General Settings</h2>
        
        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.id} className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <label htmlFor={setting.id} className="text-white font-medium">
                    {setting.label}
                  </label>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                
                {setting.type === 'toggle' && (
                  <button
                    onClick={() => handleSettingChange(setting.id, !setting.value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      setting.value ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                        setting.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
                
                {setting.type === 'select' && (
                  <select
                    id={setting.id}
                    value={setting.value as string}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    className="bg-gray-700 border border-blue-900/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
                
                {setting.type === 'input' && (
                  <input
                    type="text"
                    id={setting.id}
                    value={setting.value as string}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    className="bg-gray-700 border border-blue-900/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 