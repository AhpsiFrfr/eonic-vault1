'use client';

import { motion } from 'framer-motion';
import { GifPicker } from './GifPicker';

interface GifPickerModalProps {
  onClose: () => void;
  onSelect: (gifUrl: string) => void;
}

export function GifPickerModal({ onClose, onSelect }: GifPickerModalProps) {
  return (
    <GifPicker 
      onClose={onClose} 
      onSelect={(gif) => onSelect(gif.url)} 
    />
  );
} 