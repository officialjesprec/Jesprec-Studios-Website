-- Jesprec Studios Content Infrastructure
-- Run this in your Supabase SQL Editor

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  vault text not null,
  image_url text not null,
  description text not null,
  tags text[] default array[]::text[],
  case_study jsonb default '{}'::jsonb
);

-- 2. Create Gallery Items Table
create table if not exists public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  category text not null,
  price text not null,
  image_url text not null,
  stock_count integer default 10,
  is_sold_out boolean default false
);

-- 3. Create Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  item_id uuid references public.gallery_items(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  quantity integer default 1,
  delivery_type text not null, -- 'doorstep' or 'bus_park'
  delivery_details text, -- Legacy/General
  house_number text,
  street text,
  city text,
  state text,
  landmark text,
  landmark_description text,
  park_name text,
  delivery_fee numeric default 0,
  vat numeric default 0,
  processing_fee numeric default 0,
  total_price text not null,
  status text default 'pending', -- 'pending', 'paid', 'shipped', 'completed'
  payment_reference text
);

-- 4. Create Delivery Fees Table
create table if not exists public.delivery_fees (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  state text not null,
  park_name text not null,
  fee numeric not null,
  unique(state, park_name)
);

-- 5. Create Leads Table (for SmartQuote)

-- 4. Create Leads Table (for SmartQuote)
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  budget text,
  timeline text,
  details jsonb default '{}'::jsonb,
  status text default 'new'
);

-- 4. Enable RLS
alter table public.projects enable row level security;
alter table public.gallery_items enable row level security;
alter table public.leads enable row level security;

-- 5. Policies: Cleanup Existing (To prevent "already exists" errors)
drop policy if exists "Public Read Projects" on public.projects;
drop policy if exists "Public Read Gallery" on public.gallery_items;
drop policy if exists "Anonymous Insert Projects" on public.projects;
drop policy if exists "Anonymous Insert Gallery" on public.gallery_items;
drop policy if exists "Admin All Projects" on public.projects;
drop policy if exists "Admin All Gallery" on public.gallery_items;
drop policy if exists "Admin All Leads" on public.leads;
drop policy if exists "Anonymous Submit Leads" on public.leads;
drop policy if exists "Anonymous Insert Orders" on public.orders;
drop policy if exists "Admin All Orders" on public.orders;
drop policy if exists "Public Read Delivery Fees" on public.delivery_fees;
drop policy if exists "Admin All Delivery Fees" on public.delivery_fees;

-- 6. Policies: Public Read Access
create policy "Public Read Projects" on public.projects for select using (true);
create policy "Public Read Gallery" on public.gallery_items for select using (true);

-- 7. Policies: Anonymous Insert (Needed for initial sync utility)
create policy "Anonymous Insert Projects" on public.projects for insert with check (true);
create policy "Anonymous Insert Gallery" on public.gallery_items for insert with check (true);

-- 8. Policies: Admin Full Access (Authenticated)
create policy "Admin All Projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admin All Gallery" on public.gallery_items for all using (auth.role() = 'authenticated');
create policy "Admin All Leads" on public.leads for all using (auth.role() = 'authenticated');
create policy "Admin All Orders" on public.orders for all using (auth.role() = 'authenticated');
create policy "Public Read Delivery Fees" on public.delivery_fees for select using (true);
create policy "Admin All Delivery Fees" on public.delivery_fees for all using (auth.role() = 'authenticated');

-- 9. Policy for anonymous submissions
create policy "Anonymous Submit Leads" on public.leads for insert with check (true);
create policy "Anonymous Insert Orders" on public.orders for insert with check (true);

-- 9. INITIAL DATA SEED (Optional: Run this to skip the sync tool)
INSERT INTO public.projects (title, vault, image_url, description, tags, case_study)
VALUES 
('QuickVend', 'Digital Vault', 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800', 'Empowering Nigerian Local Vendors with Mobile-First Sales Management.', ARRAY['React Native', 'NativeWind', 'Fintech'], '{"challenge": "Local vendors in Nigeria struggle to track credit, debt, and daily profits accurately using paper ledgers.", "strategy": "We developed a high-performance React Native application focused on a 10-second sale entry flow.", "result": "An intuitive interface that allows a vendor to record a sale in under 10 seconds.", "references": []}'),
('SkillBridge Africa', 'Digital Vault', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800', 'Bridging the Gap Between Trainers and Tech Learners Across the Continent.', ARRAY['Full-Stack', 'LMS', 'Next.js'], '{"challenge": "Specialized trainers in Africa lack a centralized platform to showcase their portfolios.", "strategy": "Engineered a robust Trainer Profile system with integrated repository links and automated deployment tracking.", "result": "Developed a comprehensive ecosystem that facilitates seamless trainer-to-learner interactions.", "references": []}'),
('The Visual Vault: Lagos Pulse', 'Visual Vault', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', 'Cinematic storytelling through high-octane event coverage and drone cinematography.', ARRAY['Drone', '4K Video', 'Editing'], '{"challenge": "Traditional event coverage lacked the cinematic scale needed to match the prestige of modern Lagos summits.", "strategy": "Utilized high-altitude drone maneuvers and synchronized multi-cam 4K feeds to create an immersive \"Live Reel\" experience.", "result": "Delivered a 60-second high-energy sizzle reel that boosted client engagement by 45% on social platforms.", "references": []}');
