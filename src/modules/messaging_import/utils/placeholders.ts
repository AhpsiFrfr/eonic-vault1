import { Message, Chat, User, MessageAttachment } from '../types';

// Placeholder functions to replace Telegram's API calls
// Typing indicator state
const typingUsers = new Map<string, Set<string>>();

const setTyping = async (chatId: string, userAddress: string) => {
  let chatTypers = typingUsers.get(chatId);
  if (!chatTypers) {
    chatTypers = new Set();
    typingUsers.set(chatId, chatTypers);
  }
  chatTypers.add(userAddress);

  // Auto-remove typing indicator after 3 seconds
  setTimeout(() => {
    const typingSet = typingUsers.get(chatId);
    if (typingSet) {
      typingSet.delete(userAddress);
      if (typingSet.size === 0) {
        typingUsers.delete(chatId);
      }
    }
  }, 3000);
};

const getTypingUsers = (chatId: string): string[] => {
  return Array.from(typingUsers.get(chatId) || []);
};

export const messagingAPI = {
  async sendMessage(content: string, chatId: string, replyTo?: string, attachments?: File[]): Promise<Message> {
    console.log('Placeholder: sendMessage', { content, chatId, replyTo, attachments });
    return {
      id: Date.now().toString(),
      content,
      sender_address: 'current_user',
      created_at: new Date().toISOString(),
      timestamp: Date.now(),
    };
  },

  async fetchMessages(chatId: string, limit: number = 50): Promise<Message[]> {
    console.log('Placeholder: fetchMessages', { chatId, limit });
    return [];
  },

  async getChats(): Promise<Chat[]> {
    console.log('Placeholder: getChats');
    return [];
  },

  async getUserData(address: string): Promise<User | null> {
    console.log('Placeholder: getUserData', { address });
    return null;
  },

  async uploadAttachment(file: File): Promise<MessageAttachment> {
    console.log('Placeholder: uploadAttachment', { file });
    return {
      id: Math.random().toString(36).substring(7),
      type: file.type,
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
    };
  },

  async toggleReaction(messageId: string, emoji: string): Promise<void> {
    console.log('Placeholder: toggleReaction', { messageId, emoji });
  }
};
