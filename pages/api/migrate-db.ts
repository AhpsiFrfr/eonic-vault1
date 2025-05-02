import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    // Add new columns using Postgres REST API
    const sql = `
      ALTER TABLE user_profiles
      ADD COLUMN IF NOT EXISTS time_in_chat interval DEFAULT '0'::interval,
      ADD COLUMN IF NOT EXISTS messages_sent integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS posts_shared integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS posts_liked integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_reactions integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS custom_status text,
      ADD COLUMN IF NOT EXISTS social_stats jsonb DEFAULT '{"reactions_given": {}, "reactions_received": {}, "top_rooms": [], "weekly_activity": [0,0,0,0,0,0,0]}'::jsonb;
    `;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify({
          query: sql
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Migration error:', error);
      return res.status(500).json({ error: 'Migration failed', details: error });
    }

    const result = await response.json();
    return res.status(200).json({ 
      message: 'Migration successful',
      result 
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message 
    });
  }
}
