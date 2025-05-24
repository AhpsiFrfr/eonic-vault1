import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiCopy, 
  FiShare, 
  FiFlag, 
  FiCheckSquare,
  FiLink,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';

interface MessageAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
}

interface MessageActionsMenuProps {
  position: { x: number; y: number };
  isCurrentUser: boolean;
  onReply: () => void;
  onEnicSummarize: () => void;
  onEnicSuggest: () => void;
  onCopyLink: () => void;
  onCopyText: () => void;
  onForward: () => void;
  onReport: () => void;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MessageActionsMenu: React.FC<MessageActionsMenuProps> = ({
  position,
  isCurrentUser,
  onReply,
  onEnicSummarize,
  onEnicSuggest,
  onCopyLink,
  onCopyText,
  onForward,
  onReport,
  onSelect,
  onEdit,
  onDelete
}) => {
  // Base actions available to all messages
  const baseActions: MessageAction[] = [
    {
      id: 'reply',
      label: 'Reply',
      icon: <FiMessageSquare size={18} />,
      onClick: onReply
    },
    {
      id: 'enic-summarize',
      label: 'ENIC.0 Summarize',
      icon: <span className="text-lg font-bold">🤖</span>,
      color: 'text-cyan-400',
      onClick: onEnicSummarize
    },
    {
      id: 'enic-suggest',
      label: 'ENIC.0 Suggest',
      icon: <span className="text-lg">💡</span>,
      color: 'text-cyan-400',
      onClick: onEnicSuggest
    },
    {
      id: 'copy-link',
      label: 'Copy Message Link',
      icon: <FiLink size={18} />,
      onClick: onCopyLink
    },
    {
      id: 'copy-text',
      label: 'Copy Text',
      icon: <FiCopy size={18} />,
      onClick: onCopyText
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: <FiShare size={18} />,
      onClick: onForward
    },
    {
      id: 'select',
      label: 'Select',
      icon: <FiCheckSquare size={18} />,
      onClick: onSelect
    },
    {
      id: 'report',
      label: 'Report',
      icon: <FiFlag size={18} />,
      color: 'text-red-400',
      onClick: onReport
    }
  ];

  // Add edit/delete actions for current user's messages
  const currentUserActions: MessageAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <FiEdit2 size={18} />,
      onClick: onEdit || (() => {})
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <FiTrash2 size={18} />,
      color: 'text-red-400',
      onClick: onDelete || (() => {})
    }
  ];

  // Combine actions based on user ownership
  const actions = isCurrentUser 
    ? [...baseActions.slice(0, 3), ...currentUserActions, ...baseActions.slice(3)]
    : baseActions;

  // Calculate menu position to keep it within viewport
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  React.useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newX = position.x;
      let newY = position.y;

      // Adjust X position if menu would overflow right
      if (position.x + rect.width > viewport.width - 20) {
        newX = viewport.width - rect.width - 20;
      }

      // Adjust Y position if menu would overflow bottom
      if (position.y + rect.height > viewport.height - 20) {
        newY = position.y - rect.height - 10;
      }

      // Ensure menu doesn't go above viewport
      if (newY < 20) {
        newY = 20;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut",
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 9999
      }}
      className="min-w-[200px] bg-neutral-900 rounded-xl shadow-2xl border border-neutral-700/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="py-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.02,
              duration: 0.15
            }}
            whileHover={{ 
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              transition: { duration: 0.1 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.05 }
            }}
            onClick={() => {
              action.onClick();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-left 
              transition-all duration-150 ease-out
              hover:bg-gray-700/30 active:bg-gray-700/50
              ${action.color || 'text-white'}
            `}
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {action.icon}
            </span>
            <span className="font-medium text-sm">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MessageActionsMenu; 