import React from 'react';
import { Heart, Plus, Trash2, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { handleImageFileUpload } from '../../../services/imageUploadService';
import type { TestimonialConfig } from '../../../types/cms';

export const TestimonialsForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { customerLoves } = draftConfig;
  const testimonials = customerLoves.testimonials || [];

  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialConfig = {
      id: `rev-${Date.now()}`,
      customerName: 'New Customer',
      location: 'City, India',
      photoUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
      reviewText: 'Write verified customer review feedback here...',
      rating: 5,
      productName: 'Embroidered Cotton Kurti',
      isActive: true,
      order: testimonials.length + 1,
    };
    updateDraft('customerLoves', { testimonials: [...testimonials, newTestimonial] });
  };

  const handleUpdateTestimonial = (id: string, updates: Partial<TestimonialConfig>) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...updates } : t);
    updateDraft('customerLoves', { testimonials: updated });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (testimonials.length <= 1) {
      alert('You must keep at least one testimonial item.');
      return;
    }
    const filtered = testimonials.filter(t => t.id !== id);
    updateDraft('customerLoves', { testimonials: filtered });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;
    const items = [...testimonials];
    const temp = items[index];
    items[index] = items[newIndex];
    items[newIndex] = temp;
    updateDraft('customerLoves', { testimonials: items });
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    const url = await handleImageFileUpload(file, 'testimonial-avatar');
    if (url) handleUpdateTestimonial(id, { photoUrl: url });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Visibility Toggle */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 flex items-center justify-between">
        <div>
          <strong className="text-[#191E28] block text-xs">Customer Loves Section Visibility</strong>
          <span className="text-[11px] text-[#555E6C]">Enable or disable the customer review testimonials section</span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[#191E28] font-bold">
          <input
            type="checkbox"
            checked={customerLoves.isVisible}
            onChange={(e) => updateDraft('customerLoves', { isVisible: e.target.checked })}
            className="accent-[#C27D6E] w-4 h-4"
          />
          <span>Show Customer Loves</span>
        </label>
      </div>

      {/* Headings */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Heart size={14} /> Section Titles & Subtitle
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Section Title</label>
            <input
              type="text"
              value={customerLoves.sectionTitle}
              onChange={(e) => updateDraft('customerLoves', { sectionTitle: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-serif font-bold uppercase"
            />
          </div>
          <div>
            <label className="font-bold text-[#191E28] block mb-1">Subtitle</label>
            <input
              type="text"
              value={customerLoves.subtitle}
              onChange={(e) => updateDraft('customerLoves', { subtitle: e.target.value })}
              className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Star size={14} className="text-[#DCA134]" /> Customer Reviews & Testimonials ({testimonials.length})
          </h4>
          <button
            onClick={handleAddTestimonial}
            className="flex items-center gap-1 bg-[#C27D6E] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#A66355]"
          >
            <Plus size={13} /> Add Testimonial
          </button>
        </div>

        <div className="space-y-3">
          {testimonials.map((t, idx) => (
            <div key={t.id} className="bg-white p-3.5 rounded-lg border border-[#DEC3B5] space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#F0E6DF] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#191E28]">#{idx + 1}</span>
                  <label className="flex items-center gap-1 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={t.isActive}
                      onChange={(e) => handleUpdateTestimonial(t.id, { isActive: e.target.checked })}
                      className="accent-[#C27D6E]"
                    />
                    <span>Active</span>
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === testimonials.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-gray-500 hover:text-black disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1 text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={t.customerName}
                    onChange={(e) => handleUpdateTestimonial(t.id, { customerName: e.target.value })}
                    className="w-full border border-[#DEC3B5] rounded p-1.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={t.location}
                    onChange={(e) => handleUpdateTestimonial(t.id, { location: e.target.value })}
                    className="w-full border border-[#DEC3B5] rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={t.rating}
                    onChange={(e) => handleUpdateTestimonial(t.id, { rating: Number(e.target.value) })}
                    className="w-full border border-[#DEC3B5] rounded p-1.5 text-xs font-bold text-[#DCA134]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1">Purchased Product Name</label>
                <input
                  type="text"
                  value={t.productName}
                  onChange={(e) => handleUpdateTestimonial(t.id, { productName: e.target.value })}
                  className="w-full border border-[#DEC3B5] rounded p-1.5 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1">Customer Review Quote</label>
                <textarea
                  rows={2}
                  value={t.reviewText}
                  onChange={(e) => handleUpdateTestimonial(t.id, { reviewText: e.target.value })}
                  className="w-full border border-[#DEC3B5] rounded p-1.5 text-xs italic"
                />
              </div>

              {/* Photo */}
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-2 rounded border border-[#EAE3D9]">
                {t.photoUrl && (
                  <img src={t.photoUrl} alt={t.customerName} className="w-10 h-10 object-cover rounded-full border border-[#DEC3B5]" />
                )}
                <input
                  type="text"
                  value={t.photoUrl}
                  onChange={(e) => handleUpdateTestimonial(t.id, { photoUrl: e.target.value })}
                  placeholder="Photo URL..."
                  className="flex-1 bg-white border border-[#DEC3B5] rounded p-1 text-[11px] font-mono"
                />
                <label className="bg-white border border-[#DEC3B5] px-2.5 py-1 rounded cursor-pointer font-semibold text-[11px] hover:bg-[#F0E6DF]">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handlePhotoUpload(t.id, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
