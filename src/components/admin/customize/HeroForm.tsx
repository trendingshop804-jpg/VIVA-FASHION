import React from 'react';
import { Image as ImageIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';
import { KURTI_IMAGES, SHAWL_IMAGES, LEGGING_IMAGES } from '../../../data/productImages';

export const HeroForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { hero } = draftConfig;

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageFileUpload(file, isMobile ? 'hero-mobile' : 'hero-desktop');
      if (url) {
        if (isMobile) {
          updateDraft('hero', { mobileImageUrl: url });
        } else {
          updateDraft('hero', { imageUrl: url });
        }
      }
    }
  };

  // Category safety check
  const handleCategoryChange = (category: 'kurtis' | 'shawls' | 'leggings') => {
    let suggestedImg = hero.imageUrl;
    let suggestedProduct = hero.featuredProductName;

    if (category === 'kurtis') {
      suggestedImg = KURTI_IMAGES.embroideredCotton[0];
      suggestedProduct = 'Embroidered Cotton Kurti';
    } else if (category === 'shawls') {
      suggestedImg = SHAWL_IMAGES.kashmiriEmbroidered[0];
      suggestedProduct = 'Kashmiri Embroidered Shawl';
    } else if (category === 'leggings') {
      suggestedImg = LEGGING_IMAGES.stretchAnkle[0];
      suggestedProduct = 'Stretch Ankle Length Leggings';
    }

    updateDraft('hero', {
      featuredCategory: category,
      imageUrl: suggestedImg,
      featuredProductName: suggestedProduct,
    });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Hero Section Visibility Toggle */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between">
        <div>
          <strong className="text-[#191E28] block text-xs">Hero Banner Section Visibility</strong>
          <span className="text-[11px] text-[#555E6C]">Enable or disable the main homepage hero section</span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28] font-bold">
          <input
            type="checkbox"
            checked={hero.isVisible}
            onChange={(e) => updateDraft('hero', { isVisible: e.target.checked })}
            className="accent-[#C27D6E] w-4 h-4"
          />
          <span>Show Hero Section</span>
        </label>
      </div>

      {/* Hero Copy Settings */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Sparkles size={14} /> Hero Copy & Titles
        </h4>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Badge Tagline Text</label>
          <input
            type="text"
            value={hero.badgeText}
            onChange={(e) => updateDraft('hero', { badgeText: e.target.value })}
            placeholder="e.g. Kurtis • Shawls • Leggings"
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Heading Line 1</label>
            <input
              type="text"
              value={hero.titleLine1}
              onChange={(e) => updateDraft('hero', { titleLine1: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Heading Line 2</label>
            <input
              type="text"
              value={hero.titleLine2}
              onChange={(e) => updateDraft('hero', { titleLine2: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Heading Line 3 (Colored Accent)</label>
            <input
              type="text"
              value={hero.titleLine3}
              onChange={(e) => updateDraft('hero', { titleLine3: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase text-[#C27D6E]"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Subtitle Line</label>
          <input
            type="text"
            value={hero.subtitle}
            onChange={(e) => updateDraft('hero', { subtitle: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs uppercase tracking-wider font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Primary CTA Button Text</label>
            <input
              type="text"
              value={hero.buttonText}
              onChange={(e) => updateDraft('hero', { buttonText: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Primary CTA Destination Link</label>
            <input
              type="text"
              value={hero.buttonUrl}
              onChange={(e) => updateDraft('hero', { buttonUrl: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Hero Category Safety & Image Upload */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><ImageIcon size={14} /> Hero Visual & Featured Product Overlay</span>
          <ShieldCheck size={16} className="text-emerald-700" />
        </h4>

        {/* Featured Category Rule */}
        <div className="bg-white p-3.5 rounded-lg border border-[#DEC3B5] space-y-2">
          <label className="font-bold text-[#191E28] block">Featured Category Matching Rule *</label>
          <div className="flex gap-4">
            {(['kurtis', 'shawls', 'leggings'] as const).map(cat => (
              <label key={cat} className="flex items-center gap-1.5 cursor-pointer uppercase font-bold text-[#191E28]">
                <input
                  type="radio"
                  name="featuredCategory"
                  value={cat}
                  checked={hero.featuredCategory === cat}
                  onChange={() => handleCategoryChange(cat)}
                  className="accent-[#C27D6E]"
                />
                <span>FEATURED {cat.toUpperCase()}</span>
              </label>
            ))}
          </div>

          <p className="text-[11px] text-[#555E6C]">
            Selecting <strong>{hero.featuredCategory.toUpperCase()}</strong> ensures the image automatically matches authentic {hero.featuredCategory} imagery.
          </p>
        </div>

        {/* Image File Upload & Preview */}
        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Desktop Hero Model Image (JPG, PNG, WEBP)</label>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#DEC3B5]">
              {hero.imageUrl && (
                <img src={hero.imageUrl} alt="Hero Preview" className="w-16 h-20 object-cover rounded border" />
              )}
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={hero.imageUrl}
                  onChange={(e) => updateDraft('hero', { imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-[#DEC3B5] rounded p-1.5 font-mono text-xs"
                />
                <span className="text-[10px] text-[#71717A] block">Supports file upload or direct HTTPS image URL</span>
              </div>
              <label className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-3 py-2 rounded text-xs font-semibold cursor-pointer transition-colors shrink-0">
                Upload Image
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleHeroImageUpload(e, false)} className="hidden" />
              </label>
            </div>
          </div>

          {/* Overlay Card Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Featured Overlay Product Title</label>
              <input
                type="text"
                value={hero.featuredProductName}
                onChange={(e) => updateDraft('hero', { featuredProductName: e.target.value })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Featured Product Display Price</label>
              <input
                type="number"
                value={hero.featuredProductPrice}
                onChange={(e) => updateDraft('hero', { featuredProductPrice: Number(e.target.value) })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
