-- Check if user_profiles exists and has correct structure
DO $$ 
BEGIN
  -- Add any missing columns to user_profiles
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    BEGIN
      ALTER TABLE public.user_profiles 
        ADD COLUMN IF NOT EXISTS display_name text,
        ADD COLUMN IF NOT EXISTS avatar_url text,
        ADD COLUMN IF NOT EXISTS status text DEFAULT 'online',
        ADD COLUMN IF NOT EXISTS last_seen timestamptz DEFAULT now(),
        ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  ELSE
    -- Create user_profiles table if it doesn't exist
    CREATE TABLE public.user_profiles (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_address text NOT NULL UNIQUE,
      display_name text,
      avatar_url text,
      status text DEFAULT 'online',
      last_seen timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Ensure RLS is enabled
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;

  -- Create policies
  CREATE POLICY "Allow users to read all profiles"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Allow users to update their own profile"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = user_address)
    WITH CHECK (auth.uid()::text = user_address);

  CREATE POLICY "Allow users to insert their own profile"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = user_address);
END $$;
