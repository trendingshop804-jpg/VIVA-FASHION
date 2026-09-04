import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Layers,
  TicketPercent,
  Star,
  BarChart3,
  Palette,
  Settings,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useAdmin, type AdminTab } from '../../context/AdminContext';
import { Logo } from '../common/Logo';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const SIDEBAR_NAV: { id: AdminTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Shirt },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'coupons', label: 'Coupons', icon: TicketPercent },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'customize', label: 'Website Customize', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin-users', label: 'Admin Users', icon: Users },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { activeAdminTab, setActiveAdminTab, setIsAdminMode, logoutAdmin, orders, products } = useAdmin();

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const handleNav = (tabId: AdminTab) => {
    setActiveAdminTab(tabId);
    window.location.hash = `#admin/${tabId}`;
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-[#191E28] text-[#FDFBF7] flex flex-col justify-between h-full border-r border-[#28303F] shrink-0">
      
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-[#28303F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white block font-serif">
                VIVA FASHION
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#C27D6E] font-semibold">
                Admin Control
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-[#8C93A0] hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#C27D6E] text-white font-semibold shadow-md'
                    : 'text-[#DEC3B5]/80 hover:bg-[#28303F] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#DEC3B5]/70'} />
                  <span>{item.label}</span>
                </div>

                {/* Counter Badges */}
                {item.id === 'orders' && pendingOrdersCount > 0 && (
                  <span className="bg-[#DCA134] text-[#191E28] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {pendingOrdersCount}
                  </span>
                )}
                {item.id === 'products' && lowStockCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {lowStockCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#28303F] space-y-2">
        <button
          onClick={() => {
            setIsAdminMode(false);
            window.location.hash = '';
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#28303F] hover:bg-[#374256] text-[#FAF7F2] py-2 px-3 rounded-lg text-xs font-semibold transition-colors"
        >
          <ExternalLink size={13} />
          <span>Customer Storefront</span>
        </button>

        <button
          onClick={logoutAdmin}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 py-1.5 text-xs transition-colors"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
