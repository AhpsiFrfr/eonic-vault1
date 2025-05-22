import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SummonCaelinModalProps {
  onClose: () => void;
  user: any; // Replace with your user type
}

const SummonCaelinModal: React.FC<SummonCaelinModalProps> = ({ onClose, user }) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSummoning, setIsSummoning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSummoning(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Implement actual summoning logic
    console.log('Summoning Caelin with:', { message, priority, user });

    setIsSummoning(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="summon-modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="summon-modal"
      >
        <div className="summon-header">
          <h2>Summon Caelin</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="summon-form">
          <div className="form-group">
            <label htmlFor="message">Message for Caelin</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you need assistance with..."
              required
              className="summon-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority Level</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="summon-select"
            >
              <option value="low">Low - General Question</option>
              <option value="medium">Medium - Need Help Soon</option>
              <option value="high">High - Urgent Issue</option>
            </select>
          </div>

          <div className="summon-info">
            <p>Current Developer: {user?.displayName}</p>
            <p>Location: Dev Vault HQ</p>
          </div>

          <div className="summon-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSummoning}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="summon-button"
              disabled={isSummoning || !message.trim()}
            >
              {isSummoning ? (
                <>
                  <span className="spinner"></span>
                  Summoning...
                </>
              ) : (
                'Summon Caelin'
              )}
            </button>
          </div>
        </form>

        <div className="summon-footer">
          <p className="summon-note">
            Note: Please use this feature responsibly. Caelin will be notified and
            will respond based on availability and priority level.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SummonCaelinModal; 