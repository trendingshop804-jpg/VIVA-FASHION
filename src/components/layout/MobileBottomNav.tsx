import React from 'react';
import { Home, Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { setIsCartOpen, setIsWishlistOpen, setIsSearchOpen } = useUI();
  const { totalCartItems, wishlist } = useCart();
  const { setIsAuthModalOpen, isAuthenticated, user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] border-t border-[#DEC3B5]/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 backdrop-blur-md">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center p-1 text-[#C27D6E] group transition-colors"
          aria-label="Home"
        >
          <Home size={18} />
          <span className="text-[10px] font-medium tracking-wide mt-0.5">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center p-1 text-[#191E28] hover:text-[#C27D6E] group transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
          <span className="text-[10px] font-medium tracking-wide mt-0.5 text-[#555E6C]">Search</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="relative flex flex-col items-center justify-center p-1 text-[#191E28] hover:text-[#C27D6E] group transition-colors"
          aria-label="Account"
        >
          <User size={18} className={isAuthenticated ? "text-[#C27D6E]" : ""} />
          {isAuthenticated && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          )}
          <span className="text-[10px] font-medium tracking-wide mt-0.5 text-[#555E6C]">
            {isAuthenticated ? (user?.name?.split(' ')[0] || 'Profile') : 'Account'}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center p-1 text-[#191E28] hover:text-[#C27D6E] group transition-colors"
          aria-label="Wishlist"
        >
          <Heart size={18} className={wishlist.length > 0 ? "fill-[#C27D6E] text-[#C27D6E]" : ""} />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-[#C27D6E] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-wide mt-0.5 text-[#555E6C]">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1 text-[#191E28] hover:text-[#C27D6E] group transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag size={18} />
          {totalCartItems > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-[#191E28] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-wide mt-0.5 text-[#555E6C]">Cart</span>
        </button>
      </div>
    </div>
  );
};
