-- Supabase Database Schema for Viva Fashion Ethnic
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. site_settings table (for CMS configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  cod_fee NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'cashfree', 'razorpay')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (order_status IN ('Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  items JSONB NOT NULL,
  cashfree_order_id TEXT,
  cashfree_payment_session_id TEXT,
  cashfree_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_id TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. products table (optional - if you want to store products in DB instead of localStorage)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  brand TEXT,
  category TEXT NOT NULL CHECK (category IN ('kurtis', 'shawls', 'leggings')),
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  original_price NUMERIC(10,2),
  stock INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  image TEXT,
  secondary_image TEXT,
  images TEXT[],
  tag TEXT,
  colors JSONB,
  sizes TEXT[],
  description TEXT,
  fabric TEXT,
  fit TEXT,
  sleeve_type TEXT,
  length TEXT,
  neck_type TEXT,
  pattern TEXT,
  occasion TEXT,
  work_embroidery TEXT,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sale BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- site_settings: Allow anon read for published_config, admin full access
CREATE POLICY "Public read published config" ON site_settings
  FOR SELECT USING (id = 'published_config');

CREATE POLICY "Admin full access site_settings" ON site_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- customers: Users can read their own, admins can read all
CREATE POLICY "Users read own customer data" ON customers
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Admin full access customers" ON customers
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- orders: Users can read their own orders, admins full access
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (customer_email = (SELECT email FROM profiles WHERE id = auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- coupons: Public read active coupons, admin full access
CREATE POLICY "Public read active coupons" ON coupons
  FOR SELECT USING (is_active = TRUE AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

CREATE POLICY "Admin full access coupons" ON coupons
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- reviews: Public read approved, users insert own, admin full access
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Admin full access reviews" ON reviews
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- products: Public read active, admin full access
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'active')
  );

-- Insert default site_settings rows
INSERT INTO site_settings (id, config) VALUES
  ('published_config', '{}'::jsonb),
  ('draft_config', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;