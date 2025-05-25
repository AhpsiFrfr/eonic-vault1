// useVoiceChannel.ts – WebRTC voice channel hook for Eonic Vault

import { useEffect, useRef, useState } from 'react';
import { useUser } from './useUser';

interface VoiceUser {
  id: string;
  name: string;
  stream?: MediaStream | null;
}

export const useVoiceChannel = () => {
  const { user } = useUser();
  const [usersInChannel, setUsersInChannel] = useState<VoiceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [muted, setMuted] = useState(false);

  const localStream = useRef<MediaStream | null>(null);
  const connections = useRef<{ [id: string]: RTCPeerConnection }>({});

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      return true;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      return false;
    }
  };

  const joinChannel = async (channelId: string) => {
    setIsConnecting(true);
    const granted = await requestMicrophoneAccess();
    if (!granted) return;

    // Stub connection: simulate user join (replace with signaling/WebRTC implementation)
    setTimeout(() => {
      setUsersInChannel((prev) => [
        ...prev,
        { 
          id: user?.walletAddress || 'you', 
          name: user?.displayName || 'You', 
          stream: localStream.current 
        }
      ]);
      setIsConnected(true);
      setIsConnecting(false);
    }, 1000);
  };

  const leaveChannel = () => {
    Object.values(connections.current).forEach((pc) => pc.close());
    setUsersInChannel([]);
    setIsConnected(false);
  };

  const toggleMic = () => {
    if (localStream.current) {
      const enabled = localStream.current.getAudioTracks()[0].enabled;
      localStream.current.getAudioTracks()[0].enabled = !enabled;
      setMuted(enabled);
    }
  };

  return {
    usersInChannel,
    isConnected,
    isConnecting,
    joinChannel,
    leaveChannel,
    toggleMic,
    requestMicrophoneAccess,
    muted,
  };
}; 