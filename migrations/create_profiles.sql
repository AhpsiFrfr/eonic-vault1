-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  wallet_tagline TEXT,
  avatar_url TEXT,
  widget_list TEXT[],
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);

-- Create RLS policies
CREATE POLICY "Anyone can read public profiles"
  ON profiles FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can read their own profiles"
  ON profiles FOR SELECT
  USING (wallet_address = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (wallet_address = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (wallet_address = auth.jwt() ->> 'sub'); 