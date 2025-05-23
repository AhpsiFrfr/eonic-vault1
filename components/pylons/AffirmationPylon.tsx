'use client';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

function AffirmationPylonDashboard() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    // TODO: Integrate SMS backend (e.g., Twilio, Supabase Functions)
    setSubmitted(true);
  };

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-4 shadow-[0_0_25px_3px_rgba(0,255,170,0.15)] hover:shadow-[0_0_35px_4px_rgba(0,255,170,0.25)] transition-all duration-500 ease-in-out relative text-white w-full max-w-md min-h-[140px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FaHeart className="text-green-400 text-xl animate-pulse" />
          <h2 className="text-xl font-semibold glow-text">Affirmation</h2>
        </div>
        <div className="text-sm text-gray-400">ENIC.0</div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {submitted ? (
          <div className="text-center">
            <p className="text-green-400 text-sm mb-2">✔️ Subscribed!</p>
            <p className="text-xs text-gray-400">Daily affirmations incoming</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <label htmlFor="phone" className="text-xs text-gray-400">Mobile number:</label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555-555-5555"
              className="bg-[#1a2335] rounded px-3 py-2 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-400 border-none outline-none"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-[10px] text-right text-green-400 mt-1 italic">
        Daily motivation by AI
      </div>
    </div>
  );
}

// Named export for use in other places (VaultCord, DevHQ)
export const AffirmationPylon = () => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    // TODO: Integrate SMS backend (e.g., Twilio, Supabase Functions)
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0e1525] p-6 rounded-xl shadow-lg text-white max-w-md w-full">
      <h3 className="text-xl font-bold text-cyan-300 mb-4">Daily Affirmation by ENIC.0</h3>
      {submitted ? (
        <p className="text-green-400">✔️ You're subscribed! Affirmations will be sent daily.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="phone" className="text-sm text-gray-400">Enter your mobile number:</label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555-555-5555"
            className="bg-[#1a2335] rounded px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

// Default export for dashboard pylon system
export default AffirmationPylonDashboard; 