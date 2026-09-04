import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Truck, ShieldCheck, Plus, Minus, Check, Zap } from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { VisitorAnalyticsService } from '../../services/visitorAnalytics';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, setIsCartOpen } = useUI();
  const { addToCart, isInWishlist, toggleWishlist, currencySymbol } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0] || (quickViewProduct.category === 'shawls' ? 'Free Size' : 'M'));
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setActiveImage(quickViewProduct.image);
      setQuantity(1);

      // Track product view in analytics stream
      VisitorAnalyticsService.trackProductView(quickViewProduct.name);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const wishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    VisitorAnalyticsService.trackAddToCart(quickViewProduct.name);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    VisitorAnalyticsService.trackAddToCart(quickViewProduct.name);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(quickViewProduct);
    VisitorAnalyticsService.trackWishlist(quickViewProduct.name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#FAF7F2] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-[#DEC3B5]/70 max-h-[92vh] overflow-y-auto">
          
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 text-[#191E28] hover:bg-[#EAD7CD] flex items-center justify-center shadow-xs transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-4 sm:p-6 bg-[#F5EBE6] flex flex-col justify-between">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-sm border border-[#DEC3B5]/60 mb-3">
                <img
                  src={activeImage || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails Gallery */}
              {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickViewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === img ? 'border-[#C27D6E] shadow-sm ring-1 ring-[#C27D6E]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Category & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C27D6E] bg-[#F5EBE6] px-2.5 py-0.5 rounded">
                    {quickViewProduct.category.toUpperCase()}
                  </span>
                  <StarRating rating={quickViewProduct.rating} count={quickViewProduct.reviewCount} />
                </div>

                {/* Title & Brand */}
                <div>
                  {quickViewProduct.brand && (
                    <span className="text-[10px] uppercase font-bold text-[#A66355] tracking-wider block">
                      {quickViewProduct.brand}
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif leading-snug">
                    {quickViewProduct.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#191E28]">
                    {currencySymbol}{quickViewProduct.price.toLocaleString()}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-[#8C93A0] line-through">
                      {currencySymbol}{quickViewProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#2E5A44] bg-[#2E5A44]/10 px-2 py-0.5 rounded">
                    In Stock ({quickViewProduct.stock} left)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#555E6C] leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Category-Specific Specifications Box */}
                <div className="bg-[#FAF4EC] p-3 rounded-lg border border-[#DEC3B5]/60 text-xs space-y-1.5">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#A66355] block">
                    Product Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#333A48]">
                    {quickViewProduct.fabric && (
                      <div><span className="text-[#71717A]">Fabric:</span> {quickViewProduct.fabric}</div>
                    )}
                    {quickViewProduct.fit && (
                      <div><span className="text-[#71717A]">Fit:</span> {quickViewProduct.fit}</div>
                    )}
                    {quickViewProduct.sleeveType && (
                      <div><span className="text-[#71717A]">Sleeves:</span> {quickViewProduct.sleeveType}</div>
                    )}
                    {quickViewProduct.length && (
                      <div><span className="text-[#71717A]">Length:</span> {quickViewProduct.length}</div>
                    )}
                    {quickViewProduct.neckType && (
                      <div><span className="text-[#71717A]">Neck:</span> {quickViewProduct.neckType}</div>
                    )}
                    {quickViewProduct.pattern && (
                      <div><span className="text-[#71717A]">Pattern:</span> {quickViewProduct.pattern}</div>
                    )}
                    {quickViewProduct.stretch && (
                      <div><span className="text-[#71717A]">Stretch:</span> {quickViewProduct.stretch}</div>
                    )}
                    {quickViewProduct.waistType && (
                      <div><span className="text-[#71717A]">Waist:</span> {quickViewProduct.waistType}</div>
                    )}
                    {quickViewProduct.workEmbroidery && (
                      <div className="col-span-2"><span className="text-[#71717A]">Work:</span> {quickViewProduct.workEmbroidery}</div>
                    )}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#191E28] block">
                    Color: <span className="font-normal text-[#555E6C]">{selectedColor}</span>
                  </label>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                          selectedColor === color.name
                            ? 'ring-2 ring-offset-2 ring-[#C27D6E] scale-110'
                            : 'border-black/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check size={12} className="text-white drop-shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#191E28]">
                      Size: <span className="font-normal text-[#555E6C]">{selectedSize}</span>
                    </label>
                    <button
                      onClick={() => alert('Ethnic Wear Size Guide:\nXS: Bust 32", Waist 26"\nS: Bust 34", Waist 28"\nM: Bust 36", Waist 30"\nL: Bust 38", Waist 32"\nXL: Bust 40", Waist 34"\nXXL: Bust 42", Waist 36"')}
                      className="text-[11px] text-[#A66355] underline hover:text-[#191E28]"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                          selectedSize === size
                            ? 'bg-[#191E28] text-white border-[#191E28]'
                            : 'bg-white text-[#191E28] border-[#DEC3B5] hover:border-[#C27D6E]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#191E28]">
                    Qty:
                  </span>
                  <div className="flex items-center border border-[#DEC3B5] rounded-md bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-[#EAD7CD] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#191E28]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 hover:bg-[#EAD7CD] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className="pt-3 space-y-2 border-t border-[#EAE3D9]">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#191E28] hover:bg-[#C27D6E] text-white py-2.5 rounded-lg text-xs font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#C27D6E] hover:bg-[#A66355] text-white py-2.5 rounded-lg text-xs font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Zap size={14} />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      wishlisted
                        ? 'bg-[#C27D6E] text-white border-[#C27D6E]'
                        : 'border-[#DEC3B5] text-[#191E28] hover:border-[#C27D6E] bg-white'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart size={16} className={wishlisted ? 'fill-white' : ''} />
                  </button>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#555E6C] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className="text-[#C27D6E]" />
                    <span>Free Delivery over {currencySymbol}999</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#C27D6E]" />
                    <span>Authentic Artisan Guarantee</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
