'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ReactionAnimation {
  messageId: string;
  emoji: string;
  position: { x: number; y: number };
  animationType?: 'float' | 'burst' | 'bounce' | 'spin';
}

export function useReactionAnimation() {
  const [reactions, setReactions] = useState<ReactionAnimation[]>([]);
  const [recentReactions, setRecentReactions] = useState<{[key: string]: number}>({});

  // Track recent reactions to enable combos
  useEffect(() => {
    // Clear reactions after 5 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      setRecentReactions(prev => {
        const newReactions = {...prev};
        Object.keys(newReactions).forEach(key => {
          if (now - newReactions[key] > 5000) {
            delete newReactions[key];
          }
        });
        return newReactions;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const addReaction = useCallback((reaction: ReactionAnimation) => {
    // Ensure the reaction shows at the center of the screen if no position is provided
    if (!reaction.position) {
      reaction.position = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };
    }
    
    // Add large size to make emoji more visible
    const enhancedReaction = {
      ...reaction,
      size: reaction.animationType === 'burst' ? 1.5 : 1.2
    };
    
    setReactions(prev => [...prev, reaction]);
    
    // Add to recent reactions
    const reactionKey = `${reaction.messageId}-${reaction.emoji}`;
    setRecentReactions(prev => ({
      ...prev,
      [reactionKey]: Date.now()
    }));
    
    // Increase animation duration for better visibility
    const animationDuration = 
      reaction.animationType === 'burst' ? 2500 :
      reaction.animationType === 'spin' ? 3000 :
      reaction.animationType === 'bounce' ? 3000 : 2500;
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => 
        !(r.messageId === reaction.messageId && 
          r.emoji === reaction.emoji && 
          r.position.x === reaction.position.x && 
          r.position.y === reaction.position.y)
      ));
    }, animationDuration);
  }, []);

  const triggerReaction = useCallback((messageId: string, emoji: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // Determine animation type based on recent reactions
    const reactionKey = `${messageId}-${emoji}`;
    const recentReactionTime = recentReactions[reactionKey];
    const now = Date.now();
    
    let animationType: 'float' | 'burst' | 'bounce' | 'spin' = 'float';
    
    // If this is a combo (same reaction within 2 seconds), use a more dramatic animation
    if (recentReactionTime && now - recentReactionTime < 2000) {
      const comboCount = Math.floor((now - recentReactionTime) / 500);
      
      // Cycle through animations for combos
      switch (comboCount % 3) {
        case 0:
          animationType = 'burst';
          break;
        case 1:
          animationType = 'spin';
          break;
        case 2:
          animationType = 'bounce';
          break;
      }
    }

    addReaction({ messageId, emoji, position, animationType });
  }, [addReaction, recentReactions]);

  return {
    triggerReaction,
    reactions,
    addReaction
  };
} 