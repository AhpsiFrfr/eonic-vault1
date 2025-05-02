import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ChatMessage {
  id: string;
  created_at: string;
  content: string;
  sender_address: string;
  room: string;
}

export async function sendMessage(content: string, senderAddress: string, room: string = 'general') {
  return await supabase
    .from('messages')
    .insert([{ content, sender_address: senderAddress, room }]);
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
