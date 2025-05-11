'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedReaction } from './AnimatedReaction';
import { useReactionAnimation } from '../hooks/useReactionAnimation';

export function ReactionAnimationsContainer() {
  const { reactions } = useReactionAnimation();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {reactions.map((reaction, index) => (
          <AnimatedReaction
            key={`${reaction.messageId}-${reaction.emoji}-${index}`}
            emoji={reaction.emoji}
            position={reaction.position}
            animationType={reaction.animationType}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 