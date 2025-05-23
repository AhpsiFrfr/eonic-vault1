import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useGlowLevel } from '../../context/GlowLevelContext';

// Import the usage glow map from the dashboard
const usageGlow = {
  'Token': 'shadow-[0_0_8px_rgba(255,215,0,0.6)]',
  'XP Tracker': 'shadow-[0_0_8px_rgba(0,255,255,0.5)]',
  'Vault Reputation': 'shadow-[0_0_8px_rgba(128,0,255,0.5)]',
  'Timepiece Evolution': 'shadow-[0_0_8px_rgba(0,153,255,0.5)]',
  'Announcements': 'shadow-[0_0_8px_rgba(255,105,180,0.5)]',
  'Audio Control': 'shadow-[0_0_8px_rgba(75,0,130,0.5)]',
  'Audio Settings': 'shadow-[0_0_8px_rgba(138,43,226,0.5)]',
  'Glow Level Tester': 'shadow-[0_0_8px_rgba(0,212,255,0.5)]',
  'Radio': 'shadow-[0_0_8px_rgba(0,255,255,0.5)]'
};

interface SortablePylonWrapperProps {
  id: string;
  children: React.ReactNode;
  glow?: string;
}

export default function SortablePylonWrapper({ id, children, glow = '' }: SortablePylonWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [isHovered, setIsHovered] = useState(false);
  const { getGlowClass } = useGlowLevel();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get the base glow class from the context
  const baseGlowClass = getGlowClass();
  
  // Get the usage-specific glow for this pylon type
  const usageGlowClass = glow || '';
  
  // Combine the glow effects
  const combinedGlowClass = `${baseGlowClass} ${isHovered ? usageGlowClass : ''}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-all duration-300 rounded-xl ${combinedGlowClass}`}
    >
      {children}
    </div>
  );
} 