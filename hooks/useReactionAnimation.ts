import { useState, useCallback } from 'react';

export interface ReactionAnimation {
  messageId: string;
  emoji: string;
  position: { x: number; y: number };
}

export function useReactionAnimation() {
  const [reactions, setReactions] = useState<ReactionAnimation[]>([]);

  const addReaction = useCallback((reaction: ReactionAnimation) => {
    setReactions(prev => [...prev, reaction]);
    
    // Remove the reaction after animation completes (2 seconds)
    setTimeout(() => {
      setReactions(prev => prev.filter(r => 
        !(r.messageId === reaction.messageId && 
          r.emoji === reaction.emoji && 
          r.position.x === reaction.position.x && 
          r.position.y === reaction.position.y)
      ));
    }, 2000);
  }, []);

  const triggerReaction = useCallback((messageId: string, emoji: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    addReaction({ messageId, emoji, position });
  }, [addReaction]);

  return {
    triggerReaction,
    reactions,
    addReaction
  };
} 