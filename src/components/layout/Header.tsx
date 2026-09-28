import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';

export const Header: React.FC = () => {
  const { totalCartItems, wishlist } = useCart();
  const { setIsCartOpen, setIsWishlistOpen, setIsSearchOpen } = useUI();
  const { activeConfig } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = activeConfig?.header?.navigationItems?.filter(i => i.isActive) || [
    { id: 'nav-1', label: 'Home', url: '#hero', isActive: true, order: 1 },
    { id: 'nav-2', label: 'Women', url: '#featured-categories', isActive: true, order: 2, hasDropdown: true },
    { id: 'nav-3', label: 'New Arrivals', url: '#featured-products', isActive: true, order: 3 },
    { id: 'nav-4', label: 'Sale', url: '#featured-products', isActive: true, order: 4 },
    { id: 'nav-5', label: 'About Us', url: '#about', isActive: true, order: 5 },
    { id: 'nav-6', label: 'Contact', url: '#footer', isActive: true, order: 6 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#EAE3D9]/60 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4 gap-4">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = item.url === '#hero';
              return (
                <a
                  key={item.id || item.label}
                  href={item.url || '#'}
                  className={`relative flex items-center gap-0.5 text-[13px] font-medium transition-colors group py-1 ${
                    isActive ? 'text-[#C2185B]' : 'text-[#1A1A2E] hover:text-[#C2185B]'
                  }`}
                >
                  {item.label}
                  {(item as any).hasDropdown && (
                    <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
                  )}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#C2185B] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Search + Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for kurtis, dresses, leggings..."
                  className="w-56 lg:w-64 bg-white border border-[#E3DDD8] rounded-full px-4 py-2 pr-10 text-xs text-[#1A1A2E] placeholder-[#8C7B6B] focus:outline-none focus:border-[#C2185B] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7B6B] hover:text-[#C2185B] transition-colors"
                >
                  <Search size={15} />
                </button>
              </div>
            </form>

            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-[#1A1A2E] hover:text-[#C2185B] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#1A1A2E] hover:text-[#C2185B] transition-colors"
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={20} className={wishlist.length > 0 ? 'fill-[#C2185B] text-[#C2185B]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C2185B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#1A1A2E] hover:text-[#C2185B] transition-colors"
              aria-label={`Shopping Bag (${totalCartItems} items)`}
            >
              <ShoppingBag size={20} />
              {totalCartItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C2185B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
