import React from 'react';
import { ShoppingBag, ArrowUpDown } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const BestSellersForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { bestSellers } = draftConfig;

  return (
    <div className="space-y-6 text-xs">
      {/* Visibility Toggle */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between">
        <div>
          <strong className="text-[#191E28] block text-xs">Best Sellers Section Visibility</strong>
          <span className="text-[11px] text-[#555E6C]">Enable or disable the Best Sellers section on the homepage</span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28] font-bold">
          <input
            type="checkbox"
            checked={bestSellers.isVisible}
            onChange={(e) => updateDraft('bestSellers', { isVisible: e.target.checked })}
            className="accent-[#C27D6E] w-4 h-4"
          />
          <span>Show Best Sellers Section</span>
        </label>
      </div>

      {/* Section Headings */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <ShoppingBag size={14} /> Section Titles & Copy
        </h4>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Section Title</label>
          <input
            type="text"
            value={bestSellers.sectionTitle}
            onChange={(e) => updateDraft('bestSellers', { sectionTitle: e.target.value.toUpperCase() })}
            placeholder="e.g. BEST SELLERS"
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
          />
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Subtitle / Tagline</label>
          <input
            type="text"
            value={bestSellers.subtitle}
            onChange={(e) => updateDraft('bestSellers', { subtitle: e.target.value })}
            placeholder="e.g. Handpicked favorites by modern women"
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
          />
        </div>
      </div>

      {/* Product Display Controls */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <ArrowUpDown size={14} /> Product Display & Sorting
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Products To Display (Count)</label>
            <select
              value={bestSellers.productCount}
              onChange={(e) => updateDraft('bestSellers', { productCount: Number(e.target.value) })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
            >
              <option value={4}>4 Products</option>
              <option value={6}>6 Products</option>
              <option value={8}>8 Products (Default)</option>
              <option value={12}>12 Products</option>
              <option value={16}>16 Products</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Default Sort Order</label>
            <select
              value={bestSellers.sortBy}
              onChange={(e) => updateDraft('bestSellers', { sortBy: e.target.value as any })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
            >
              <option value="bestseller">Highest Rated / Best Selling</option>
              <option value="newest">Newest Arrivals First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
