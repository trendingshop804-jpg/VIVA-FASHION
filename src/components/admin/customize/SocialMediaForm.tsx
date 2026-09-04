import React from 'react';
import { Share2, MessageCircle, Globe } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const SocialMediaForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { socialMedia } = draftConfig;

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Share2 size={14} /> Social Channels & Links
        </h4>
        <p className="text-[11px] text-[#555E6C]">
          Configure direct links to your brand social profiles. Icons will appear in header, footer, and mobile drawer.
        </p>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1.5 mb-1">
              <span className="text-pink-600 font-bold">📷</span> Instagram Profile URL
            </label>
            <input
              type="text"
              value={socialMedia.instagram}
              onChange={(e) => updateDraft('socialMedia', { instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1.5 mb-1">
              <span className="text-blue-600 font-bold">f</span> Facebook Page URL
            </label>
            <input
              type="text"
              value={socialMedia.facebook}
              onChange={(e) => updateDraft('socialMedia', { facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1.5 mb-1">
              <span className="text-red-600 font-bold">▶</span> YouTube Channel URL
            </label>
            <input
              type="text"
              value={socialMedia.youtube}
              onChange={(e) => updateDraft('socialMedia', { youtube: e.target.value })}
              placeholder="https://youtube.com/..."
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1.5 mb-1">
              <Globe size={14} className="text-red-700" /> Pinterest Board URL
            </label>
            <input
              type="text"
              value={socialMedia.pinterest}
              onChange={(e) => updateDraft('socialMedia', { pinterest: e.target.value })}
              placeholder="https://pinterest.com/..."
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1.5 mb-1">
              <MessageCircle size={14} className="text-emerald-600" /> WhatsApp Direct Link or Number
            </label>
            <input
              type="text"
              value={socialMedia.whatsapp}
              onChange={(e) => updateDraft('socialMedia', { whatsapp: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
