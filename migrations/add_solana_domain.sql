-- Add solana_domain column to the profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS solana_domain TEXT;

-- Create index for faster lookups by domain
CREATE INDEX IF NOT EXISTS idx_profiles_solana_domain ON profiles(solana_domain);

-- Drop any existing constraint and create a new one with a more specific name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS unique_solana_domain;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_solana_domain_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_solana_domain_unique UNIQUE (solana_domain);

-- Create a function to validate solana domains
CREATE OR REPLACE FUNCTION validate_solana_domain()
RETURNS TRIGGER AS $$
BEGIN
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
WHEN (NEW.solana_domain IS NOT NULL)
EXECUTE FUNCTION validate_solana_domain(); 