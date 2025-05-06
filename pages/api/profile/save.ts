import type { NextApiRequest, NextApiResponse } from 'next';
import { createProfileWithServiceRole } from '../../../utils/admin-supabase';

type ResponseData = {
  success?: boolean;
  message?: string;
  profile?: any;
  error?: string;
  details?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log environment variables (excluding sensitive data)
    console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse request body
    const { walletAddress, profileData } = req.body;
    
    // Log details for debugging
    console.log('Processing save request for wallet:', walletAddress ? walletAddress.substring(0, 8) + '...' : 'undefined');
    console.log('Profile data fields:', profileData ? Object.keys(profileData) : 'undefined');
    
    // Basic validation
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Use admin supabase client to save the profile
    const { success, data, error } = await createProfileWithServiceRole(
      walletAddress, 
      profileData
    );
    
    if (!success) {
      console.error('Error saving profile with service role:', error);
      return res.status(500).json({ 
        error: 'Failed to save profile', 
        details: error 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      profile: data
    });
  } catch (error: any) {
    console.error('Error in profile save API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
} 