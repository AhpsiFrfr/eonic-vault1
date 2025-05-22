'use client';

import { useState, useRef, useCallback } from 'react';
import { FiSmile, FiCode, FiSlash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { markdownToHTML } from '@/lib/utils/markdown';

interface SlashCommand {
  command: string;
  description: string;
  action: () => void;
}

export default function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [glowPreview, setGlowPreview] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const slashCommands: SlashCommand[] = [
    {
      command: '/clear',
      description: 'Clears chat history',
      action: () => {
        // Implement clear action
        setText('');
      }
    },
    {
      command: '/debug',
      description: 'Opens Dev Debug Panel',
      action: () => {
        // Implement debug action
        onSend('/debug');
      }
    },
    {
      command: '/simulate',
      description: 'Spawns fake users for testing',
      action: () => {
        // Implement simulate action
        onSend('/simulate');
      }
    },
    {
      command: '/ping',
      description: 'Echo test',
      action: () => {
        onSend('/ping');
      }
    }
  ];

  const handleEmojiClick = (emojiData: any) => {
    const cursor = inputRef.current?.selectionStart || text.length;
    const newText = text.slice(0, cursor) + emojiData.emoji + text.slice(cursor);
    setText(newText);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        onSend(text.trim());
        setText('');
        setShowPreview(false);
      }
    }

    if (e.key === '/' && text.length === 0) {
      setShowSlashMenu(true);
    }

    if (e.key === 'Escape') {
      setShowEmoji(false);
      setShowSlashMenu(false);
    }
  };

  const executeSlashCommand = (command: SlashCommand) => {
    command.action();
    setShowSlashMenu(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative bg-[#0f0f0f] p-3 rounded-xl border border-[#222] shadow-[0_0_15px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <FiSmile className="text-blue-400" />
        </button>
        <button 
          onClick={() => setShowSlashMenu(!showSlashMenu)}
          className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <FiSlash className="text-blue-400" />
        </button>
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <FiCode className="text-blue-400" />
        </button>
        <button 
          onClick={() => setGlowPreview(!glowPreview)}
          className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <span className={`text-xl ${glowPreview ? 'text-[#00f0ff] animate-pulse' : 'text-gray-400'}`}>
            ✨
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showEmoji && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <div className="bg-[#111] rounded-lg p-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          </motion.div>
        )}

        {showSlashMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 top-full mt-2 bg-[#111] text-white p-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 w-64"
          >
            <p className="text-sm text-blue-400 mb-2">Slash Commands</p>
            <ul className="space-y-1">
              {slashCommands.map((cmd) => (
                <li 
                  key={cmd.command}
                  onClick={() => executeSlashCommand(cmd)}
                  className="flex items-center justify-between p-2 hover:bg-blue-900/20 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono text-sm">{cmd.command}</span>
                  <span className="text-xs text-gray-400">{cmd.description}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {!showPreview ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (/ for commands)"
          className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500"
          rows={3}
        />
      ) : (
        <div
          className={`bg-[#111] text-white p-2 rounded overflow-auto max-h-48 markdown-preview prose prose-invert prose-sm ${
            glowPreview ? 'glow-fx' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: markdownToHTML(text) }}
        />
      )}

      <style jsx global>{`
        .glow-fx {
          color: #ffffff;
          text-shadow:
            0 0 4px rgba(0, 255, 255, 0.7),
            0 0 8px rgba(0, 200, 255, 0.5),
            0 0 12px rgba(0, 100, 255, 0.4);
          transition: text-shadow 0.3s ease-in-out;
        }

        .glow-fx h1,
        .glow-fx h2,
        .glow-fx h3,
        .glow-fx strong {
          color: #ffffff;
          text-shadow:
            0 0 4px rgba(255, 255, 255, 0.9),
            0 0 8px rgba(0, 255, 255, 0.3);
        }

        .glow-fx code,
        .glow-fx pre {
          background: rgba(26, 26, 26, 0.8);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
        }

        .glow-fx a {
          color: #00f0ff;
          text-shadow:
            0 0 4px rgba(0, 255, 255, 0.7),
            0 0 8px rgba(0, 200, 255, 0.5);
        }

        .glow-fx blockquote {
          border-left-color: #00f0ff;
          box-shadow: -2px 0 8px rgba(0, 255, 255, 0.2);
        }

        .markdown-preview pre {
          background: #1a1a1a;
          padding: 0.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .markdown-preview code {
          background: #1a1a1a;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
        }
        .markdown-preview a {
          color: #60a5fa;
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
} 