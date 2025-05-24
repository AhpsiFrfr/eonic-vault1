import { ReactNode } from 'react';

export interface EnicoMessage {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface EnicoThread {
  id: string;
  title?: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  isVaulted?: boolean;
}

export interface ThreadAssistantProps {
  messages: EnicoMessage[];
  threadId: string;
  userId: string;
  onSendReply?: (reply: string) => void;
  onVault?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export interface SidebarHeaderProps {
  onClose?: () => void;
}

export interface ThreadSummaryProps {
  summary: string;
}

export interface SuggestedReplyProps {
  replyText: string;
  setReplyText: (text: string) => void;
  isEditing: boolean;
}

export interface ActionButtonsProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSendClick: () => void;
  onVaultClick: () => void;
  disableSend?: boolean;
} 