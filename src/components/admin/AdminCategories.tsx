import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CATEGORIES_DATA } from '../../data/mockData';
import { useAdmin } from '../../context/AdminContext';
import { useUI } from '../../context/UIContext';

export const AdminCategories: React.FC = () => {
  const { products } = useAdmin();
  const { setSelectedCategory } = useUI();

  const getProductCount = (slug: string) => {
    return products.filter(p => p.category === slug).length;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
          Ethnic Product Categories
        </h2>
        <p className="text-xs text-[#555E6C]">
          Manage and configure the 3 primary ethnic wear categories displayed across the storefront.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#DEC3B5]/70 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            {/* Category Image Header */}
            <div className="relative aspect-[16/9] bg-[#F5EBE6] overflow-hidden">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-[#191E28]/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {getProductCount(cat.slug)} Live Products
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#191E28] font-serif uppercase tracking-wider">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#555E6C] mt-1 leading-relaxed">
                  {cat.description || `Specialized catalog collection for ${cat.title}.`}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Active in Store
                </span>

                <button
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    alert(`Navigated to ${cat.title} category filter`);
                  }}
                  className="text-xs text-[#C27D6E] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Filter Store</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
