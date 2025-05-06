import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: 'emoji' | 'gif' | 'sticker';
  content: string;
  created_at: string;
}

export function useMessageReactions(messageId: string) {
  const supabase = useSupabaseClient();
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadReactions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('message_reactions')
          .select('*')
          .eq('message_id', messageId);

        if (error) throw error;
        if (mounted) {
          setReactions(data || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error loading reactions:', err);
          setError(err instanceof Error ? err : new Error('Failed to load reactions'));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadReactions();

    // Subscribe to changes
    const channel = supabase
      .channel(`message_reactions:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReactions((prev) => [...prev, payload.new as MessageReaction]);
          } else if (payload.eventType === 'DELETE') {
            setReactions((prev) =>
              prev.filter((r) => r.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    setSubscription(channel);

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [messageId, supabase]);

  // Toggle emoji reaction
  const toggleReaction = async (content: string, type: 'emoji' | 'gif' | 'sticker' = 'emoji') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      // Check if reaction exists
      const existingReaction = reactions.find(
        (r) => r.user_id === user.id && r.content === content && r.reaction_type === type
      );

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase.from('message_reactions').insert({
          message_id: messageId,
          user_id: user.id,
          reaction_type: type,
          content,
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
      setError(err instanceof Error ? err : new Error('Failed to toggle reaction'));
      throw err;
    }
  };

  // Add GIF or sticker reaction
  const addMediaReaction = async (content: string, type: 'gif' | 'sticker') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: user.id,
        reaction_type: type,
        content,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to add ${type}`));
      throw err;
    }
  };

  // Group reactions by type and content
  const groupedReactions = reactions.reduce((acc, reaction) => {
    const key = `${reaction.reaction_type}-${reaction.content}`;
    if (!acc[key]) {
      acc[key] = {
        type: reaction.reaction_type,
        content: reaction.content,
        count: 0,
        users: [],
        hasReacted: false,
      };
    }
    acc[key].count++;
    acc[key].users.push(reaction.user_id);
    
    // We'll update hasReacted in a separate effect
    return acc;
  }, {} as Record<string, {
    type: 'emoji' | 'gif' | 'sticker';
    content: string;
    count: number;
    users: string[];
    hasReacted: boolean;
  }>);

  // Update hasReacted status for each reaction
  useEffect(() => {
    const updateReactionStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Update hasReacted status for each reaction
        Object.keys(groupedReactions).forEach((key) => {
          const reaction = groupedReactions[key];
          reaction.hasReacted = reaction.users.includes(user.id);
        });
      } catch (error) {
        console.error('Error updating reaction status:', error);
      }
    };

    updateReactionStatus();
  }, [reactions, supabase.auth]);

  return {
    reactions: Object.values(groupedReactions),
    isLoading,
    error,
    toggleReaction,
    addMediaReaction,
  };
} 