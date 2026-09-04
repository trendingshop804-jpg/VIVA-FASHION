import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';

export const AdminCustomers: React.FC = () => {
  const { customers } = useAdmin();
  const { currencySymbol } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
            Customer Directory ({customers.length})
          </h2>
          <p className="text-xs text-[#555E6C]">
            View customer contact records, order history, and lifetime spending.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C93A0]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, or city..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg text-xs focus:ring-1 focus:ring-[#C27D6E]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DEC3B5]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#191E28]">{c.name}</div>
                    <div className="text-[10px] text-[#71717A]">Member since {c.createdAt}</div>
                  </td>
                  <td className="py-3 px-4 text-[#555E6C]">
                    <div className="flex items-center gap-1.5"><Mail size={12} className="text-[#C27D6E]" /> {c.email}</div>
                    {c.phone && <div className="flex items-center gap-1.5 mt-0.5"><Phone size={12} className="text-[#C27D6E]" /> {c.phone}</div>}
                  </td>
                  <td className="py-3 px-4 text-[#555E6C]">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#A66355]" />
                      <span>{c.city ? `${c.city}, ${c.state}` : 'India'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#191E28]">
                    {c.totalOrders} orders
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    {currencySymbol}{c.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'VIP' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
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
