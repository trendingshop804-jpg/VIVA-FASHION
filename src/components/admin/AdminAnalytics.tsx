import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';

export const AdminAnalytics: React.FC = () => {
  const { orders } = useAdmin();
  const { currencySymbol } = useCart();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Historical breakdown by day
  const chartData = [
    { day: 'Mon', kurtis: 3800, shawls: 2400, leggings: 1500 },
    { day: 'Tue', kurtis: 4500, shawls: 3200, leggings: 1800 },
    { day: 'Wed', kurtis: 5200, shawls: 2800, leggings: 2100 },
    { day: 'Thu', kurtis: 4900, shawls: 3900, leggings: 2400 },
    { day: 'Fri', kurtis: 6800, shawls: 5100, leggings: 3200 },
    { day: 'Sat', kurtis: 8400, shawls: 6200, leggings: 4100 },
    { day: 'Sun', kurtis: 7900, shawls: 5800, leggings: 3800 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
            Sales & Category Analytics
          </h2>
          <p className="text-xs text-[#555E6C]">
            Detailed metrics and revenue trends for Kurtis, Shawls, and Leggings.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex bg-white rounded-lg border border-[#DEC3B5] p-0.5 text-xs font-semibold">
          {(['7d', '30d', '90d', '1y'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-md uppercase transition-colors ${
                timeRange === t ? 'bg-[#191E28] text-white' : 'text-[#555E6C] hover:text-[#191E28]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            Total Store Revenue
          </span>
          <div className="text-2xl font-bold text-[#191E28]">
            {currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-bold text-[#191E28]">
            {currencySymbol}{avgOrderValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#555E6C]">Across all {orders.length} transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            Category Leader
          </span>
          <div className="text-2xl font-bold text-[#DCA134]">
            Kurtis & Kurtas
          </div>
          <span className="text-[10px] text-[#555E6C]">48% of total gross sales</span>
        </div>
      </div>

      {/* Visual Analytics Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <h3 className="text-sm font-bold text-[#191E28] uppercase tracking-wider">
            Weekly Revenue by Category ({currencySymbol})
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#DCA134]" /> Kurtis</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#C27D6E]" /> Shawls</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2A4A7F]" /> Leggings</div>
          </div>
        </div>

        {/* Bar Visualization */}
        <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
          {chartData.map((d) => {
            const maxHeight = 200;
            const kurtiH = (d.kurtis / 10000) * maxHeight;
            const shawlH = (d.shawls / 10000) * maxHeight;
            const leggingH = (d.leggings / 10000) * maxHeight;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full max-w-[42px] flex flex-col items-center justify-end rounded-t-lg overflow-hidden bg-gray-50 shadow-xs">
                  <div style={{ height: `${kurtiH}px` }} className="w-full bg-[#DCA134] transition-all group-hover:opacity-90" title={`Kurtis: ${currencySymbol}${d.kurtis}`} />
                  <div style={{ height: `${shawlH}px` }} className="w-full bg-[#C27D6E] transition-all group-hover:opacity-90" title={`Shawls: ${currencySymbol}${d.shawls}`} />
                  <div style={{ height: `${leggingH}px` }} className="w-full bg-[#2A4A7F] transition-all group-hover:opacity-90" title={`Leggings: ${currencySymbol}${d.leggings}`} />
                </div>
                <span className="text-[11px] font-bold text-[#555E6C]">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
