import React from 'react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';

export const AboutSection: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { currencySymbol, freeShippingThreshold } = useCart();
  const { activeConfig } = useCMS();
  const about = activeConfig?.aboutUs;

  if (about && about.isVisible === false) {
    return null;
  }

  const handleShopNow = () => {
    setSelectedCategory('all');
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="w-full bg-[#FAF7F2] py-8 md:py-12 border-b border-[#EAE3D9]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        
        <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#191E28]">
          {about?.heading || 'ABOUT US'}
        </h3>

        <p className="text-xs sm:text-sm text-[#555E6C] leading-relaxed max-w-2xl mx-auto">
          {about?.description ||
            'Viva Fashion Ethnic celebrates the timeless grace of traditional Indian craftsmanship curated for modern lifestyles. From breathable handloom cottons to silky stretch churidars, our collections are mindfully designed with premium materials, fair wages for artisans, and unparalleled attention to detail.'}
        </p>

        <p className="text-xs text-[#71717A] max-w-xl mx-auto">
          {about?.additionalText ||
            `Experience authentic silhouettes reimagined for ultimate daily ease. Enjoy complimentary shipping across India on qualifying orders over ${currencySymbol}${freeShippingThreshold}.`}
        </p>

        <div className="pt-2">
          <button
            onClick={handleShopNow}
            className="bg-[#D99A8C] hover:bg-[#C27D6E] text-[#191E28] hover:text-white px-6 py-2.5 rounded-md text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 shadow-sm"
          >
            {about?.buttonText || 'Shop now'}
          </button>
        </div>

      </div>
    </section>
  );
};
