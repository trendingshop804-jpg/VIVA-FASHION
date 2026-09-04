import React from 'react';
import { useUI } from '../../context/UIContext';
import { useCMS } from '../../context/CMSContext';

export const DesktopNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useUI();
  const { activeConfig } = useCMS();

  const navItems = activeConfig?.header?.navigationItems?.filter(i => i.isActive) || [
    { id: 'nav-1', label: 'NEW ARRIVALS', url: '#featured-categories', isActive: true, order: 1 },
    { id: 'nav-2', label: 'KURTIS', url: '#featured-products', isActive: true, order: 2 },
    { id: 'nav-3', label: 'SHAWLS', url: '#featured-products', isActive: true, order: 3 },
    { id: 'nav-4', label: 'LEGGINGS', url: '#featured-products', isActive: true, order: 4 },
    { id: 'nav-5', label: 'SALE', url: '#featured-products', isActive: true, order: 5 },
    { id: 'nav-6', label: 'OUR STORY', url: '#our-story', isActive: true, order: 6 },
  ];

  return (
    <nav className="border-t border-[#EAE3D9]/70 pt-2.5 pb-2">
      <ul className="flex items-center justify-center gap-7 md:gap-9 text-[11px] font-medium tracking-[0.18em] uppercase text-[#191E28]">
        {navItems.map((item) => {
          const categorySlug = item.label.toLowerCase().replace(/\s+/g, '-');
          const isActive = selectedCategory === categorySlug || (item.label === 'KURTIS' && selectedCategory === 'kurtis');
          return (
            <li key={item.id || item.label}>
              <a
                href={item.url || '#'}
                onClick={() => {
                  if (['kurtis', 'shawls', 'leggings', 'all', 'new-arrivals', 'sale'].includes(categorySlug)) {
                    setSelectedCategory(categorySlug);
                  }
                }}
                className={`relative py-1 transition-all duration-200 hover:text-[#C27D6E] ${
                  isActive ? 'text-[#C27D6E] font-semibold' : 'text-[#333A48]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C27D6E] rounded-full" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
