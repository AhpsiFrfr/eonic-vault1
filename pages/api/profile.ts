import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type ProfileResponse = {
  id: string;
  user_address: string;
  display_name: string;
  avatar_url: string;
  status: string;
  custom_status?: string;
  messages_sent?: number;
  posts_shared?: number;
  posts_liked?: number;
  total_reactions?: number;
  social_stats?: {
    reactions_given: Record<string, number>;
    reactions_received: Record<string, number>;
    top_rooms: string[];
    weekly_activity: number[];
  };
  created_at: string;
  updated_at: string;
};

type ErrorResponse = {
  error: string;
  details?: string | {
    message: string;
    code?: string;
    name?: string;
  };
};

type SuccessResponse = {
  profile: ProfileResponse;
};

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the user's address from query params
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid address' });
  }

  // Normalize the address to lowercase
  const normalizedAddress = address.toLowerCase();

  try {
    // Create or update the profile
    const { data: profile, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        user_address: normalizedAddress,
        display_name: req.body?.display_name || '',
        avatar_url: req.body?.avatar_url || '',
        status: req.body?.status || 'online',
        custom_status: req.body?.custom_status || null
      }, {
        onConflict: 'user_address'
      });

    if (upsertError) {
      console.error('Error upserting profile:', upsertError);
      return res.status(500).json({ error: upsertError.message });
    }

    // Fetch the updated profile
    const { data: fetchedProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_address', normalizedAddress)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!fetchedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ profile: fetchedProfile });
  } catch (error: any) {
    console.error('Error in profile handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: {
        message: error.message,
        code: error.code,
        name: error.name
      }
    });
  }
}
