export interface DevHQUser {
  id: string;
  username: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface DevHQMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  reactions: { [key: string]: string[] };
  threadId?: string;
  parentId?: string;
  isEdited?: boolean;
  type?: 'text' | 'file' | 'system';
  files?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface DevHQThread {
  id: string;
  parentMessageId: string;
  messages: DevHQMessage[];
  participantIds: string[];
  lastActivityAt: number;
}

export interface DevHQSearchFilters {
  senders: string[];
  reactions: string[];
  messageTypes: ('text' | 'file' | 'system')[];
}

export interface DevHQMessageStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'seen';
  timestamp: number;
} 