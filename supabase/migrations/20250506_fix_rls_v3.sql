-- Most permissive RLS setup for development
BEGIN;

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "storage_policy" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_policy" ON public.user_profiles;

-- 2. Make sure tables exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_address text UNIQUE,
  display_name text,
  avatar_url text,
  status text DEFAULT 'online',
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Make sure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 4. Most permissive storage policy
CREATE POLICY "Allow all storage operations"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Most permissive profiles policy
CREATE POLICY "Allow all profile operations"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Enable RLS but allow public access
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 7. Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- 8. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;

COMMIT;
