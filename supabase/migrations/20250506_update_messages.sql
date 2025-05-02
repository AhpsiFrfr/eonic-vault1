-- First, add columns to messages table
DO $$ 
BEGIN
  -- Add edited_at and edited_by columns
  BEGIN
    ALTER TABLE public.messages
      ADD COLUMN IF NOT EXISTS edited_at timestamptz,
      ADD COLUMN IF NOT EXISTS edited_by uuid references auth.users(id);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Add thread support columns
  BEGIN
    ALTER TABLE public.messages
      ADD COLUMN IF NOT EXISTS thread_id uuid references public.messages(id),
      ADD COLUMN IF NOT EXISTS reply_count integer default 0;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- Then create the trigger function
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.thread_id IS NOT NULL THEN
    UPDATE messages
    SET reply_count = (
      SELECT COUNT(*)
      FROM messages
      WHERE thread_id = NEW.thread_id
    )
    WHERE id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_reply_count_trigger ON messages;

-- Create trigger
CREATE TRIGGER update_reply_count_trigger
AFTER INSERT OR DELETE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_reply_count();
