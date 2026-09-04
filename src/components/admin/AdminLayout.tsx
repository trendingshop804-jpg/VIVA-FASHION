import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminCategories } from './AdminCategories';
import { AdminCoupons } from './AdminCoupons';
import { AdminReviews } from './AdminReviews';
import { AdminAnalytics } from './AdminAnalytics';
import { WebsiteCustomize } from './customize/WebsiteCustomize';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { activeAdminTab, setIsAdminMode } = useAdmin();
  const { isAdmin, isAuthenticated, isLoading, setIsAuthModalOpen, setAuthModalTab } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If unauthenticated or non-admin, redirect away from admin panel
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      const timer = setTimeout(() => {
        // Do not stay in admin mode for unauthorized users
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191E28] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 size={32} className="animate-spin text-[#C27D6E]" />
        <p className="text-xs uppercase tracking-widest font-semibold text-[#DEC3B5]">Verifying Authorization...</p>
      </div>
    );
  }

  // Strict role-based protection
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#DEC3B5]/60 space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#191E28] font-serif">Restricted Area</h2>
            <p className="text-xs text-[#71717A] mt-1">
              You must be signed in with an authorized Administrator account to access the Merchant Control Panel.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Administrator Sign In
            </button>

            <button
              onClick={() => {
                setIsAdminMode(false);
                window.location.hash = '';
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#71717A] hover:text-[#191E28] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Customer Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeAdminTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'customers': return <AdminCustomers />;
      case 'categories': return <AdminCategories />;
      case 'coupons': return <AdminCoupons />;
      case 'reviews': return <AdminReviews />;
      case 'analytics': return <AdminAnalytics />;
      case 'customize': return <WebsiteCustomize />;
      case 'settings': return <AdminSettings />;
      case 'admin-users': return <AdminUsers />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EBE6]/60 flex text-[#191E28]">
      
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Slide-Over Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#191E28]">
            <AdminSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 pb-12 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

    </div>
  );
};
