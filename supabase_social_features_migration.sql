-- Create social_features table
CREATE TABLE IF NOT EXISTS public.social_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    unit_price NUMERIC NOT NULL, -- Price per 1 unit
    min_qty INTEGER DEFAULT 1,
    category TEXT NOT NULL, -- e.g. 'Engagement', 'Content', 'Strategy'
    icon TEXT, -- React icon name or URL
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.social_features ENABLE ROW LEVEL SECURITY;

-- Create policies (Public read, Admin all)
DROP POLICY IF EXISTS "Public items are viewable by everyone" ON public.social_features;
CREATE POLICY "Public items are viewable by everyone" 
ON public.social_features FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can insert features" ON public.social_features;
CREATE POLICY "Admins can insert features" 
ON public.social_features FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update features" ON public.social_features;
CREATE POLICY "Admins can update features" 
ON public.social_features FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete features" ON public.social_features;
CREATE POLICY "Admins can delete features" 
ON public.social_features FOR DELETE 
USING (auth.role() = 'authenticated');
