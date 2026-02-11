-- Social Media Services Migration
-- Run this in your Supabase SQL Editor

-- 1. Create Social Packages Table
create table if not exists public.social_packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null, -- e.g., "Bronze", "Real Followers"
  category text not null, -- 'management', 'growth_metric', 'bundle'
  platform text not null, -- 'instagram', 'youtube', 'tiktok', 'facebook', 'x', 'linkedin', 'spotify', 'other'
  service_type text not null, -- 'followers', 'likes', 'views', 'subscribers', 'verified_comments', 'watch_hours'
  audience_type text default 'worldwide', -- 'nigeria', 'worldwide', 'mixed'
  unit_price numeric not null, -- Price per 1 unit (or fixed price for management)
  min_quantity integer default 100,
  max_quantity integer default 100000,
  features jsonb default '[]'::jsonb, -- Array of strings features
  is_active boolean default true
);

-- 2. Create Social Orders Table
create table if not exists public.social_orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  package_id uuid references public.social_packages(id),
  quantity integer, -- For growth metrics
  total_price numeric not null,
  target_link text not null, -- Profile or Post URL
  status text default 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
  payment_status text default 'unpaid', -- 'paid', 'unpaid'
  receipt_url text,
  details jsonb default '{}'::jsonb -- For storing initial count, goal, etc.
);

-- 3. Enable RLS
alter table public.social_packages enable row level security;
alter table public.social_orders enable row level security;

-- 4. Policies for Social Packages
-- Public read access (so frontend can fetch prices)
create policy "Public Read Social Packages" on public.social_packages for select using (true);
-- Admin full access
create policy "Admin All Social Packages" on public.social_packages for all using (auth.role() = 'authenticated');

-- 5. Policies for Social Orders
-- Public insert (for creating orders)
create policy "Public Insert Social Orders" on public.social_orders for insert with check (true);
-- Individual read access (if we had user accounts for customers, strictly strictly limited for now)
-- Admin full access
create policy "Admin All Social Orders" on public.social_orders for all using (auth.role() = 'authenticated');

-- 6. Seed Initial Data (Examples)
INSERT INTO public.social_packages (name, category, platform, service_type, audience_type, unit_price, min_quantity, features) VALUES
('Nigerian Real Followers', 'growth_metric', 'instagram', 'followers', 'nigeria', 25.00, 100, '["Real Nigerian Accounts", "High Retention", "Organic-Safe"]'),
('Global Views', 'growth_metric', 'tiktok', 'views', 'worldwide', 1.50, 1000, '["Instant Start", "For You Page Boost"]'),
('Bronze Management', 'management', 'all', 'subscription', 'worldwide', 50000, 1, '["1k Monthly Followers", "12 Posts Scheduled", "Basic Reporting"]'),
('Silver Management', 'management', 'all', 'subscription', 'worldwide', 100000, 1, '["Growth + Content Scheduling", "Community Engagement", "Monthly Audits"]'),
('Gold (Agency Pro)', 'management', 'all', 'subscription', 'worldwide', 250000, 1, '["Full Content Creation (1 Shoot)", "Daily Posting", "Growth Acceleration", "Priority Support"]');
