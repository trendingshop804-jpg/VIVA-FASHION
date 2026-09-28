import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';
import type { ProductCategory } from '../../types';

interface CategoryItem {
  id: string;
  slug: ProductCategory | string;
  title: string;
  image: string;
}

// Design assets extracted from the approved reference design (public/assets)
const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', slug: 'kurtis', title: 'Kurtis', image: '/assets/cat-kurtis.png' },
  { id: 'cat-2', slug: 'salwar-suits', title: 'Salwar Suits', image: '/assets/cat-salwar.png' },
  { id: 'cat-3', slug: 'leggings', title: 'Leggings', image: '/assets/cat-leggings.png' },
  { id: 'cat-4', slug: 'shawls', title: 'Shawls & Dupattas', image: '/assets/cat-shawls.png' },
  { id: 'cat-5', slug: 'dresses', title: 'Dresses', image: '/assets/cat-dresses.png' },
  { id: 'cat-6', slug: 'co-ord-sets', title: 'Co-ord Sets', image: '/assets/cat-coord.png' },
];

export const CategorySection: React.FC = () => {
  const { setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const customCategories = activeConfig?.categories?.filter(c => c.isActive) || [];
  const displayCategories: CategoryItem[] = customCategories.length > 0
    ? customCategories.map(c => ({
        id: c.id,
        slug: c.slug as ProductCategory,
        title: c.title,
        image: c.imageUrl,
      }))
    : DEFAULT_CATEGORIES;

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug as ProductCategory);
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resolveImage = (cat: CategoryItem, index: number) => {
    if (failedImages[cat.id]) {
      return DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length].image;
    }
    return cat.image || DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length].image;
  };

  return (
    <section id="featured-categories" className="w-full bg-white py-10 md:py-14">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Category Circles */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {displayCategories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Circular Image */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#C2185B] transition-all duration-300 group-hover:shadow-lg">
                <img
                  src={resolveImage(cat, index)}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={() => setFailedImages(prev => ({ ...prev, [cat.id]: true }))}
                />
              </div>

              {/* Category Name */}
              <h3 className="mt-3 text-sm md:text-base font-semibold text-[#1A1A2E] group-hover:text-[#C2185B] transition-colors">
                {cat.title}
              </h3>

              {/* Shop Now Link */}
              <span className="mt-1 flex items-center gap-1 text-[11px] md:text-xs text-[#C2185B] font-medium group-hover:gap-2 transition-all">
                Shop Now <ArrowRight size={12} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
