-- Fix Foreign Key Constraints for Cascading Deletes

-- 1. Drop existing foreign keys
ALTER TABLE public.social_orders
DROP CONSTRAINT IF EXISTS social_orders_package_id_fkey;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_item_id_fkey;

-- 2. Re-add foreign keys with ON DELETE CASCADE
ALTER TABLE public.social_orders
ADD CONSTRAINT social_orders_package_id_fkey
FOREIGN KEY (package_id)
REFERENCES public.social_packages(id)
ON DELETE CASCADE;

ALTER TABLE public.orders
ADD CONSTRAINT orders_item_id_fkey
FOREIGN KEY (item_id)
REFERENCES public.gallery_items(id)
ON DELETE CASCADE;
