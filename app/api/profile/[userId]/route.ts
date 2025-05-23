import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token && userId !== 'current') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // TODO: Replace with actual database call
    // For now return mock data
    const profile = {
      id: userId === 'current' ? 'current-user-id' : userId,
      displayName: 'Buoyant',
      title: 'Cosmic Explorer',
      bio: 'Exploring the digital cosmos and building the future of Web4',
      domain: 'buoyant.eonic',
      avatarUrl: '/images/avatars/default.svg',
      socialLinks: {
        twitter: 'https://twitter.com/buoyant',
        github: 'https://github.com/buoyant'
      }
    };

    const modules = [
      {
        id: 'tokens',
        type: 'tokenHoldings',
        title: 'Token Holdings',
        subtitle: '2 Tokens',
        position: { x: 0, y: 0 },
        data: {
          tokens: [
            { symbol: 'EON', amount: '1000' },
            { symbol: 'USDC', amount: '500' }
          ]
        }
      },
      {
        id: 'timepiece',
        type: 'timepiece',
        title: 'Timepiece',
        subtitle: 'Level 3',
        position: { x: 0, y: 0 },
        data: {
          level: 3,
          xp: 2500,
          nextLevel: 5000
        }
      },
      {
        id: 'social',
        type: 'socialLinks',
        title: 'Social Links',
        subtitle: '2 Links',
        position: { x: 0, y: 0 },
        data: {
          links: [
            { platform: 'Twitter', url: 'https://twitter.com/buoyant' },
            { platform: 'GitHub', url: 'https://github.com/buoyant' }
          ]
        }
      },
      {
        id: 'reputation',
        type: 'reputation',
        title: 'Reputation',
        subtitle: 'Score: 87',
        position: { x: 0, y: 0 },
        data: {
          score: 87,
          badges: ['Early Adopter', 'Builder']
        }
      }
    ];
    
    return NextResponse.json({ profile, modules });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 