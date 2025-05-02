import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type ChatMessage = {
  id: string;
  content: string;
  sender_address: string;
  room: string;
  created_at: string;
  parent_id?: string;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
};

export type MessageReaction = {
  id: string;
  message_id: string;
  user_address: string;
  emoji: string;
  created_at: string;
};

export type MessageAttachment = {
  id: string;
  message_id: string;
  type: 'image' | 'file';
  url: string;
  filename: string;
  size: number;
  created_at: string;
};

export type Proposal = {
  id: string;
  title: string;
  description: string;
  creator_address: string;
  votes_for: number;
  votes_against: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  ends_at: string;
};

export type Vote = {
  id: string;
  proposal_id: string;
  voter_address: string;
  vote: 'for' | 'against';
  voting_power: number;
  created_at: string;
};

export type ExclusiveContent = {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'image' | 'video';
  access_level: number;
  created_at: string;
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Message functions
export async function sendMessage(
  content: string,
  senderAddress: string,
  room: string,
  parentId?: string,
  attachments?: { type: 'image' | 'file'; url: string; filename: string; size: number }[]
) {
  const { data: message, error } = await supabase.from('messages').insert([
    {
      content,
      sender_address: senderAddress,
      room,
      parent_id: parentId,
    },
  ]).select().single();

  if (error) throw error;

  // If there are attachments, add them
  if (attachments && message) {
    const { error: attachmentError } = await supabase.from('message_attachments').insert(
      attachments.map(attachment => ({
        message_id: message.id,
        ...attachment,
      }))
    );

    if (attachmentError) throw attachmentError;
  }

  return message;
}

export function subscribeToMessages(room: string = 'general', callback: (message: ChatMessage) => void) {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room=eq.${room}`,
      },
      (payload) => callback(payload.new as ChatMessage)
    )
    .subscribe();
}

export async function getMessages(room: string = 'general', limit: number = 50) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('room', room)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return data as ChatMessage[] || [];
}
