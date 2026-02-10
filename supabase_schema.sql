
-- Create leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  project_type text not null, -- 'MEDIA', 'DIGITAL', 'SOCIAL', 'ART'
  budget text,
  timeline text,
  specifics jsonb, -- Stores dynamic fields like 'tech', 'nature', 'guests', etc.
  status text default 'NEW'
);

-- Enable potentially needed RLS (Row Level Security)
alter table public.leads enable row level security;

-- Allow anonymous inserts (since it's a public form)
create policy "Allow public inserts"
on public.leads
for insert
to anon, authenticated
with check (true);

-- Allow only authenticated (admins) to view leads
create policy "Allow admins to view leads"
on public.leads
for select
to authenticated
using (true);
