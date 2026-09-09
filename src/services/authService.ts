import { supabase } from '../lib/supabase';
import { profileService } from './supabaseDb';
import type { UserProfile } from '../types';

export const AuthService = {
  // Sign up with email & password
  async signUp({ email, password, name, phone }: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    try {
      // 1. Create auth user
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });

      if (authError) throw authError;
      if (!user) throw new Error('Failed to create user');

      // 2. Create user profile
      const profileResult = await profileService.createProfile(user.id, {
        email,
        name,
        phone,
        role: 'user',
        status: 'active',
      });

      if (!profileResult.success) throw new Error('Failed to create profile');

      return {
        success: true,
        user,
        profile: profileResult.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      return {
        success: false,
        user: null,
        profile: null,
        error: error.message,
      };
    }
  },

  // Sign in with email & password
  async signIn({ email, password }: { email: string; password: string }) {
    try {
      // 1. Authenticate user
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('Authentication failed');

      // 2. Fetch user profile
      const profileResult = await profileService.getProfile(user.id);
      if (!profileResult.success) throw new Error('Failed to fetch profile');

      return {
        success: true,
        user,
        profile: profileResult.data as UserProfile,
        error: null,
      };
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      return {
        success: false,
        user: null,
        profile: null,
        error: error.message,
      };
    }
  },

  // Get current user profile
  async getCurrentProfile() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      const profileResult = await profileService.getProfile(user.id);
      return profileResult.success ? profileResult.data : null;
    } catch (error: any) {
      console.error('Error getting current profile:', error.message);
      return null;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Reset password (send email)
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Update password error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error: any) {
      console.error('Get session error:', error.message);
      return { success: false, session: null, error: error.message };
    }
  },

  // ============ ADMIN MANAGEMENT ============

  // Fetch all admin users
  async fetchAdminUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching admin users:', error.message);
      return [];
    }
  },

  // Create a new admin user
  async createAdminUser({ email, password, name, phone }: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    try {
      // 1. Create auth user
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });

      if (authError) throw authError;
      if (!user) throw new Error('Failed to create user');

      // 2. Create admin profile
      const profileResult = await profileService.createProfile(user.id, {
        email,
        name,
        phone,
        role: 'admin',
        status: 'active',
      });

      if (!profileResult.success) throw new Error('Failed to create admin profile');

      return {
        success: true,
        profile: profileResult.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Error creating admin user:', error.message);
      return {
        success: false,
        profile: null,
        error: error.message,
      };
    }
  },

  // Update admin status (active/inactive)
  async updateAdminStatus(userId: string, status: 'active' | 'inactive') {
    try {
      const result = await profileService.updateProfile(userId, { status });
      if (!result.success) throw new Error('Failed to update admin status');
      
      return {
        success: true,
        data: result.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Error updating admin status:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Remove admin privileges (downgrade to user)
  async removeAdmin(userId: string) {
    try {
      const result = await profileService.updateProfile(userId, { role: 'user' });
      if (!result.success) throw new Error('Failed to remove admin privileges');
      
      return {
        success: true,
        data: result.data,
        error: null,
      };
    } catch (error: any) {
      console.error('Error removing admin:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
