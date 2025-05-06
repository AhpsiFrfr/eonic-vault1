-- First, check if the profiles table exists, if not create it
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
  solana_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_solana_domain ON profiles(solana_domain);

-- Add unique constraint for solana_domain (only if the column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'solana_domain'
  ) THEN
    BEGIN
      ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_solana_domain_unique;
      ALTER TABLE profiles ADD CONSTRAINT profiles_solana_domain_unique UNIQUE (solana_domain);
    EXCEPTION WHEN OTHERS THEN
      -- Do nothing if there's an error
    END;
  END IF;
END $$;

-- Create a function to validate solana domains
CREATE OR REPLACE FUNCTION validate_solana_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip validation if domain is null
  IF NEW.solana_domain IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Basic validation: only allow lowercase alphanumeric and hyphens
  IF NEW.solana_domain ~ '[^a-z0-9\-]' THEN
    RAISE EXCEPTION 'Solana domain may only contain lowercase letters, numbers, and hyphens';
  END IF;
  
  -- Validate length (between 3 and 63 characters)
  IF LENGTH(NEW.solana_domain) < 3 OR LENGTH(NEW.solana_domain) > 63 THEN
    RAISE EXCEPTION 'Solana domain must be between 3 and 63 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate domains before insert/update
DROP TRIGGER IF EXISTS validate_solana_domain_trigger ON profiles;
CREATE TRIGGER validate_solana_domain_trigger
BEFORE INSERT OR UPDATE OF solana_domain ON profiles
FOR EACH ROW
EXECUTE FUNCTION validate_solana_domain(); 