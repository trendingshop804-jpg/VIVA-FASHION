# Supabase Integration for VIVA-FASHION

This document outlines the Supabase integration for the VIVA-FASHION e-commerce platform.

## What's Been Added

### 1. **Updated Files**

- **`src/lib/supabase.ts`** - Supabase client initialization with environment variables
- **`src/services/authService.ts`** - Enhanced authentication service

### 2. **New Files**

- **`src/services/supabaseDb.ts`** - Complete CRUD service layer for:
  - Products (getAll, getById, create, update, delete, getByCategory)
  - Orders (create, getUserOrders, updateStatus, getAll)
  - Profiles (getProfile, updateProfile, createProfile)
  - Wishlist (addToWishlist, getUserWishlist, removeFromWishlist)

- **`.env.example`** - Environment variables template
- **`docs/SUPABASE_SETUP.md`** - Detailed setup and usage guide

## Quick Start

### 1. Set Up Environment Variables

```bash
# Copy the example
cp .env.example .env.local

# Add your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Database Tables

Run these SQL queries in your Supabase dashboard (SQL Editor):

**Products Table:**
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
```

**Orders Table:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Profiles Table:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Wishlist Table:**
```sql
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);
```

### 3. Enable Row Level Security (RLS)

See `docs/SUPABASE_SETUP.md` for complete RLS policy setup.

## Usage Examples

### Authentication

```typescript
import { AuthService } from './services/authService';

// Sign up
const signup = await AuthService.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
});

// Login
const login = await AuthService.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Logout
await AuthService.signOut();
```

### Products

```typescript
import { productService } from './services/supabaseDb';

// Get all products
const allProducts = await productService.getAll();

// Get by category
const dresses = await productService.getByCategory('dresses');

// Create (admin only)
const newProduct = await productService.create({
  name: 'Elegant Dress',
  price: 99.99,
  category: 'dresses',
  stock: 50,
});

// Update
await productService.update(productId, { price: 89.99 });

// Delete
await productService.delete(productId);
```

### Orders

```typescript
import { orderService } from './services/supabaseDb';

// Create order
const order = await orderService.create({
  user_id: userId,
  items: [...],
  total: 250.00,
  shipping_address: '123 Main St',
});

// Get user orders
const userOrders = await orderService.getUserOrders(userId);

// Update status
await orderService.updateStatus(orderId, 'shipped');
```

### Wishlist

```typescript
import { wishlistService } from './services/supabaseDb';

// Add to wishlist
await wishlistService.addToWishlist(userId, productId);

// Get wishlist
const wishlist = await wishlistService.getUserWishlist(userId);

// Remove from wishlist
await wishlistService.removeFromWishlist(userId, productId);
```

## Error Handling

All service methods return:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

Always check for success:
```typescript
const result = await productService.getAll();

if (result.success) {
  console.log('Products:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Key Features

✅ **Type-safe** - Full TypeScript support  
✅ **Error handling** - All operations have try-catch  
✅ **Authentication** - Signup, login, password reset  
✅ **CRUD operations** - Complete data management  
✅ **Row Level Security** - Data privacy and security  
✅ **Scalable** - Ready for production  

## Integration Points

- **AuthContext** - Already uses `AuthService` and `profileService`
- **CartContext** - Ready to use `orderService`
- **Admin Dashboard** - Use `productService` for product management
- **Wishlist** - Use `wishlistService`

## Next Steps

1. ✅ Configure `.env.local` with your Supabase credentials
2. ✅ Create database tables using the SQL schema
3. ✅ Enable Row Level Security policies
4. ✅ Test authentication and CRUD operations
5. ✅ Integrate services into your components

## Documentation

See **`docs/SUPABASE_SETUP.md`** for:
- Detailed setup instructions
- SQL schema with RLS policies
- Complete API reference
- Best practices and troubleshooting
- Real-time subscriptions guide

## Support

For issues or questions:
1. Check `docs/SUPABASE_SETUP.md` troubleshooting section
2. Review Supabase official docs: https://supabase.com/docs
3. Check browser console for error messages

---

**Status:** Ready for production use ✅
