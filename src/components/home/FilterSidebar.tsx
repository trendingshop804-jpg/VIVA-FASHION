import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

interface FilterSidebarProps {
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  onResetFilters: () => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const AVAILABLE_COLORS = [
  { name: 'Mustard Gold', hex: '#DCA134' },
  { name: 'Indigo Blue', hex: '#2A4A7F' },
  { name: 'Sage Green', hex: '#7A8F73' },
  { name: 'Classic Black', hex: '#151515' },
  { name: 'Blush Pink', hex: '#D99A8C' },
  { name: 'Ivory Cream', hex: '#FAF4EC' },
  { name: 'Maroon Red', hex: '#8F263E' },
  { name: 'Emerald Green', hex: '#1E4D3E' },
];

const CATEGORIES_FILTER = [
  { id: 'all', label: 'All Ethnic Wear' },
  { id: 'kurtis', label: 'Kurtis & Kurtas' },
  { id: 'shawls', label: 'Shawls & Dupattas' },
  { id: 'leggings', label: 'Leggings & Churidars' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedSizes,
  onToggleSize,
  selectedColors,
  onToggleColor,
  maxPrice,
  onPriceChange,
  onResetFilters,
}) => {
  const { selectedCategory, setSelectedCategory } = useUI();
  const { currencySymbol } = useCart();
  
  const [openSections, setOpenSections] = useState({
    size: true,
    color: true,
    price: true,
    category: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    maxPrice < 3000 ||
    selectedCategory !== 'all';

  return (
    <aside className="w-full bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#DEC3B5]/70 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
        <h3 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#191E28]">
          FILTER
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#C27D6E] hover:underline"
            title="Reset all filters"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="border-b border-[#EAE3D9] pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#191E28] uppercase tracking-wider mb-2.5 focus:outline-none"
        >
          <span>Category</span>
          {openSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.category && (
          <div className="space-y-1.5 pt-1">
            {CATEGORIES_FILTER.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-xs text-[#333A48] cursor-pointer hover:text-[#C27D6E] select-none"
              >
                <input
                  type="radio"
                  name="category_filter"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="accent-[#C27D6E]"
                />
                <span className={selectedCategory === cat.id ? 'font-bold text-[#C27D6E]' : ''}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Size Filter */}
      <div className="border-b border-[#EAE3D9] pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#191E28] uppercase tracking-wider mb-2.5 focus:outline-none"
        >
          <span>Size</span>
          {openSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.size && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onToggleSize(size)}
                  className={`px-2.5 h-7 rounded text-[10px] font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#191E28] text-white border-[#191E28]'
                      : 'bg-white text-[#191E28] border-[#DEC3B5] hover:border-[#C27D6E]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Color Filter */}
      <div className="border-b border-[#EAE3D9] pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#191E28] uppercase tracking-wider mb-2.5 focus:outline-none"
        >
          <span>Color</span>
          {openSections.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.color && (
          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_COLORS.map((c) => {
              const isSelected = selectedColors.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => onToggleColor(c.name)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#C27D6E] scale-110'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Price Filter */}
      <div className="pb-1">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#191E28] uppercase tracking-wider mb-2.5 focus:outline-none"
        >
          <span>Price Range</span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.price && (
          <div className="space-y-2 pt-1">
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full accent-[#C27D6E] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-medium text-[#555E6C]">
              <span>{currencySymbol}300</span>
              <span className="font-bold text-[#191E28]">Up to {currencySymbol}{maxPrice.toLocaleString()}</span>
              <span>{currencySymbol}3,000</span>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
};
