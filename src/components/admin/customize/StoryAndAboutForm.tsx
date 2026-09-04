import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';

export const StoryAndAboutForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { ourStory, aboutUs } = draftConfig;

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageFileUpload(file, 'our-story-banner');
      if (url) updateDraft('ourStory', { imageUrl: url });
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageFileUpload(file, 'about-us-banner');
      if (url) updateDraft('aboutUs', { imageUrl: url });
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. OUR STORY SECTION */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <BookOpen size={14} /> Our Story (Heritage Section)
          </h4>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28] font-bold">
            <input
              type="checkbox"
              checked={ourStory.isVisible}
              onChange={(e) => updateDraft('ourStory', { isVisible: e.target.checked })}
              className="accent-[#C27D6E] w-4 h-4"
            />
            <span>Show Our Story</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Section Heading</label>
            <input
              type="text"
              value={ourStory.heading}
              onChange={(e) => updateDraft('ourStory', { heading: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Story Description Narrative</label>
            <textarea
              rows={3}
              value={ourStory.description}
              onChange={(e) => updateDraft('ourStory', { description: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Button Text</label>
              <input
                type="text"
                value={ourStory.buttonText}
                onChange={(e) => updateDraft('ourStory', { buttonText: e.target.value.toUpperCase() })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase"
              />
            </div>
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Button Link</label>
              <input
                type="text"
                value={ourStory.buttonUrl}
                onChange={(e) => updateDraft('ourStory', { buttonUrl: e.target.value })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Heritage Photo / Model Image</label>
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-[#DEC3B5]">
              {ourStory.imageUrl && (
                <img src={ourStory.imageUrl} alt="Our Story" className="w-14 h-14 object-cover rounded border" />
              )}
              <input
                type="text"
                value={ourStory.imageUrl}
                onChange={(e) => updateDraft('ourStory', { imageUrl: e.target.value })}
                className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono"
              />
              <label className="bg-[#191E28] text-white px-3 py-1.5 rounded cursor-pointer font-semibold text-xs hover:bg-[#C27D6E]">
                Upload Image
                <input type="file" accept="image/*" onChange={handleStoryImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT US SECTION */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles size={14} /> About Us & Ethical Craftsmanship
          </h4>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28] font-bold">
            <input
              type="checkbox"
              checked={aboutUs.isVisible}
              onChange={(e) => updateDraft('aboutUs', { isVisible: e.target.checked })}
              className="accent-[#C27D6E] w-4 h-4"
            />
            <span>Show About Us</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Section Heading</label>
            <input
              type="text"
              value={aboutUs.heading}
              onChange={(e) => updateDraft('aboutUs', { heading: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Primary Description</label>
            <textarea
              rows={2}
              value={aboutUs.description}
              onChange={(e) => updateDraft('aboutUs', { description: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Quality Assurance Guarantee Text</label>
            <textarea
              rows={2}
              value={aboutUs.additionalText}
              onChange={(e) => updateDraft('aboutUs', { additionalText: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">CTA Button Text</label>
              <input
                type="text"
                value={aboutUs.buttonText}
                onChange={(e) => updateDraft('aboutUs', { buttonText: e.target.value.toUpperCase() })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase"
              />
            </div>
            <div>
              <label className="font-bold text-[#191E28] block mb-1">CTA Destination URL</label>
              <input
                type="text"
                value={aboutUs.buttonUrl}
                onChange={(e) => updateDraft('aboutUs', { buttonUrl: e.target.value })}
                className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Artisan Image</label>
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-[#DEC3B5]">
              {aboutUs.imageUrl && (
                <img src={aboutUs.imageUrl} alt="About Us" className="w-14 h-14 object-cover rounded border" />
              )}
              <input
                type="text"
                value={aboutUs.imageUrl}
                onChange={(e) => updateDraft('aboutUs', { imageUrl: e.target.value })}
                className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono"
              />
              <label className="bg-[#191E28] text-white px-3 py-1.5 rounded cursor-pointer font-semibold text-xs hover:bg-[#C27D6E]">
                Upload Image
                <input type="file" accept="image/*" onChange={handleAboutImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
