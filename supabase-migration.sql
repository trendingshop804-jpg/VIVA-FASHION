-- =====================================================
-- VIVA FASHION - Migration: Payment Checkout + Admin Login
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- Every section runs inside its own error guard:
--   * if one section fails, the other sections still apply
--   * a failure is reported in the output panel as a "NOTICE:" line
--
-- After running, copy the ENTIRE output (including every NOTICE line).
--
-- Sections:
--   1. Allow guest/customer checkout order inserts (RLS)
--   2. Create payment_settings table (admin payment toggles)
--   3. profiles fixes (updated_at column + self-read/insert policies)
--   4. Create admin login: admin@vivafashion.com / admin123
-- =====================================================


-- ---------------------------------------------------
-- SECTION 1 - orders: allow checkout inserts
-- (existing admin-only UPDATE/DELETE policies unchanged)
-- ---------------------------------------------------
DO $do$
BEGIN
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

  RAISE NOTICE 'SECTION 1 OK - orders insert policy created';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'SECTION 1 FAILED [%]: %', SQLSTATE, SQLERRM;
END $do$;


-- ---------------------------------------------------
-- SECTION 2 - payment_settings table
-- Columns match src/services/storeService.ts
-- fetchPaymentSettings() / savePaymentSettings()
-- ---------------------------------------------------
DO $do$
BEGIN
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

  RAISE NOTICE 'SECTION 2 OK - payment_settings created and seeded';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'SECTION 2 FAILED [%]: %', SQLSTATE, SQLERRM;
END $do$;


-- ---------------------------------------------------
-- SECTION 3 - profiles: align with the columns the app uses
-- ---------------------------------------------------
DO $do$
BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

  -- Signed-in users can read their own profile row
  DROP POLICY IF EXISTS "profiles_self_select_v2" ON profiles;
  CREATE POLICY "profiles_self_select_v2" ON profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

  -- Signed-in users can create their own profile row (signup fallback)
  DROP POLICY IF EXISTS "profiles_insert_own_v2" ON profiles;
  CREATE POLICY "profiles_insert_own_v2" ON profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

  -- Admins (JWT app_metadata.role = 'admin', same claim the app's #admin
  -- gate checks) can read every profile so the Admin Users tab can list
  -- and manage all administrators, not only their own row.
  -- Uses auth.jwt() instead of a profiles subquery to avoid recursive RLS.
  DROP POLICY IF EXISTS "profiles_admin_read_all" ON profiles;
  CREATE POLICY "profiles_admin_read_all" ON profiles
    FOR SELECT TO authenticated
    USING ((COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');

  RAISE NOTICE 'SECTION 3 OK - profiles column and policies applied';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'SECTION 3 FAILED [%]: %', SQLSTATE, SQLERRM;
END $do$;


-- ---------------------------------------------------
-- SECTION 4 - Admin login bootstrap (Supabase Auth)
-- Creates or resets: admin@vivafashion.com / admin123
-- with app_metadata.role = 'admin'. The app grants admin
-- access from this metadata (src/services/authService.ts),
-- so the #admin gate unlocks and survives page reloads.
-- Password stored as a bcrypt hash of "admin123".
-- ---------------------------------------------------
DO $do$
DECLARE
  v_uid uuid;
  v_email text := 'admin@vivafashion.com';
  v_hash text := '$2b$10$8aMX5T6pKrXvyV1kTvab0eMwLZCyN0e.FkNszjDIdMSc1fSA54Fgi';
BEGIN
  -- Step A: create or reset the auth user
  BEGIN
    SELECT id INTO v_uid FROM auth.users
    WHERE lower(email) = lower(v_email)
    LIMIT 1;

    IF v_uid IS NULL THEN
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        -- CRITICAL: GoTrue scans these token columns as plain Go strings.
        -- Leaving them NULL makes EVERY lookup of this user fail with
        -- "Scan error ... converting NULL to string is unsupported" (HTTP 500).
        confirmation_token, recovery_token, email_change, phone_change,
        phone_change_token, email_change_token_new, email_change_token_current,
        reauthentication_token, email_change_confirm_status
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
        'authenticated', 'authenticated', v_email, v_hash, now(),
        '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
        '{"name":"Viva Fashion Admin"}'::jsonb,
        now(), now(),
        '', '', '', '', '', '', '', '', 0
      );

      SELECT id INTO v_uid FROM auth.users
      WHERE lower(email) = lower(v_email)
      LIMIT 1;
    ELSE
      UPDATE auth.users
      SET encrypted_password = v_hash,
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
                              || '{"role":"admin"}'::jsonb,
          updated_at = now(),
          -- Heal legacy rows where these were NULL (breaks GoTrue's user scan)
          confirmation_token = COALESCE(NULLIF(confirmation_token, ''), ''),
          recovery_token     = COALESCE(NULLIF(recovery_token, ''), ''),
          email_change       = COALESCE(NULLIF(email_change, ''), ''),
          phone_change       = COALESCE(NULLIF(phone_change, ''), ''),
          phone_change_token = COALESCE(NULLIF(phone_change_token, ''), ''),
          email_change_token_new     = COALESCE(NULLIF(email_change_token_new, ''), ''),
          email_change_token_current = COALESCE(NULLIF(email_change_token_current, ''), ''),
          reauthentication_token     = COALESCE(NULLIF(reauthentication_token, ''), ''),
          email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
          raw_user_meta_data = COALESCE(raw_user_meta_data, jsonb_build_object(
            'sub', id::text, 'email', email, 'email_verified', true, 'phone_verified', false))
      WHERE id = v_uid;
    END IF;

    RAISE NOTICE 'SECTION 4 step A OK - auth user %', v_uid;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'SECTION 4 step A FAILED [%]: %', SQLSTATE, SQLERRM;
  END;

  IF v_uid IS NOT NULL THEN
    -- Step B: email/password identity row (required by newer GoTrue versions)
    BEGIN
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
      RAISE NOTICE 'SECTION 4 step B OK - identity row ready';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'SECTION 4 step B FAILED [%]: %', SQLSTATE, SQLERRM;
    END;

    -- Step C: profile row (display name + Admin > Users listing)
    BEGIN
      INSERT INTO profiles (id, full_name, email, role, status, created_at)
      VALUES (v_uid, 'Viva Fashion Admin', v_email, 'admin', 'active', now())
      ON CONFLICT (id) DO UPDATE
        SET full_name = 'Viva Fashion Admin',
            email = EXCLUDED.email,
            role = 'admin',
            status = 'active';
      RAISE NOTICE 'SECTION 4 step C OK - profile row ready';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'SECTION 4 step C FAILED [%]: %', SQLSTATE, SQLERRM;
    END;
  ELSE
    RAISE NOTICE 'SECTION 4: auth user missing - steps B and C skipped';
  END IF;

  RAISE NOTICE 'SECTION 4 FINISHED - login is admin@vivafashion.com / admin123';
END $do$;

-- ---------------------------------------------------
-- SECTION 5 - Customer order cancellation / return (self-service)
-- Lets a signed-in customer cancel their own order before it ships, or
-- request a return once delivered. SECURITY DEFINER so the orders RLS does
-- not block the customer UPDATE; ownership and allowed transitions are
-- validated inside the body, and only order_status is ever written.
-- Consumed by StoreService.updateOrderStatus() via supabase.rpc(
-- 'customer_order_status_change', ...). The app falls back to a direct
-- UPDATE (admin sessions) while this function is absent.
-- ---------------------------------------------------
DO $do$
BEGIN
  CREATE OR REPLACE FUNCTION public.customer_order_status_change(
    p_order_id uuid,
    p_new_status text
  )
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $fn$
  DECLARE
    v_profile_email text;
    v_order public.orders%ROWTYPE;
  BEGIN
    -- 1) Caller must be a signed-in user with a profile row
    SELECT lower(email) INTO v_profile_email
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_profile_email IS NULL THEN
      RAISE EXCEPTION 'Not signed in';
    END IF;

    -- 2) Lock the order row while validating
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Order not found';
    END IF;

    -- 3) Ownership: order email must match the caller's profile email
    IF lower(COALESCE(v_order.customer_email, '')) <> v_profile_email THEN
      RAISE EXCEPTION 'Not your order';
    END IF;

    -- 4) Allowed customer transitions
    IF p_new_status = 'Cancelled'
       AND v_order.order_status IN ('Pending','Confirmed','Processing','Packed') THEN
      UPDATE public.orders
        SET order_status = 'Cancelled', updated_at = now()
        WHERE id = p_order_id;
    ELSIF p_new_status = 'Returned'
       AND v_order.order_status = 'Delivered' THEN
      UPDATE public.orders
        SET order_status = 'Returned', updated_at = now()
        WHERE id = p_order_id;
    ELSE
      RAISE EXCEPTION 'Order cannot change from % to %', v_order.order_status, p_new_status;
    END IF;

    RETURN jsonb_build_object('order_id', p_order_id, 'order_status', p_new_status);
  END;
  $fn$;

  -- Only signed-in customers/admins may execute; no anon, no PUBLIC
  REVOKE ALL ON FUNCTION public.customer_order_status_change(uuid, text) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.customer_order_status_change(uuid, text) TO authenticated;

  RAISE NOTICE 'SECTION 5 OK - customer cancel/return RPC created';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'SECTION 5 FAILED [%]: %', SQLSTATE, SQLERRM;
END $do$;
