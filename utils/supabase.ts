// Mock implementation for testing purposes
// In a production environment, this would use the actual Supabase client

import { createClient } from '@supabase/supabase-js';
import { UserProfile } from './user';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Create a mock client that doesn't make real network requests when using placeholders
let supabase: any;

if (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
  console.log('[MOCK] Using mock Supabase implementation');
  supabase = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        }),
        order: () => ({ 
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: () => ({ 
        eq: () => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({ 
        eq: () => Promise.resolve({ data: null, error: null })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {}
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

// Helper function to create a profile
export async function createProfile(walletAddress: string, data: Partial<UserProfile>) {
  const timestamp = new Date().toISOString();
  const newProfile = {
    wallet_address: walletAddress,
    display_name: `User-${walletAddress.substring(0, 6)}`,
    title: 'EONIC Explorer',
    bio: '',
    wallet_tagline: '',
    avatar_url: '/images/avatars/default.svg',
    widget_list: ['display_name', 'timepiece', 'xp_level', 'nft_gallery'],
    is_public: true,
    timepiece_url: '/images/timepiece-nft.png',
    timepiece_stage: 'Genesis',
    timepiece_xp: 0,
    created_at: timestamp,
    updated_at: timestamp,
    ...data
  };

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select()
    .single();

  if (error) throw error;
  return profile;
}

// Helper function to update a profile
export async function updateProfile(walletAddress: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('wallet_address', walletAddress)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper function to get a profile
export async function getProfile(walletAddress: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return await createProfile(walletAddress, {});
    }
    throw error;
  }

  return data;
}

const inMemoryProfiles = new Map<string, any>();
const inMemoryStorage = new Map<string, any>();

// Mock client factory function
export const createSupabaseClient = (walletAddress?: string) => {
  console.log(`[MOCK] Creating Supabase client with wallet: ${walletAddress ? walletAddress.substring(0, 8) + '...' : 'none'}`);
  
  return {
    from: (table: string) => {
      // Mock the database methods
      return {
        select: (query?: string) => {
          return {
            eq: (column: string, value: string) => {
              return {
                single: async () => {
                  console.log(`[MOCK] Getting ${table} where ${column} = ${value}`);
                  
                  if (table === 'user_profiles') {
                    const profile = inMemoryProfiles.get(value);
                    
                    // If the profile doesn't exist yet, return an empty data result
                    if (!profile) {
                      return { data: null, error: null };
                    }
                    
                    return { data: profile, error: null };
                  }
                  
                  return { data: null, error: null };
                }
              };
            }
          };
        },
        upsert: (data: any) => {
          return {
            select: () => {
              return {
                single: async () => {
                  console.log(`[MOCK] Upserting data into ${table}:`, data);
                  
                  if (table === 'user_profiles') {
                    const walletAddr = data.wallet_address || '';
                    
                    // If the profile already exists, update it
                    if (inMemoryProfiles.has(walletAddr)) {
                      const existingProfile = inMemoryProfiles.get(walletAddr);
                      const updatedProfile = { ...existingProfile, ...data };
                      inMemoryProfiles.set(walletAddr, updatedProfile);
                      return { data: updatedProfile, error: null };
                    }
                    
                    // Otherwise create a new profile
                    const newProfile = {
                      id: `mock-${Date.now()}`,
                      ...data
                    };
                    
                    inMemoryProfiles.set(walletAddr, newProfile);
                    return { data: newProfile, error: null };
                  }
                  
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      };
    },
    storage: {
      from: (bucket: string) => {
        return {
          upload: async (path: string, file: any) => {
            console.log(`[MOCK] Uploading file to ${bucket}/${path}`);
            
            // Store a reference to the file
            const key = `${bucket}/${path}`;
            inMemoryStorage.set(key, file);
            
            return { data: { path }, error: null };
          },
          getPublicUrl: (path: string) => {
            // Generate a fake public URL
            const publicUrl = `/mock-storage/${bucket}/${path}`;
            console.log(`[MOCK] Getting public URL for ${bucket}/${path}: ${publicUrl}`);
            
            return { data: { publicUrl } };
          }
        };
      }
    }
  };
};

// Default client for convenience
export const supabaseMock = createSupabaseClient();

// Additional utility mock functions

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
}

export async function sendMessage(
  content: string,
  senderAddress: string,
  room: string = 'general',
  parentId?: string,
  attachments?: File[]
) {
  if (!content.trim() && (!attachments || attachments.length === 0)) {
    return { error: new Error('Message content cannot be empty') };
  }

  if (!senderAddress) {
    return { error: new Error('Sender address is required') };
  }

  try {
    // First insert the message
    const { data: message, error: messageError } = await supabaseMock
      .from('messages')
      .insert([{ 
        content: content.trim(), 
        sender_address: senderAddress, 
        room,
        parent_id: parentId
      }])
      .select(`
        *,
        attachments:message_attachments(*),
        reactions:message_reactions(*)
      `)
      .single();

    if (messageError) {
      console.error('Error creating message:', messageError);
      throw messageError;
    }
    if (!message) {
      console.error('No message returned after creation');
      throw new Error('Failed to create message');
    }

    // Then handle attachments if any
    if (attachments?.length) {
      const attachmentPromises = attachments.map(async (file) => {
        try {
        // Upload file to storage
        const { data: fileData, error: uploadError } = await supabaseMock.storage
          .from('attachments')
          .upload(`${message.id}/${file.name}`, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabaseMock.storage
          .from('attachments')
          .getPublicUrl(`${message.id}/${file.name}`);

        // Create attachment record
        const { error: attachError } = await supabaseMock
          .from('message_attachments')
          .insert([{
            message_id: message.id,
            type: file.type,
            url: publicUrl,
            filename: file.name,
            size: file.size
          }]);

        if (attachError) throw attachError;
        } catch (error) {
          console.error(`Error handling attachment ${file.name}:`, error);
          throw error;
        }
      });

      try {
      await Promise.all(attachmentPromises);
      } catch (error) {
        console.error('Error handling attachments:', error);
        throw error;
      }
    }

    // Fetch the complete message with attachments and reactions
    const { data: completeMessage, error: fetchError } = await supabaseMock
      .from('messages')
      .select(`
        *,
        attachments:message_attachments(*),
        reactions:message_reactions(*)
      `)
      .eq('id', message.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete message:', fetchError);
      throw fetchError;
    }
    if (!completeMessage) {
      console.error('No complete message found');
      throw new Error('Failed to fetch complete message');
    }

    return { data: completeMessage };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return { error };
  }
}

export function subscribeToDirectMessages(
  senderAddress: string,
  recipientAddress: string,
  callback: (message: DirectMessage) => void
) {
  const channel = supabaseMock.channel(`dm:${[senderAddress, recipientAddress].sort().join(':')}`);

  // Subscribe to DM changes
  channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
        filter: `or(and(sender_address.eq.${senderAddress},recipient_address.eq.${recipientAddress}),and(sender_address.eq.${recipientAddress},recipient_address.eq.${senderAddress}))`
      },
      async (payload) => {
        const message = payload.new as DirectMessage;
        const { data: completeMessage } = await supabaseMock
          .from('direct_messages')
          .select('*, attachments:direct_message_attachments(*)')
          .eq('id', message.id)
          .single();

        if (completeMessage) {
          callback(completeMessage);
        }
      }
    )
    // Subscribe to attachment changes
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'direct_message_attachments',
      },
      async (payload: RealtimePostgresChangesPayload<{ message_id: string }>) => {
        if (payload.new && 'message_id' in payload.new) {
          const { data: message } = await supabaseMock
            .from('direct_messages')
            .select('*, attachments:direct_message_attachments(*)')
            .eq('id', payload.new.message_id)
            .single();

          if (message) {
            callback(message);
          }
        }
      }
    )
    .subscribe();

  return channel;
}

export function subscribeToMessages(
  room: string = 'general',
  callback: (message: ChatMessage) => void
) {
  const channel = supabaseMock.channel('messages');

  // Subscribe to new messages
  channel
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room=eq.${room}`,
      },
      async (payload) => {
        const message = payload.new as ChatMessage;
        const { data: completeMessage } = await supabaseMock
          .from('messages')
          .select(`
            *,
            attachments:message_attachments(*),
            reactions:message_reactions(*)
          `)
          .eq('id', message.id)
          .single();

        if (completeMessage) {
          callback(completeMessage);
        }
      }
    )
    // Subscribe to attachment changes
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'message_attachments',
      },
      async () => {
        // Refresh messages when attachments change
        const messages = await getMessages(room);
        messages.forEach(msg => callback(msg));
      }
    )
    // Subscribe to reaction changes
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'message_reactions',
      },
      async () => {
        // Refresh messages when reactions change
        const messages = await getMessages(room);
        messages.forEach(msg => callback(msg));
      }
    )
    .subscribe();

  return channel;
}

export async function getMessages(
  room: string = 'general',
  limit: number = 50,
  parentId?: string
): Promise<ChatMessage[]> {
  try {
    const query = supabaseMock
      .from('messages')
      .select(`
        *,
        attachments:message_attachments(*),
        reactions:message_reactions(*)
      `)
      .eq('room', room)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (parentId) {
      query.eq('parent_id', parentId);
    } else {
      query.is('parent_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data as ChatMessage[]) || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function getMessageAttachments(messageId: string) {
  const { data } = await supabaseMock
    .from('message_attachments')
    .select('*')
    .eq('message_id', messageId);
  
  return data as MessageAttachment[] || [];
}

export async function getMessageReactions(messageId: string) {
  const { data } = await supabaseMock
    .from('message_reactions')
    .select('*')
    .eq('message_id', messageId);
  
  return data as MessageReaction[] || [];
}

export async function toggleReaction(
  messageId: string,
  senderAddress: string,
  emoji: string
) {
  try {
    // Check if reaction exists
    const { data: existing } = await supabaseMock
      .from('message_reactions')
      .select('id')
      .eq('message_id', messageId)
      .eq('sender_address', senderAddress)
      .eq('emoji', emoji)
      .single();

    if (existing) {
      // Remove reaction
      const { error: deleteError } = await supabaseMock
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
    } else {
      // Add reaction
      const { error: insertError } = await supabaseMock
        .from('message_reactions')
        .insert([{
          message_id: messageId,
          sender_address: senderAddress,
          emoji
        }]);

      if (insertError) throw insertError;
    }

    // Fetch updated reactions
    const { data: reactions } = await supabaseMock
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId);

    return reactions as MessageReaction[] || [];
  } catch (error) {
    return { error };
  }
}

export async function deleteMessage(messageId: string, senderAddress: string) {
  if (!messageId || !senderAddress) {
    return { error: new Error('Message ID and sender address are required') };
  }

  try {
    // First check if the user owns the message
    const { data: message, error: fetchError } = await supabaseMock
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .eq('sender_address', senderAddress)
      .single();

    if (fetchError) {
      console.error('Error fetching message:', fetchError);
      throw fetchError;
    }

    if (!message) {
      return { error: new Error('Message not found or you do not have permission to delete it') };
    }

    // Delete the message
    const { error: deleteError } = await supabaseMock
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_address', senderAddress);

    if (deleteError) {
      console.error('Error deleting message:', deleteError);
      throw deleteError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    return { error };
  }
}
