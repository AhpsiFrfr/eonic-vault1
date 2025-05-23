'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { RadioContext, Track } from './RadioContext';
import { useAudioVolume } from '../../app/components/dashboard/AudioVolumeContext';

const PLAYLIST_KEY = 'eonic-radio-playlist';
const TRACK_KEY = 'eonic-radio-current-track';

const defaultTracks: Track[] = [
  {
    id: 'vault-ambient',
    title: 'Vault Ambient',
    artist: 'EONIC',
    url: '/audio/vault-ambient.mp3',
    source: 'local',
  }
];

export function RadioProvider({ children }: { children: ReactNode }) {
  const { volume: globalVolume, muted: globalMuted } = useAudioVolume();
  const playerRef = useRef<ReactPlayer>(null);

  // Playlist and current track state
  const [playlist, setPlaylist] = useState<Track[]>(defaultTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(defaultTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(globalVolume);
  const [isMuted, setIsMuted] = useState(globalMuted);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PLAYLIST_KEY);
    if (stored) {
      try {
        const parsed: Track[] = JSON.parse(stored);
        if (parsed.length > 0) setPlaylist(parsed);
      } catch {}
    }
    const storedTrack = localStorage.getItem(TRACK_KEY);
    if (storedTrack) {
      try {
        const parsed: Track = JSON.parse(storedTrack);
        setCurrentTrack(parsed);
      } catch {}
    }
  }, []);

  // Persist playlist and current track
  useEffect(() => {
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
  }, [playlist]);
  useEffect(() => {
    if (currentTrack) localStorage.setItem(TRACK_KEY, JSON.stringify(currentTrack));
  }, [currentTrack]);

  // Sync with global audio context
  useEffect(() => {
    setVolume(globalVolume);
    setIsMuted(globalMuted);
  }, [globalVolume, globalMuted]);

  // Player controls
  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggleMute = () => setIsMuted((m: boolean) => !m);

  // Add a track by URL
  const addTrack = async (url: string) => {
    let track: Track | null = null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // YouTube
      const videoId = getYouTubeVideoId(url);
      if (!videoId) throw new Error('Invalid YouTube URL');
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();
      track = {
        id: videoId,
        title: data.title,
        artist: data.author_name,
        url,
        source: 'youtube',
        thumbnailUrl: data.thumbnail_url,
      };
    } else if (url.includes('soundcloud.com')) {
      // SoundCloud
      track = {
        id: url,
        title: 'SoundCloud Track',
        artist: 'Unknown',
        url,
        source: 'soundcloud',
      };
    } else if (url.endsWith('.mp3')) {
      // MP3
      track = {
        id: url,
        title: url.split('/').pop() || 'MP3',
        artist: 'Unknown',
        url,
        source: 'local',
      };
    } else {
      throw new Error('Unsupported URL');
    }
    setPlaylist((prev: Track[]) => [...prev, track!]);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Remove a track
  const removeTrack = (id: string) => {
    setPlaylist((prev: Track[]) => prev.filter((t: Track) => t.id !== id));
    if (currentTrack && currentTrack.id === id) {
      setCurrentTrack(playlist[0] || null);
      setIsPlaying(false);
    }
  };

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        play,
        pause,
        setVolume,
        toggleMute,
        addTrack,
        volume,
        isMuted,
        playlist,
        setCurrentTrack,
        removeTrack,
      }}
    >
      {currentTrack && (
        <ReactPlayer
          ref={playerRef}
          url={currentTrack.url}
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          width={0}
          height={0}
          style={{ display: 'none' }}
        />
      )}
      {children}
    </RadioContext.Provider>
  );
}

function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
} 