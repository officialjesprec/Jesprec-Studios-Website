-- Add is_sold_out column to gallery_items if it doesn't exist
ALTER TABLE public.gallery_items
ADD COLUMN IF NOT EXISTS is_sold_out boolean default false;
