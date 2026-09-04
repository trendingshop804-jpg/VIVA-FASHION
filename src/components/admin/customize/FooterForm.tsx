import React from 'react';
import { LayoutTemplate, Plus, Trash2, Link as LinkIcon, Mail } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const FooterForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { footer } = draftConfig;
  const quickLinks = footer.quickLinks || [];

  const handleAddLink = () => {
    const newLink = {
      id: `fl-${Date.now()}`,
      label: 'New Link',
      url: '#',
      order: quickLinks.length + 1,
    };
    updateDraft('footer', { quickLinks: [...quickLinks, newLink] });
  };

  const handleUpdateLink = (id: string, label: string, url: string) => {
    const updated = quickLinks.map(l => l.id === id ? { ...l, label, url } : l);
    updateDraft('footer', { quickLinks: updated });
  };

  const handleDeleteLink = (id: string) => {
    if (quickLinks.length <= 1) {
      alert('You must keep at least one footer link.');
      return;
    }
    const filtered = quickLinks.filter(l => l.id !== id);
    updateDraft('footer', { quickLinks: filtered });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Brand Summary & Copyright */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <LayoutTemplate size={14} /> Brand Statement & Copyright
        </h4>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Footer Brand Bio / Description</label>
          <textarea
            rows={3}
            value={footer.description}
            onChange={(e) => updateDraft('footer', { description: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
          />
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Copyright Statement Text</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => updateDraft('footer', { copyrightText: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-semibold uppercase"
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Mail size={14} /> Newsletter Subscription Box
        </h4>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Newsletter Title</label>
          <input
            type="text"
            value={footer.newsletterTitle}
            onChange={(e) => updateDraft('footer', { newsletterTitle: e.target.value.toUpperCase() })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold uppercase"
          />
        </div>

        <div>
          <label className="font-bold text-[#191E28] block mb-1">Newsletter Incentive / Subtitle</label>
          <input
            type="text"
            value={footer.newsletterDescription}
            onChange={(e) => updateDraft('footer', { newsletterDescription: e.target.value })}
            className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
          />
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <LinkIcon size={14} /> Footer Quick Links ({quickLinks.length})
          </h4>
          <button
            onClick={handleAddLink}
            className="flex items-center gap-1 bg-[#C27D6E] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#A66355]"
          >
            <Plus size={13} /> Add Link
          </button>
        </div>

        <div className="space-y-2">
          {quickLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#DEC3B5]">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleUpdateLink(link.id, e.target.value, link.url)}
                placeholder="Link Title"
                className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-semibold"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleUpdateLink(link.id, link.label, e.target.value)}
                placeholder="Destination URL (e.g. #featured-products)"
                className="flex-1 border border-[#DEC3B5] rounded p-1.5 text-xs font-mono"
              />
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
