-- =========================================================================
-- ASTROCLUB SYSTEM UPGRADE SCHEMA
-- Execute these queries in your Supabase SQL Editor (https://supabase.com)
-- =========================================================================

-- 1. Create designated administrative approvers table
CREATE TABLE IF NOT EXISTS public.system_approvers (
  role TEXT PRIMARY KEY,
  designated_email TEXT UNIQUE NOT NULL
);

-- Seed the initial 5 administrative slots
INSERT INTO public.system_approvers (role, designated_email) VALUES
  ('president', 'president@gla.ac.in'),
  ('vp', 'vp@gla.ac.in'),
  ('gs', 'gs@gla.ac.in'),
  ('tech_head', 'tech_head@gla.ac.in'),
  ('advisory_head', 'advisor@gla.ac.in')
ON CONFLICT (role) DO UPDATE SET designated_email = EXCLUDED.designated_email;

-- 2. Expand profiles with role, status, and secondary email columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'guest',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved', -- 'approved', 'pending_approval', 'restricted'
  ADD COLUMN IF NOT EXISTS secondary_email TEXT;

-- 3. Create role application queue for GLA students
CREATE TABLE IF NOT EXISTS public.role_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  requested_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Modify blog author foreign key constraint to retain posts on account deletion
ALTER TABLE public.blogs 
  DROP CONSTRAINT IF EXISTS blogs_author_id_fkey,
  DROP CONSTRAINT IF EXISTS blogs_author_profile_fkey,
  ADD CONSTRAINT blogs_author_profile_fkey 
    FOREIGN KEY (author_id) 
    REFERENCES public.profiles(id) 
    ON DELETE SET NULL;

-- 4. Create security reports table for S.AI moderation flags
CREATE TABLE IF NOT EXISTS public.security_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  incident_type TEXT NOT NULL, -- e.g. 'nudity_detected'
  report_details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Update blogs table for multi-image uploads and S.AI moderation states
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS edit_allowed_until TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS contributor_type TEXT,
  ADD COLUMN IF NOT EXISTS contributor_name TEXT,
  ADD COLUMN IF NOT EXISTS contributor_email TEXT,
  ALTER COLUMN status SET DEFAULT 'draft'; -- 'draft', 'published', 'flagged_review'

-- 7. Add preferred date, group size, and purpose to session_requests
ALTER TABLE public.session_requests
  ADD COLUMN IF NOT EXISTS preferred_date TEXT,
  ADD COLUMN IF NOT EXISTS group_size TEXT,
  ADD COLUMN IF NOT EXISTS purpose TEXT;

-- 8. Add description and availability_status to telescopes
ALTER TABLE public.telescopes
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'in_service';

-- 9. Create database-level role-synchronization trigger
CREATE OR REPLACE FUNCTION public.handle_user_role_elevation()
RETURNS TRIGGER AS $$
DECLARE
  matching_role TEXT;
BEGIN
  -- Search for matching email in system_approvers
  SELECT role INTO matching_role 
  FROM public.system_approvers 
  WHERE designated_email = NEW.email;

  -- Elevate role if matched
  IF matching_role IS NOT NULL THEN
    NEW.role := matching_role;
    NEW.status := 'approved';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to profiles table
DROP TRIGGER IF EXISTS tr_elevate_user_role ON public.profiles;
CREATE TRIGGER tr_elevate_user_role
  BEFORE INSERT OR UPDATE OF email ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_elevation();

-- 10. Database-backed rate limits fallback table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  ip TEXT PRIMARY KEY,
  count INT DEFAULT 1,
  window_start BIGINT NOT NULL
);

-- =========================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.session_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telescopes ENABLE ROW LEVEL SECURITY;

-- session_requests: Public can insert, only admins/service role can view/modify
CREATE POLICY "Allow public insert" ON public.session_requests FOR INSERT WITH CHECK (true);

-- blogs: Public can view published, authenticated can insert, authors can update own
CREATE POLICY "Allow public read published" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Allow authenticated insert" ON public.blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow author update" ON public.blogs FOR UPDATE USING (auth.uid() = author_id);

-- profiles: Users can view and update their own profiles
CREATE POLICY "Allow users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- system_approvers: Public can view to know who admins are (or just authenticated)
CREATE POLICY "Allow read only" ON public.system_approvers FOR SELECT USING (true);

-- security_reports: No public policies, service role only

-- role_applications: Authenticated users can insert and view their own applications
CREATE POLICY "Allow authenticated insert own" ON public.role_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow read own" ON public.role_applications FOR SELECT USING (auth.uid() = user_id);

-- rate_limits: No public policies, service role only

-- telescopes: Public can view all telescopes
CREATE POLICY "Allow public read telescopes" ON public.telescopes FOR SELECT USING (true);

