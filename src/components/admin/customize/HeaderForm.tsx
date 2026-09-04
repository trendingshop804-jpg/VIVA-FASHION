import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Layout, Link } from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import type { NavigationItem } from '../../../types/cms';

export const HeaderForm: React.FC = () => {
  const { draftConfig, updateDraft } = useCMS();
  const { header } = draftConfig;

  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('#featured-products');

  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: newItemLabel.trim().toUpperCase(),
      url: newItemUrl.trim() || '#featured-products',
      isActive: true,
      order: header.navigationItems.length + 1,
    };

    updateDraft('header', {
      navigationItems: [...header.navigationItems, newItem],
    });

    setNewItemLabel('');
    setNewItemUrl('#featured-products');
  };

  const handleUpdateItem = (id: string, updates: Partial<NavigationItem>) => {
    const updated = header.navigationItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateDraft('header', { navigationItems: updated });
  };

  const handleRemoveItem = (id: string) => {
    const updated = header.navigationItems.filter(item => item.id !== id);
    updateDraft('header', { navigationItems: updated });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const items = [...header.navigationItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    // reindex order
    const reindexed = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    updateDraft('header', { navigationItems: reindexed });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header Logo Sizing */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center gap-1.5">
          <Layout size={14} /> Logo Sizing
        </h4>

        <div className="flex items-center gap-4">
          <label className="font-bold text-[#191E28]">Display Logo Size:</label>
          <div className="flex gap-3">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <label key={size} className="flex items-center gap-1.5 cursor-pointer uppercase font-bold text-[#191E28]">
                <input
                  type="radio"
                  name="logoSize"
                  value={size}
                  checked={header.logoSize === size}
                  onChange={() => updateDraft('header', { logoSize: size })}
                  className="accent-[#C27D6E]"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Menu Item Manager */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
        <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Link size={14} /> Desktop Navigation Links</span>
          <span className="text-[10px] text-[#71717A] font-normal">{header.navigationItems.length} links configured</span>
        </h4>

        {/* Add New Item Form */}
        <form onSubmit={handleAddNavItem} className="bg-white p-3 rounded-lg border border-[#DEC3B5] space-y-2">
          <span className="font-bold text-[#191E28] block text-[11px]">Add New Navigation Link</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              required
              placeholder="e.g. BLOG / FESTIVE SALE"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              className="border border-[#DEC3B5] rounded px-2.5 py-1.5 uppercase font-semibold text-xs"
            />
            <input
              type="text"
              required
              placeholder="e.g. #featured-products"
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
              className="border border-[#DEC3B5] rounded px-2.5 py-1.5 text-xs font-mono"
            />
            <button
              type="submit"
              className="bg-[#191E28] hover:bg-[#C27D6E] text-white rounded font-bold uppercase tracking-wider text-xs py-1.5 flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>
        </form>

        {/* List of Navigation Items */}
        <div className="space-y-2">
          {header.navigationItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-lg border border-[#DEC3B5]/60 flex items-center gap-3 shadow-2xs"
            >
              {/* Order Controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-1 hover:bg-[#EAD7CD] rounded text-[#191E28] disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  disabled={index === header.navigationItems.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1 hover:bg-[#EAD7CD] rounded text-[#191E28] disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Active Checkbox */}
              <input
                type="checkbox"
                checked={item.isActive}
                onChange={(e) => handleUpdateItem(item.id, { isActive: e.target.checked })}
                className="accent-[#C27D6E] w-4 h-4 cursor-pointer"
                title="Enable/Disable link"
              />

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateItem(item.id, { label: e.target.value.toUpperCase() })}
                  className="border border-[#DEC3B5] rounded px-2 py-1 uppercase font-bold text-xs bg-[#FAF7F2]"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                  className="border border-[#DEC3B5] rounded px-2 py-1 font-mono text-xs bg-[#FAF7F2]"
                />
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-1.5 text-[#8C93A0] hover:text-red-600 transition-colors"
                title="Remove link"
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
