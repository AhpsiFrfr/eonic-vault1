export type ChannelType = 'text' | 'voice';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  categoryId?: string; // null if top-level
  position: number;
  unreadCount?: number;
  description?: string;
  isLocked?: boolean;
  permissions?: {
    read: string[];
    write: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  position: number;
  collapsed?: boolean;
  permissions?: {
    view: string[];
  };
}

export interface ChannelContextType {
  channels: Channel[];
  categories: Category[];
  activeChannelId: string | null;
  activeVoiceChannelId: string | null;
  
  // Channel actions
  setActiveChannel: (channelId: string) => void;
  setActiveVoiceChannel: (channelId: string | null) => void;
  createChannel: (channel: Omit<Channel, 'id' | 'position'>) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  deleteChannel: (channelId: string) => void;
  reorderChannels: (channels: Channel[]) => void;
  
  // Category actions
  createCategory: (category: Omit<Category, 'id' | 'position'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (categories: Category[]) => void;
  toggleCategoryCollapse: (categoryId: string) => void;
} 