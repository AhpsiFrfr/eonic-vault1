'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute, FaSync } from 'react-icons/fa';
import { useRadio } from './RadioContext';
import { motion } from 'framer-motion';

export default function RadioPlayer() {
  const {
    isPlaying,
    currentTrack,
    play,
    pause,
    setVolume,
    toggleMute,
    addTrack,
    volume,
    isMuted
  } = useRadio();

  const [urlInput, setUrlInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Neon visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 32;
      const barWidth = canvas.width / barCount;
      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * canvas.height * (isPlaying ? 1 : 0.2);
        ctx.fillStyle = 'rgba(0, 234, 255, 0.85)';
        ctx.shadowColor = '#00eaff';
        ctx.shadowBlur = 12;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth * 0.7, height);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Handle adding a track
  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    setIsAdding(true);
    setError(null);
    try {
      await addTrack(urlInput.trim());
      setUrlInput('');
    } catch (err) {
      setError('Invalid or unsupported URL.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Input Row */}
      <form onSubmit={handleAdd} className="w-full flex mb-4">
        <input
          type="text"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder="Paste YouTube / SoundCloud / MP3 link"
          className="flex-1 bg-[#10151a] border border-cyan-700 text-cyan-200 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg shadow-[0_0_8px_#00eaff55]"
        />
        <button
          type="submit"
          disabled={isAdding || !urlInput.trim()}
          className="px-6 py-2 rounded-r-lg bg-cyan-500 text-black font-bold text-lg shadow-[0_0_12px_#00eaff] hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isAdding ? '...' : 'PLAY'}
        </button>
      </form>
      {error && <div className="text-red-400 text-xs mb-2">{error}</div>}

      {/* Streaming Display */}
      <div className="w-full flex flex-col items-center bg-[#10151a] border border-cyan-800 rounded-xl py-4 mb-4 shadow-[0_0_16px_#00eaff33]">
        <motion.div
          className="text-cyan-300 text-xl font-mono tracking-widest mb-2 drop-shadow-[0_0_8px_#00eaff]"
          animate={{ opacity: isPlaying ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          STREAMING
        </motion.div>
        <canvas ref={canvasRef} width={320} height={40} className="w-full h-10 bg-transparent" />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={isPlaying ? pause : play}
          className="p-3 rounded-full bg-[#10151a] border border-cyan-700 text-cyan-300 shadow-[0_0_8px_#00eaff55] hover:bg-cyan-800 hover:text-cyan-100 transition"
        >
          {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="p-3 rounded-full bg-[#10151a] border border-cyan-700 text-cyan-300 shadow-[0_0_8px_#00eaff55] hover:bg-cyan-800 hover:text-cyan-100 transition"
        >
          <FaStop size={22} />
        </button>
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-[#10151a] border border-cyan-700 text-cyan-300 shadow-[0_0_8px_#00eaff55] hover:bg-cyan-800 hover:text-cyan-100 transition"
        >
          {isMuted ? <FaVolumeMute size={22} /> : <FaVolumeUp size={22} />}
        </button>
        <button
          onClick={() => setVolume(volume === 1 ? 0.5 : 1)}
          className="p-3 rounded-full bg-[#10151a] border border-cyan-700 text-cyan-300 shadow-[0_0_8px_#00eaff55] hover:bg-cyan-800 hover:text-cyan-100 transition"
        >
          <FaSync size={22} />
        </button>
      </div>
    </div>
  );
} 