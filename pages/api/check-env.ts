import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  // Check URL format
  let urlValid = false;
  try {
    if (supabaseUrl) {
      const url = new URL(supabaseUrl);
      urlValid = url.protocol === 'https:' && url.host.endsWith('.supabase.co');
    }
  } catch (e) {
    urlValid = false;
  }

  return res.status(200).json({
    supabaseUrl: supabaseUrl ? {
      value: `${supabaseUrl.substring(0, 10)}...`,
      startsWithHttps: supabaseUrl.startsWith('https://'),
      endsWithSupabaseCo: supabaseUrl.endsWith('.supabase.co'),
      length: supabaseUrl.length,
      valid: urlValid
    } : null,
    serviceKey: serviceKey ? {
      length: serviceKey.length,
      prefix: `${serviceKey.substring(0, 10)}...`,
      containsEyJ: serviceKey.startsWith('eyJ'),
      valid: serviceKey.length > 20 && serviceKey.startsWith('eyJ')
    } : null
  });
}
