import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';
import type { PromoBannerConfig } from '../../types/cms';

// Reference-design fallback banners (assets extracted from the approved design)
const FALLBACK_PROMOS: PromoBannerConfig[] = [
  {
    id: 'promo-1',
    title: 'New Arrivals',
    subtitle: 'Fresh styles for a brighter you',
    imageUrl: '/assets/banner-left.png',
    bgColor: '#F6DBD9',
    buttonText: 'Explore Collection',
    buttonUrl: '#featured-products',
    isActive: true,
    order: 1,
  },
  {
    id: 'promo-2',
    title: 'Up to 50% OFF',
    subtitle: 'On Selected Styles',
    imageUrl: '/assets/banner-right.png',
    bgColor: '#B5B893',
    buttonText: 'Shop Sale',
    buttonUrl: '#featured-products',
    isActive: true,
    order: 2,
  },
];

export const PromoBanners: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();

  const promos = activeConfig?.promotions?.filter(p => p.isActive) || [];
  const banners = promos.length > 0 ? promos : FALLBACK_PROMOS;

  const handleBannerClick = (url?: string) => {
    if (url && url.startsWith('#')) {
      const el = document.getElementById(url.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedCategory('new-arrivals');
      const target = document.getElementById('featured-products');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="promotions" className="w-full bg-white py-8 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {banners.map((promo, idx) => {
            const imageLeft = idx % 2 === 0;
            const fallbackBg = imageLeft ? '#F6DBD9' : '#B5B893';
            const mask = imageLeft
              ? 'linear-gradient(to right, black 74%, transparent 100%)'
              : 'linear-gradient(to left, black 74%, transparent 100%)';

            return (
              <div
                key={promo.id || idx}
                onClick={() => handleBannerClick(promo.buttonUrl)}
                style={{ backgroundColor: promo.bgColor || fallbackBg }}
                className={`group relative rounded-xl overflow-hidden cursor-pointer min-h-[160px] md:min-h-[200px] flex flex-col ${imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Photo (design asset) with soft blend into the banner color */}
                {promo.imageUrl && (
                  <div
                    className="h-40 md:h-auto md:w-[46%] shrink-0"
                    style={{
                      WebkitMaskImage: mask,
                      maskImage: mask,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                    }}
                  >
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Copy */}
                <div className="flex-1 flex flex-col justify-center gap-1.5 px-5 md:px-7 py-6">
                  <h3 className="font-serif text-xl md:text-2xl lg:text-[26px] font-bold text-[#1A1A1A] leading-tight">
                    {promo.title}
                  </h3>
                  <p className="text-xs md:text-[13px] text-[#4B4B4B]">
                    {promo.subtitle}
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1.5 self-start bg-white border border-black/10 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[10px] md:text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-sm transition-colors"
                  >
                    {promo.buttonText}
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
