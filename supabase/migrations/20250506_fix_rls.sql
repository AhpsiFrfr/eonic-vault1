-- Fix RLS policies for storage and user_profiles
DO $$ 
BEGIN
  -- 1. Fix storage policies
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;

  -- Create new storage policies
  CREATE POLICY "Allow users to read all avatars"
    ON storage.objects
    FOR SELECT
    TO public  -- Allow public read access
    USING (bucket_id = 'avatars');

  CREATE POLICY "Allow users to upload their own avatar"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');  -- Removed folder restriction

  CREATE POLICY "Allow users to delete their own avatar"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars');  -- Removed folder restriction

  -- 2. Fix user_profiles policies
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;

  -- Create new user_profiles policies
  CREATE POLICY "Allow users to read all profiles"
    ON public.user_profiles
    FOR SELECT
    TO public  -- Allow public read access
    USING (true);

  CREATE POLICY "Allow users to update their own profile"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (true)  -- Allow all authenticated users to update
    WITH CHECK (true);  -- Allow all authenticated users to update

  CREATE POLICY "Allow users to insert their own profile"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);  -- Allow all authenticated users to insert

  -- Make sure RLS is enabled
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

  -- Make sure avatars bucket is public
  UPDATE storage.buckets
  SET public = true
  WHERE id = 'avatars';
END $$;
