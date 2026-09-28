import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { useUI } from '../../context/UIContext';
import { useAdmin } from '../../context/AdminContext';
import { useCMS } from '../../context/CMSContext';
import { INITIAL_PRODUCTS } from '../../services/storeService';

// Category slugs (nav / circles) mapped to the product categories they display
const CATEGORY_GROUPS: Record<string, string[]> = {
  kurtis: ['kurtis'],
  'salwar-suits': ['kurtis'],
  dresses: ['kurtis'],
  'co-ord-sets': ['kurtis'],
  shawls: ['shawls'],
  leggings: ['leggings'],
};

export const BestSellersSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useUI();
  const { products: adminProducts } = useAdmin();
  const { activeConfig } = useCMS();
  const bestSellers = activeConfig?.bestSellers;
  // Use admin products if we have enough, otherwise fall back to seeded catalog
  const allProducts = adminProducts.length >= 4 ? adminProducts : INITIAL_PRODUCTS;
  // Reference design shows a single clean row of 4 on the default view
  const displayLimit = selectedCategory === 'all' ? 4 : 8;

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(3000);
    setSelectedCategory('all');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (product.isActive === false) return false;

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'new-arrivals') {
          if (!product.isNewArrival) return false;
        } else if (selectedCategory === 'sale') {
          if (!product.isSale) return false;
        } else {
          const allowed = CATEGORY_GROUPS[selectedCategory] || [selectedCategory];
          if (!allowed.includes(product.category)) return false;
        }
      }

      if (selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some(s => selectedSizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some(c => selectedColors.includes(c.name));
        if (!hasMatchingColor) return false;
      }

      if (product.price > maxPrice) return false;

      return true;
    });
  }, [allProducts, selectedCategory, selectedSizes, selectedColors, maxPrice]);

  if (bestSellers && bestSellers.isVisible === false) {
    return null;
  }

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'kurtis': return 'Kurtis & Kurtas';
      case 'shawls': return 'Shawls & Dupattas';
      case 'leggings': return 'Leggings & Churidars';
      case 'new-arrivals': return 'New Arrivals';
      case 'sale': return 'Special Offers & Sale';
      default: return bestSellers?.sectionTitle || 'Best Sellers';
    }
  };

  return (
    <section id="featured-products" className="w-full bg-[#FDFBFA] py-10 md:py-14">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-4 pb-3 border-b border-[#E5C4AD]">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#E5C4AD]"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
          <span className="text-xs text-[#8C7B6B]">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-4 overflow-y-auto flex flex-col z-10">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D9]">
                <h3 className="font-bold text-sm tracking-wider uppercase text-[#1A1A2E]">
                  Filters
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[#1A1A2E] hover:bg-[#F5E6D3]"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar
                selectedSizes={selectedSizes}
                onToggleSize={toggleSize}
                selectedColors={selectedColors}
                onToggleColor={toggleColor}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                onResetFilters={resetFilters}
              />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#C2185B] text-white py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase mt-4"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#5C384C]">
              Featured Collection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A2E] font-serif mt-1">
              {getCategoryTitle()}
            </h2>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#C2185B] hover:gap-2.5 transition-all">
            View All <ArrowRight size={16} />
          </button>
        </div>

        {/* Product Grid - Clean 4-column layout */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#E5C4AD]">
            <p className="text-sm font-semibold text-[#1A1A2E]">No products match the selected filters.</p>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#C2185B] underline uppercase tracking-wider mt-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.slice(0, displayLimit).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
