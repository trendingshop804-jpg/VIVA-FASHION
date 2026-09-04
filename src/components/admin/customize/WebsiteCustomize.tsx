import React, { useState } from 'react';
import {
  Save,
  UploadCloud,
  RotateCcw,
  Eye,
  Sliders,
  Store,
  Menu as MenuIcon,
  Sparkles,
  Layers,
  ShoppingBag,
  Heart,
  BookOpen,
  LayoutTemplate,
  Share2,
  Palette,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';
import { GeneralForm } from './GeneralForm';
import { HeaderForm } from './HeaderForm';
import { HeroForm } from './HeroForm';
import { CategoriesForm } from './CategoriesForm';
import { PromotionsForm } from './PromotionsForm';
import { BestSellersForm } from './BestSellersForm';
import { TestimonialsForm } from './TestimonialsForm';
import { StoryAndAboutForm } from './StoryAndAboutForm';
import { FooterForm } from './FooterForm';
import { SocialMediaForm } from './SocialMediaForm';
import { BrandColorsForm } from './BrandColorsForm';
import { SectionOrderForm } from './SectionOrderForm';
import { SEOForm } from './SEOForm';
import { DevicePreviewModal } from './DevicePreviewModal';

type CMSTab =
  | 'general'
  | 'header'
  | 'hero'
  | 'categories'
  | 'promotions'
  | 'bestsellers'
  | 'testimonials'
  | 'story'
  | 'footer'
  | 'social'
  | 'colors'
  | 'order'
  | 'seo';

const CMS_TABS: { id: CMSTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'header', label: 'Header & Nav', icon: MenuIcon },
  { id: 'hero', label: 'Hero Section', icon: Sparkles },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'promotions', label: 'Promotions', icon: Sparkles },
  { id: 'bestsellers', label: 'Best Sellers', icon: ShoppingBag },
  { id: 'testimonials', label: 'Customer Loves', icon: Heart },
  { id: 'story', label: 'Our Story & About', icon: BookOpen },
  { id: 'footer', label: 'Footer', icon: LayoutTemplate },
  { id: 'social', label: 'Social Channels', icon: Share2 },
  { id: 'colors', label: 'Brand Colors', icon: Palette },
  { id: 'order', label: 'Section Order', icon: Sliders },
  { id: 'seo', label: 'SEO & Social', icon: Search },
];

export const WebsiteCustomize: React.FC = () => {
  const {
    isUnsaved,
    isPublishing,
    saveDraft,
    publishChanges,
    resetSection,
    resetAll,
    setIsPreviewModalOpen,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<CMSTab>('general');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveDraft = async () => {
    const ok = await saveDraft();
    if (ok) showNotice('Draft settings saved successfully!');
    else showNotice('Failed to save draft settings.', 'error');
  };

  const handlePublish = async () => {
    const ok = await publishChanges();
    if (ok) showNotice('Changes published live to storefront!');
    else showNotice('Failed to publish changes.', 'error');
  };

  const handleResetSection = () => {
    if (window.confirm(`Reset active section (${activeTab.toUpperCase()}) to default settings?`)) {
      resetSection(activeTab as any);
      showNotice(`Section "${activeTab.toUpperCase()}" reset to default.`);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset ALL website customization settings to defaults? This will overwrite your draft.')) {
      resetAll();
      showNotice('All website settings reset to defaults.');
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralForm />;
      case 'header': return <HeaderForm />;
      case 'hero': return <HeroForm />;
      case 'categories': return <CategoriesForm />;
      case 'promotions': return <PromotionsForm />;
      case 'bestsellers': return <BestSellersForm />;
      case 'testimonials': return <TestimonialsForm />;
      case 'story': return <StoryAndAboutForm />;
      case 'footer': return <FooterForm />;
      case 'social': return <SocialMediaForm />;
      case 'colors': return <BrandColorsForm />;
      case 'order': return <SectionOrderForm />;
      case 'seo': return <SEOForm />;
      default: return <GeneralForm />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-[#191E28] text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#28303F]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold font-serif tracking-tight text-[#FAF7F2]">
              Website Customization CMS
            </h2>
            {isUnsaved ? (
              <span className="bg-[#DCA134] text-[#191E28] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle size={11} /> Draft (Unsaved)
              </span>
            ) : (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={11} /> Published Live
              </span>
            )}
          </div>
          <p className="text-xs text-[#DEC3B5]/80">
            Control storefront content, imagery, layout order, branding colors, and navigation without touching code.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Live Device Preview Button */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#28303F] hover:bg-[#374256] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Eye size={14} className="text-[#C27D6E]" />
            <span>Live Device Preview</span>
          </button>

          {/* Reset Active Section */}
          <button
            type="button"
            onClick={handleResetSection}
            title="Reset current tab to default"
            className="flex items-center gap-1 bg-[#28303F] hover:bg-[#374256] text-gray-300 hover:text-white px-2.5 py-2 rounded-xl text-xs transition-colors"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Section</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-[#28303F] hover:bg-[#374256] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          {/* Publish Changes */}
          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            className="flex items-center gap-1.5 bg-[#C27D6E] hover:bg-[#A66355] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <UploadCloud size={15} />
            <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-black font-normal text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Main CMS Layout with Section Tabs & Editor Pane */}
      <div className="bg-white rounded-2xl border border-[#DEC3B5] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Vertical Section Tabs */}
        <div className="w-full md:w-56 bg-[#FAF7F2] border-b md:border-b-0 md:border-r border-[#DEC3B5] p-2 space-y-0.5 shrink-0 overflow-x-auto md:overflow-x-visible flex md:flex-col">
          {CMS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                  isActive
                    ? 'bg-[#191E28] text-white font-bold shadow-sm'
                    : 'text-[#555E6C] hover:bg-[#F0E6DF] hover:text-[#191E28]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#C27D6E]' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-auto border-t border-[#DEC3B5]/60 hidden md:block">
            <button
              type="button"
              onClick={handleResetAll}
              className="w-full text-left text-[10px] text-red-500 hover:text-red-700 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              Reset All To Factory Defaults
            </button>
          </div>
        </div>

        {/* Right Editor Pane */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="mb-4 pb-3 border-b border-[#EAE3D9] flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#191E28] font-serif">
              {CMS_TABS.find(t => t.id === activeTab)?.label} Configuration
            </h3>
            <span className="text-[11px] text-[#71717A]">
              Click <strong>Publish Changes</strong> when done to update live storefront
            </span>
          </div>

          {renderActiveTabContent()}
        </div>
      </div>

      {/* Live Device Preview Modal Component */}
      <DevicePreviewModal />
    </div>
  );
};
