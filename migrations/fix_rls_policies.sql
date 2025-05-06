-- Create RLS policies for the profiles table
-- First drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON profiles;

-- Re-create policies with proper conditions
CREATE POLICY "Anyone can read public profiles"
  ON profiles FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can read their own profiles"
  ON profiles FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub' OR 
         wallet_address = current_setting('request.headers')::json->>'x-wallet-address');

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub' OR 
         wallet_address = current_setting('request.headers')::json->>'x-wallet-address');

CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub' OR 
              wallet_address = current_setting('request.headers')::json->>'x-wallet-address');

-- Allow the service role to bypass RLS
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
-- In production, you would set this up through Supabase dashboard for the service role 