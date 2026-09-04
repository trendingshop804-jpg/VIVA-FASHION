import React from 'react';
import { CUSTOMER_REVIEWS_ROW2 } from '../../data/mockData';
import { Logo } from '../common/Logo';
import { StarRating } from '../common/StarRating';
import { useCMS } from '../../context/CMSContext';

export const OurStory: React.FC = () => {
  const { activeConfig } = useCMS();
  const story = activeConfig?.ourStory;

  if (story && story.isVisible === false) {
    return null;
  }

  const customTestimonials = activeConfig?.customerLoves?.testimonials?.filter(t => t.isActive) || [];
  const displayItems = customTestimonials.length >= 6
    ? customTestimonials.slice(3, 6).map(t => ({
        id: t.id,
        image: t.photoUrl,
        author: t.customerName,
        rating: t.rating,
      }))
    : CUSTOMER_REVIEWS_ROW2;

  return (
    <section id="our-story" className="w-full bg-[#FAF7F2] py-8 md:py-10 border-b border-[#EAE3D9]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Customer Loves (3 photos) - 7 cols */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#191E28]">
                CUSTOMER LOVES
              </h3>
              <span className="text-[11px] text-[#A66355] font-medium italic">
                With Photos
              </span>
            </div>

            {/* 3 Photos */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-[#DEC3B5] shadow-xs bg-[#F5EBE6]"
                >
                  <img
                    src={item.image}
                    alt={`${item.author} review photo`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#191E28]/80 text-white p-1.5 text-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <span className="font-semibold block">{item.author}</span>
                    <StarRating rating={item.rating} showCount={false} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Circular Brand Stamp / Story Motif matching reference */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-3 p-4 bg-[#F5EBE6]/60 rounded-xl border border-[#DEC3B5]/50">
            <Logo size="lg" />
            <p className="text-xs text-[#555E6C] max-w-xs leading-relaxed italic">
              "{story?.description || 'Every fabric is ethically sourced from master artisan clusters across India, blending handcrafted heritage with luxurious everyday ease.'}"
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C27D6E]">
              Handcrafted in India • Worn Worldwide
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
