import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart, currencySymbol } = useCart();
  const { setQuickViewProduct } = useUI();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col bg-[#FAF7F2] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-[#DEC3B5]/40">
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full bg-[#F5EBE6] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tag badge (if any) */}
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#191E28] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-[#DEC3B5]/50 shadow-sm">
            {product.tag}
          </span>
        )}

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-[#C27D6E] text-white scale-110'
              : 'bg-[#FAF7F2]/90 hover:bg-white text-[#191E28] hover:scale-110'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
        </button>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-[#191E28]/90 hover:bg-[#191E28] text-white text-[10px] font-semibold tracking-wider uppercase py-2 px-2 rounded backdrop-blur-sm flex items-center justify-center gap-1 transition-colors"
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-[#C27D6E] hover:bg-[#A66355] text-white p-2 rounded shadow transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between space-y-1.5">
        {/* Rating & Category */}
        <div className="flex items-center justify-between">
          <StarRating rating={product.rating} showCount={false} />
          <span className="text-[10px] uppercase tracking-wider text-[#A66355] font-bold">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <h4
          onClick={() => setQuickViewProduct(product)}
          className="text-xs sm:text-[13px] font-medium text-[#191E28] line-clamp-2 hover:text-[#C27D6E] cursor-pointer transition-colors leading-snug"
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Price & Colors */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#191E28]">
              {currencySymbol}{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#8C93A0] line-through">
                {currencySymbol}{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c, idx) => (
              <span
                key={idx}
                className="w-2 h-2 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
