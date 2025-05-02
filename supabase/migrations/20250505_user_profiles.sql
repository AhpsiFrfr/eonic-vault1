-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_address text NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  status text DEFAULT 'online',
  last_seen timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all profiles
CREATE POLICY "Allow users to read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_address)
  WITH CHECK (auth.uid()::text = user_address);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_address);

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create policy to allow users to read all avatars
CREATE POLICY "Allow users to read all avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

-- Create policy to allow users to upload their own avatar
CREATE POLICY "Allow users to upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Enable realtime subscriptions for user_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
