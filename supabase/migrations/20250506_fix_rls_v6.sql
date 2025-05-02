-- Fix profiles and storage setup
BEGIN;

-- 1. Recreate user_profiles table with correct name
DROP TABLE IF EXISTS public.user_profiles;

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address text UNIQUE NOT NULL,
    display_name text,
    avatar_url text,
    status text DEFAULT 'online',
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Make sure avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3. Drop all existing policies
DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "storage_policy" ON storage.objects;
DROP POLICY IF EXISTS "Allow all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all profile operations" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.user_profiles;

-- 4. Create minimal policies
DROP POLICY IF EXISTS "public_select" ON storage.objects;
CREATE POLICY "public_select"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "authenticated_insert" ON storage.objects;
CREATE POLICY "authenticated_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "authenticated_update" ON storage.objects;
CREATE POLICY "authenticated_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "authenticated_delete" ON storage.objects;
CREATE POLICY "authenticated_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

-- Create new policies for user_profiles
DROP POLICY IF EXISTS "public_profiles_select" ON public.user_profiles;
CREATE POLICY "public_profiles_select"
  ON public.user_profiles
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "authenticated_profiles_insert" ON public.user_profiles;
CREATE POLICY "authenticated_profiles_insert"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_profiles_update" ON public.user_profiles;
CREATE POLICY "authenticated_profiles_update"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (true);

-- 5. Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Grant permissions
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- 7. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;

-- 8. Insert a test profile
INSERT INTO public.user_profiles (user_address, display_name, status)
VALUES ('test_address', 'Test User', 'online')
ON CONFLICT (user_address) DO NOTHING;

COMMIT;
