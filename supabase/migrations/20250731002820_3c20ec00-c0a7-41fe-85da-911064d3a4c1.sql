-- Fix security warnings by setting proper search paths for functions

-- Update the email time trigger function with proper search path
CREATE OR REPLACE FUNCTION set_email_time()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.time IS NULL THEN
    NEW.time = NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

-- Update the existing update_updated_at_column function with proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;