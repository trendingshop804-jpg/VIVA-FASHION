import React from 'react';
import { CUSTOMER_REVIEWS_ROW1 } from '../../data/mockData';
import { StarRating } from '../common/StarRating';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';

export const CustomerLoves: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();
  const loves = activeConfig?.customerLoves;

  if (loves && loves.isVisible === false) {
    return null;
  }

  const customTestimonials = loves?.testimonials?.filter(t => t.isActive) || [];
  const displayItems = customTestimonials.length > 0
    ? customTestimonials.slice(0, 3).map(t => ({
        id: t.id,
        image: t.photoUrl,
        author: t.customerName,
        rating: t.rating,
      }))
    : CUSTOMER_REVIEWS_ROW1;

  const handleShopNow = () => {
    setSelectedCategory('all');
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="customer-loves" className="w-full bg-[#FAF7F2] py-8 md:py-10 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Customer Loves (3 photos) - 7 cols */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#191E28]">
                {loves?.sectionTitle || 'CUSTOMER LOVES'}
              </h3>
              <span className="text-[11px] text-[#A66355] font-medium italic">
                {loves?.subtitle || 'Photos / Reviews'}
              </span>
            </div>

            {/* 3 Photos in a row matching reference */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-[#DEC3B5] shadow-xs bg-[#F5EBE6]"
                >
                  <img
                    src={item.image}
                    alt={`${item.author} wearing Viva Fashion`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Rating / Author tooltip on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-[#191E28]/80 text-white p-1.5 text-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <span className="font-semibold block">{item.author}</span>
                    <StarRating rating={item.rating} showCount={false} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Our Story snippet (5 cols) matching reference */}
          <div className="md:col-span-5 space-y-3 md:pl-4">
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#191E28]">
              OUR STORY
            </h3>
            
            <p className="text-xs text-[#555E6C] leading-relaxed">
              {activeConfig?.ourStory?.description ||
                'Viva Fashion Ethnic was born from a devotion to timeless Indian silhouettes crafted for the modern global woman. Every stitch preserves centuries-old weaving traditions while embracing breezy silhouettes, breathable cottons, and all-day stretch comfort.'}
            </p>

            <div className="pt-1">
              <button
                onClick={handleShopNow}
                className="bg-[#D99A8C] hover:bg-[#C27D6E] text-[#191E28] hover:text-white px-5 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-xs"
              >
                Shop now
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
