import React from 'react';
import { CATEGORIES_DATA } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';
import type { ProductCategory } from '../../types';

export const CategorySection: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();

  const customCategories = activeConfig?.categories?.filter(c => c.isActive) || [];
  const displayCategories = customCategories.length > 0
    ? customCategories.map(c => ({
        id: c.id,
        slug: c.slug as ProductCategory,
        title: c.title,
        buttonText: c.buttonText,
        image: c.imageUrl,
      }))
    : CATEGORIES_DATA;

  const handleCategoryClick = (slug: ProductCategory) => {
    setSelectedCategory(slug);
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="featured-categories" className="w-full bg-[#FAF7F2] py-8 md:py-12 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase text-[#191E28] font-serif">
            FEATURED CATEGORIES
          </h2>
          <div className="w-12 h-0.5 bg-[#C27D6E] mx-auto mt-2" />
        </div>

        {/* Categories: Kurtis, Shawls, Leggings */}
        <div className="flex sm:grid sm:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-2 sm:pb-0 snap-x snap-mandatory">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="min-w-[260px] sm:min-w-0 flex-1 snap-center group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-[#F5EBE6] border border-[#DEC3B5]/50"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#191E28]/80 via-[#191E28]/20 to-transparent transition-opacity" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center justify-end text-center z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.14em] text-[#FFFFFF] mb-3 drop-shadow-sm font-sans">
                  {cat.title}
                </h3>
                
                <button
                  type="button"
                  className="bg-[#191E28]/90 group-hover:bg-[#C27D6E] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase px-5 py-2 rounded-md transition-all duration-200 shadow-md backdrop-blur-sm group-hover:scale-105"
                >
                  {cat.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
