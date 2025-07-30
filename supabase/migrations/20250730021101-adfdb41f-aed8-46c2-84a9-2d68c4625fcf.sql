-- Add missing columns to emails table
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS preview TEXT;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS time TIMESTAMP WITH TIME ZONE;

-- Add missing columns to calendar_events table  
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'event';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue';

-- Create a trigger to set time = created_at for new records
CREATE OR REPLACE FUNCTION set_email_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.time IS NULL THEN
    NEW.time = NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_email_time_trigger
  BEFORE INSERT OR UPDATE ON public.emails
  FOR EACH ROW EXECUTE FUNCTION set_email_time();

-- Update existing records to set time = created_at where time is null
UPDATE public.emails SET time = created_at WHERE time IS NULL;