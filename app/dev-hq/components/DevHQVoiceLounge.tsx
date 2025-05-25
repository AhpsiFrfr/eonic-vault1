// DevHQVoiceLounge.tsx – Real-time voice chat for DevHQ's 'Voice Lounge' channel
// Uses a shared WebRTC-based voice channel for collaborative discussion

import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useVoiceChannel } from '../../../hooks/useVoiceChannel';
import { Mic, MicOff, Users, Loader2, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceUser {
  id: string;
  name: string;
  stream?: MediaStream | null;
}

const DevHQVoiceLounge: React.FC = () => {
  const { user } = useUser();
  const {
    usersInChannel,
    joinChannel,
    leaveChannel,
    toggleMic,
    isConnected,
    isConnecting,
    requestMicrophoneAccess,
    muted
  } = useVoiceChannel();

  useEffect(() => {
    requestMicrophoneAccess().then((granted: boolean) => {
      if (granted) joinChannel('devhq-voice-lounge');
    });
    return leaveChannel;
  }, [joinChannel, leaveChannel, requestMicrophoneAccess]);

  return (
    <div className="bg-zinc-900 border border-muted rounded-xl p-4 shadow-inner space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-glow">🎙️ Voice Lounge (DevHQ)</h2>
        <button
          onClick={() => {
            toggleMic();
          }}
          className={cn(
            'p-2 rounded-full transition-all',
            muted ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
          )}
        >
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      {isConnecting ? (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin mr-2" /> Connecting to voice channel…
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <Users size={14} className="inline mr-1" />
          {usersInChannel.length > 0
            ? usersInChannel.map((u: VoiceUser) => <span key={u.id} className="inline-block mr-2">{u.name}</span>)
            : 'No one connected'}
        </div>
      )}
    </div>
  );
};

export default DevHQVoiceLounge;

// ✅ Requires a functioning `useVoiceChannel` hook with permission handling
// 📍 Drop this component into the DevHQ Chat page under the 'Voice Lounge' tab or section 