export interface ChatMessage {
  id: string;
  content: string;
  sender_address: string;
  room: string;
  parent_id?: string;
  created_at: string;
  edited_at?: string;
  thread_id?: string;
  reply_count?: number;
  reactions?: Record<string, string[]>;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  type: 'image' | 'file';
  url: string;
  filename: string;
  size: number;
  created_at: string;
}
