# Eonic Vault Deployment Guide

## 🚀 Token Gating & Production Deployment

This guide will help you enable token gating and deploy the Eonic Vault to production.

### Prerequisites

- GitHub repository with your code
- Vercel account
- Helius API key for Solana token verification
- EONIC token mint address

### Step 1: Environment Variables Setup

Add these environment variables to your Vercel project:

#### Required for Token Gating:
```
NEXT_PUBLIC_EONIC_TOKEN_MINT=<your_eonic_token_mint_address>
NEXT_PUBLIC_HELIUS_API_KEY=<your_helius_api_key>
```

#### Other Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXTAUTH_SECRET=<generate_random_string>
NEXTAUTH_URL=<your_production_url>
LIVEKIT_API_KEY=<your_livekit_api_key>
LIVEKIT_API_SECRET=<your_livekit_api_secret>
NEXT_PUBLIC_LIVEKIT_URL=<your_livekit_url>
```

### Step 2: Vercel Deployment Setup

1. **Connect to Vercel:**
   ```bash
   npx vercel
   ```

2. **Link to existing project or create new:**
   - Follow the prompts to link your GitHub repository
   - Choose the appropriate Vercel team/account

3. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all the variables listed above
   - Make sure to add them for all environments (Production, Preview, Development)

### Step 3: Token Gating Configuration

The token gating system is now enabled by default. Here's what's protected:

#### Protected Routes:
- `/dashboard/*` - Main dashboard
- `/vault/*` - Vault features
- `/dev-hq/*` - Development headquarters
- `/vaultcord/*` - Discord-like features
- `/eon-id/*` - Identity management
- `/messages/*` - Messaging features
- `/showcase` - Project showcase

#### Public Routes:
- `/` - Landing page
- `/login` - Authentication
- `/access-denied` - Error page

### Step 4: Development Overrides (Optional)

For staging/development, you can temporarily whitelist specific wallets:

1. **Edit `lib/token-checker.ts`:**
   ```typescript
   // Uncomment and modify this section for dev wallets
   const DEV_WALLETS = [
     'your_dev_wallet_1',
     'your_dev_wallet_2',
     'your_dev_wallet_3'
   ];
   
   export async function checkAccess(wallet: string): Promise<boolean> {
     // For development: bypass token check for dev wallets
     if (DEV_WALLETS.includes(wallet)) {
       return true;
     }
     
     // Production: check token balance
     const balance = await getTokenBalance(wallet);
     return balance > 0;
   }
   ```

### Step 5: Final Deployment

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Enable token gating for production"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Automatic deployment will trigger from GitHub
   - Or manually trigger: `npx vercel --prod`

3. **Verify deployment:**
   - Check that environment variables are correctly set
   - Test token gating with a wallet that has EONIC tokens
   - Test access denied flow with a wallet without tokens

### Step 6: Production Verification

#### Test Cases:
1. **Valid Token Holder:**
   - Connect wallet with EONIC tokens
   - Should access all protected routes

2. **Invalid/No Tokens:**
   - Connect wallet without EONIC tokens
   - Should redirect to `/access-denied`

3. **No Wallet:**
   - Access protected route without connecting wallet
   - Should redirect to `/login`

### Step 7: Custom Domain (Optional)

1. **Add domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update environment variables:**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update any other domain-specific variables

### Troubleshooting

#### Common Issues:

1. **Token verification failing:**
   - Check Helius API key is valid
   - Verify token mint address is correct
   - Check wallet has proper token balance

2. **Environment variables not loading:**
   - Ensure variables are added to all environments
   - Check variable names match exactly
   - Redeploy after adding variables

3. **Infinite redirect loops:**
   - Check middleware configuration
   - Verify public paths are correctly excluded
   - Check cookie handling

#### Debug Mode:

To enable detailed logging, add:
```
DEBUG=true
```

### Security Considerations

1. **Environment Variables:**
   - Never commit real API keys to repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **Token Verification:**
   - All verification happens server-side
   - Client-side checks are for UX only
   - Middleware enforces access control

3. **Rate Limiting:**
   - Consider implementing rate limiting for token checks
   - Cache token verification results when appropriate

### Monitoring

1. **Set up monitoring:**
   - Vercel Analytics for performance
   - Error tracking (Sentry recommended)
   - Uptime monitoring

2. **Key metrics to watch:**
   - Token verification success rate
   - Authentication flow completion
   - Error rates on protected routes

---

## Quick Reference

### Environment Variables for Vercel:
```bash
# Token Gating (Required)
NEXT_PUBLIC_EONIC_TOKEN_MINT=<mint_address>
NEXT_PUBLIC_HELIUS_API_KEY=<api_key>

# Database & Auth
DATABASE_URL=<postgres_url>
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=<production_url>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>

# LiveKit
LIVEKIT_API_KEY=<key>
LIVEKIT_API_SECRET=<secret>
NEXT_PUBLIC_LIVEKIT_URL=<url>
```

### Deployment Commands:
```bash
# Install dependencies
npm install

# Build and deploy
npx vercel --prod

# Check logs
npx vercel logs
```

---

**🎉 Your Eonic Vault is now ready for production with token gating enabled!** 