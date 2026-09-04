import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';
import { KURTI_IMAGES } from '../../data/productImages';

export const HeroSection: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { currencySymbol } = useCart();
  const { activeConfig } = useCMS();
  const hero = activeConfig?.hero;

  if (hero && hero.isVisible === false) {
    return null;
  }

  const badgeText = hero?.badgeText || 'Kurtis • Shawls • Leggings';
  const titleLine1 = hero?.titleLine1 || 'SUMMER ETHNIC';
  const titleLine2 = hero?.titleLine2 || 'VIVA FASHION';
  const titleLine3 = hero?.titleLine3 || 'COLLECTION';
  const subtitle = hero?.subtitle || 'STYLE THAT INSPIRES YOU';
  const buttonText = hero?.buttonText || 'SHOP KURTIS';
  const heroImage = hero?.imageUrl || KURTI_IMAGES.embroideredCotton[0];
  const featuredProductName = hero?.featuredProductName || 'Embroidered Cotton Kurti';
  const featuredProductPrice = hero?.featuredProductPrice || 1299;
  const featuredCategory = hero?.featuredCategory || 'kurtis';

  const handleHeroCTA = () => {
    if (featuredCategory) {
      setSelectedCategory(featuredCategory);
    }
    const targetId = (hero?.buttonUrl?.startsWith('#') ? hero.buttonUrl.slice(1) : 'featured-products') || 'featured-products';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="w-full bg-[#FAF7F2] overflow-hidden pt-2 pb-6 md:py-8 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 lg:gap-12">
          
          {/* Left Column: Copy & CTAs */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4 md:space-y-6 pt-2 md:pt-0">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EBE6] border border-[#DEC3B5] text-[#A66355] text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={12} />
              <span>{badgeText}</span>
            </div>

            {/* Main Dominant Heading */}
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#191E28] leading-[1.08] tracking-tight font-serif">
                {titleLine1}
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#191E28] leading-[1.08] tracking-tight font-serif">
                {titleLine2}
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#191E28] leading-[1.08] tracking-tight font-serif text-[#C27D6E]">
                {titleLine3}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base font-medium tracking-[0.14em] uppercase text-[#555E6C]">
              {subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleHeroCTA}
                className="group inline-flex items-center justify-center gap-2.5 bg-[#191E28] hover:bg-[#C27D6E] text-[#FDFBF7] px-6 sm:px-8 py-3 rounded-md text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{buttonText}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Model */}
          <div className="md:col-span-6 lg:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#DEC3B5]/50 bg-gradient-to-tr from-[#EAD7CD] to-[#FAF7F2]">
              <img
                src={heroImage}
                alt="Featured model wearing ethnic apparel"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                loading="eager"
              />

              {/* Editorial Badge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#FAF7F2]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#A66355] font-bold block">
                    FEATURED {featuredCategory.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-[#191E28]">
                    {featuredProductName}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#191E28] bg-[#F5EBE6] px-2.5 py-1 rounded-md">
                  {currencySymbol}{featuredProductPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
