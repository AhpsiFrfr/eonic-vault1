import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const address = '9qnKguL5uUp8PbrXDcSUWbJ1gbTkGh3URyLtx66Ya7Lx';

  try {
    // First check if the profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_address', address)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }

    // Create or update the profile
    const { data: profile, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        user_address: address,
        display_name: 'Test User',
        status: 'online',
        custom_status: '🎮 Gaming in the vault',
        messages_sent: 5,
        posts_shared: 2,
        posts_liked: 3,
        total_reactions: 3
      }, {
        onConflict: 'user_address'
      });

    if (upsertError) {
      console.error('Error updating profile:', upsertError);
      throw upsertError;
    }

    res.status(200).json({ 
      message: 'Test metrics updated successfully',
      profile
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to update test metrics',
      details: error.message
    });
  }
}
