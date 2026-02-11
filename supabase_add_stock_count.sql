-- Add stock_count column to gallery_items if it doesn't exist
ALTER TABLE public.gallery_items
ADD COLUMN IF NOT EXISTS stock_count integer default 1;
