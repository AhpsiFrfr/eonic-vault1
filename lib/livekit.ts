import { AccessToken } from 'livekit-server-sdk';

export function generateLiveKitToken(identity: string, room: string) {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error('LiveKit credentials not configured');
  }

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  
  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true
  });
  
  return at.toJwt();
}

export const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'wss://your-livekit-url'; 