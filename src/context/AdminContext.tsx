import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { StoreService, mapOrderRow } from '../services/storeService';
import { AuthService } from '../services/authService';
import type { Product, Order, Customer, Coupon, CustomerReview, StoreSettings } from '../types';

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'categories' | 'coupons' | 'reviews' | 'analytics' | 'customize' | 'settings' | 'admin-users';

interface AdminContextType {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isAdminAuthenticated: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  products: Product[];
  refreshProducts: () => Promise<void>;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  /** true while the FIRST Supabase orders load is in flight */
  ordersLoading: boolean;
  /** Supabase error message when the last orders load failed (null = ok) */
  ordersError: string | null;
  customers: Customer[];
  refreshCustomers: () => Promise<void>;
  coupons: Coupon[];
  refreshCoupons: () => Promise<void>;
  reviews: CustomerReview[];
  refreshReviews: () => Promise<void>;
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash.startsWith('#admin') || window.location.pathname.startsWith('/admin');
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vf_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('vf_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const ordersLoadedRef = useRef(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StoreService.getSettings());

  const refreshProducts = async () => {
    const data = await StoreService.fetchProducts();
    setProducts(data);
  };

  /**
   * Load orders straight from Supabase. On failure the complete error is
   * logged and exposed through `ordersError` — the state is NEVER replaced
   * with localStorage rows, so the admin panel can't show stale local data
   * as if it were real database orders.
   */
  const refreshOrders = async () => {
    if (!ordersLoadedRef.current) setOrdersLoading(true);
    try {
      const data = await StoreService.fetchOrders();
      ordersLoadedRef.current = true;
      setOrders(data);
      setOrdersError(null);
    } catch (err) {
      console.error('[Admin Orders] Failed to load orders from Supabase:', err);
      setOrdersError(
        (err as Error)?.message || 'Failed to load orders from the database.'
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const refreshCustomers = async () => {
    const data = await StoreService.fetchCustomers();
    setCustomers(data);
  };

  const refreshCoupons = async () => {
    const data = await StoreService.fetchCoupons();
    setCoupons(data);
  };

  const refreshReviews = async () => {
    const data = await StoreService.fetchReviews();
    setReviews(data);
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
    refreshCustomers();
    refreshCoupons();
    refreshReviews();

    // Fetch and sync payment settings from DB
    StoreService.fetchPaymentSettings().then(() => {
      setSettings(StoreService.getSettings());
    });

    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin')) {
        setIsAdminMode(true);
        const parts = window.location.hash.replace('#admin/', '').replace('#admin', '');
        if (parts && ['dashboard', 'products', 'orders', 'customers', 'categories', 'coupons', 'reviews', 'analytics', 'customize', 'settings', 'admin-users'].includes(parts)) {
          setActiveAdminTab(parts as AdminTab);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ------------------------------------------------------------------
  // Live admin orders: Supabase Realtime (postgres_changes INSERT/UPDATE
  // on public.orders) plus ONE 15s poll as a safety net (covers the case
  // where the realtime publication is not configured yet, and any transient
  // channel drop). A single timer ref guarantees no duplicate polling
  // timers; the channel, auth listener and timer are cleaned up on
  // unmount / sign-out.
  //
  // Auth is WATCHED rather than checked once: admins often sign in through
  // the login modal without reloading the page, and the subscription must
  // come alive at that moment.
  // ------------------------------------------------------------------
  const ordersPollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAdminMode) return;

    let disposed = false;
    let channel: any = null;
    let starting = false;
    let authSubscription: any = null;

    const startPolling = () => {
      if (ordersPollRef.current === null && !disposed) {
        ordersPollRef.current = window.setInterval(() => {
          refreshOrders();
        }, 15000);
      }
    };
    const stopPolling = () => {
      if (ordersPollRef.current !== null) {
        window.clearInterval(ordersPollRef.current);
        ordersPollRef.current = null;
      }
    };
    const teardownLive = () => {
      stopPolling();
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn('[Admin Orders] Realtime cleanup failed:', (err as Error).message);
        }
        channel = null;
      }
    };

    const startLive = async () => {
      if (disposed || channel || starting) return;
      starting = true;
      try {
        // Only a real admin session can read orders (RLS) — subscribe for it.
        const { data: sessionData } = await supabase.auth.getSession();
        const uid = sessionData?.session?.user?.id;
        if (!uid || disposed) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', uid)
          .maybeSingle();
        if (disposed || (profile as any)?.role !== 'admin') return;

        startPolling();

        channel = supabase
          .channel(`admin-orders-${uid}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'orders' },
            () => {
              // Full refetch replaces the list → no duplicates in state.
              refreshOrders();
            }
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'orders' },
            (payload: any) => {
              const row = payload?.new;
              if (row?.id) {
                // Merge the changed row first so status edits are instant...
                setOrders(prev => prev.map(o => (o.id === row.id ? mapOrderRow(row) : o)));
              }
              // ...then refetch so orders we don't have yet (or changed
              // totals/payments) converge with the database.
              refreshOrders();
            }
          )
          .subscribe((status: string) => {
            if (disposed) return;
            if (status === 'SUBSCRIBED') {
              // Catch up immediately after joining.
              refreshOrders();
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error(`[Admin Orders] Realtime subscription ${status} — relying on the 15s orders poll.`);
            }
          });
      } catch (err) {
        console.error('[Admin Orders] Realtime setup failed:', (err as Error).message);
        if (!disposed) startPolling();
      } finally {
        starting = false;
      }
    };

    try {
      const res = supabase.auth.onAuthStateChange((_event: string, session: any) => {
        if (disposed) return;
        if (session?.user) {
          startLive();
        } else {
          teardownLive(); // signed out → stop timer + channel
        }
      });
      authSubscription = res?.data?.subscription;
    } catch (err) {
      console.error('[Admin Orders] Auth listener failed:', (err as Error).message);
    }
    // Session may already exist (page loaded while signed in).
    startLive();

    return () => {
      disposed = true;
      try {
        authSubscription?.unsubscribe();
      } catch {
        /* listener already gone */
      }
      teardownLive();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminMode]);

  /**
   * Admin sign-in = REAL Supabase Auth + admin role check.
   * The old "<any email> + any 6-char password" backdoor is gone: an
   * arbitrary visitor can no longer become admin by entering any password.
   */
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = await AuthService.signIn({ email, password: pass });
      if (result.error || !result.profile) {
        console.error('[Admin Auth] Sign-in rejected:', result.error || 'no profile returned');
        return false;
      }
      const profile = result.profile;
      if (profile.role !== 'admin' || profile.status === 'suspended' || profile.status === 'inactive') {
        console.error('[Admin Auth] Sign-in succeeded but the account has no active administrator role.');
        return false;
      }
      const user = { name: profile.name || email, email, role: 'Super Admin' };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('vf_admin_auth', 'true');
      localStorage.setItem('vf_admin_user', JSON.stringify(user));
      return true;
    } catch (err) {
      console.error('[Admin Auth] Sign-in error:', (err as Error).message);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('vf_admin_auth');
    localStorage.removeItem('vf_admin_user');
  };

  const updateSettings = (newSettings: StoreSettings) => {
    const saved = StoreService.saveSettings(newSettings);
    setSettings(saved);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        activeAdminTab,
        setActiveAdminTab,
        products,
        refreshProducts,
        orders,
        refreshOrders,
        ordersLoading,
        ordersError,
        customers,
        refreshCustomers,
        coupons,
        refreshCoupons,
        reviews,
        refreshReviews,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
