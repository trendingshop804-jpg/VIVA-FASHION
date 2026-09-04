import React from 'react';
import { Store, Bell, LogOut, User, Menu } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { setIsAdminMode, logoutAdmin, adminUser, activeAdminTab } = useAdmin();

  const getTitle = () => {
    switch (activeAdminTab) {
      case 'dashboard': return 'Storefront Overview';
      case 'products': return 'Product Catalog & Inventory';
      case 'orders': return 'Customer Orders';
      case 'customers': return 'Customer Database';
      case 'categories': return 'Ethnic Categories';
      case 'coupons': return 'Coupons & Promotions';
      case 'reviews': return 'Review Moderation';
      case 'analytics': return 'Sales & Category Analytics';
      case 'settings': return 'Store Settings';
      default: return 'Admin Portal';
    }
  };

  return (
    <header className="bg-[#FAF7F2] border-b border-[#DEC3B5] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-md text-[#191E28] hover:bg-[#EAD7CD]"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="text-sm sm:text-base font-bold text-[#191E28] uppercase tracking-wider font-serif">
            {getTitle()}
          </h1>
          <span className="text-[10px] text-[#A66355] font-semibold hidden sm:inline-block">
            VIVA FASHION ETHNIC • MERCHANT PORTAL
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Switch to Storefront */}
        <button
          onClick={() => {
            setIsAdminMode(false);
            window.location.hash = '';
          }}
          className="flex items-center gap-1.5 bg-[#FAF4EC] hover:bg-[#EAD7CD] text-[#191E28] border border-[#DEC3B5] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <Store size={14} className="text-[#C27D6E]" />
          <span className="hidden sm:inline">View Live Store</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-[#191E28] hover:text-[#C27D6E] rounded-full hover:bg-[#EAD7CD]/50 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C27D6E] rounded-full" />
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DEC3B5]">
          <div className="w-7 h-7 rounded-full bg-[#191E28] text-white flex items-center justify-center text-xs font-bold">
            <User size={14} />
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-[#191E28] block leading-tight">
              {adminUser?.name || 'Admin'}
            </span>
            <span className="text-[10px] text-[#71717A] leading-tight block">
              {adminUser?.role || 'Super Admin'}
            </span>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-1.5 text-[#8C93A0] hover:text-red-600 rounded hover:bg-red-50 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
