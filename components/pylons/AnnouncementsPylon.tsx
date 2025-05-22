import { FaBullhorn } from 'react-icons/fa';

export default function AnnouncementsPylon() {
  const announcements = [
    "🧠 AI Prompt Enhancer deployed!",
    "🎯 New referral rewards system live.",
    "🔥 You earned 200 XP today!",
    "🛠 Vault optimization update pushed."
  ];

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-5 shadow-[0_0_25px_3px_rgba(0,212,255,0.2)] hover:shadow-[0_0_35px_4px_rgba(0,212,255,0.4)] transition-all duration-500 ease-in-out text-white w-full max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <FaBullhorn className="text-blue-300 text-xl" />
        <h2 className="text-xl font-semibold glow-text">Announcements</h2>
      </div>
      <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
        {announcements.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
} 