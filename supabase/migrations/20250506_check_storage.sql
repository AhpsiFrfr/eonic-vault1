-- Check and create avatars bucket if needed
DO $$ 
BEGIN
  -- Create avatars bucket if it doesn't exist
  IF NOT EXISTS (SELECT FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;

  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;

  -- Create policies
  CREATE POLICY "Allow users to read all avatars"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'avatars');

  CREATE POLICY "Allow users to upload their own avatar"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'avatars' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
END $$;
