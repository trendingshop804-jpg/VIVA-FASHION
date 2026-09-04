import React, { useState } from 'react';
import { Plus, Trash2, Tag, Upload } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';
import type { PromoBannerConfig } from '../../../types/cms';

export const PromotionsForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { promotions } = draftConfig;

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newButtonText, setNewButtonText] = useState('SHOP NOW');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBanner: PromoBannerConfig = {
      id: `promo-${Date.now()}`,
      title: newTitle.trim().toUpperCase(),
      subtitle: newSubtitle.trim().toUpperCase(),
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      bgColor: '#F5EBE6',
      buttonText: newButtonText.trim().toUpperCase(),
      buttonUrl: '#featured-products',
      isActive: true,
      order: promotions.length + 1,
    };

    updateDraft('promotions', [...promotions, newBanner] as any);
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleUpdateBanner = (id: string, updates: Partial<PromoBannerConfig>) => {
    const updated = promotions.map(p => p.id === id ? { ...p, ...updates } : p);
    updateDraft('promotions', updated as any);
  };

  const handleRemoveBanner = (id: string) => {
    const updated = promotions.filter(p => p.id !== id);
    updateDraft('promotions', updated as any);
  };

  const handleImageUpload = async (id: string, file: File) => {
    const url = await handleImageFileUpload(file, `banner-${id}`);
    if (url) {
      handleUpdateBanner(id, { imageUrl: url });
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
            <Tag size={15} className="text-[#C27D6E]" />
            <span>Homepage Promotional Banners Manager</span>
          </h4>
          <p className="text-[11px] text-[#555E6C] mt-0.5">
            Create and schedule promotional banners for trend alerts, seasonal sales, and free shipping calls.
          </p>
        </div>
      </div>

      {/* Add New Banner Form */}
      <form onSubmit={handleAddBanner} className="bg-white p-4 rounded-xl border border-[#DEC3B5] space-y-3 shadow-2xs">
        <span className="font-bold text-[#191E28] block text-xs border-b border-[#FAF4EC] pb-1.5">
          + Add New Promotional Banner
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Banner Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. TREND ALERT: NEW ETHNIC ARRIVALS!"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-[#DEC3B5] rounded p-2 text-xs uppercase font-bold bg-[#FAF7F2]"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Banner Subtitle</label>
            <input
              type="text"
              placeholder="e.g. HANDBLOCKED CHANDERI SILK KURTIS"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="w-full border border-[#DEC3B5] rounded p-2 text-xs uppercase font-medium bg-[#FAF7F2]"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Button Text</label>
            <input
              type="text"
              placeholder="SHOP NOW"
              value={newButtonText}
              onChange={(e) => setNewButtonText(e.target.value)}
              className="w-full border border-[#DEC3B5] rounded p-2 text-xs uppercase font-semibold bg-[#FAF7F2]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-5 py-2 rounded font-bold uppercase tracking-wider text-xs flex items-center gap-1 transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Promotional Banner
          </button>
        </div>
      </form>

      {/* List of Existing Banners */}
      <div className="space-y-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-white p-4 rounded-xl border border-[#DEC3B5]/70 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#FAF4EC] pb-2">
              <span className="font-bold text-[#191E28] uppercase">{promo.title}</span>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#191E28] text-[11px]">
                  <input
                    type="checkbox"
                    checked={promo.isActive}
                    onChange={(e) => handleUpdateBanner(promo.id, { isActive: e.target.checked })}
                    className="accent-[#C27D6E] w-3.5 h-3.5"
                  />
                  <span>Active</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveBanner(promo.id)}
                  className="p-1 text-[#8C93A0] hover:text-red-600 transition-colors"
                  title="Delete banner"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#191E28] block mb-1">Title Text</label>
                <input
                  type="text"
                  value={promo.title}
                  onChange={(e) => handleUpdateBanner(promo.id, { title: e.target.value.toUpperCase() })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1">Subtitle Text</label>
                <input
                  type="text"
                  value={promo.subtitle}
                  onChange={(e) => handleUpdateBanner(promo.id, { subtitle: e.target.value.toUpperCase() })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs uppercase bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#191E28] block mb-1">Button Text</label>
                <input
                  type="text"
                  value={promo.buttonText}
                  onChange={(e) => handleUpdateBanner(promo.id, { buttonText: e.target.value.toUpperCase() })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1">Button Destination Link</label>
                <input
                  type="text"
                  value={promo.buttonUrl}
                  onChange={(e) => handleUpdateBanner(promo.id, { buttonUrl: e.target.value })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs font-mono bg-[#FAF7F2]"
                />
              </div>
            </div>

            {/* Banner Background & Image */}
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Banner Background Image URL</label>
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DEC3B5]/60">
                {promo.imageUrl && (
                  <img src={promo.imageUrl} alt={promo.title} className="w-16 h-10 object-cover rounded border" />
                )}
                <input
                  type="text"
                  value={promo.imageUrl}
                  onChange={(e) => handleUpdateBanner(promo.id, { imageUrl: e.target.value })}
                  className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono bg-white"
                />
                <label className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                  <Upload size={12} />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(promo.id, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
