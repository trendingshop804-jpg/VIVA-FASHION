import React from 'react';
import { Truck, Heart, Sparkles, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export const AnnouncementBar: React.FC = () => {
  const { currencySymbol, freeShippingThreshold, totalCartItems, shippingFeeEnabled } = useCart();
  const { activeConfig } = useCMS();
  const { setIsCartOpen } = useUI();
  const { setIsAuthModalOpen, isAuthenticated, profile } = useAuth();
  const general = activeConfig?.general;

  if (general && general.isAnnouncementVisible === false) {
    return null;
  }

  return (
    <div className="bg-[#3A1F2E] text-white py-2 px-4 text-[11px] md:text-xs flex items-center justify-between">
      {/* Left: Free Shipping */}
      <div className="flex items-center gap-1.5">
        <Truck size={13} />
        <span className="hidden sm:inline">
          {shippingFeeEnabled
            ? `Free Shipping on Orders Above ${currencySymbol}${freeShippingThreshold}`
            : 'Free Shipping on All Orders'}
        </span>
        <span className="sm:hidden">Free Shipping</span>
      </div>

      {/* Center: Quality Badges */}
      <div className="hidden md:flex items-center gap-4 text-[10px] tracking-wider">
        <span className="flex items-center gap-1"><Sparkles size={11} /> Elegant Styles</span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-1"><Heart size={11} /> Premium Quality</span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-1"><Sparkles size={11} /> Made for You</span>
      </div>

      {/* Right: Login & Cart */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1 hover:text-[#F8C8DC] transition-colors"
        >
          <User size={13} />
          <span>{isAuthenticated ? (profile?.name || 'My Account') : 'Login / Register'}</span>
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-1 hover:text-[#F8C8DC] transition-colors"
          aria-label={`Cart (${totalCartItems} items)`}
        >
          <ShoppingBag size={13} />
          <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-white text-[#3A1F2E] text-[9px] font-bold rounded-full flex items-center justify-center">
            {totalCartItems}
          </span>
        </button>
      </div>
    </div>
  );
};
