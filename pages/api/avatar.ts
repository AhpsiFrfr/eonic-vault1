import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Use service role key for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = await fs.readFile(file.filepath);
    const fileExt = file.originalFilename?.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileData, {
        contentType: file.mimetype || undefined,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = await supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return res.status(200).json({ url: urlData.publicUrl });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({ error: error.message });
  }
}
