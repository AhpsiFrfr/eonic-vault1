import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicking outside the menu to close it
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Calculate menu position
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 16; // Increased padding from viewport edge
      const offset = 5; // Small offset to prevent edge clipping

      let left = x;
      let top = y;

      // Adjust horizontal position if menu would overflow viewport
      if (x + rect.width + padding > viewportWidth) {
        left = x - rect.width - offset;
      }

      // Adjust vertical position if menu would overflow viewport
      if (y + rect.height + padding > viewportHeight) {
        top = y - rect.height - offset;
      }

      // Ensure menu doesn't go off the left or top edge
      left = Math.max(padding, left);
      top = Math.max(padding, top);

      // Apply the calculated position with smooth transition
      menuRef.current.style.transition = 'left 0.2s, top 0.2s';
      menuRef.current.style.left = `${left}px`;
      menuRef.current.style.top = `${top}px`;
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [x, y, onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed z-50 min-w-[160px] bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1"
      style={{ left: x, top: y }} // Initial position, will be adjusted by useEffect
    >
      {children}
    </motion.div>
  );
}

interface ContextMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

// Optional: Export a context menu item component for consistent styling
export function ContextMenuItem({
  onClick,
  children,
  disabled = false,
  className = '',
}: ContextMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm ${
        disabled
          ? 'text-gray-500 cursor-not-allowed'
          : 'text-gray-200 hover:bg-gray-700 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
} 