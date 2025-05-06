import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PublicKey } from '@solana/web3.js';

// Helper for Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin actions
);

/**
 * Register a subdomain for a user under vault.sol
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { subdomain, walletAddress } = body;
    
    // Basic validation
    if (!subdomain || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate subdomain format
    if (!/^[a-z0-9-]{3,63}$/.test(subdomain)) {
      return NextResponse.json({ 
        error: 'Subdomain must be 3-63 characters and only contain lowercase letters, numbers, and hyphens'
      }, { status: 400 });
    }
    
    // Validate wallet address
    try {
      new PublicKey(walletAddress);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }
    
    // 1. Check if subdomain is already registered
    // For a real implementation, you would need to:
    // - Check in your database if the subdomain is already claimed
    // - If you've implemented the SNS subdomain program, check on-chain
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('solana_domain', subdomain)
      .not('wallet_address', 'eq', walletAddress)
      .maybeSingle();
    
    if (existingUser) {
      return NextResponse.json({ error: 'This profile name is already taken' }, { status: 409 });
    }

    // 2. In a real implementation, this would register the subdomain on Solana blockchain
    // This would use the Bonfida subdomain program or your own implementation
    // For now we'll just simulate this process
    
    console.log(`Registering subdomain ${subdomain}.vault.sol for wallet ${walletAddress}`);
    
    // 3. Update user's profile in database
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ solana_domain: subdomain })
      .eq('wallet_address', walletAddress);
    
    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json({ error: 'Failed to save profile data' }, { status: 500 });
    }
    
    // Return success
    return NextResponse.json({
      success: true,
      message: 'Profile name registered successfully',
      data: {
        subdomain,
        full_domain: `${subdomain}.vault.sol`
      }
    });
  } catch (error) {
    console.error('Error registering subdomain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 