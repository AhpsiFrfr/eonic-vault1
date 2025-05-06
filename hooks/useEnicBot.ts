import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import type { ChatMessage } from '../utils/types';

interface EnicResponse {
  reply?: string;
  suggestions?: string[];
  action?: {
    type: 'TRADE' | 'STAKE' | 'EVOLVE' | 'REFER';
    data: any;
  };
}

interface EnicBotHook {
  isProcessing: boolean;
  generateReply: (message: ChatMessage) => Promise<EnicResponse | null>;
  getSuggestions: (context: string) => Promise<string[]>;
  error: Error | null;
}

export const useEnicBot = (): EnicBotHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyzeMessage = async (content: string): Promise<EnicResponse> => {
    // TODO: Replace with actual AI model call
    // This is a mock implementation
    if (content.toLowerCase().includes('price')) {
      return {
        reply: "The current EONIC price is $X. Would you like to see the price chart?",
        suggestions: [
          "Show me the price chart",
          "What's the 24h change?",
          "Where can I buy EONIC?"
        ]
      };
    }
    
    if (content.toLowerCase().includes('stake')) {
      return {
        reply: "I can help you stake your EONIC tokens. The current APY is X%.",
        action: {
          type: 'STAKE',
          data: {
            apy: 'X%',
            minStake: 100
          }
        }
      };
    }

    return {
      suggestions: [
        "Tell me about EONIC",
        "How do I stake tokens?",
        "Show me my NFTs"
      ]
    };
  };

  const generateReply = useCallback(async (message: ChatMessage): Promise<EnicResponse | null> => {
    try {
      setIsProcessing(true);
      setError(null);

      // Don't process bot messages or empty content
      if (message.sender_address === 'ENIC_BOT' || !message.content.trim()) {
        return null;
      }

      const response = await analyzeMessage(message.content);
      
      // If we have a reply, store it in the database
      if (response.reply) {
        const { error: dbError } = await supabase
          .from('messages')
          .insert({
            content: response.reply,
            sender_address: 'ENIC_BOT',
            room: message.room,
            parent_id: message.id,
            created_at: new Date().toISOString()
          });

        if (dbError) throw dbError;
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate reply'));
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getSuggestions = useCallback(async (context: string): Promise<string[]> => {
    try {
      setError(null);
      const { suggestions = [] } = await analyzeMessage(context);
      return suggestions;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get suggestions'));
      return [];
    }
  }, []);

  return {
    isProcessing,
    generateReply,
    getSuggestions,
    error
  };
}; 