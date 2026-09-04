import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, setIsWishlistOpen, setIsCartOpen } = useUI();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#191E28]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-[#EAE3D9] flex items-center justify-between bg-[#F5EBE6]">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-[#C27D6E] fill-[#C27D6E]" />
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#191E28]">
              Saved Wishlist ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-[#191E28] hover:bg-[#EAD7CD] transition-colors"
            aria-label="Close wishlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-[#555E6C]">
              <Heart size={36} className="mx-auto text-[#DEC3B5]" />
              <p className="text-sm font-semibold text-[#191E28]">No saved items yet</p>
              <p className="text-xs text-[#71717A]">
                Click the heart icon on any product to save it to your wishlist.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="bg-[#191E28] text-white px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#C27D6E] transition-colors"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 bg-white p-3 rounded-xl border border-[#DEC3B5]/50 shadow-2xs"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F5EBE6] shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#191E28] line-clamp-2">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="text-[#8C93A0] hover:text-[#C27D6E] transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-[#191E28] mt-1">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(product);
                      setIsWishlistOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-1.5 px-3 rounded-md text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors mt-2"
                  >
                    <ShoppingBag size={12} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
