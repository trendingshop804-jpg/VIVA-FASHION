# Supabase Integration Guide

Complete guide for setting up and using Supabase with VIVA-FASHION.

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Database Schema](#database-schema)
3. [Authentication](#authentication)
4. [CRUD Operations](#crud-operations)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [Error Handling](#error-handling)

---

## Environment Setup

### 1. Create `.env.local` file

Copy `.env.example` and create `.env.local` in your project root:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Get Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to **Settings → API**
4. Copy your **Project URL** and **Anon Key**
5. Add them to `.env.local`

---

## Database Schema

Create these tables in your Supabase dashboard using the SQL editor:

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
```

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
```

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

### Wishlist Table

```sql
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add RLS policies
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);
```

---

## Authentication

### Sign Up

```typescript
import { AuthService } from './services/authService';

const result = await AuthService.signUp({
  email: 'user@example.com',
  password: 'secure_password',
  name: 'John Doe',
  phone: '+1234567890',
});

if (result.success) {
  console.log('User created:', result.user);
  console.log('Profile:', result.profile);
} else {
  console.error('Sign up failed:', result.error);
}
```

### Sign In

```typescript
const result = await AuthService.signIn({
  email: 'user@example.com',
  password: 'secure_password',
});

if (result.success) {
  console.log('Logged in:', result.user);
  console.log('Profile:', result.profile);
} else {
  console.error('Login failed:', result.error);
}
```

### Sign Out

```typescript
const result = await AuthService.signOut();

if (result.success) {
  console.log('Logged out successfully');
}
```

### Reset Password

```typescript
const result = await AuthService.resetPassword('user@example.com');

if (result.success) {
  console.log('Password reset email sent');
}
```

---

## CRUD Operations

All operations return:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### Products

#### Get All Products

```typescript
import { productService } from './services/supabaseDb';

const result = await productService.getAll();

if (result.success) {
  console.log(result.data); // Array of products
} else {
  console.error(result.error);
}
```

#### Get Single Product

```typescript
const result = await productService.getById('product-id');

if (result.success) {
  console.log(result.data);
}
```

#### Create Product (Admin)

```typescript
const result = await productService.create({
  name: 'Elegant Dress',
  description: 'Beautiful summer dress',
  price: 99.99,
  image_url: 'https://...',
  category: 'dresses',
  stock: 50,
});

if (result.success) {
  console.log('Product created:', result.data);
}
```

#### Update Product

```typescript
const result = await productService.update('product-id', {
  price: 89.99,
  stock: 45,
});

if (result.success) {
  console.log('Product updated:', result.data);
}
```

#### Delete Product

```typescript
const result = await productService.delete('product-id');

if (result.success) {
  console.log('Product deleted');
}
```

### Orders

#### Create Order

```typescript
import { orderService } from './services/supabaseDb';

const result = await orderService.create({
  user_id: 'user-id',
  items: [
    { product_id: 'prod-1', quantity: 2, price: 99.99 },
    { product_id: 'prod-2', quantity: 1, price: 49.99 },
  ],
  total: 249.97,
  shipping_address: '123 Main St, City, State 12345',
});

if (result.success) {
  console.log('Order created:', result.data);
}
```

#### Get User Orders

```typescript
const result = await orderService.getUserOrders('user-id');

if (result.success) {
  console.log('User orders:', result.data);
}
```

#### Update Order Status

```typescript
const result = await orderService.updateStatus('order-id', 'shipped');

if (result.success) {
  console.log('Order updated:', result.data);
}
```

### Profiles

#### Get Profile

```typescript
import { profileService } from './services/supabaseDb';

const result = await profileService.getProfile('user-id');

if (result.success) {
  console.log('Profile:', result.data);
}
```

#### Update Profile

```typescript
const result = await profileService.updateProfile('user-id', {
  name: 'Jane Doe',
  phone: '+1987654321',
  address: 'New Address',
});

if (result.success) {
  console.log('Profile updated:', result.data);
}
```

---

## Real-time Subscriptions

Subscribe to real-time changes in your database:

```typescript
import { supabase } from './lib/supabase';

// Listen for new products
supabase
  .channel('products')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'products' },
    (payload) => {
      console.log('New product:', payload.new);
    }
  )
  .subscribe();

// Listen for order updates
supabase
  .channel('orders')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('Order updated:', payload.new);
    }
  )
  .subscribe();
```

---

## Error Handling

### Try-Catch Pattern

```typescript
try {
  const result = await productService.getAll();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  // Use result.data
} catch (error) {
  console.error('Operation failed:', error.message);
  // Show user-friendly error message
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing Supabase environment variables` | `.env.local` not configured | Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| `Unauthorized` | Invalid/expired JWT | User needs to re-login |
| `Row Level Security violation` | User lacks permissions | Check RLS policies |
| `Relation not found` | Table doesn't exist | Create table using SQL schema |
| `Unique violation` | Duplicate entry | Check unique constraints |

---

## Best Practices

1. **Always check `result.success`** before accessing `result.data`
2. **Use `.env.local` for secrets** — Never commit it
3. **Enable Row Level Security (RLS)** on all tables
4. **Handle errors gracefully** — Show user-friendly messages
5. **Cache frequently accessed data** — Use React Context or local state
6. **Validate data before sending** — Check email format, password strength, etc.
7. **Use transactions** — For multi-step operations like creating orders

---

## Testing

### Test Signup/Login

```typescript
// Test signup
const signupResult = await AuthService.signUp({
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
});

console.log('Signup success:', signupResult.success);

// Test login
const loginResult = await AuthService.signIn({
  email: 'test@example.com',
  password: 'TestPassword123!',
});

console.log('Login success:', loginResult.success);
```

### Test Product CRUD

```typescript
// Create
const createResult = await productService.create({
  name: 'Test Product',
  price: 29.99,
  category: 'test',
  stock: 10,
});

// Read
const getResult = await productService.getById(createResult.data.id);

// Update
const updateResult = await productService.update(createResult.data.id, {
  price: 39.99,
});

// Delete
const deleteResult = await productService.delete(createResult.data.id);
```

---

## Troubleshooting

### Issue: "Cannot read property 'createClient' of undefined"

**Solution:** Make sure `@supabase/supabase-js` is installed:
```bash
npm install @supabase/supabase-js
```

### Issue: "VITE_SUPABASE_URL is not defined"

**Solution:** Create `.env.local` and add your Supabase credentials

### Issue: RLS Policy Violations

**Solution:** Check row-level security policies in Supabase dashboard:
- Settings → Authentication → Policies
- Ensure policies match your auth logic

### Issue: CORS Errors

**Solution:** Add your domain to Supabase allowed origins:
- Settings → API → CORS settings

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
