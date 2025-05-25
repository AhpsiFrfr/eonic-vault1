'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePylonContext } from '@/context/PylonContext';
import { availablePylons, getPylonsByCategory, PylonDefinition } from '@/constants/pylons';
import { RotateCcw, Eye, EyeOff, Grid, List, Save, X, AlertCircle } from 'lucide-react';

export default function PylonSelector() {
  const { 
    activePylons, 
    draftPylons, 
    togglePylon, 
    isDraft, 
    resetToDefaults, 
    savePylons, 
    discardChanges, 
    hasUnsavedChanges 
  } = usePylonContext();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<PylonDefinition['category'] | 'all'>('all');
  const [isSaving, setIsSaving] = useState(false);

  const categories: Array<{ key: PylonDefinition['category'] | 'all', label: string, icon: string }> = [
    { key: 'all', label: 'All Pylons', icon: '🏛️' },
    { key: 'identity', label: 'Identity', icon: '🆔' },
    { key: 'monitoring', label: 'Monitoring', icon: '📡' },
    { key: 'social', label: 'Social', icon: '👥' },
    { key: 'utility', label: 'Utility', icon: '🔧' },
    { key: 'customization', label: 'Customization', icon: '🎨' }
  ];

  const filteredPylons = selectedCategory === 'all' 
    ? availablePylons 
    : getPylonsByCategory(selectedCategory);

  const activeCount = activePylons.length;
  const draftCount = draftPylons.length;
  const totalCount = availablePylons.length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      savePylons();
      // Optional: Show success message
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Error saving pylons:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-glow">Pylon Manager</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              {activeCount} of {totalCount} pylons active
            </span>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span>Draft: {draftCount} pylons selected</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Save/Discard Actions */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-950/50 to-orange-950/50 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-400">Unsaved Changes</h3>
                <p className="text-sm text-gray-300">
                  You have {Math.abs(draftCount - activeCount)} pylon changes that haven't been saved.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={discardChanges}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors flex items-center gap-2 text-gray-300"
              >
                <X className="w-4 h-4" />
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-white font-semibold"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              selectedCategory === category.key
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Pylons Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
          : 'space-y-3'
      }`}>
        {filteredPylons.map((pylon) => {
          const active = isDraft(pylon.id); // Use draft state for display
          const isChanged = isDraft(pylon.id) !== activePylons.includes(pylon.id);
          
          return (
            <motion.div
              key={pylon.id}
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer border rounded-xl transition-all p-4 ${
                active 
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-950/50 to-blue-950/30 shadow-glow-blue' 
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
              } ${pylon.isCore ? 'ring-1 ring-yellow-500/30' : ''} ${
                isChanged ? 'ring-2 ring-yellow-400/50' : ''
              }`}
              onClick={() => !pylon.isCore && togglePylon(pylon.id)}
            >
              <div className={`flex items-start justify-between ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center gap-4' : 'space-y-2'}`}>
                  <div className={`flex items-center gap-3 ${viewMode === 'list' ? '' : 'w-full'}`}>
                    <span className="text-2xl">{pylon.icon}</span>
                    <div className={viewMode === 'list' ? 'flex-1' : 'flex-1'}>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {pylon.name}
                        {pylon.isCore && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            CORE
                          </span>
                        )}
                        {isChanged && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            CHANGED
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{pylon.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 ${viewMode === 'list' ? '' : 'mt-3'}`}>
                  {!pylon.isCore ? (
                    active ? (
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Inactive</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Required</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <div className="text-center">
          <div className="text-xl font-bold text-cyan-400">{activeCount}</div>
          <div className="text-xs text-gray-400">Active Pylons</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-400">{getPylonsByCategory('identity').length}</div>
          <div className="text-xs text-gray-400">Identity</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">{getPylonsByCategory('utility').length}</div>
          <div className="text-xs text-gray-400">Utility</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">{getPylonsByCategory('customization').length}</div>
          <div className="text-xs text-gray-400">Customization</div>
        </div>
      </div>
    </div>
  );
} 