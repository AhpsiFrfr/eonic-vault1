// Mock implementation for testing purposes
// In a production environment, this would use the actual Supabase client

import { createClient } from '@supabase/supabase-js';
import { UserProfile } from './user';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// In-memory storage for mock data
const mockMessages = new Map<string, any[]>();
const mockDirectMessages = new Map<string, any[]>();
const mockProfiles = new Map<string, any>();
const inMemoryProfiles = new Map<string, any>();
const inMemoryStorage = new Map<string, any>();

// Create a mock client that doesn't make real network requests when using placeholders
let supabase: any;

if (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
  console.log('[MOCK] Using mock Supabase implementation');
  
  // Enhanced mock client with proper method chaining
  supabase = {
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            console.log(`[MOCK] ${table}.select('${columns}').eq('${column}', '${value}').single()`);
            if (table === 'user_profiles') {
              const profile = inMemoryProfiles.get(value);
              return { data: profile || null, error: null };
            }
            return { data: null, error: null };
          },
          maybeSingle: async () => {
            console.log(`[MOCK] ${table}.select('${columns}').eq('${column}', '${value}').maybeSingle()`);
            return { data: null, error: null };
          },
          order: (orderColumn: string, options?: any) => ({
            limit: (limitCount: number) => Promise.resolve({ data: [], error: null }),
            then: (callback: any) => callback({ data: [], error: null })
          }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        order: (column: string, options?: any) => ({
          limit: (limitCount: number) => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        limit: (limitCount: number) => Promise.resolve({ data: [], error: null }),
        is: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        or: (condition: string) => Promise.resolve({ data: [], error: null }),
        not: (column: string, operator: string, value: any) => ({
          maybeSingle: async () => ({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            console.log(`[MOCK] ${table}.insert().select('${columns}').single()`);
            const newRecord = { id: `mock-${Date.now()}`, created_at: new Date().toISOString(), ...data };
            return { data: newRecord, error: null };
          },
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => callback({ data: null, error: null })
      }),
      upsert: (data: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            console.log(`[MOCK] ${table}.upsert().select('${columns}').single()`);
            if (table === 'user_profiles') {
              const walletAddr = data.wallet_address || '';
              const existingProfile = inMemoryProfiles.get(walletAddr);
              const updatedProfile = existingProfile ? { ...existingProfile, ...data } : { id: `mock-${Date.now()}`, ...data };
              inMemoryProfiles.set(walletAddr, updatedProfile);
              return { data: updatedProfile, error: null };
            }
            return { data: { id: `mock-${Date.now()}`, ...data }, error: null };
          },
          then: (callback: any) => callback({ data: null, error: null })
        }),
        then: (callback: any) => callback({ data: null, error: null })
      })
    }),
    rpc: (fnName: string, params?: any) => {
      console.log(`[MOCK] Calling RPC function: ${fnName}`, params);
      return {
        select: (columns: string = '*') => Promise.resolve({ data: [], error: null }),
        then: (callback: any) => callback({ data: [], error: null })
      };
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    channel: (channelName: string) => {
      console.log(`[MOCK] Creating channel: ${channelName}`);
      return {
        on: (event: string, options: any, callback?: any) => {
          console.log(`[MOCK] Subscribing to ${event} on channel ${channelName}`);
          return {
            subscribe: () => {
              console.log(`[MOCK] Subscribed to channel ${channelName}`);
              return Promise.resolve();
            }
          };
        },
        subscribe: () => {
          console.log(`[MOCK] Subscribed to channel ${channelName}`);
          return Promise.resolve();
        },
        unsubscribe: () => {
          console.log(`[MOCK] Unsubscribed from channel ${channelName}`);
          return Promise.resolve();
        }
      };
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any) => {
          console.log(`[MOCK] Uploading to ${bucket}/${path}`);
          const key = `${bucket}/${path}`;
          inMemoryStorage.set(key, file);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          const publicUrl = `/mock-storage/${bucket}/${path}`;
          return { data: { publicUrl } };
        }
      })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

// Additional utility functions for backward compatibility
export async function createProfile(walletAddress: string, data: Partial<UserProfile>) {
  console.log(`[MOCK] Creating profile for ${walletAddress}`);
  const profile = { id: `mock-${Date.now()}`, wallet_address: walletAddress, ...data };
  inMemoryProfiles.set(walletAddress, profile);
  return profile;
}

export async function updateProfile(walletAddress: string, updates: Partial<UserProfile>) {
  console.log(`[MOCK] Updating profile for ${walletAddress}`);
  const existing = inMemoryProfiles.get(walletAddress) || {};
  const updated = { ...existing, ...updates };
  inMemoryProfiles.set(walletAddress, updated);
  return updated;
}

export async function getProfile(walletAddress: string) {
  const profile = inMemoryProfiles.get(walletAddress);
  if (!profile) {
    return await createProfile(walletAddress, {});
  }
  return profile;
}

// Mock client factory function
export const createSupabaseClient = (walletAddress?: string) => {
  console.log(`[MOCK] Creating Supabase client with wallet: ${walletAddress ? walletAddress.substring(0, 8) + '...' : 'none'}`);
  return supabase;
};

// Default client for convenience
export const supabaseMock = supabase;

// Interfaces for type checking
export interface MessageAttachment {
  id: string;
  message_id: string;
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

export interface DirectMessage {
  id: string;
  created_at: string;
  content: string;
  sender_address: string;
  recipient_address: string;
  parent_id?: string;
  thread_count: number;
  attachments?: MessageAttachment[];
}

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
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  smart_action?: 'rephrase' | 'summarize' | 'idea' | 'task' | 'translate';
  thread_count?: number;
}

// Mock functions for compatibility
export async function sendMessage(
  content: string,
  senderAddress: string,
  room: string = 'general',
  attachments?: File[],
  parentId?: string
) {
  console.log(`[MOCK] Sending message to room ${room}`);
  const message = {
    id: `mock-${Date.now()}`,
    content,
    sender_address: senderAddress,
    room,
    parent_id: parentId,
    created_at: new Date().toISOString(),
    attachments: [],
    reactions: []
  };
  return { data: message, error: null };
}

export function subscribeToDirectMessages(
  senderAddress: string,
  recipientAddress: string,
  callback: (message: DirectMessage) => void
) {
  console.log(`[MOCK] Subscribing to DMs between ${senderAddress} and ${recipientAddress}`);
  return supabase.channel(`dm:${[senderAddress, recipientAddress].sort().join(':')}`);
}

export function subscribeToMessages(
  room: string = 'general',
  callback: (message: ChatMessage) => void
) {
  console.log(`[MOCK] Subscribing to messages in room ${room}`);
  return supabase.channel('messages');
}

export async function getMessages(
  room: string = 'general',
  limit: number = 50,
  parentId?: string
): Promise<ChatMessage[]> {
  console.log(`[MOCK] Getting messages from room ${room}`);
  return [];
}

export async function getMessageAttachments(messageId: string) {
  console.log(`[MOCK] Getting attachments for message ${messageId}`);
  return [];
}

export async function getMessageReactions(messageId: string) {
  console.log(`[MOCK] Getting reactions for message ${messageId}`);
  return [];
}

export async function toggleReaction(
  messageId: string,
  senderAddress: string,
  emoji: string
) {
  console.log(`[MOCK] Toggling reaction ${emoji} on message ${messageId}`);
  return [];
}

export async function deleteMessage(messageId: string, senderAddress: string) {
  console.log(`[MOCK] Deleting message ${messageId}`);
  return { success: true };
}

export function subscribeToChannel(channelName: string, table: string, callback: (payload: any) => void) {
  console.log(`[MOCK] Subscribing to channel ${channelName} for table ${table}`);
  return {
    unsubscribe: () => {
      console.log(`[MOCK] Unsubscribing from channel ${channelName}`);
    }
  };
}

export function unsubscribeFromChannel(channelName: string) {
  console.log(`[MOCK] Unsubscribing from channel ${channelName}`);
}
