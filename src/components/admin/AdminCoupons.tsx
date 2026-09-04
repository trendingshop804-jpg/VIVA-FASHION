import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../services/storeService';
import type { Coupon } from '../../types';

export const AdminCoupons: React.FC = () => {
  const { coupons, refreshCoupons } = useAdmin();
  const { currencySymbol, showToast } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 999,
    usageLimit: 500,
    isActive: true,
  });

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) return;

    await StoreService.saveCoupon(newCoupon);
    await refreshCoupons();
    setIsModalOpen(false);
    setNewCoupon({ code: '', discountType: 'percentage', discountValue: 15, minOrder: 999, usageLimit: 500, isActive: true });
    showToast(`Coupon ${newCoupon.code} created!`, 'success');
  };

  const handleDelete = async (id: string) => {
    await StoreService.deleteCoupon(id);
    await refreshCoupons();
    showToast('Coupon removed', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
            Coupons & Promotional Discounts ({coupons.length})
          </h2>
          <p className="text-xs text-[#555E6C]">
            Create promotional discount codes for your customers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#191E28] hover:bg-[#C27D6E] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
        >
          <Plus size={14} />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm tracking-wider bg-[#F5EBE6] text-[#A66355] px-3 py-1 rounded-lg border border-[#DEC3B5]">
                {c.code}
              </span>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                title="Delete coupon"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="text-xl font-bold text-[#191E28]">
              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `${currencySymbol}${c.discountValue} FLAT OFF`}
            </div>

            <div className="text-xs text-[#555E6C] space-y-1">
              <div>Min Order: <strong>{currencySymbol}{c.minOrder.toLocaleString()}</strong></div>
              <div>Usage: <strong>{c.timesUsed} / {c.usageLimit} times</strong></div>
            </div>

            <div className="pt-2 border-t border-[#EAE3D9] flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Active Code
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] p-6 rounded-2xl max-w-md w-full border border-[#DEC3B5] space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#191E28] uppercase tracking-wider font-serif">
              Create Promo Coupon
            </h4>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full bg-white border border-[#DEC3B5] rounded p-2 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({currencySymbol})</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Minimum Order Value ({currencySymbol})</label>
                <input
                  type="number"
                  value={newCoupon.minOrder || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                  className="w-full bg-white border border-[#DEC3B5] rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DEC3B5] rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#191E28] hover:bg-[#C27D6E] text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
