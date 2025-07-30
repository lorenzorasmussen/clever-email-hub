-- Add missing columns to emails table
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS preview TEXT;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS time TIMESTAMP WITH TIME ZONE DEFAULT created_at;

-- Add missing columns to calendar_events table  
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'event';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue';

-- Update time column to be computed from created_at if null
UPDATE public.emails SET time = created_at WHERE time IS NULL;