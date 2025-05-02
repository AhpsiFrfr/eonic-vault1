-- Temporarily disable all RLS to test functionality
BEGIN;

-- 1. Drop all existing policies
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

-- 2. Disable RLS
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. Make sure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 4. Grant all permissions
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- 5. Handle realtime
DO $$ 
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.user_profiles;
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
END $$;

COMMIT;
