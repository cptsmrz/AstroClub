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
