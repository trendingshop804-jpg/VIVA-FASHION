import React from 'react';
import { Palette, RefreshCw, Check } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

const PRESET_PALETTES = [
  {
    name: 'Viva Terracotta Rose (Default)',
    primary: '#191E28',
    secondary: '#C27D6E',
    accent: '#A66355',
    background: '#FAF7F2',
    cardBackground: '#F5EBE6',
    textColor: '#191E28',
    footerBg: '#191E28',
  },
  {
    name: 'Royal Kashmiri Emerald',
    primary: '#0F291E',
    secondary: '#1A533E',
    accent: '#DCA134',
    background: '#F7FAF8',
    cardBackground: '#EAF2EC',
    textColor: '#0F291E',
    footerBg: '#0F291E',
  },
  {
    name: 'Jaipur Handblock Crimson',
    primary: '#241014',
    secondary: '#992B3C',
    accent: '#C44D58',
    background: '#FCF7F7',
    cardBackground: '#F7EBEB',
    textColor: '#241014',
    footerBg: '#241014',
  },
  {
    name: 'Artisanal Indigo Gold',
    primary: '#141E30',
    secondary: '#243B55',
    accent: '#D4AF37',
    background: '#F6F8FA',
    cardBackground: '#E8EEF5',
    textColor: '#141E30',
    footerBg: '#141E30',
  },
];

export const BrandColorsForm: React.FC = () => {
  const { draftConfig, updateDraft, resetSection } = useCMS();
  const { colors } = draftConfig;

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    updateDraft('colors', { [key]: value });
  };

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    const { name, ...colorVals } = preset;
    updateDraft('colors', colorVals);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Preset Palettes */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Palette size={14} /> Curated Brand Color Palettes</span>
          <button
            onClick={() => resetSection('colors')}
            className="flex items-center gap-1 text-[11px] font-bold text-[#C27D6E] hover:underline"
          >
            <RefreshCw size={12} /> Reset to Default
          </button>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_PALETTES.map((p) => {
            const isSelected = colors.secondary === p.secondary && colors.primary === p.primary;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  isSelected ? 'border-[#C27D6E] bg-white ring-2 ring-[#C27D6E]/30 shadow' : 'border-[#DEC3B5] bg-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191E28]">{p.name}</span>
                  {isSelected && <span className="bg-[#C27D6E] text-white p-0.5 rounded-full"><Check size={12} /></span>}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.primary }} title="Primary" />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.secondary }} title="Secondary" />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.accent }} title="Accent" />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.background }} title="Background" />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.cardBackground }} title="Card Background" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Custom Color Pickers */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5">
          Custom Color Tokens (CSS Variables)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Color */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Primary Color</label>
            <span className="text-[10px] text-[#555E6C] block">Headings, dark buttons, text accents</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Secondary / Brand Rose</label>
            <span className="text-[10px] text-[#555E6C] block">CTA buttons, badges, highlight tags</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Accent Color</label>
            <span className="text-[10px] text-[#555E6C] block">Muted labels, price strikes, hover tints</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>

          {/* Canvas Background */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Page Canvas Background</label>
            <span className="text-[10px] text-[#555E6C] block">Warm ivory / off-white base</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>

          {/* Card Background */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Card / Banner Background</label>
            <span className="text-[10px] text-[#555E6C] block">Soft nude tint for banners & cards</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.cardBackground}
                onChange={(e) => handleColorChange('cardBackground', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.cardBackground}
                onChange={(e) => handleColorChange('cardBackground', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>

          {/* Footer Background */}
          <div className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-1.5">
            <label className="font-bold text-[#191E28] block">Dark Footer Background</label>
            <span className="text-[10px] text-[#555E6C] block">Deep luxury charcoal/black</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.footerBg || '#191E28'}
                onChange={(e) => handleColorChange('footerBg', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.footerBg || '#191E28'}
                onChange={(e) => handleColorChange('footerBg', e.target.value)}
                className="flex-1 font-mono text-xs uppercase p-1.5 border border-[#DEC3B5] rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
