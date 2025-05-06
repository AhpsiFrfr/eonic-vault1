import { createSupabaseClient } from './supabase';
import { getWalletDomain } from './solana-name-service';
import { Connection } from '@solana/web3.js';

export interface UserProfile {
  id: string;
  wallet_address: string;
  display_name: string;
  title: string;
  bio: string;
  wallet_tagline: string;
  avatar_url: string;
  widget_list: string[];
  is_public: boolean;
  solana_domain: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get user profile by wallet address
 * @param walletAddress user's wallet address
 * @returns UserProfile or null if not found
 */
export async function getUserProfile(walletAddress: string): Promise<UserProfile | null> {
  if (!walletAddress) {
    console.error('getUserProfile called with empty wallet address');
    return null;
  }
  
  try {
    console.log(`Fetching profile for wallet: ${walletAddress.substring(0, 8)}...`);
    const supabase = createSupabaseClient(walletAddress);
    
    // Query the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If the user doesn't have a profile yet, try to create one
      if (error.code === 'PGRST116') { // No rows returned
        console.log('No profile found. Attempting to create one...');
        return await createUserProfile(walletAddress);
      }
      return null;
    }
    
    if (!data) {
      console.log('No profile data returned. Attempting to create one...');
      return await createUserProfile(walletAddress);
    }
    
    console.log('Profile fetched successfully:', data.id);
    
    // If the user doesn't have a solana_domain set, try to fetch it from the Solana blockchain
    if (!data.solana_domain) {
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const domain = await getWalletDomain(connection, walletAddress);
        
        if (domain) {
          console.log(`Found domain for wallet: ${domain}`);
          // Update the profile with the domain
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ solana_domain: domain })
            .eq('wallet_address', walletAddress);
          
          if (updateError) {
            console.error('Error updating domain in profile:', updateError);
          } else {
            data.solana_domain = domain;
            console.log(`Updated profile with domain: ${domain}`);
          }
        }
      } catch (err) {
        console.error('Error fetching Solana domain:', err);
      }
    }
    
    return data as UserProfile;
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    return null;
  }
}

/**
 * Update user profile
 * @param walletAddress user's wallet address
 * @param profileData partial user profile data to update
 * @returns updated UserProfile or null if failed
 */
export async function updateUserProfile(
  walletAddress: string, 
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> {
  if (!walletAddress) {
    console.error('updateUserProfile called with empty wallet address');
    return null;
  }
  
  try {
    console.log(`Updating profile for wallet: ${walletAddress.substring(0, 8)}...`);
    console.log('Profile data to update:', profileData);
    
    const supabase = createSupabaseClient(walletAddress);
    
    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!existingProfile) {
      console.log('No existing profile found. Creating a new one...');
      return await createUserProfile(walletAddress);
    }
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    console.log('Profile updated successfully:', data.id);
    return data as UserProfile;
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    return null;
  }
}

/**
 * Create a new user profile
 * @param walletAddress user's wallet address
 * @returns created UserProfile or null if failed
 */
export async function createUserProfile(walletAddress: string): Promise<UserProfile | null> {
  if (!walletAddress) {
    console.error('createUserProfile called with empty wallet address');
    return null;
  }
  
  try {
    console.log(`Creating new profile for wallet: ${walletAddress.substring(0, 8)}...`);
    const supabase = createSupabaseClient(walletAddress);
    
    // Check if a profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError);
    }
    
    if (existingProfile) {
      console.log('Profile already exists. Fetching details...');
      return getUserProfile(walletAddress);
    }
    
    // Try to get the domain
    let solanaDomain: string | null = null;
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      solanaDomain = await getWalletDomain(connection, walletAddress);
      if (solanaDomain) {
        console.log(`Found domain for wallet: ${solanaDomain}`);
      }
    } catch (err) {
      console.error('Error fetching Solana domain during profile creation:', err);
    }
    
    // Create timestamp for both created and updated
    const timestamp = new Date().toISOString();
    
    // Create a new profile
    const newProfile = {
      wallet_address: walletAddress,
      display_name: `User-${walletAddress.substring(0, 6)}`,
      title: 'EONIC Explorer',
      bio: '',
      wallet_tagline: '',
      avatar_url: '/default-avatar.png',
      widget_list: ['nft-showcase', 'xp-tracker'],
      is_public: true,
      solana_domain: solanaDomain,
      created_at: timestamp,
      updated_at: timestamp
    };
    
    console.log('Creating new profile with data:', newProfile);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      
      // If permission denied, try with service role (if available)
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        console.log('Permission denied. This may be an RLS policy issue.');
      }
      
      return null;
    }
    
    console.log('Profile created successfully:', data.id);
    return data as UserProfile;
  } catch (err) {
    console.error('Error in createUserProfile:', err);
    return null;
  }
} 