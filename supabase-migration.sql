-- =====================================================
-- VIVA FASHION — Migration: Payment Checkout + Admin Login
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- Safe to run multiple times (idempotent).
--
-- Fixes:
--   1. Guest checkout orders were rejected by RLS
--      (browser console showed: "new row violates row-level
--      security policy for table orders"), so orders only ever
--      saved to browser localStorage.
--   2. payment_settings table was missing (404 on every page
--      load; Admin > Settings payment toggles could not sync).
--   3. profiles column/policy gaps (full_name vs name, missing
--      updated_at column, no self-read policy for signed-in users).
--   4. No Supabase Auth admin user existed, so the #admin gate
--      could never log in. Creates admin@vivafashion.com /
--      admin123 with role = admin (demo credentials — change the
--      password after first login if this store goes live).
-- =====================================================

-- ---------------------------------------------------
-- 0. Extension used for password hashing below
-- ---------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------
-- 1. Allow checkout order inserts (guest/anon + customer)
--    Admin-only UPDATE/DELETE policies remain unchanged.
-- ---------------------------------------------------
DROP POLICY IF EXISTS "Insert checkout orders" ON orders;

CREATE POLICY "Insert checkout orders" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL
    AND customer_email IS NOT NULL
    AND payment_method IN ('cod', 'cashfree', 'razorpay')
    AND payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')
    AND order_status IN ('Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')
    AND subtotal >= 0
    AND total >= 0
  );

-- ---------------------------------------------------
-- 2. payment_settings table (non-secret store config)
--    Column names match src/services/storeService.ts
--    fetchPaymentSettings() / savePaymentSettings().
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_settings (
  id TEXT PRIMARY KEY,
  cashfree_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  razorpay_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  cod_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  cod_fee NUMERIC(10,2) NOT NULL DEFAULT 49,
  min_cod_amount NUMERIC(10,2) NOT NULL DEFAULT 299,
  max_cod_amount NUMERIC(10,2) NOT NULL DEFAULT 10000,
  cashfree_app_id TEXT,
  cashfree_environment TEXT NOT NULL DEFAULT 'sandbox',
  razorpay_key_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Storefront may read which methods are enabled (no secrets stored here)
DROP POLICY IF EXISTS "Public read payment settings" ON payment_settings;
CREATE POLICY "Public read payment settings" ON payment_settings
  FOR SELECT USING (id = 'default');

-- Admins manage payment configuration
DROP POLICY IF EXISTS "Admin full access payment_settings" ON payment_settings;
CREATE POLICY "Admin full access payment_settings" ON payment_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
        AND profiles.status = 'active'
    )
  );

-- Default row: Razorpay + COD enabled, Cashfree disabled (matches app defaults)
INSERT INTO payment_settings (id, cashfree_enabled, razorpay_enabled, cod_enabled)
VALUES ('default', FALSE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------
-- 3. profiles: align with the columns the app uses
-- ---------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Signed-in users can read their own profile row
DROP POLICY IF EXISTS "profiles_self_select_v2" ON profiles;
CREATE POLICY "profiles_self_select_v2" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Signed-in users can create their own profile row (signup fallback)
DROP POLICY IF EXISTS "profiles_insert_own_v2" ON profiles;
CREATE POLICY "profiles_insert_own_v2" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------
-- 4. Admin login bootstrap (Supabase Auth)
--    Creates or resets: admin@vivafashion.com / admin123
--    with app_metadata.role = 'admin' — src/services/authService.ts
--    grants admin access from this metadata, and the gate survives
--    page reloads because of it.
-- ---------------------------------------------------
DO $$
DECLARE
  v_uid uuid;
  v_email text := 'admin@vivafashion.com';
  v_pass text := 'admin123';
BEGIN
  SELECT id INTO v_uid FROM auth.users
  WHERE lower(email) = lower(v_email)
    AND instance_id = '00000000-0000-0000-0000-000000000000';

  IF v_uid IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
      'authenticated', 'authenticated', v_email,
      crypt(v_pass, gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      '{"name":"Viva Fashion Admin"}'::jsonb,
      now(), now()
    );

    SELECT id INTO v_uid FROM auth.users
    WHERE lower(email) = lower(v_email)
      AND instance_id = '00000000-0000-0000-0000-000000000000';
  ELSE
    -- Existing user: make sure the demo password + admin metadata work
    UPDATE auth.users
    SET encrypted_password = crypt(v_pass, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
                            || '{"role":"admin"}'::jsonb,
        updated_at = now()
    WHERE id = v_uid;
  END IF;

  -- Email/password identity row (required by newer GoTrue versions)
  IF NOT EXISTS (
    SELECT 1 FROM auth.identities
    WHERE user_id = v_uid AND provider = 'email'
  ) THEN
    INSERT INTO auth.identities (
      id, user_id, provider, provider_id, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_uid, 'email', v_uid::text,
      jsonb_build_object(
        'sub', v_uid::text,
        'email', lower(v_email),
        'email_verified', true
      ),
      now(), now(), now()
    );
  END IF;

  -- Profile row (display name + Admin > Users listing)
  INSERT INTO profiles (id, full_name, email, role, status, created_at)
  VALUES (v_uid, 'Viva Fashion Admin', v_email, 'admin', 'active', now())
  ON CONFLICT (id) DO UPDATE
    SET full_name = 'Viva Fashion Admin',
        email = EXCLUDED.email,
        role = 'admin',
        status = 'active';
END $$;
