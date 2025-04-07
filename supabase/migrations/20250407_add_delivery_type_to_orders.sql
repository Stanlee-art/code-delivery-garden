
-- Add delivery_type column to the orders table
ALTER TABLE IF EXISTS public.orders 
ADD COLUMN IF NOT EXISTS delivery_type text;
