-- Migration: Create Admin Content Tables
-- Date: 2026-02-11

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  vault text not null check (vault in ('Visual Vault', 'Digital Vault')),
  image_url text not null,
  description text not null,
  tags text[] not null default '{}',
  case_study jsonb default '{"challenge": "", "strategy": "", "result": ""}'::jsonb
);

-- 2. Create Gallery Items Table
create table if not exists public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  price text not null,
  image_url text not null,
  category text not null
);

-- 3. Enable Row Level Security
alter table public.projects enable row level security;
alter table public.gallery_items enable row level security;

-- 4. Set up Policies
-- Allow anyone (including anonymous visitors) to read content
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to projects') THEN
        create policy "Allow public read-only access to projects" on public.projects for select to anon, authenticated using (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to gallery_items') THEN
        create policy "Allow public read-only access to gallery_items" on public.gallery_items for select to anon, authenticated using (true);
    END IF;

    -- Allow authenticated users (Admins) to perform all actions
    -- In a production environment, you might restrict this to a specific 'admin' role or check auth.email()
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to manage projects') THEN
        create policy "Allow admins to manage projects" on public.projects for all to authenticated using (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to manage gallery_items') THEN
        create policy "Allow admins to manage gallery_items" on public.gallery_items for all to authenticated using (true);
    END IF;
END $$;
