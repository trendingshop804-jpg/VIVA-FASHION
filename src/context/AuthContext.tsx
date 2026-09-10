import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/authService';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'account';
  setAuthModalTab: (tab: 'login' | 'signup' | 'account') => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vf_auth_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'account'>('login');

  const refreshProfile = async () => {
    const prof = await AuthService.getCurrentProfile();
    setProfile(prof);
    if (prof) {
      localStorage.setItem('vf_auth_profile', JSON.stringify(prof));
    } else {
      localStorage.removeItem('vf_auth_profile');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (!isMounted) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await refreshProfile().catch(() => {});
        } else {
          setProfile(null);
          localStorage.removeItem('vf_auth_profile');
        }
      } catch (err) {
        console.warn('[Auth Initialization Warning]:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    let subscription: any;
    try {
      const res = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          await refreshProfile().catch(() => {});
        } else {
          setProfile(null);
          localStorage.removeItem('vf_auth_profile');
        }
        setIsLoading(false);
      });
      subscription = res?.data?.subscription;
    } catch (err) {
      console.warn('[Auth Listener Warning]:', err);
    }

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    setIsLoading(true);
    const result = await AuthService.signIn({ email, password: pass });
    setIsLoading(false);

    if (result.error || !result.profile) {
      return { success: false, error: result.error || 'Authentication failed.' };
    }

    setUser(result.user);
    setProfile(result.profile);
    localStorage.setItem('vf_auth_profile', JSON.stringify(result.profile));

    const isUserAdmin = result.profile.role === 'admin' && result.profile.status === 'active';
    return { success: true, isAdmin: isUserAdmin };
  };

  const signup = async (email: string, pass: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await AuthService.signUp({ email, password: pass, name, phone });
    setIsLoading(false);

    if (result.error || !result.profile) {
      return { success: false, error: result.error || 'Signup failed.' };
    }

    setUser(result.user);
    setProfile(result.profile);
    localStorage.setItem('vf_auth_profile', JSON.stringify(result.profile));

    return { success: true };
  };

  const logout = async (): Promise<void> => {
    await AuthService.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('vf_auth_profile');
    localStorage.removeItem('vf_admin_auth');
    localStorage.removeItem('vf_admin_user');
    window.location.hash = '';
  };

  const isAdmin = Boolean(
    (user?.app_metadata?.role === 'admin' || profile?.role === 'admin') &&
    profile?.status !== 'suspended' &&
    profile?.status !== 'inactive'
  );
  const isAuthenticated = Boolean(user && profile);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
