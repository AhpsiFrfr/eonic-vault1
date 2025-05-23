-- Create community_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS community_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  room TEXT DEFAULT 'community' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to UUID,
  reactions JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  parent_id UUID,
  thread_count INTEGER DEFAULT 0
);

-- Add channel column if it doesn't exist
ALTER TABLE community_messages ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'community-chat';

-- Create indices
CREATE INDEX IF NOT EXISTS idx_messages_room_channel ON community_messages(room, channel);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON community_messages(channel);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT,
  wallet_address TEXT NOT NULL UNIQUE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index on wallet_address
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Insert dummy data if the tables are empty
INSERT INTO users (username, wallet_address)
SELECT 'Demo User', 'demo_wallet_address'
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);

-- Update any existing messages without a channel to use the appropriate default channel
UPDATE community_messages 
SET channel = 'community-chat' 
WHERE channel IS NULL OR channel = '' OR channel = 'community-conference';

-- Ensure messages have the correct room value
UPDATE community_messages
SET room = 'community'
WHERE room = 'general' OR room = 'conference';

-- Enable row level security if not already enabled
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Update policies with better error handling
DO $$
BEGIN
    -- Drop policies if they exist (no error if they don't)
    BEGIN
        DROP POLICY IF EXISTS "Allow anyone to read community messages" ON community_messages;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy "Allow anyone to read community messages" does not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow users to insert their own messages" ON community_messages;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy "Allow users to insert their own messages" does not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow users to update their own messages" ON community_messages;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy "Allow users to update their own messages" does not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow users to delete their own messages" ON community_messages;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy "Allow users to delete their own messages" does not exist';
    END;
END $$;

-- Add comprehensive RLS policies
CREATE POLICY "Allow anyone to read community messages" 
  ON community_messages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow users to insert their own messages" 
  ON community_messages 
  FOR INSERT 
  WITH CHECK (sender_address = current_user OR (current_setting('request.headers')::json->>'x-wallet-address') = sender_address);

CREATE POLICY "Allow users to update their own messages" 
  ON community_messages 
  FOR UPDATE 
  USING (sender_address = current_user OR (current_setting('request.headers')::json->>'x-wallet-address') = sender_address)
  WITH CHECK (sender_address = current_user OR (current_setting('request.headers')::json->>'x-wallet-address') = sender_address);

CREATE POLICY "Allow users to delete their own messages" 
  ON community_messages 
  FOR DELETE 
  USING (sender_address = current_user OR (current_setting('request.headers')::json->>'x-wallet-address') = sender_address);

-- Create a trigger to ensure room and channel are consistent
CREATE OR REPLACE FUNCTION set_default_channel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.channel IS NULL THEN
    CASE NEW.room
      WHEN 'community' THEN NEW.channel := 'community-chat';
      WHEN 'lounge' THEN NEW.channel := 'community-lounge';
      WHEN 'cabal' THEN NEW.channel := 'community-cabal';
      WHEN 'board' THEN NEW.channel := 'community-board';
      ELSE NEW.channel := 'community-' || NEW.room;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger with error handling
DO $$
BEGIN
    BEGIN
        DROP TRIGGER IF EXISTS ensure_channel_set ON community_messages;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Trigger ensure_channel_set does not exist';
    END;
    
    BEGIN
        CREATE TRIGGER ensure_channel_set
        BEFORE INSERT OR UPDATE ON community_messages
        FOR EACH ROW
        EXECUTE FUNCTION set_default_channel();
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating trigger ensure_channel_set: %', SQLERRM;
    END;
END $$;

-- Add users table to realtime publication if it's not already a member
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'users'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE users;
    END IF;
END $$;

-- Analyze tables to update statistics for the query planner
ANALYZE community_messages;
ANALYZE users;

-- Make sure all necessary columns exist on community_messages table
ALTER TABLE IF EXISTS community_messages 
  ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS thread_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'community-chat';

-- Create any missing indices
CREATE INDEX IF NOT EXISTS idx_messages_room_channel ON community_messages(room, channel);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON community_messages(channel);

-- Ensure the schema is up to date
COMMENT ON TABLE community_messages IS 'Community chat messages with attachments and reactions support';
