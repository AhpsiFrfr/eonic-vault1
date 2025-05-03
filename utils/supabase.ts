import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-my-custom-header': 'eonic-vault'
    }
  }
});

// Channel management
let activeChannels: { [key: string]: RealtimeChannel } = {};

export const subscribeToChannel = (channelName: string, table: string, callback: (payload: any) => void) => {
  // Reuse existing channel if available
  if (activeChannels[channelName]) {
    return activeChannels[channelName];
  }

  // Create new channel
  const channel = supabase.channel(channelName)
    .on('presence', { event: 'sync' }, () => {
      console.log('Presence sync');
    })
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => callback(payload)
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Connected to ${channelName}`);
      }
    });

  activeChannels[channelName] = channel;
  return channel;
};

export const unsubscribeFromChannel = (channelName: string) => {
  const channel = activeChannels[channelName];
  if (channel) {
    channel.unsubscribe();
    delete activeChannels[channelName];
  }
};

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
  created_at: string;
  content: string;
  sender_address: string;
  room: string;
  parent_id?: string;
  thread_count: number;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export async function sendMessage(
  content: string,
  senderAddress: string,
  room: string = 'general',
  parentId?: string,
  attachments?: File[]
) {
  try {
    // First insert the message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{ 
        content, 
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

    if (messageError) throw messageError;
    if (!message) throw new Error('Failed to create message');

    // Then handle attachments if any
    if (attachments?.length) {
      const attachmentPromises = attachments.map(async (file) => {
        // Upload file to storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(`${message.id}/${file.name}`, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(`${message.id}/${file.name}`);

        // Create attachment record
        const { error: attachError } = await supabase
          .from('message_attachments')
          .insert([{
            message_id: message.id,
            type: file.type,
            url: publicUrl,
            filename: file.name,
            size: file.size
          }]);

        if (attachError) throw attachError;
      });

      await Promise.all(attachmentPromises);
    }

    // Fetch the complete message with attachments and reactions
    const { data: completeMessage, error: fetchError } = await supabase
      .from('messages')
      .select(`
        *,
        attachments:message_attachments(*),
        reactions:message_reactions(*)
      `)
      .eq('id', message.id)
      .single();

    if (fetchError) throw fetchError;
    if (!completeMessage) throw new Error('Failed to fetch complete message');

    return { data: completeMessage };
  } catch (error) {
    return { error };
  }
}

export function subscribeToDirectMessages(
  senderAddress: string,
  recipientAddress: string,
  callback: (message: DirectMessage) => void
) {
  const channel = supabase.channel(`dm:${[senderAddress, recipientAddress].sort().join(':')}`);

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
        const { data: completeMessage } = await supabase
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
          const { data: message } = await supabase
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
  const channel = supabase.channel('messages');

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
        const { data: completeMessage } = await supabase
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
    const query = supabase
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
  const { data } = await supabase
    .from('message_attachments')
    .select('*')
    .eq('message_id', messageId);
  
  return data as MessageAttachment[] || [];
}

export async function getMessageReactions(messageId: string) {
  const { data } = await supabase
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
    const { data: existing } = await supabase
      .from('message_reactions')
      .select('id')
      .eq('message_id', messageId)
      .eq('sender_address', senderAddress)
      .eq('emoji', emoji)
      .single();

    if (existing) {
      // Remove reaction
      const { error: deleteError } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
    } else {
      // Add reaction
      const { error: insertError } = await supabase
        .from('message_reactions')
        .insert([{
          message_id: messageId,
          sender_address: senderAddress,
          emoji
        }]);

      if (insertError) throw insertError;
    }

    // Fetch updated reactions
    const { data: reactions } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId);

    return reactions as MessageReaction[] || [];
  } catch (error) {
    return { error };
  }
}
