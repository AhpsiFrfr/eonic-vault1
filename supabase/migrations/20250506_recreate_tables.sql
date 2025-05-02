-- Recreate tables with proper structure
BEGIN;

-- 1. Drop existing tables and start fresh
DROP TABLE IF EXISTS public.user_profiles;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.buckets;

-- 2. Create storage schema
CREATE SCHEMA IF NOT EXISTS storage;

-- 3. Create storage tables
CREATE TABLE storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT false
);

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
    CONSTRAINT "buckets_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets (id)
);

-- 4. Create user_profiles table
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

-- 5. Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- 6. Grant permissions
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- 7. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;

COMMIT;
