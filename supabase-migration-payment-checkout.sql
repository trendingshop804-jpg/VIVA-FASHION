-- =====================================================
-- VIVA FASHION — Payment Checkout Migration
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- Fixes:
--   1. Guest checkout orders were rejected by RLS
--      (console showed: "new row violates row-level security
--      policy for table orders"), so orders only saved locally.
--   2. payment_settings table was missing (404 on every page load;
--      Admin > Settings payment toggles could not sync to the cloud).
--
-- Idempotent: safe to run multiple times.
-- =====================================================

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

-- Public may read the store's enabled methods (no secrets stored here)
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
