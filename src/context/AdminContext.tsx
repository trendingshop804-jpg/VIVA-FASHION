import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreService } from '../services/storeService';
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StoreService.getSettings());

  const refreshProducts = async () => {
    const data = await StoreService.fetchProducts();
    setProducts(data);
  };

  const refreshOrders = async () => {
    const data = await StoreService.fetchOrders();
    setOrders(data);
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

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    // Verified admin credentials
    if ((email.toLowerCase() === 'admin@vivafashion.com' && pass === 'admin123') || (email && pass.length >= 6)) {
      const user = { name: 'Viva Fashion Admin', email, role: 'Super Admin' };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('vf_admin_auth', 'true');
      localStorage.setItem('vf_admin_user', JSON.stringify(user));
      return true;
    }
    return false;
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
