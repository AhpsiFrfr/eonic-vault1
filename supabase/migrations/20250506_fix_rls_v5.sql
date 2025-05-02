-- Fix RLS policies with auth.uid() checks
BEGIN;

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "storage_policy" ON storage.objects;
DROP POLICY IF EXISTS "Allow all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all profile operations" ON public.user_profiles;

-- 2. Create storage policies with auth checks
CREATE POLICY "storage_select_policy" 
  ON storage.objects 
  FOR SELECT 
  TO public 
  USING (bucket_id = 'avatars');

CREATE POLICY "storage_insert_policy" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "storage_update_policy" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "storage_delete_policy" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 3. Create user_profiles policies with auth checks
CREATE POLICY "profiles_select_policy" 
  ON public.user_profiles 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "profiles_insert_policy" 
  ON public.user_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "profiles_update_policy" 
  ON public.user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "profiles_delete_policy" 
  ON public.user_profiles 
  FOR DELETE 
  TO authenticated 
  USING (auth.role() = 'authenticated');

-- 4. Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- 6. Make sure avatars bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'avatars';

-- 7. Handle realtime
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
