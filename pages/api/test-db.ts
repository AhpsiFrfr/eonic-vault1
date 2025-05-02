import { NextApiRequest, NextApiResponse } from 'next';

// Import node-fetch explicitly
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Testing database connection...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({
      error: 'Missing environment variables',
      env: {
        hasUrl: !!supabaseUrl,
        hasKey: !!serviceKey
      }
    });
  }

  console.log('Making request to:', `${supabaseUrl}/rest/v1/user_profiles?select=id&limit=1`);
  console.log('Using service key prefix:', serviceKey.substring(0, 10) + '...');

  try {
    // First, check table structure
    const structureResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?select=*&limit=1`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });

    if (!structureResponse.ok) {
      const error = await structureResponse.text();
      console.error('Failed to get table structure:', error);
      return res.status(500).json({
        error: 'Failed to get table structure',
        details: error
      });
    }

    const profile = await structureResponse.json();
    console.log('Table structure:', {
      columns: Object.keys(profile[0] || {})
    });

    // Then try to create a test profile
    const response = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Database error',
        details: error,
        response: {
          status: response.status,
          statusText: response.statusText
        }
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      data,
      response: {
        status: response.status,
        statusText: response.statusText
      }
    });
  } catch (error: any) {
    console.error('Unexpected error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    return res.status(500).json({
      error: 'Unexpected error',
      details: {
        message: error.message,
        code: error.code,
        name: error.name
      }
    });
  }
}
