import { Connection, PublicKey } from '@solana/web3.js';
import type { WalletContextState } from '@solana/wallet-adapter-react';

// This file contains utility functions for interacting with Solana Name Service
// For development, we're using mock implementations that simulate the behavior

// Store user domains in memory for the session
const userDomains = new Map<string, string>();

/**
 * Check if a domain is available for registration
 * @param connection Solana connection
 * @param domain Domain name without .sol suffix
 * @returns Promise<boolean> True if available
 */
export async function checkDomainAvailability(
  connection: Connection,
  domain: string
): Promise<boolean> {
  try {
    if (!domain) return false;
    
    console.log(`[MOCK] Checking availability for domain: ${domain}`);
    
    // Check if the domain is already registered in our mock storage
    const isRegistered = Array.from(userDomains.values()).includes(domain);
    
    return !isRegistered;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return true; // For development, assume domain is available
  }
}

/**
 * Check if a wallet owns a specific domain
 * @param connection Solana connection
 * @param domain Domain name without .sol suffix
 * @param walletAddress The wallet address to check
 * @returns Promise<boolean> True if the wallet owns the domain
 */
export async function verifyDomainOwnership(
  connection: Connection,
  domain: string,
  walletAddress: string
): Promise<boolean> {
  try {
    if (!domain || !walletAddress) return false;
    
    console.log(`[MOCK] Verifying ownership of domain: ${domain} for wallet: ${walletAddress.substring(0, 8)}...`);
    
    // Check if the wallet has this domain in our mock storage
    return userDomains.get(walletAddress) === domain;
  } catch (error) {
    console.error('Error verifying domain ownership:', error);
    return false;
  }
}

/**
 * Register a new .sol domain
 * @param connection Solana connection
 * @param wallet Solana wallet
 * @param domain Domain name without .sol suffix
 * @returns Promise<string> Transaction signature
 */
export async function registerSolanaDomain(
  connection: Connection,
  wallet: WalletContextState,
  domain: string
): Promise<string> {
  try {
    if (!domain || !wallet.publicKey) {
      throw new Error('Missing domain or wallet');
    }
    
    const walletAddress = wallet.publicKey.toString();
    
    console.log(`[MOCK] Registering domain: ${domain} for wallet: ${walletAddress.substring(0, 8)}...`);
    
    // Store the domain for this wallet in our mock storage
    userDomains.set(walletAddress, domain);
    
    // Return a mock transaction signature
    return `mock-tx-${Date.now()}`;
  } catch (error) {
    console.error('Error registering domain:', error);
    throw error;
  }
}

/**
 * Reverse lookup: Get the primary domain for a wallet address
 * @param connection Solana connection
 * @param walletAddress The wallet address to lookup
 * @returns Promise<string|null> The domain name without .sol suffix, or null if not found
 */
export async function getWalletDomain(
  connection: Connection,
  walletAddress: string
): Promise<string | null> {
  try {
    if (!walletAddress) return null;
    
    console.log(`[MOCK] Looking up domain for wallet: ${walletAddress.substring(0, 8)}...`);
    
    // Check if we have a domain for this wallet in our mock storage
    const domain = userDomains.get(walletAddress);
    
    if (domain) {
      return domain;
    }
    
    // For wallets without a domain, generate a default one
    const shortAddress = walletAddress.slice(0, 8).toLowerCase();
    const defaultDomain = `user-${shortAddress}`;
    
    // Store it for future lookups
    userDomains.set(walletAddress, defaultDomain);
    
    return defaultDomain;
  } catch (error) {
    console.error('Error in reverse lookup:', error);
    return null;
  }
} 