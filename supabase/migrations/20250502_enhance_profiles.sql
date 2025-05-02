-- Enhance user_profiles table with custom status and engagement tracking
ALTER TABLE user_profiles
  ADD COLUMN custom_status text,
  ADD COLUMN last_active_at timestamptz DEFAULT now(),
  ADD COLUMN streak_days integer DEFAULT 0,
  ADD COLUMN total_actions integer DEFAULT 0,
  ADD COLUMN action_log jsonb DEFAULT '[]'::jsonb;

-- Function to update last_active_at and streak
CREATE OR REPLACE FUNCTION update_profile_activity()
RETURNS trigger AS $$
BEGIN
  -- Update last_active_at
  NEW.last_active_at = now();
  
  -- Check if we need to update streak
  IF OLD.last_active_at IS NULL OR 
     (NEW.last_active_at::date - OLD.last_active_at::date) = 1 THEN
    -- Consecutive day, increment streak
    NEW.streak_days = OLD.streak_days + 1;
  ELSIF (NEW.last_active_at::date - OLD.last_active_at::date) > 1 THEN
    -- Streak broken, reset to 1
    NEW.streak_days = 1;
  END IF;

  -- Increment total actions
  NEW.total_actions = OLD.total_actions + 1;

  -- Add to action log (keep last 50 actions)
  NEW.action_log = jsonb_build_array(
    jsonb_build_object(
      'action', TG_ARGV[0],
      'timestamp', now()
    )
  ) || (CASE 
    WHEN jsonb_array_length(OLD.action_log) >= 50 
    THEN (OLD.action_log[1:49])
    ELSE OLD.action_log
  END);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
CREATE TRIGGER profile_activity_trigger
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_activity();
