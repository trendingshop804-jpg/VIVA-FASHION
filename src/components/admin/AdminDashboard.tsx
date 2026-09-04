import React, { useMemo, useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Shirt,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Plus,
  Activity,
  Heart,
  ShoppingCart,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { VisitorAnalyticsService } from '../../services/visitorAnalytics';
import type { VisitorStats, VisitorActivity } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { products, orders, customers, setActiveAdminTab } = useAdmin();
  const { currencySymbol } = useCart();

  const [visitorStats, setVisitorStats] = useState<VisitorStats>(VisitorAnalyticsService.getStats());
  const [visitorActivities, setVisitorActivities] = useState<VisitorActivity[]>(VisitorAnalyticsService.getActivities());

  useEffect(() => {
    setVisitorStats(VisitorAnalyticsService.getStats());
    setVisitorActivities(VisitorAnalyticsService.getActivities());
  }, []);

  // Metrics Calculation
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed'), [orders]);
  const lowStockProducts = useMemo(() => products.filter(p => p.stock <= 5), [products]);

  // Category Sales Breakdown
  const categoryStats = useMemo(() => {
    const stats: Record<string, { name: string; revenue: number; orders: number; units: number; color: string }> = {
      kurtis: { name: 'Kurtis & Kurtas', revenue: 0, orders: 0, units: 0, color: '#DCA134' },
      shawls: { name: 'Shawls & Dupattas', revenue: 0, orders: 0, units: 0, color: '#C27D6E' },
      leggings: { name: 'Leggings & Churidars', revenue: 0, orders: 0, units: 0, color: '#2A4A7F' },
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        const itemLower = item.name.toLowerCase();
        let cat = 'kurtis';
        if (itemLower.includes('shawl') || itemLower.includes('dupatta')) cat = 'shawls';
        else if (itemLower.includes('legging') || itemLower.includes('churidar')) cat = 'leggings';

        stats[cat].revenue += item.price * item.quantity;
        stats[cat].orders += 1;
        stats[cat].units += item.quantity;
      });
    });

    return Object.values(stats);
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  const getDeviceIcon = (device: 'Desktop' | 'Mobile' | 'Tablet') => {
    switch (device) {
      case 'Mobile': return <Smartphone size={13} className="text-[#C27D6E]" />;
      case 'Tablet': return <Tablet size={13} className="text-amber-600" />;
      default: return <Monitor size={13} className="text-blue-600" />;
    }
  };

  const getEventBadge = (event: VisitorActivity['event']) => {
    switch (event) {
      case 'Order Placed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Add to Cart': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Wishlist': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Category View': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
            Welcome back, Store Admin! 👋
          </h2>
          <p className="text-xs text-[#555E6C] mt-0.5">
            Live overview across Kurtis, Shawls, and Leggings storefront performance & visitor behavior.
          </p>
        </div>

        <button
          onClick={() => setActiveAdminTab('products')}
          className="inline-flex items-center justify-center gap-1.5 bg-[#191E28] hover:bg-[#C27D6E] text-white px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Total Sales
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#191E28]">
            {currencySymbol}{totalSales.toLocaleString()}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            <ArrowUpRight size={12} /> +18.4% vs last month
          </span>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Total Orders
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#191E28]">
            {orders.length}
          </div>
          <span className="text-[10px] text-[#71717A] block">
            {pendingOrders.length} pending processing
          </span>
        </div>

        {/* 3. Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Active Customers
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users size={16} />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#191E28]">
            {customers.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            85% repeat buyers
          </span>
        </div>

        {/* 4. Total Products */}
        <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Catalog Items
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Shirt size={16} />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#191E28]">
            {products.length}
          </div>
          {lowStockProducts.length > 0 ? (
            <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
              <AlertTriangle size={11} /> {lowStockProducts.length} low stock
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600">All in stock</span>
          )}
        </div>

      </div>

      {/* SECTION 13: VISITOR & STORE ANALYTICS METRICS */}
      <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider flex items-center gap-2">
              <Globe size={16} className="text-[#C27D6E]" />
              <span>Visitor & Store Traffic Overview</span>
            </h3>
            <p className="text-[11px] text-[#71717A]">
              Real-time traffic metrics across storefront sessions and customer interactions
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
            Live Traffic
          </span>
        </div>

        {/* Grid of Visitor Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3 text-center">
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">Total Visitors</span>
            <div className="text-base font-bold text-[#191E28]">{visitorStats.totalVisitors}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">Today</span>
            <div className="text-base font-bold text-emerald-700">{visitorStats.todayVisitors}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">This Week</span>
            <div className="text-base font-bold text-[#191E28]">{visitorStats.weekVisitors}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">This Month</span>
            <div className="text-base font-bold text-[#191E28]">{visitorStats.monthVisitors}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block flex items-center justify-center gap-1">
              <Eye size={11} className="text-blue-600" /> Page Views
            </span>
            <div className="text-base font-bold text-[#191E28]">{visitorStats.productViews}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">Category Views</span>
            <div className="text-base font-bold text-[#191E28]">{visitorStats.categoryViews}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block flex items-center justify-center gap-1">
              <ShoppingCart size={11} className="text-amber-600" /> Cart Actions
            </span>
            <div className="text-base font-bold text-amber-700">{visitorStats.addToCartEvents}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block flex items-center justify-center gap-1">
              <Heart size={11} className="text-rose-600" /> Wishlists
            </span>
            <div className="text-base font-bold text-rose-700">{visitorStats.wishlistEvents}</div>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#DEC3B5]/40 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase font-bold text-[#71717A] block">Total Orders</span>
            <div className="text-base font-bold text-emerald-800">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* SECTION 14: RECENT VISITOR ACTIVITY TABLE */}
      <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-[#C27D6E]" />
              <span>Recent Visitor Activity Stream</span>
            </h3>
            <p className="text-[11px] text-[#71717A]">
              Anonymous real-time event log tracking user interest across Kurtis, Shawls, and Leggings
            </p>
          </div>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Date / Time</th>
                <th className="py-2.5 px-3">Page / Item</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3 text-right">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {visitorActivities.slice(0, 8).map((act) => (
                <tr key={act.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-2.5 px-3 text-[#71717A] text-[11px]">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#191E28]">
                    {act.page}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getEventBadge(act.event)}`}>
                      {act.event}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#555E6C]">
                      {getDeviceIcon(act.device)}
                      <span>{act.device}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Sales Breakdown */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <div>
              <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider">
                Sales by Ethnic Category
              </h3>
              <p className="text-[11px] text-[#71717A]">
                Revenue distribution across Kurtis, Shawls, and Leggings
              </p>
            </div>
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className="text-xs text-[#C27D6E] font-semibold hover:underline"
            >
              Full Analytics →
            </button>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => {
              const percentage = totalSales > 0 ? Math.round((cat.revenue / totalSales) * 100) : 33;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-[#191E28]">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#71717A] text-[11px]">{cat.units} units sold</span>
                      <strong className="text-[#191E28]">{currencySymbol}{cat.revenue.toLocaleString()}</strong>
                      <span className="text-[11px] font-bold text-[#A66355] w-8 text-right">{percentage}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#FAF4EC] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-500" />
              <span>Inventory Alerts</span>
            </h3>
            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">
              {lowStockProducts.length} Items
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#71717A]">
              ✨ All products have healthy stock levels!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF4EC] border border-[#DEC3B5]/40 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt={p.name} className="w-9 h-11 rounded object-cover" />
                    <div>
                      <span className="font-bold text-[#191E28] line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-[#A66355] uppercase font-semibold">{p.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-red-600 block">{p.stock} left</span>
                    <button
                      onClick={() => setActiveAdminTab('products')}
                      className="text-[10px] text-[#C27D6E] underline font-semibold"
                    >
                      Refill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider">
              Recent Store Orders
            </h3>
            <p className="text-[11px] text-[#71717A]">
              Latest purchases made through the customer storefront
            </p>
          </div>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className="text-xs text-[#C27D6E] font-semibold hover:underline"
          >
            View All Orders ({orders.length}) →
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#191E28]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#191E28]">{ord.customerName}</div>
                    <div className="text-[10px] text-[#71717A]">{ord.customerEmail}</div>
                  </td>
                  <td className="py-3 px-3 text-[#555E6C]">
                    {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#191E28]">
                    {currencySymbol}{ord.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.orderStatus === 'Processing'
                        ? 'bg-purple-100 text-purple-800'
                        : ord.orderStatus === 'Confirmed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setActiveAdminTab('orders')}
                      className="p-1 text-[#191E28] hover:text-[#C27D6E] rounded"
                      title="View order"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
