import React from 'react';
import { Store, Megaphone, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';

export const GeneralForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { general } = draftConfig;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageFileUpload(file, 'general-logo');
      if (url) updateDraft('general', { logoUrl: url });
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Announcement Bar Settings */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center justify-between border-b border-[#EAE3D9] pb-1.5">
          <span className="flex items-center gap-1.5"><Megaphone size={14} /> Announcement Bar Banner</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28]">
            <input
              type="checkbox"
              checked={general.isAnnouncementVisible}
              onChange={(e) => updateDraft('general', { isAnnouncementVisible: e.target.checked })}
              className="accent-[#C27D6E] w-3.5 h-3.5"
            />
            <span>Show Announcement Bar</span>
          </label>
        </h4>

        <div className="space-y-2.5">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Announcement Message Text</label>
            <input
              type="text"
              value={general.announcementText}
              onChange={(e) => updateDraft('general', { announcementText: e.target.value })}
              placeholder="e.g. FREE SHIPPING ON ORDERS OVER ₹999"
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Announcement Bar Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={general.announcementBgColor || '#191E28'}
                onChange={(e) => updateDraft('general', { announcementBgColor: e.target.value })}
                className="w-8 h-8 rounded border border-[#DEC3B5] cursor-pointer"
              />
              <input
                type="text"
                value={general.announcementBgColor || '#191E28'}
                onChange={(e) => updateDraft('general', { announcementBgColor: e.target.value })}
                className="bg-white border border-[#DEC3B5] rounded p-1.5 text-xs font-mono w-28 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Store Identity */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Store size={14} /> Store Identity & Branding
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Store / Business Name</label>
            <input
              type="text"
              value={general.storeName}
              onChange={(e) => updateDraft('general', { storeName: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Short Brand Name</label>
            <input
              type="text"
              value={general.brandName}
              onChange={(e) => updateDraft('general', { brandName: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Store Logo Image</label>
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-[#DEC3B5]/60">
            {general.logoUrl && (
              <img src={general.logoUrl} alt="Store Logo" className="w-10 h-10 object-contain rounded border" />
            )}
            <input
              type="text"
              value={general.logoUrl}
              onChange={(e) => updateDraft('general', { logoUrl: e.target.value })}
              placeholder="https://..."
              className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono"
            />
            <label className="bg-[#FAF7F2] border border-[#DEC3B5] px-3 py-1.5 rounded cursor-pointer font-semibold hover:bg-[#EAD7CD]">
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Store Description / Tagline</label>
          <textarea
            rows={2}
            value={general.storeDescription}
            onChange={(e) => updateDraft('general', { storeDescription: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
          />
        </div>
      </div>

      {/* Financials & Thresholds */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5">
          Financial Rules & Shipping Thresholds
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Currency Symbol</label>
            <input
              type="text"
              value={general.currencySymbol}
              onChange={(e) => updateDraft('general', { currencySymbol: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold text-center"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Free Shipping Threshold ({general.currencySymbol})</label>
            <input
              type="number"
              value={general.freeShippingThreshold}
              onChange={(e) => updateDraft('general', { freeShippingThreshold: Number(e.target.value) })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold text-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5">
          Customer Contact & Support Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1 mb-1"><Phone size={12} /> Helpline Phone</label>
            <input
              type="text"
              value={general.phone}
              onChange={(e) => updateDraft('general', { phone: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1 mb-1"><Mail size={12} /> Support Email</label>
            <input
              type="email"
              value={general.email}
              onChange={(e) => updateDraft('general', { email: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#191E28] flex items-center gap-1 mb-1"><MessageCircle size={12} className="text-emerald-600" /> WhatsApp Number</label>
            <input
              type="text"
              value={general.whatsapp}
              onChange={(e) => updateDraft('general', { whatsapp: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#191E28] flex items-center gap-1 mb-1"><MapPin size={12} /> Physical Address</label>
          <input
            type="text"
            value={general.address}
            onChange={(e) => updateDraft('general', { address: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
