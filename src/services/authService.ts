import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

export const AuthService = {
  /**
   * Public Customer Signup - strictly creates profile with role = 'customer'
   */
  async signUp(params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<{ user: any; profile: UserProfile | null; error?: string }> {
    try {
      const cleanEmail = params.email.trim().toLowerCase();
      const cleanName = params.name.trim();
      const cleanPhone = params.phone?.trim();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
            role: 'customer', // Customer role
          },
        },
      });

      if (authError) {
        return { user: null, profile: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, profile: null, error: 'Registration failed. Please try again.' };
      }

      // Ensure profile row exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      let profile: UserProfile;
      if (profileData) {
        profile = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role,
          status: profileData.status,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };
      } else {
        // Fallback insert if trigger hasn't fired yet
        const newProfile = {
          id: authData.user.id,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'customer' as const,
          status: 'active' as const,
        };
        await supabase.from('profiles').upsert(newProfile);
        profile = {
          ...newProfile,
          createdAt: new Date().toISOString(),
        };
      }

      return { user: authData.user, profile };
    } catch (err: any) {
      return { user: null, profile: null, error: err?.message || 'An unexpected error occurred during signup.' };
    }
  },

  /**
   * Unified Sign In for Customers and Admins
   */
  async signIn(params: {
    email: string;
    password: string;
  }): Promise<{ user: any; profile: UserProfile | null; error?: string }> {
    try {
      const cleanEmail = params.email.trim().toLowerCase();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: params.password,
      });

      if (authError) {
        return { user: null, profile: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, profile: null, error: 'Invalid credentials' };
      }

      // Fetch user profile from database to determine role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      let profile: UserProfile;

      if (!profileError && profileData) {
        profile = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role,
          status: profileData.status,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };
      } else {
        // Create customer profile if not yet in database
        const isDefaultAdmin = ['complaint.dropzone@gmail.com', 'praveen.dialamitesolutions@gmail.com'].includes(cleanEmail);
        const newProfile = {
          id: authData.user.id,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: isDefaultAdmin ? ('admin' as const) : ('customer' as const),
          status: 'active' as const,
        };
        await supabase.from('profiles').upsert(newProfile);
        profile = {
          ...newProfile,
          createdAt: new Date().toISOString(),
        };
      }

      if (profile.status === 'suspended' || profile.status === 'inactive') {
        await supabase.auth.signOut();
        return { user: null, profile: null, error: 'Your account has been deactivated. Please contact support.' };
      }

      return { user: authData.user, profile };
    } catch (err: any) {
      return { user: null, profile: null, error: err?.message || 'Login failed.' };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('vf_auth_profile');
  },

  /**
   * Get currently authenticated user's profile
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        return null;
      }

      const userId = sessionData.session.user.id;
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && profileData) {
        return {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role,
          status: profileData.status,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };
      }
    } catch {}
    return null;
  },

  /**
   * Admin Management: Fetch all admin users
   */
  async fetchAdminUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          role: p.role,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
      }
    } catch {}

    const saved = localStorage.getItem('vf_admin_users_list');
    return saved ? JSON.parse(saved) : [];
  },

  /**
   * Admin Management: Create a new admin account
   */
  async createAdminUser(params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<{ profile: UserProfile | null; error?: string }> {
    try {
      const cleanEmail = params.email.trim().toLowerCase();
      const cleanName = params.name.trim();
      const cleanPhone = params.phone?.trim();

      // Sign up the new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
            role: 'admin',
          },
        },
      });

      if (authError) {
        return { profile: null, error: authError.message };
      }

      if (!authData.user) {
        return { profile: null, error: 'Failed to create user.' };
      }

      // Explicitly set role = 'admin' in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'admin',
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        return { profile: null, error: profileError.message };
      }

      const profile: UserProfile = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        role: 'admin',
        status: profileData.status,
        createdAt: profileData.created_at,
      };

      return { profile };
    } catch (err: any) {
      return { profile: null, error: err?.message || 'Failed to create admin.' };
    }
  },

  /**
   * Admin Management: Update Admin Role / Status with safety check against deleting last admin
   */
  async updateAdminStatus(adminId: string, status: 'active' | 'inactive' | 'suspended'): Promise<{ success: boolean; error?: string }> {
    try {
      if (status !== 'active') {
        const admins = await this.fetchAdminUsers();
        const activeAdmins = admins.filter(a => a.status === 'active');
        if (activeAdmins.length <= 1 && activeAdmins.some(a => a.id === adminId)) {
          return { success: false, error: 'Cannot disable the last remaining active admin account.' };
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', adminId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * Admin Management: Demote / Remove Admin role
   */
  async removeAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admins = await this.fetchAdminUsers();
      if (admins.length <= 1) {
        return { success: false, error: 'Security constraint: Cannot remove the last remaining admin account.' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: 'customer', updated_at: new Date().toISOString() })
        .eq('id', adminId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },
};
