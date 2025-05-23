'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChannels } from '@/context/ChannelContext';
import { Channel, Category, ChannelType } from '@/types/channel';
import { FiHash, FiVolume2, FiPlus, FiEdit2, FiTrash2, FiMoreHorizontal, FiFolder, FiMove } from 'react-icons/fi';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  target?: {
    type: 'channel' | 'category' | 'space';
    item?: Channel | Category;
  };
}

interface ContextMenuOption {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  danger?: boolean;
  separator?: boolean;
}

export function ChannelContextMenu({ x, y, onClose, target }: ContextMenuProps) {
  const {
    channels,
    categories,
    createChannel,
    createCategory,
    deleteChannel,
    deleteCategory,
    updateChannel,
    updateCategory
  } = useChannels();

  const menuRef = useRef<HTMLDivElement>(null);
  const [showCreateForm, setShowCreateForm] = useState<'channel' | 'category' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newChannelType, setNewChannelType] = useState<ChannelType>('text');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleCreateChannel = () => {
    if (!newItemName.trim()) return;

    const categoryId = target?.type === 'category' ? (target.item as Category)?.id : selectedCategoryId || undefined;

    createChannel({
      name: newItemName.toLowerCase().replace(/\s+/g, '-'),
      type: newChannelType,
      categoryId,
      description: `${newChannelType === 'text' ? 'Text' : 'Voice'} channel for ${newItemName}`
    });

    setNewItemName('');
    setNewChannelType('text');
    setSelectedCategoryId('');
    setShowCreateForm(null);
    onClose();
  };

  const handleCreateCategory = () => {
    if (!newItemName.trim()) return;

    createCategory({
      name: newItemName,
      collapsed: false
    });

    setNewItemName('');
    setShowCreateForm(null);
    onClose();
  };

  const handleEdit = () => {
    if (!target?.item) return;
    
    const newName = prompt(
      `Enter new name for ${target.type}:`,
      target.type === 'channel' ? (target.item as Channel).name : (target.item as Category).name
    );

    if (newName && newName.trim()) {
      if (target.type === 'channel') {
        updateChannel(target.item.id, { name: newName.toLowerCase().replace(/\s+/g, '-') });
      } else {
        updateCategory(target.item.id, { name: newName });
      }
    }
    onClose();
  };

  const handleDelete = () => {
    if (!target?.item) return;

    const confirmMessage = `Are you sure you want to delete this ${target.type}?`;
    if (confirm(confirmMessage)) {
      if (target.type === 'channel') {
        deleteChannel(target.item.id);
      } else {
        deleteCategory(target.item.id);
      }
    }
    onClose();
  };

  const getMenuOptions = (): ContextMenuOption[] => {
    const options: ContextMenuOption[] = [];

    if (!target || target.type === 'space') {
      // Empty space context menu
      options.push(
        {
          icon: <FiHash className="w-4 h-4" />,
          label: 'Create Text Channel',
          action: () => {
            setNewChannelType('text');
            setShowCreateForm('channel');
          }
        },
        {
          icon: <FiVolume2 className="w-4 h-4" />,
          label: 'Create Voice Channel',
          action: () => {
            setNewChannelType('voice');
            setShowCreateForm('channel');
          }
        },
        {
          icon: <FiFolder className="w-4 h-4" />,
          label: 'Create Category',
          action: () => setShowCreateForm('category'),
          separator: true
        }
      );
    } else if (target.type === 'category') {
      const category = target.item as Category;
      options.push(
        {
          icon: <FiHash className="w-4 h-4" />,
          label: 'Create Text Channel',
          action: () => {
            setNewChannelType('text');
            setSelectedCategoryId(category.id);
            setShowCreateForm('channel');
          }
        },
        {
          icon: <FiVolume2 className="w-4 h-4" />,
          label: 'Create Voice Channel',
          action: () => {
            setNewChannelType('voice');
            setSelectedCategoryId(category.id);
            setShowCreateForm('channel');
          }
        },
        {
          icon: <FiEdit2 className="w-4 h-4" />,
          label: 'Edit Category',
          action: handleEdit,
          separator: true
        },
        {
          icon: <FiTrash2 className="w-4 h-4" />,
          label: 'Delete Category',
          action: handleDelete,
          danger: true
        }
      );
    } else if (target.type === 'channel') {
      const channel = target.item as Channel;
      options.push(
        {
          icon: <FiEdit2 className="w-4 h-4" />,
          label: 'Edit Channel',
          action: handleEdit
        },
        {
          icon: <FiMove className="w-4 h-4" />,
          label: 'Move to Category',
          action: () => {
            // TODO: Implement move to category functionality
            console.log('Move to category clicked');
          },
          separator: true
        },
        {
          icon: <FiTrash2 className="w-4 h-4" />,
          label: 'Delete Channel',
          action: handleDelete,
          danger: true
        }
      );
    }

    return options;
  };

  const menuOptions = getMenuOptions();

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 250);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#18191c] border border-gray-600 rounded-lg shadow-xl min-w-[200px] py-2"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {showCreateForm ? (
        <div className="p-3 space-y-3">
          <h3 className="text-white font-medium text-sm">
            Create {showCreateForm === 'channel' ? 'Channel' : 'Category'}
          </h3>
          
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`${showCreateForm === 'channel' ? 'Channel' : 'Category'} name`}
            className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          {showCreateForm === 'channel' && (
            <>
              <select
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value as ChannelType)}
                className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Text Channel</option>
                <option value="voice">Voice Channel</option>
              </select>

              {(!target || target.type !== 'category') && (
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-[#40444b] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={showCreateForm === 'channel' ? handleCreateChannel : handleCreateCategory}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateForm(null);
                setNewItemName('');
                setNewChannelType('text');
                setSelectedCategoryId('');
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        menuOptions.map((option, index) => (
          <React.Fragment key={index}>
            {option.separator && <div className="h-px bg-gray-600 my-1" />}
            <button
              onClick={option.action}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                option.danger
                  ? 'text-red-400 hover:bg-red-600/20 hover:text-red-300'
                  : 'text-gray-300 hover:bg-blue-600/20 hover:text-white'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          </React.Fragment>
        ))
      )}
    </div>
  );
}

interface OverflowMenuProps {
  target: {
    type: 'channel' | 'category';
    item: Channel | Category;
  };
  onOpenContextMenu: (x: number, y: number, target: { type: 'channel' | 'category'; item: Channel | Category }) => void;
}

export function OverflowMenu({ target, onOpenContextMenu }: OverflowMenuProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    onOpenContextMenu(rect.right, rect.top, target);
  };

  return (
    <button
      onClick={handleClick}
      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-1 rounded hover:bg-gray-700/50"
      title="More options"
    >
      <FiMoreHorizontal className="w-4 h-4" />
    </button>
  );
} 