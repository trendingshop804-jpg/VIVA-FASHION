import React from 'react';
import { Truck } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';

export const PromoBanners: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { currencySymbol, freeShippingThreshold } = useCart();
  const { activeConfig } = useCMS();

  const promos = activeConfig?.promotions?.filter(p => p.isActive) || [];

  const handleBannerClick = (url?: string) => {
    if (url && url.startsWith('#')) {
      const el = document.getElementById(url.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (url) {
      window.location.href = url;
    } else {
      setSelectedCategory('new-arrivals');
      const target = document.getElementById('featured-products');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="promotions" className="w-full bg-[#FAF7F2] py-4 md:py-6 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {promos.length > 0 ? (
            promos.map((promo, idx) => (
              <div
                key={promo.id || idx}
                onClick={() => handleBannerClick(promo.buttonUrl)}
                style={{ backgroundColor: promo.bgColor || (idx % 2 === 0 ? '#F5EBE6' : '#FAF4EC') }}
                className="group relative rounded-xl overflow-hidden p-4 sm:p-5 flex items-center justify-between border border-[#DEC3B5]/60 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Left Content */}
                <div className="space-y-1 z-10 flex-1 pr-3">
                  {promo.subtitle && (
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#C27D6E] block">
                      {promo.subtitle}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-tight text-[#191E28] font-sans">
                    {promo.title}
                  </h3>
                  {promo.buttonText && (
                    <span className="inline-block text-[11px] font-semibold text-[#A66355] underline uppercase tracking-wider group-hover:text-[#191E28] transition-colors pt-1">
                      {promo.buttonText} →
                    </span>
                  )}
                </div>

                {/* Right Photo Thumbnail */}
                {promo.imageUrl && (
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border border-[#DEC3B5] shrink-0 bg-white shadow-sm">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              {/* Fallback Banner 1 */}
              <div
                onClick={() => handleBannerClick('#featured-products')}
                className="group relative bg-[#F5EBE6] rounded-xl overflow-hidden p-4 sm:p-5 flex items-center justify-between border border-[#DEC3B5]/60 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="space-y-1 z-10">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#C27D6E] block">
                    TREND ALERT:
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-tight text-[#191E28] font-sans">
                    NEW ETHNIC ARRIVALS ARE HERE!
                  </h3>
                  <span className="inline-block text-[11px] font-semibold text-[#A66355] underline uppercase tracking-wider group-hover:text-[#191E28] transition-colors pt-1">
                    Explore festive edit →
                  </span>
                </div>
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border border-[#DEC3B5] shrink-0 ml-3 bg-white shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80"
                    alt="New Ethnic Arrivals"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Fallback Banner 2 */}
              <div className="bg-[#FAF4EC] rounded-xl p-4 sm:p-5 flex items-center justify-between border border-[#DEC3B5]/60 shadow-none hover:shadow-md transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#EAE3D9] text-[#191E28] rounded-full">
                      <Truck size={14} />
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#A66355]">
                      COMPLIMENTARY DELIVERY
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-tight text-[#191E28] font-sans">
                    FREE SHIPPING ON ORDERS OVER {currencySymbol}{freeShippingThreshold}
                  </h3>
                  <p className="text-[11px] text-[#555E6C]">
                    Automatic discount applied at checkout on all orders across India.
                  </p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
};
