import React from 'react';
import { Search, Globe } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';

export const SEOForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { seo } = draftConfig;

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageFileUpload(file, 'seo-og-image');
      if (url) updateDraft('seo', { ogImage: url });
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Search Engine Optimization */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Search size={14} /> Search Engine Metadata (SEO)
        </h4>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">
              Meta Browser Title <span className="text-[10px] text-gray-500 font-normal">(Recommended 50–60 chars)</span>
            </label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => updateDraft('seo', { metaTitle: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">
              Meta Search Description <span className="text-[10px] text-gray-500 font-normal">(Recommended 140–160 chars)</span>
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => updateDraft('seo', { metaDescription: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Target Search Keywords</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => updateDraft('seo', { keywords: e.target.value })}
              placeholder="e.g. Kurtis online, Kashmiri shawls, Leggings..."
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* OpenGraph & Social Sharing */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Globe size={14} /> Open Graph (Social Sharing Cards)
        </h4>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Social Card Share Title (og:title)</label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => updateDraft('seo', { ogTitle: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Social Card Share Description (og:description)</label>
            <textarea
              rows={2}
              value={seo.ogDescription}
              onChange={(e) => updateDraft('seo', { ogDescription: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Social Share Preview Image (og:image)</label>
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-[#DEC3B5]">
              {seo.ogImage && (
                <img src={seo.ogImage} alt="OG Preview" className="w-16 h-10 object-cover rounded border" />
              )}
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => updateDraft('seo', { ogImage: e.target.value })}
                className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono"
              />
              <label className="bg-[#191E28] text-white px-3 py-1.5 rounded cursor-pointer font-semibold text-xs hover:bg-[#C27D6E]">
                Upload
                <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
