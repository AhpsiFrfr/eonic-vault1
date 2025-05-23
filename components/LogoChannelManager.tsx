'use client';

import React, { useState } from 'react';
import { ChannelManagerModal } from './ChannelManagerModal';
import { FiSettings, FiPlus, FiHash, FiVolume2, FiFolder } from 'react-icons/fi';
import { useChannels } from '@/context/ChannelContext';
import { ChannelType } from '@/types/channel';

interface LogoChannelManagerProps {
  logoSrc: string;
  logoAlt: string;
  serverName: string;
  className?: string;
}

export function LogoChannelManager({ 
  logoSrc, 
  logoAlt, 
  serverName, 
  className = "" 
}: LogoChannelManagerProps) {
  const [showFullManager, setShowFullManager] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState<'channel' | 'category' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newChannelType, setNewChannelType] = useState<ChannelType>('text');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const { createChannel, createCategory, categories } = useChannels();

  const handleQuickCreate = () => {
    if (!newItemName.trim() || !showQuickCreate) return;

    if (showQuickCreate === 'channel') {
      createChannel({
        name: newItemName.toLowerCase().replace(/\s+/g, '-'),
        type: newChannelType,
        categoryId: selectedCategoryId || undefined,
        description: `${newChannelType === 'text' ? 'Text' : 'Voice'} channel for ${newItemName}`
      });
    } else {
      createCategory({
        name: newItemName,
        collapsed: false
      });
    }

    setNewItemName('');
    setNewChannelType('text');
    setSelectedCategoryId('');
    setShowQuickCreate(null);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewChannelType('text');
    setSelectedCategoryId('');
    setShowQuickCreate(null);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Logo Trigger */}
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer">
          <img 
            src={logoSrc} 
            alt={logoAlt}
            className="w-8 h-8 transition-transform group-hover:scale-110"
          />
          <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
            {serverName}
          </span>
        </div>

        {/* Hover Panel - Slide Down */}
        <div className="absolute left-0 right-0 top-full bg-[#18191c] border border-gray-600 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
          {/* Quick Actions */}
          <div className="p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm border-b border-gray-600 pb-2 mb-3">
              Quick Actions
            </h3>

            {/* Quick Create Form */}
            {showQuickCreate && (
              <div className="bg-[#2f3349] rounded-lg p-3 space-y-3 border border-gray-600">
                <h4 className="text-white font-medium text-sm">
                  Create {showQuickCreate === 'channel' ? 'Channel' : 'Category'}
                </h4>
                
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`${showQuickCreate === 'channel' ? 'Channel' : 'Category'} name`}
                  className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  autoFocus
                />

                {showQuickCreate === 'channel' && (
                  <>
                    <select
                      value={newChannelType}
                      onChange={(e) => setNewChannelType(e.target.value as ChannelType)}
                      className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="text">Text Channel</option>
                      <option value="voice">Voice Channel</option>
                    </select>

                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleQuickCreate}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm py-2 px-3 rounded transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            {!showQuickCreate && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setNewChannelType('text');
                    setShowQuickCreate('channel');
                  }}
                  className="flex items-center gap-2 p-3 bg-[#2f3349] hover:bg-[#3d4450] rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
                >
                  <FiHash className="w-4 h-4" />
                  Text Channel
                </button>

                <button
                  onClick={() => {
                    setNewChannelType('voice');
                    setShowQuickCreate('channel');
                  }}
                  className="flex items-center gap-2 p-3 bg-[#2f3349] hover:bg-[#3d4450] rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
                >
                  <FiVolume2 className="w-4 h-4" />
                  Voice Channel
                </button>

                <button
                  onClick={() => setShowQuickCreate('category')}
                  className="flex items-center gap-2 p-3 bg-[#2f3349] hover:bg-[#3d4450] rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
                >
                  <FiFolder className="w-4 h-4" />
                  Category
                </button>

                <button
                  onClick={() => setShowFullManager(true)}
                  className="flex items-center gap-2 p-3 bg-[#2f3349] hover:bg-[#3d4450] rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
                >
                  <FiSettings className="w-4 h-4" />
                  Full Manager
                </button>
              </div>
            )}

            {/* Tip */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-600">
              Hover over the logo to access channel management
            </div>
          </div>
        </div>
      </div>

      {/* Full Channel Manager Modal */}
      {showFullManager && (
        <ChannelManagerModal
          isOpen={showFullManager}
          onClose={() => setShowFullManager(false)}
        />
      )}
    </>
  );
} 