'use client';

import React, { useState, useEffect } from 'react';
import { useChannels } from '@/context/ChannelContext';
import { Channel, Category, ChannelType } from '@/types/channel';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiX, FiHash, FiVolume2, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight, FiMenu } from 'react-icons/fi';

interface ChannelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

function SortableItem({ id, children, isDragging }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <button 
          {...listeners}
          className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
        >
          <FiMenu className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ChannelManagerModal({ isOpen, onClose }: ChannelManagerModalProps) {
  const {
    channels,
    categories,
    createChannel,
    updateChannel,
    deleteChannel,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderChannels,
    reorderCategories,
    toggleCategoryCollapse
  } = useChannels();

  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<ChannelType>('text');
  const [newChannelCategory, setNewChannelCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingItem, setEditingItem] = useState<{ type: 'channel' | 'category'; id: string; name: string } | null>(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
  const uncategorizedChannels = channels.filter(c => !c.categoryId).sort((a, b) => a.position - b.position);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Handle category reordering
    if (active.id.toString().startsWith('category-') && over.id.toString().startsWith('category-')) {
      const oldIndex = sortedCategories.findIndex(c => c.id === active.id);
      const newIndex = sortedCategories.findIndex(c => c.id === over.id);
      
      const reorderedCategories = arrayMove(sortedCategories, oldIndex, newIndex).map((category, index) => ({
        ...category,
        position: index
      }));
      
      reorderCategories(reorderedCategories);
    }

    // Handle channel reordering within same category
    const activeChannel = channels.find(c => c.id === active.id);
    const overChannel = channels.find(c => c.id === over.id);
    
    if (activeChannel && overChannel && activeChannel.categoryId === overChannel.categoryId) {
      const categoryChannels = channels.filter(c => c.categoryId === activeChannel.categoryId);
      const oldIndex = categoryChannels.findIndex(c => c.id === active.id);
      const newIndex = categoryChannels.findIndex(c => c.id === over.id);
      
      const reorderedChannels = arrayMove(categoryChannels, oldIndex, newIndex).map((channel, index) => ({
        ...channel,
        position: index
      }));
      
      const updatedChannels = channels.map(channel => {
        const reordered = reorderedChannels.find(r => r.id === channel.id);
        return reordered || channel;
      });
      
      reorderChannels(updatedChannels);
    }
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    createChannel({
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      type: newChannelType,
      categoryId: newChannelCategory || undefined,
      description: `${newChannelType === 'text' ? 'Text' : 'Voice'} channel for ${newChannelName}`
    });

    setNewChannelName('');
    setNewChannelType('text');
    setNewChannelCategory('');
    setShowCreateChannel(false);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    createCategory({
      name: newCategoryName,
      collapsed: false
    });

    setNewCategoryName('');
    setShowCreateCategory(false);
  };

  const handleEditSave = () => {
    if (!editingItem || !editingItem.name.trim()) return;

    if (editingItem.type === 'channel') {
      updateChannel(editingItem.id, { name: editingItem.name.toLowerCase().replace(/\s+/g, '-') });
    } else {
      updateCategory(editingItem.id, { name: editingItem.name });
    }

    setEditingItem(null);
  };

  const handleDelete = (type: 'channel' | 'category', id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'channel') {
        deleteChannel(id);
      } else {
        deleteCategory(id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2f3349] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Channel Manager</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* Create Category Button */}
            <div className="mb-6">
              {!showCreateCategory ? (
                <button
                  onClick={() => setShowCreateCategory(true)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  Create Category
                </button>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="bg-[#40444b] text-white px-3 py-2 rounded flex-1"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateCategory(false);
                      setNewCategoryName('');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Categories and Channels */}
            <SortableContext items={sortedCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {sortedCategories.map((category) => {
                const categoryChannels = channels
                  .filter(c => c.categoryId === category.id)
                  .sort((a, b) => a.position - b.position);

                return (
                  <div key={category.id} className="mb-6">
                    <SortableItem id={category.id}>
                      <div className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCategoryCollapse(category.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            {category.collapsed ? (
                              <FiChevronRight className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          
                          {editingItem?.type === 'category' && editingItem.id === category.id ? (
                            <input
                              type="text"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              onBlur={handleEditSave}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                              className="bg-[#40444b] text-white px-2 py-1 rounded text-sm"
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-300 font-medium uppercase text-xs">
                              {category.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingItem({ type: 'category', id: category.id, name: category.name })}
                            className="text-gray-400 hover:text-white"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('category', category.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </SortableItem>

                    {/* Channels in category */}
                    {!category.collapsed && (
                      <div className="ml-6 mt-2 space-y-1">
                        <SortableContext items={categoryChannels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                          {categoryChannels.map((channel) => (
                            <SortableItem key={channel.id} id={channel.id}>
                              <div className="flex items-center justify-between w-full group">
                                <div className="flex items-center gap-2">
                                  {channel.type === 'text' ? (
                                    <FiHash className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <FiVolume2 className="w-4 h-4 text-gray-400" />
                                  )}
                                  
                                  {editingItem?.type === 'channel' && editingItem.id === channel.id ? (
                                    <input
                                      type="text"
                                      value={editingItem.name}
                                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                      onBlur={handleEditSave}
                                      onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                                      className="bg-[#40444b] text-white px-2 py-1 rounded text-sm"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="text-gray-300 text-sm">{channel.name}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingItem({ type: 'channel', id: channel.id, name: channel.name })}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <FiEdit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete('channel', channel.id)}
                                    className="text-gray-400 hover:text-red-400"
                                  >
                                    <FiTrash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </SortableItem>
                          ))}
                        </SortableContext>

                        {/* Add Channel to Category */}
                        <button
                          onClick={() => {
                            setNewChannelCategory(category.id);
                            setShowCreateChannel(true);
                          }}
                          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm ml-6"
                        >
                          <FiPlus className="w-3 h-3" />
                          Add Channel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </SortableContext>

            {/* Uncategorized Channels */}
            {uncategorizedChannels.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-300 font-medium uppercase text-xs mb-2">Uncategorized</h3>
                <div className="space-y-1">
                  <SortableContext items={uncategorizedChannels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {uncategorizedChannels.map((channel) => (
                      <SortableItem key={channel.id} id={channel.id}>
                        <div className="flex items-center justify-between w-full group">
                          <div className="flex items-center gap-2">
                            {channel.type === 'text' ? (
                              <FiHash className="w-4 h-4 text-gray-400" />
                            ) : (
                              <FiVolume2 className="w-4 h-4 text-gray-400" />
                            )}
                            
                            {editingItem?.type === 'channel' && editingItem.id === channel.id ? (
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                onBlur={handleEditSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                                className="bg-[#40444b] text-white px-2 py-1 rounded text-sm"
                                autoFocus
                              />
                            ) : (
                              <span className="text-gray-300 text-sm">{channel.name}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingItem({ type: 'channel', id: channel.id, name: channel.name })}
                              className="text-gray-400 hover:text-white"
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete('channel', channel.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </div>
              </div>
            )}

            {/* Create Channel */}
            {showCreateChannel && (
              <div className="bg-[#40444b] p-4 rounded-lg mb-4">
                <h3 className="text-white font-medium mb-3">Create Channel</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Channel name"
                    className="bg-[#36393f] text-white px-3 py-2 rounded w-full"
                  />
                  
                  <select
                    value={newChannelType}
                    onChange={(e) => setNewChannelType(e.target.value as ChannelType)}
                    className="bg-[#36393f] text-white px-3 py-2 rounded w-full"
                  >
                    <option value="text">Text Channel</option>
                    <option value="voice">Voice Channel</option>
                  </select>

                  <select
                    value={newChannelCategory}
                    onChange={(e) => setNewChannelCategory(e.target.value)}
                    className="bg-[#36393f] text-white px-3 py-2 rounded w-full"
                  >
                    <option value="">No Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateChannel}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Create Channel
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateChannel(false);
                        setNewChannelName('');
                        setNewChannelType('text');
                        setNewChannelCategory('');
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Create Channel (when not already showing form) */}
            {!showCreateChannel && (
              <button
                onClick={() => setShowCreateChannel(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
              >
                <FiPlus className="w-4 h-4" />
                Create Channel
              </button>
            )}
          </DndContext>
        </div>
      </div>
    </div>
  );
} 