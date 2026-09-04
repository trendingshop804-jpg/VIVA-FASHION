import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Layers, RefreshCw } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const SectionOrderForm: React.FC = () => {
  const { draftConfig, updateDraft, resetSection } = useCMS();
  const sectionsOrder = draftConfig.sectionsOrder || [];

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sectionsOrder.length) return;

    const list = [...sectionsOrder];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // Update orders
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateDraft('sectionsOrder', reordered as any);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = sectionsOrder.map((s) =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    );
    updateDraft('sectionsOrder', updated as any);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
          <div>
            <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers size={14} /> Homepage Layout & Section Reordering
            </h4>
            <span className="text-[11px] text-[#555E6C]">
              Control the top-to-bottom layout hierarchy and visibility of sections on the live storefront.
            </span>
          </div>
          <button
            onClick={() => resetSection('sectionsOrder')}
            className="flex items-center gap-1 text-[11px] font-bold text-[#C27D6E] hover:underline shrink-0"
          >
            <RefreshCw size={12} /> Reset Layout
          </button>
        </div>

        <div className="space-y-2">
          {sectionsOrder.map((sec, idx) => (
            <div
              key={sec.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                sec.isVisible
                  ? 'bg-white border-[#DEC3B5] shadow-sm'
                  : 'bg-gray-100/70 border-gray-300 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-400 text-xs w-5 text-center">#{idx + 1}</span>
                <span className={`font-semibold text-xs ${sec.isVisible ? 'text-[#191E28]' : 'text-gray-500 line-through'}`}>
                  {sec.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(sec.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    sec.isVisible
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sec.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 rounded hover:bg-[#F0E6DF] disabled:opacity-25 text-[#191E28]"
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === sectionsOrder.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 rounded hover:bg-[#F0E6DF] disabled:opacity-25 text-[#191E28]"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
