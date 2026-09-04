import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { useUI } from '../../context/UIContext';
import { useAdmin } from '../../context/AdminContext';
import { useCMS } from '../../context/CMSContext';
import { INITIAL_PRODUCTS } from '../../services/storeService';

export const BestSellersSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useUI();
  const { products: adminProducts } = useAdmin();
  const { activeConfig } = useCMS();
  const bestSellers = activeConfig?.bestSellers;

  if (bestSellers && bestSellers.isVisible === false) {
    return null;
  }
  
  const allProducts = adminProducts.length > 0 ? adminProducts : INITIAL_PRODUCTS;

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

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

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'new-arrivals') {
          if (!product.isNewArrival) return false;
        } else if (selectedCategory === 'sale') {
          if (!product.isSale) return false;
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some(s => selectedSizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some(c => selectedColors.includes(c.name));
        if (!hasMatchingColor) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      return true;
    });
  }, [allProducts, selectedCategory, selectedSizes, selectedColors, maxPrice]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'kurtis': return 'KURTIS & KURTAS';
      case 'shawls': return 'SHAWLS & DUPATTAS';
      case 'leggings': return 'LEGGINGS & CHURIDARS';
      case 'new-arrivals': return 'NEW ARRIVALS';
      case 'sale': return 'SPECIAL OFFERS & SALE';
      default: return bestSellers?.sectionTitle || 'BEST SELLERS';
    }
  };

  return (
    <section id="featured-products" className="w-full bg-[#FAF7F2] py-8 md:py-12 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden flex items-center justify-between mb-4 pb-3 border-b border-[#DEC3B5]">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 bg-[#F5EBE6] text-[#191E28] px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#DEC3B5]"
          >
            <SlidersHorizontal size={14} />
            <span>Filter Catalog</span>
          </button>
          <span className="text-xs text-[#71717A]">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            <div
              className="fixed inset-0 bg-[#191E28]/60 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF7F2] shadow-2xl p-4 overflow-y-auto flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D9]">
                  <h3 className="font-bold text-sm tracking-wider uppercase text-[#191E28]">
                    Filter Options
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-[#191E28] hover:bg-[#EAD7CD]"
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
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#191E28] text-white py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase mt-4"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

        {/* Main Grid: Left Filter (3 cols) | Right Best Sellers (9 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Left: Filter Sidebar (3 cols) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <FilterSidebar
              selectedSizes={selectedSizes}
              onToggleSize={toggleSize}
              selectedColors={selectedColors}
              onToggleColor={toggleColor}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Right: Best Sellers Header & Product Carousel/Grid (8-9 cols) */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            
            {/* Header with Navigation Arrows */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D9]">
              <div className="flex items-center gap-3">
                <h3 className="text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-[#191E28]">
                  {getCategoryTitle()}
                </h3>
                {selectedCategory !== 'all' && (
                  <span className="text-xs px-2.5 py-0.5 bg-[#EAD7CD] text-[#191E28] rounded-full font-semibold uppercase tracking-wider text-[10px]">
                    {selectedCategory}
                  </span>
                )}
              </div>

              {/* Arrow controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-7 h-7 rounded-full border border-[#DEC3B5] hover:border-[#191E28] text-[#191E28] flex items-center justify-center transition-colors bg-white shadow-xs"
                  aria-label="Previous products"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-7 h-7 rounded-full border border-[#DEC3B5] hover:border-[#191E28] text-[#191E28] flex items-center justify-center transition-colors bg-white shadow-xs"
                  aria-label="Next products"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Products Container */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-[#F5EBE6] rounded-xl border border-dashed border-[#DEC3B5] space-y-2">
                <p className="text-sm font-semibold text-[#191E28]">No products match the selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#C27D6E] underline uppercase tracking-wider"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="relative group/carousel">
                {/* Horizontal scroll on carousel / 4-column auto grid */}
                <div
                  ref={carouselRef}
                  className="grid grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[calc(33.333%-12px)] lg:auto-cols-[calc(25%-12px)] gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory"
                >
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="snap-start">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Forward overlay circular arrow button matching reference */}
                {filteredProducts.length > 3 && (
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-[#191E28] border border-[#DEC3B5] items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
