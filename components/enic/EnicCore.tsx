'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCommentDots } from 'react-icons/fa';

export default function EnicCore() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    '👁 ENIC.0 online. What insight do you seek?'
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `🧠 ${input}`, '...processing...']);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev.slice(0, -1), '✅ Response complete.']);
    }, 1500);
  };

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      >
        <img
          src="/enic-face.png"
          alt="ENIC.0"
          className="rounded-full w-10 h-10 object-cover opacity-90"
        />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#121212] w-[500px] max-w-[90%] rounded-2xl border border-[#1f1f1f] shadow-2xl p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-red-500"
              >
                ✕
              </button>
              <h2 className="text-xl text-white font-bold mb-4">ENIC.0 Console</h2>
              <div className="h-48 overflow-y-auto space-y-2 text-sm text-gray-300 mb-4">
                {messages.map((msg, i) => (
                  <div key={i} className="whitespace-pre-wrap">{msg}</div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded-md bg-[#1c1c1c] text-white border border-gray-600"
                  placeholder="Ask ENIC.0..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition"
                >
                  Ask
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 