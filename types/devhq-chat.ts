export interface DevHQUser {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export interface DevHQMessageFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DevHQMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  reactions: { [emoji: string]: string[] };
  type: 'text' | 'system' | 'file';
  channelId?: string;
  files?: DevHQMessageFile[];
  replyTo?: string;
  isEdited?: boolean;
  editedAt?: number;
}

export interface DevHQThread {
  id: string;
  name: string;
  parentMessageId: string;
  channelId: string;
  createdBy: string;
  createdAt: number;
  isArchived?: boolean;
}

export interface DevHQSearchFilters {
  senders: string[];
  reactions: string[];
  messageTypes: ('text' | 'file' | 'system')[];
}

export interface DevHQMessageStatus {
  messageId: string;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
  timestamp: number;
} 