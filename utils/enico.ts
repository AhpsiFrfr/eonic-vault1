import { supabase } from './supabase';

export type SmartActionType = 'rephrase' | 'summarize' | 'idea' | 'task' | 'translate';

// Mock responses for now - would be replaced with actual OpenAI calls
const mockResponses: Record<SmartActionType, (text: string) => string> = {
  rephrase: (text) => `Here's another way to say that: "${text.split(' ').reverse().join(' ')}"`,
  summarize: (text) => `TL;DR: ${text.slice(0, 50)}...`,
  idea: (text) => `💡 Innovative concept: ${text}`,
  task: (text) => `✅ New task created: ${text}`,
  translate: (text) => `🌐 English translation: ${text}`
};

export async function runEnicoSmartAction(messageText: string, actionType: SmartActionType) {
  try {
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get mock response based on action type
    const response = mockResponses[actionType](messageText);
    
    // Create a new system message
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        content: response,
        sender_address: 'ENIC_BOT',
        room: 'general', // This should be dynamic based on context
        created_at: new Date().toISOString(),
        smart_action: actionType, // Add this column to your messages table
        parent_id: null, // This should be the original message ID
      }])
      .select()
      .single();

    if (error) throw error;
    return message;
  } catch (error) {
    console.error('Error running smart action:', error);
    throw error;
  }
} 