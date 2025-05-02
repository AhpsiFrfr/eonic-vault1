-- Add social metrics to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN time_in_chat interval DEFAULT '0'::interval,
  ADD COLUMN messages_sent integer DEFAULT 0,
  ADD COLUMN posts_shared integer DEFAULT 0,
  ADD COLUMN posts_liked integer DEFAULT 0,
  ADD COLUMN total_reactions integer DEFAULT 0,
  ADD COLUMN social_stats jsonb DEFAULT '{
    "reactions_given": {},
    "reactions_received": {},
    "top_rooms": [],
    "weekly_activity": [0,0,0,0,0,0,0]
  }'::jsonb;

-- Function to update chat time
CREATE OR REPLACE FUNCTION update_chat_time(user_addr text, seconds_spent integer)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET time_in_chat = time_in_chat + (seconds_spent || ' seconds')::interval
  WHERE user_address = user_addr;
END;
$$ LANGUAGE plpgsql;

-- Function to increment social metrics
CREATE OR REPLACE FUNCTION increment_social_metric(user_addr text, metric text, amount integer DEFAULT 1)
RETURNS void AS $$
BEGIN
  CASE metric
    WHEN 'messages_sent' THEN
      UPDATE user_profiles
      SET messages_sent = messages_sent + amount
      WHERE user_address = user_addr;
    WHEN 'posts_shared' THEN
      UPDATE user_profiles
      SET posts_shared = posts_shared + amount
      WHERE user_address = user_addr;
    WHEN 'posts_liked' THEN
      UPDATE user_profiles
      SET posts_liked = posts_liked + amount,
          total_reactions = total_reactions + amount
      WHERE user_address = user_addr;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update weekly activity
CREATE OR REPLACE FUNCTION update_weekly_activity()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET social_stats = jsonb_set(
    social_stats,
    '{weekly_activity}',
    (
      SELECT jsonb_agg(count)
      FROM (
        SELECT count(*)
        FROM messages m
        WHERE m.sender_address = user_profiles.user_address
        AND m.created_at > now() - interval '7 days'
        GROUP BY date_trunc('day', m.created_at)
        ORDER BY date_trunc('day', m.created_at)
      ) daily_counts
    )
  )
  WHERE last_active_at > now() - interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled task to update weekly activity (runs daily)
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('update_weekly_stats', '0 0 * * *', 'SELECT update_weekly_activity();');
