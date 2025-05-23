'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Room,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteAudioTrack,
  RoomEvent,
  Participant,
  LocalParticipant
} from 'livekit-client';
import { useRouter } from 'next/navigation';

interface VoiceRoomProps {
  roomName: string;
  userId?: string; // Optional since we can get from wallet
}

export function VoiceRoom({ roomName }: VoiceRoomProps) {
  const { publicKey } = useWallet();
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) return;

    const connectToRoom = async () => {
      try {
        setIsConnecting(true);
        const response = await fetch('/api/livekit-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName,
            participantName: publicKey.toString(),
          }),
        });

        const { token } = await response.json();
        const room = new Room();

        room.on(RoomEvent.ParticipantConnected, () => {
          setParticipants([room.localParticipant, ...room.remoteParticipants]);
        });

        room.on(RoomEvent.ParticipantDisconnected, () => {
          setParticipants([room.localParticipant, ...room.remoteParticipants]);
        });

        await room.connect('wss://your-livekit-server.com', token);
        setRoom(room);
        setParticipants([room.localParticipant, ...room.remoteParticipants]);
        
        // Save current room in localStorage
        localStorage.setItem('currentVoiceRoom', roomName);
        
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to connect to voice room:', error);
        setIsConnecting(false);
      }
    };

    // Auto-reconnect from localStorage if needed
    const savedRoom = localStorage.getItem('currentVoiceRoom');
    if (savedRoom === roomName) {
      connectToRoom();
    }

    // Cleanup on unmount or room change
    return () => {
      if (room) {
        localStorage.removeItem('currentVoiceRoom');
        room.disconnect();
      }
    };
  }, [publicKey, roomName]);

  // Reconnect handling on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (room) {
        room.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [room]);

  if (!publicKey) {
    return (
      <div className="p-6 bg-gray-800 text-gray-300 rounded">
        Please connect your wallet to join voice chat.
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="p-6 bg-gray-800 text-gray-300 rounded">
        Connecting to voice room...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-4">Voice Room: {roomName}</h2>
      
      <div className="space-y-4">
        {participants.map((p) => {
          const audioTrack = Array.from(p.audioTracks.values())
            .find((pub): pub is RemoteTrackPublication => pub.track instanceof RemoteAudioTrack);
          const isMuted = !audioTrack?.isSubscribed || audioTrack.track?.isMuted;

          return (
            <div key={p.identity} className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
              <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`} />
              <span>{p.identity.slice(0, 4)}...{p.identity.slice(-4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 