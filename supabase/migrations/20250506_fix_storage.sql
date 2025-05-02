-- Update storage bucket and policies
DO $$ 
BEGIN
  -- Make sure avatars bucket exists and is public
  IF NOT EXISTS (SELECT FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  ELSE
    UPDATE storage.buckets
    SET public = true
    WHERE id = 'avatars';
  END IF;

  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Allow users to read all avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;

  -- Create policies with broader permissions
  CREATE POLICY "Allow users to read all avatars"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'avatars');

  CREATE POLICY "Allow users to upload their own avatar"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');

  CREATE POLICY "Allow users to delete their own avatar"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars');

  -- Enable RLS on storage.objects
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
END $$;
