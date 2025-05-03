-- Create community_messages table
-- Enable UUID and JSONB support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS community_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  room TEXT DEFAULT 'general' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to UUID REFERENCES community_messages(id),
  reactions JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  parent_id UUID REFERENCES community_messages(id),
  thread_count INTEGER DEFAULT 0
);

-- Add trigger for edited_at
CREATE OR REPLACE FUNCTION update_edited_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.edited_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_edited_at
    BEFORE UPDATE ON community_messages
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION update_edited_at();

-- Enable row level security
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read messages
CREATE POLICY "Allow anyone to read community messages"
  ON community_messages
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert messages
CREATE POLICY "Allow authenticated users to insert community messages"
  ON community_messages
  FOR INSERT
  WITH CHECK (sender_address IS NOT NULL);

-- Create policy to allow users to delete their own messages
CREATE POLICY "Allow users to delete own community messages"
  ON community_messages
  FOR DELETE
  USING (sender_address = auth.jwt() ->> 'sub');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE community_messages;

-- Clear test messages (run this separately if needed)
DELETE FROM community_messages WHERE content LIKE '%Test%' OR content LIKE '%TEST%';
