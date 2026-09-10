import { supabase } from '../lib/supabase';
import { profileService } from './supabaseDb';
import type { UserProfile } from '../types';

function formatAuthError(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const msg = typeof err === 'string' ? err : err.message || err.error_description || String(err);

  if (msg.includes('Invalid API key') || msg.includes('invalid_api_key') || msg.includes('API key')) {
    return 'Authentication service configuration is invalid. Please try again later.';
  }
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user_already_exists')) {
    return 'This email is already registered. Please sign in.';
  }
  if (msg.includes('Password should be at least 6 characters') || msg.includes('password') && msg.includes('6')) {
    return 'Password must contain at least 6 characters.';
  }
  if (msg.includes('Unable to validate email address') || msg.includes('invalid') && msg.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
    return 'Please check your inbox and confirm your email address before signing in.';
  }
  if (msg.includes('Invalid login credentials')) {
    return 'Invalid email or password.';
  }
  return msg;
}

export const AuthService = {
  /**
   * Public Customer Signup - strictly creates profile with role = 'customer'
   */
  async signUp(params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<{ user: any; profile: UserProfile | null; error?: string; success?: boolean }> {
    try {
      const cleanEmail = params.email.trim().toLowerCase();
      const cleanName = params.name.trim();
      const cleanPhone = params.phone?.trim();

      if (!cleanName) {
        return { success: false, user: null, profile: null, error: 'Full name is required.' };
      }
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, user: null, profile: null, error: 'Please enter a valid email address.' };
      }
      if (!params.password || params.password.length < 6) {
        return { success: false, user: null, profile: null, error: 'Password must contain at least 6 characters.' };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
            role: 'customer',
          },
        },
      });

      if (authError) {
        return { success: false, user: null, profile: null, error: formatAuthError(authError) };
      }

      if (!authData.user) {
        return { success: false, user: null, profile: null, error: 'Registration failed. Please try again.' };
      }

      // Ensure profile row exists
      let profile: UserProfile | null = null;
      if (profileService && typeof profileService.getProfile === 'function') {
        const profRes = await profileService.getProfile(authData.user.id);
        if (profRes.success && profRes.data) {
          profile = profRes.data as UserProfile;
        }
      }

      if (!profile) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

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
            phone: cleanPhone || null,
            role: 'customer' as const,
            status: 'active' as const,
          };
          await supabase.from('profiles').upsert(newProfile);
          profile = {
            ...newProfile,
            phone: cleanPhone,
            createdAt: new Date().toISOString(),
          };
        }
      }

      return { success: true, user: authData.user, profile, error: undefined };
    } catch (err: any) {
      return { success: false, user: null, profile: null, error: formatAuthError(err) };
    }
  },

  /**
   * Unified Sign In for Customers and Admins
   */
  async signIn(params: {
    email: string;
    password: string;
  }): Promise<{ user: any; profile: UserProfile | null; error?: string; success?: boolean }> {
    try {
      const cleanEmail = params.email.trim().toLowerCase();

      if (!cleanEmail || !params.password) {
        return { success: false, user: null, profile: null, error: 'Please enter your email and password.' };
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: params.password,
      });

      if (authError) {
        return { success: false, user: null, profile: null, error: formatAuthError(authError) };
      }

      if (!authData.user) {
        return { success: false, user: null, profile: null, error: 'Invalid credentials.' };
      }

      const isAppMetaAdmin = authData.user.app_metadata?.role === 'admin';
      const isDefaultAdmin = ['complaint.dropzone@gmail.com', 'praveen.dialamitesolutions@gmail.com'].includes(cleanEmail);

      let profile: UserProfile | null = null;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const userRole = (isAppMetaAdmin || isDefaultAdmin || profileData?.role === 'admin') ? 'admin' : (profileData?.role || 'customer');

      profile = {
        id: authData.user.id,
        name: profileData?.name || profileData?.full_name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: profileData?.phone || authData.user.user_metadata?.phone,
        role: userRole as 'admin' | 'customer',
        status: (profileData?.status as 'active' | 'inactive' | 'suspended') || 'active',
        createdAt: profileData?.created_at || authData.user.created_at,
        updatedAt: profileData?.updated_at,
      };

      if (profile.status === 'suspended' || profile.status === 'inactive') {
        await supabase.auth.signOut();
        return { success: false, user: null, profile: null, error: 'Your account has been deactivated. Please contact support.' };
      }

      return { success: true, user: authData.user, profile, error: undefined };
    } catch (err: any) {
      return { success: false, user: null, profile: null, error: formatAuthError(err) };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('vf_auth_profile');
    return { success: true };
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

      const user = sessionData.session.user;
      const userEmail = (user.email || '').toLowerCase();
      const isAppMetaAdmin = user.app_metadata?.role === 'admin';
      const isDefaultAdmin = ['complaint.dropzone@gmail.com', 'praveen.dialamitesolutions@gmail.com'].includes(userEmail);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const userRole = (isAppMetaAdmin || isDefaultAdmin || profileData?.role === 'admin') ? 'admin' : (profileData?.role || 'customer');

      return {
        id: user.id,
        name: profileData?.name || profileData?.full_name || user.user_metadata?.name || userEmail.split('@')[0],
        email: user.email || '',
        phone: profileData?.phone || user.user_metadata?.phone,
        role: userRole as 'admin' | 'customer',
        status: (profileData?.status as 'active' | 'inactive' | 'suspended') || 'active',
        createdAt: profileData?.created_at || user.created_at,
        updatedAt: profileData?.updated_at,
      };
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
  }): Promise<{ profile: UserProfile | null; error?: string; success?: boolean }> {
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
            role: 'admin',
          },
        },
      });

      if (authError) {
        return { success: false, profile: null, error: formatAuthError(authError) };
      }

      if (!authData.user) {
        return { success: false, profile: null, error: 'Failed to create user.' };
      }

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
        return { success: false, profile: null, error: profileError.message };
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

      return { success: true, profile };
    } catch (err: any) {
      return { success: false, profile: null, error: formatAuthError(err) };
    }
  },

  /**
   * Admin Management: Update Admin Status
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
