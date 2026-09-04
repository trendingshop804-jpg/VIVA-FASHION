import React from 'react';
import { X, Heart, ShoppingBag, ChevronRight, Sparkles, Phone, Mail } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

const DRAWER_LINKS = [
  { label: 'Summer Ethnic Collection', href: '#hero', tag: 'New' },
  { label: 'New Arrivals', href: '#featured-categories', category: 'new-arrivals' },
  { label: 'Chic Kurthas', href: '#featured-products', category: 'kurthas' },
  { label: 'Comfy Leggings & Churidars', href: '#featured-products', category: 'leggings' },
  { label: 'Anarkalis & Dresses', href: '#featured-products', category: 'dresses' },
  { label: 'Artisan Tunics & Tops', href: '#featured-products', category: 'tops' },
  { label: 'Best Sellers', href: '#featured-products' },
  { label: 'Customer Reviews', href: '#customer-loves' },
  { label: 'Our Story & Heritage', href: '#our-story' },
];

export const MobileDrawer: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, setIsWishlistOpen, setIsCartOpen, setSelectedCategory } = useUI();
  const { wishlist, totalCartItems } = useCart();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#191E28]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10 transition-transform duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#EAE3D9] flex items-center justify-between bg-[#F5EBE6]/60">
          <Logo size="sm" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-[#191E28] hover:text-[#C27D6E] transition-colors rounded-full hover:bg-[#EAD7CD]/40"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Promo snippet */}
        <div className="bg-[#B87B6F] text-[#FAF7F2] py-2 px-4 text-center text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5">
          <Sparkles size={12} />
          <span>FREE SHIPPING OVER $75</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {DRAWER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                if (link.category) {
                  setSelectedCategory(link.category);
                }
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2.5 px-3 text-sm font-medium text-[#191E28] rounded-lg hover:bg-[#F2ECE0] transition-colors group"
            >
              <span className="group-hover:text-[#C27D6E] transition-colors">
                {link.label}
              </span>
              <div className="flex items-center gap-2">
                {link.tag && (
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#C27D6E] text-white rounded-full">
                    {link.tag}
                  </span>
                )}
                <ChevronRight size={15} className="text-[#C69B85]" />
              </div>
            </a>
          ))}
        </div>

        {/* Quick Actions Footer in Drawer */}
        <div className="p-4 border-t border-[#EAE3D9] bg-[#FDFBF7] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-[#DEC3B5] rounded-lg text-xs font-semibold text-[#191E28] hover:border-[#C27D6E]"
            >
              <Heart size={14} className={wishlist.length > 0 ? "text-[#C27D6E] fill-[#C27D6E]" : ""} />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-[#191E28] text-white rounded-lg text-xs font-semibold hover:bg-[#C27D6E] transition-colors"
            >
              <ShoppingBag size={14} />
              <span>Cart ({totalCartItems})</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[#71717A] space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone size={11} className="text-[#C27D6E]" />
              <span>1-800-VIVA-ETHNIC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={11} className="text-[#C27D6E]" />
              <span>care@vivafashionethnic.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
