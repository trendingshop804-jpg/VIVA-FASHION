import React from 'react';
import { Menu, Search, User, Heart, ShoppingBag } from 'lucide-react';
import { Logo } from '../common/Logo';
import { DesktopNav } from './DesktopNav';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { totalCartItems, wishlist } = useCart();
  const { setIsCartOpen, setIsWishlistOpen, setIsMobileMenuOpen, setIsSearchOpen } = useUI();
  const { setIsAuthModalOpen, isAuthenticated, profile } = useAuth();

  return (
    <header className="w-full bg-[#FAF7F2] border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Bar */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-3 md:gap-5 w-1/3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-[#191E28] hover:text-[#C27D6E] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={20} />
            </button>
            
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#191E28] hover:text-[#C27D6E] transition-colors"
              aria-label="Open Search"
            >
              <Search size={15} />
              <span className="font-semibold">SEARCH</span>
            </button>
          </div>

          {/* Center: Brand Circular Logo */}
          <div className="flex justify-center w-1/3">
            <Logo size="md" />
          </div>

          {/* Right: Icons (Search on mobile, User, Wishlist, Bag) */}
          <div className="flex items-center justify-end gap-3 md:gap-4 w-1/3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-1.5 text-[#191E28] hover:text-[#C27D6E] transition-colors"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`p-1.5 transition-colors relative ${isAuthenticated ? 'text-[#C27D6E]' : 'text-[#191E28] hover:text-[#C27D6E]'}`}
              aria-label="My Account"
              title={isAuthenticated ? `Signed in as ${profile?.name || 'Customer'}` : "Sign In or Register"}
            >
              <User size={19} />
              {isAuthenticated && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 text-[#191E28] hover:text-[#C27D6E] transition-colors"
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={19} className={wishlist.length > 0 ? "fill-[#C27D6E] text-[#C27D6E]" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C27D6E] text-[#FFFDFB] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-[#191E28] hover:text-[#C27D6E] transition-colors"
              aria-label={`Shopping Bag (${totalCartItems} items)`}
            >
              <ShoppingBag size={19} />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#191E28] text-[#FFFDFB] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Row */}
        <div className="hidden md:block">
          <DesktopNav />
        </div>
      </div>
    </header>
  );
};
