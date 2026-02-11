-- 1. Create Delivery Fees Table
CREATE TABLE IF NOT EXISTS public.delivery_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state TEXT NOT NULL,
    park_name TEXT NOT NULL,
    fee INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(state, park_name)
);

-- 2. Create Orders Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  item_id UUID, -- Optional foreign key if you want to enforce it: REFERENCES public.gallery_items(id)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  quantity INTEGER DEFAULT 1,
  delivery_type TEXT NOT NULL, -- 'doorstep' or 'bus_park'
  delivery_details TEXT,
  house_number TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  landmark TEXT,
  landmark_description TEXT,
  park_name TEXT,
  delivery_fee NUMERIC DEFAULT 0,
  vat NUMERIC DEFAULT 0,
  processing_fee NUMERIC DEFAULT 0,
  total_price TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'completed'
  payment_reference TEXT
);

-- 3. Add columns to orders table if they are missing (for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE public.orders ADD COLUMN customer_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'house_number') THEN
        ALTER TABLE public.orders ADD COLUMN house_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'street') THEN
        ALTER TABLE public.orders ADD COLUMN street TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'city') THEN
        ALTER TABLE public.orders ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'state') THEN
        ALTER TABLE public.orders ADD COLUMN state TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'landmark') THEN
        ALTER TABLE public.orders ADD COLUMN landmark TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'landmark_description') THEN
        ALTER TABLE public.orders ADD COLUMN landmark_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'park_name') THEN
        ALTER TABLE public.orders ADD COLUMN park_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_fee') THEN
        ALTER TABLE public.orders ADD COLUMN delivery_fee NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'vat') THEN
        ALTER TABLE public.orders ADD COLUMN vat NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'processing_fee') THEN
        ALTER TABLE public.orders ADD COLUMN processing_fee NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 4. Enable Row Level Security
ALTER TABLE public.delivery_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for delivery_fees
-- Allow public read access (so customers can see fees in the gallery)
DROP POLICY IF EXISTS "Allow public read access on delivery_fees" ON public.delivery_fees;
CREATE POLICY "Allow public read access on delivery_fees" 
ON public.delivery_fees FOR SELECT 
TO public 
USING (true);

-- Allow authenticated admins to do everything
DROP POLICY IF EXISTS "Allow admin all access on delivery_fees" ON public.delivery_fees;
CREATE POLICY "Allow admin all access on delivery_fees" 
ON public.delivery_fees FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. Update Policies for orders
-- Update insertion policy to allow public customers to create orders
DROP POLICY IF EXISTS "Allow public to insert orders" ON public.orders;
CREATE POLICY "Allow public to insert orders" 
ON public.orders FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin all access on orders" ON public.orders;
CREATE POLICY "Allow admin all access on orders" 
ON public.orders FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
