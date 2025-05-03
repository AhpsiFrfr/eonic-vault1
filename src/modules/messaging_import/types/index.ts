export interface Message {
  id: string;
  content: string;
  sender_address: string;
  created_at: string;
  parent_id?: string;
  timestamp: number;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  reply_to?: string;
}

export interface MessageAttachment {
  id: string;
  type: string;
  url: string;
  filename: string;
  size: number;
  preview_url?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  sender_address: string;
  emoji: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string;
  participants: string[];
  last_message?: Message;
  unread_count?: number;
}

export interface User {
  address: string;
  display_name?: string;
  avatar_url?: string;
  status?: 'online' | 'offline';
  last_seen?: number;
}
