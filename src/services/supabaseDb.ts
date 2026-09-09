import { supabase } from '../lib/supabase';

// ============ PRODUCTS ============
export const productService = {
  // Read all products
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Read single product by ID
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching product:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Create product (admin only)
  async create(productData: {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error creating product:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update product
  async update(id: string, updates: Partial<any>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete product
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Search products by category
  async getByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching products by category:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// ============ ORDERS ============
export const orderService = {
  // Create order
  async create(orderData: {
    user_id: string;
    items: any[];
    total: number;
    shipping_address: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...orderData, status: 'pending', created_at: new Date() }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error creating order:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching orders:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  async updateStatus(orderId: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date() })
        .eq('id', orderId)
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error updating order:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get all orders (admin)
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching all orders:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// ============ USER PROFILES ============
export const profileService = {
  // Get user profile
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Create profile (called after signup)
  async createProfile(userId: string, profileData: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData, created_at: new Date() }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error creating profile:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// ============ WISHLIST ============
export const wishlistService = {
  // Add to wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{ user_id: userId, product_id: productId }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error('Error adding to wishlist:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user's wishlist
  async getUserWishlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching wishlist:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Remove from wishlist
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error removing from wishlist:', error.message);
      return { success: false, error: error.message };
    }
  },
};
