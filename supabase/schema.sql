-- ==========================================
-- AICURA DIAGNOSTICS SUPABASE SQL SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  test_count INTEGER NOT NULL,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  description TEXT,
  included_tests TEXT[],
  is_popular BOOLEAN DEFAULT false,
  badge_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. DIAGNOSTIC TESTS TABLE
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  sample_type TEXT DEFAULT 'Blood',
  fasting_required BOOLEAN DEFAULT false,
  report_turnaround TEXT DEFAULT '24 Hours',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. BANNERS & PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_primary_text TEXT DEFAULT 'Enquire for a Test',
  cta_primary_link TEXT DEFAULT '#enquire',
  cta_secondary_text TEXT DEFAULT 'View Health Packages',
  cta_secondary_link TEXT DEFAULT '/packages',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. PATIENT ENQUIRIES & HOME COLLECTION BOOKINGS
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'test', 'package', 'home_collection', 'prescription'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  selected_item TEXT,
  prescription_url TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. BLOGS & HEALTH INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  read_time TEXT DEFAULT '5 min read',
  author TEXT DEFAULT 'AiCura Medical Team',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_published BOOLEAN DEFAULT true
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  location TEXT,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ POLICIES
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for website content
CREATE POLICY "Allow public read packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public read tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Allow public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (true);

-- Allow Public Insert for Enquiries & Home Collection Bookings
CREATE POLICY "Allow public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies (Authenticated Users)
CREATE POLICY "Allow auth all packages" ON public.packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all tests" ON public.tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all banners" ON public.banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all blogs" ON public.blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
