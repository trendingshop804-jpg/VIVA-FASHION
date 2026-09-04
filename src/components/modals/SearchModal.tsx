import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { INITIAL_PRODUCTS } from '../../services/storeService';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useUI();
  const { products: adminProducts } = useAdmin();
  const { currencySymbol } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allProducts = adminProducts.length > 0 ? adminProducts : INITIAL_PRODUCTS;

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allProducts.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.fabric && p.fabric.toLowerCase().includes(term)) ||
        (p.workEmbroidery && p.workEmbroidery.toLowerCase().includes(term)) ||
        p.colors.some(c => c.name.toLowerCase().includes(term))
    );
  }, [allProducts, searchTerm]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 sm:pt-20">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-2xl border border-[#DEC3B5] transition-all">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-[#EAE3D9] flex items-center gap-3 bg-white">
            <Search size={20} className="text-[#C27D6E] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search kurtis, shawls, leggings, fabrics (cotton, silk, wool)..."
              className="w-full bg-transparent text-sm sm:text-base text-[#191E28] placeholder-[#8C93A0] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#8C93A0] hover:text-[#191E28] px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-full text-[#191E28] hover:bg-[#EAD7CD] transition-colors shrink-0"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Popular Search Suggestions */}
          <div className="px-5 py-3 bg-[#FAF4EC] border-b border-[#EAE3D9] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[#A66355] font-semibold shrink-0">Popular:</span>
            {['Cotton Kurti', 'Kashmiri Shawl', 'Ankle Leggings', 'Churidar', 'Anarkali', 'Mustard Gold'].map((item) => (
              <button
                key={item}
                onClick={() => setSearchTerm(item)}
                className="bg-white px-2.5 py-1 rounded-full text-[11px] font-medium text-[#191E28] border border-[#DEC3B5] hover:border-[#C27D6E] shrink-0 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Results list */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-3">
            {searchTerm.trim() && searchResults.length === 0 ? (
              <div className="text-center py-8 text-[#555E6C]">
                <p className="text-sm font-semibold">No matches found for "{searchTerm}"</p>
                <p className="text-xs text-[#71717A] mt-1">
                  Try searching for 'kurti', 'shawl', 'leggings', or 'embroidered'
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setQuickViewProduct(product);
                      setIsSearchOpen(false);
                    }}
                    className="flex gap-3 bg-white p-2.5 rounded-xl border border-[#DEC3B5]/50 hover:border-[#C27D6E] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F5EBE6] shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A66355] font-bold block">
                          {product.category}
                        </span>
                        <h4 className="text-xs font-semibold text-[#191E28] line-clamp-1 group-hover:text-[#C27D6E] transition-colors">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#191E28]">
                          {currencySymbol}{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#C27D6E] font-semibold flex items-center gap-0.5">
                          View <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#71717A] text-xs">
                Search our collection of Kurtis, Shawls, and Leggings.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
