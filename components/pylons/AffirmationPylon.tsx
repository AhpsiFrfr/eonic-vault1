import { useState } from 'react';

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