import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = '/assets/prod-1.png';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist, addToCart, currencySymbol } = useCart();
  const { setQuickViewProduct } = useUI();
  const wishlisted = isInWishlist(product.id);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-[#EAE3D9]/60">
      {/* Product Image Area */}
      <div className="relative aspect-[218/204] w-full bg-[#F5E6D3]/30 overflow-hidden">
        <img
          src={imgError ? FALLBACK_IMAGE : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-[#C2185B] text-white'
              : 'bg-white/90 hover:bg-white text-[#1A1A2E] hover:text-[#C2185B]'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={13} className={wishlisted ? 'fill-white' : ''} />
        </button>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-[#1A1A2E]/90 hover:bg-[#1A1A2E] text-white text-[10px] font-semibold tracking-wider uppercase py-2 px-2 rounded backdrop-blur-sm flex items-center justify-center gap-1 transition-colors"
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
            className="bg-[#C2185B] hover:bg-[#A01348] text-white p-2 rounded shadow transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-1">
        {/* Product Title */}
        <h4
          onClick={() => setQuickViewProduct(product)}
          className="text-xs sm:text-[13px] font-medium text-[#1A1A2E] line-clamp-1 hover:text-[#C2185B] cursor-pointer transition-colors"
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-[#1A1A2E]">
            {currencySymbol}{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-[#8C93A0] line-through">
              {currencySymbol}{product.originalPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-semibold text-[#C2185B]">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-1.5">
          <StarRating rating={product.rating} showCount={true} />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="mt-3 w-full bg-[#C2185B] hover:bg-[#A01348] text-white py-2.5 rounded-md text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
