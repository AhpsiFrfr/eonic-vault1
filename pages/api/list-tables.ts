import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    // List all tables in the public schema
    const response = await fetch(
      `${supabaseUrl}/rest/v1/`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error listing tables:', {
        status: response.status,
        statusText: response.statusText,
        error
      });
      return res.status(500).json({ error: 'Failed to list tables', details: error });
    }

    const data = await response.json();
    return res.status(200).json({ tables: data });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to list tables', details: error.message });
  }
}
