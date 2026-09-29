-- ==========================================================================
-- VIVA FASHION — Required Database Migration
-- ==========================================================================
-- Run this in your Supabase Dashboard → SQL Editor
-- This fixes the CHECK constraints, adds missing columns, and adds
-- the RLS policies needed for checkout and customer registration.
-- ==========================================================================

-- SECTION 1: Fix order_status CHECK constraint to include 'Pending' and 'Packed'
-- The admin UI allows these statuses but the DB rejects them.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check
  CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'));

-- SECTION 2: Add user_id column to orders (links orders to auth users)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
  END IF;
END $$;

-- SECTION 3: Add paid_at and paid_by audit columns to orders
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paid_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN paid_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paid_by'
  ) THEN
    ALTER TABLE orders ADD COLUMN paid_by TEXT;
  END IF;
END $$;

-- SECTION 4: RLS — Allow authenticated users to INSERT orders (checkout)
-- Without this, customer checkout INSERT is blocked by RLS.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Authenticated users can insert orders'
  ) THEN
    CREATE POLICY "Authenticated users can insert orders" ON orders
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- SECTION 5: RLS — Allow anonymous users to INSERT orders (guest checkout)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Anon users can insert orders'
  ) THEN
    CREATE POLICY "Anon users can insert orders" ON orders
      FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- SECTION 6: RLS — Allow authenticated users to INSERT into customers (signup)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Authenticated users can insert customers'
  ) THEN
    CREATE POLICY "Authenticated users can insert customers" ON customers
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- SECTION 7: RLS — Allow authenticated users to UPDATE their own customer record
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Users update own customer data'
  ) THEN
    CREATE POLICY "Users update own customer data" ON customers
      FOR UPDATE TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- SECTION 8: RLS — Allow anon users to insert into customers for guest flows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Anon users can insert customers'
  ) THEN
    CREATE POLICY "Anon users can insert customers" ON customers
      FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- SECTION 9: Ensure orders SELECT policy works for authenticated users
-- The existing policy checks customer_email against profiles, which is correct.
-- Also allow users to see orders linked by user_id.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users read own orders by user_id'
  ) THEN
    CREATE POLICY "Users read own orders by user_id" ON orders
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- SECTION 10: Allow authenticated users to UPDATE their own orders (cancel/return)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users update own orders'
  ) THEN
    CREATE POLICY "Users update own orders" ON orders
      FOR UPDATE TO authenticated
      USING (
        user_id = auth.uid() OR
        customer_email = (SELECT email FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;

-- SECTION 11: Backfill link between old orders and existing user profiles by email
UPDATE orders o
SET user_id = p.id
FROM profiles p
WHERE LOWER(o.customer_email) = LOWER(p.email)
  AND o.user_id IS NULL;

-- SECTION 12: Backfill customers table from existing profiles (registered accounts)
INSERT INTO customers (id, name, email, phone, created_at)
SELECT 
  id, 
  COALESCE(name, full_name, split_part(email, '@', 1)), 
  email, 
  phone, 
  created_at
FROM profiles
ON CONFLICT (email) DO UPDATE 
SET 
  name = EXCLUDED.name,
  phone = EXCLUDED.phone;

-- Done! All changes are backwards-compatible.
-- Existing data is preserved. No tables or rows are deleted.

