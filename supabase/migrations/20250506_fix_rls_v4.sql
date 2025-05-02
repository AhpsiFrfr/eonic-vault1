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

-- 2. Make sure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3. Most permissive storage policy
CREATE POLICY "Allow all storage operations"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Most permissive profiles policy
CREATE POLICY "Allow all profile operations"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Enable RLS but allow public access
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- 7. Handle realtime
DO $$ 
BEGIN
  -- Remove from publication if exists
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.user_profiles;
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;
  
  -- Add to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
END $$;

COMMIT;
