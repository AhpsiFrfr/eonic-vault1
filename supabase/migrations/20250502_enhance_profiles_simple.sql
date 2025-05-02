-- Simpler migration without functions for testing
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS time_in_chat interval DEFAULT '0'::interval,
ADD COLUMN IF NOT EXISTS messages_sent integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_shared integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_liked integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reactions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS social_stats jsonb DEFAULT '{"reactions_given": {}, "reactions_received": {}, "top_rooms": [], "weekly_activity": [0,0,0,0,0,0,0]}'::jsonb;
