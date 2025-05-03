import React from 'react';

interface Props {
  x: number;
  y: number;
  onReply: () => void;
  onPin: () => void;
  onCopy: () => void;
  onForward: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onAddReaction: () => void;
  onClose: () => void;
}

export function MessageContextMenu({
  x,
  y,
  onReply,
  onPin,
  onCopy,
  onForward,
  onDelete,
  onSelect,
  onAddReaction,
  onClose
}: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { icon: '↩️', label: 'Reply', onClick: onReply },
    { icon: '📌', label: 'Pin', onClick: onPin },
    { icon: '😀', label: 'Add Reaction', onClick: onAddReaction },
    { icon: '📋', label: 'Copy Text', onClick: onCopy },
    { icon: '↪️', label: 'Forward', onClick: onForward },
    { icon: '🗑️', label: 'Delete', onClick: onDelete },
    { icon: '✓', label: 'Select', onClick: onSelect },
  ];

  const adjustPosition = () => {
    if (!menuRef.current) return { left: x, top: y };
    
    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = x;
    let top = y;
    
    // Adjust horizontal position if menu would go off screen
    if (x + rect.width > viewportWidth) {
      left = viewportWidth - rect.width - 10;
    }
    
    // Adjust vertical position if menu would go off screen
    if (y + rect.height > viewportHeight) {
      top = viewportHeight - rect.height - 10;
    }
    
    return { left, top };
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 rounded-lg shadow-lg py-2 w-48"
      style={adjustPosition()}
    >
      {menuItems.map(({ icon, label, onClick }) => (
        <button
          key={label}
          onClick={() => {
            onClick();
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
