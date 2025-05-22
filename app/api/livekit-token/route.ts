import { NextRequest, NextResponse } from 'next/server';
import { generateLiveKitToken } from '@/lib/livekit';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const identity = searchParams.get('identity');
  const room = searchParams.get('room');

  if (!identity || !room) {
    return NextResponse.json(
      { error: 'Missing identity or room parameter' },
      { status: 400 }
    );
  }

  try {
    const token = generateLiveKitToken(identity, room);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 