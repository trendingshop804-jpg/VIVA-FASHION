import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';

const DEFAULT_HERO_IMAGE = '/assets/hero.png';

export const HeroSection: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();
  const hero = activeConfig?.hero;
  const [imgError, setImgError] = useState(false);

  if (hero && hero.isVisible === false) {
    return null;
  }

  const titleLine1 = hero?.titleLine1 || 'Stylish Ethnic Wear';
  const titleLine2 = hero?.titleLine2 || 'for Every You';
  const subtitle = hero?.subtitle || 'Kurtis • Salwar Suits • Leggings • Shawls & More';
  const buttonText = hero?.buttonText || 'Shop Now';
  const eyebrow = hero?.badgeText || 'Tradition Meets Trend';
  const heroImage = hero?.imageUrl || DEFAULT_HERO_IMAGE;

  const handleHeroCTA = () => {
    setSelectedCategory('all');
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="w-full bg-[#ECD7C0] overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row items-stretch min-h-[460px] md:min-h-[480px] lg:min-h-[500px]">

        {/* Left Column: Copy & CTA */}
        <div className="w-full lg:w-[44%] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-0 space-y-4 md:space-y-5">

          {/* Eyebrow */}
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#514944]">
            {eyebrow}
          </span>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#111111] leading-[1.08] tracking-tight font-sans">
            {titleLine1}
            <br />
            {titleLine2}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#3F3F3F] tracking-wide">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="pt-1">
            <button
              onClick={handleHeroCTA}
              className="group inline-flex items-center justify-center gap-2 bg-[#C2185B] hover:bg-[#A01348] text-white px-8 py-3 rounded-md text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{buttonText}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center gap-2 pt-3">
            <span className="w-6 h-1.5 bg-[#C2185B] rounded-full" />
            <span className="w-1.5 h-1.5 bg-[#C2185B]/30 rounded-full" />
            <span className="w-1.5 h-1.5 bg-[#C2185B]/30 rounded-full" />
          </div>
        </div>

        {/* Right Column: Hero Image - fills the right side edge-to-edge */}
        <div className="w-full lg:w-[56%] relative h-[320px] sm:h-[400px] lg:h-auto">
          <div className="absolute inset-0">
            <img
              src={imgError ? DEFAULT_HERO_IMAGE : heroImage}
              alt="Featured model wearing ethnic apparel"
              className="w-full h-full object-cover object-center"
              loading="eager"
              onError={() => setImgError(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
