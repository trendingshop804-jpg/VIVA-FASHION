import React from 'react';
import { Layers, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';
import type { FeaturedCategoryConfig } from '../../../types/cms';

export const CategoriesForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { categories } = draftConfig;

  const handleUpdateCategory = (id: string, updates: Partial<FeaturedCategoryConfig>) => {
    const updated = categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat);
    updateDraft('categories', updated as any);
  };

  const handleImageUpload = async (id: string, file: File) => {
    const url = await handleImageFileUpload(file, `category-${id}`);
    if (url) {
      handleUpdateCategory(id, { imageUrl: url });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const items = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    const reindexed = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    updateDraft('categories', reindexed as any);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
            <Layers size={15} className="text-[#C27D6E]" />
            <span>Featured Category Cards Manager</span>
          </h4>
          <p className="text-[11px] text-[#555E6C] mt-0.5">
            Manage the 3 main category cards displayed on the homepage (Kurtis, Shawls, Leggings).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="bg-white p-4 rounded-xl border border-[#DEC3B5]/70 shadow-2xs space-y-3"
          >
            {/* Header / Reorder bar */}
            <div className="flex items-center justify-between border-b border-[#FAF4EC] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#191E28] uppercase text-xs">
                  Card #{index + 1}: {cat.title}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#A66355] bg-[#F5EBE6] px-2 py-0.5 rounded">
                  {cat.slug}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 hover:bg-[#EAD7CD] rounded text-[#191E28] disabled:opacity-30"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 hover:bg-[#EAD7CD] rounded text-[#191E28] disabled:opacity-30"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#191E28] text-[11px]">
                  <input
                    type="checkbox"
                    checked={cat.isActive}
                    onChange={(e) => handleUpdateCategory(cat.id, { isActive: e.target.checked })}
                    className="accent-[#C27D6E] w-3.5 h-3.5"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#191E28] block mb-1">Card Title</label>
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => handleUpdateCategory(cat.id, { title: e.target.value.toUpperCase() })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1">Button Action Text</label>
                <input
                  type="text"
                  value={cat.buttonText}
                  onChange={(e) => handleUpdateCategory(cat.id, { buttonText: e.target.value })}
                  className="w-full border border-[#DEC3B5] rounded p-2 text-xs bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Category Card Description</label>
              <input
                type="text"
                value={cat.description}
                onChange={(e) => handleUpdateCategory(cat.id, { description: e.target.value })}
                className="w-full border border-[#DEC3B5] rounded p-2 text-xs bg-[#FAF7F2]"
              />
            </div>

            {/* Image Preview & Upload */}
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Category Image (JPG, PNG, WEBP)</label>
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DEC3B5]/60">
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt={cat.title} className="w-12 h-14 object-cover rounded border" />
                )}
                <input
                  type="text"
                  value={cat.imageUrl}
                  onChange={(e) => handleUpdateCategory(cat.id, { imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono bg-white"
                />
                <label className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                  <Upload size={12} />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(cat.id, e.target.files[0])}
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
