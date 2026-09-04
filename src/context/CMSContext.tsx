import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WebsiteCustomizationConfig } from '../types/cms';
import { DEFAULT_WEBSITE_CONFIG } from '../data/defaultCMSConfig';
import { CMSService } from '../services/cmsService';

interface CMSContextType {
  draftConfig: WebsiteCustomizationConfig;
  publishedConfig: WebsiteCustomizationConfig;
  activeConfig: WebsiteCustomizationConfig; // Returns preview draft if editing, or published
  isUnsaved: boolean;
  isPublishing: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: (open: boolean) => void;
  
  updateDraft: <K extends keyof WebsiteCustomizationConfig>(
    section: K,
    data: Partial<WebsiteCustomizationConfig[K]>
  ) => void;

  saveDraft: () => Promise<boolean>;
  publishChanges: () => Promise<boolean>;
  resetSection: <K extends keyof WebsiteCustomizationConfig>(section: K) => void;
  resetAll: () => void;
  reloadCMS: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draftConfig, setDraftConfig] = useState<WebsiteCustomizationConfig>(DEFAULT_WEBSITE_CONFIG);
  const [publishedConfig, setPublishedConfig] = useState<WebsiteCustomizationConfig>(DEFAULT_WEBSITE_CONFIG);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const reloadCMS = async () => {
    const published = await CMSService.getPublishedConfig();
    const draft = await CMSService.getDraftConfig();
    setPublishedConfig(published);
    setDraftConfig(draft);
    setIsUnsaved(JSON.stringify(published) !== JSON.stringify(draft));
  };

  useEffect(() => {
    reloadCMS();
  }, []);

  // Update CSS Variables dynamically whenever active published or draft config changes
  useEffect(() => {
    const activeColors = publishedConfig.colors || DEFAULT_WEBSITE_CONFIG.colors;
    const root = document.documentElement;
    if (activeColors.primary) root.style.setProperty('--primary-color', activeColors.primary);
    if (activeColors.secondary) root.style.setProperty('--secondary-color', activeColors.secondary);
    if (activeColors.accent) root.style.setProperty('--accent-color', activeColors.accent);
    if (activeColors.background) root.style.setProperty('--bg-color', activeColors.background);
    if (activeColors.textColor) root.style.setProperty('--text-color', activeColors.textColor);
  }, [publishedConfig]);

  const updateDraft = <K extends keyof WebsiteCustomizationConfig>(
    section: K,
    data: Partial<WebsiteCustomizationConfig[K]>
  ) => {
    setDraftConfig(prev => {
      const updatedSection = typeof data === 'object' && !Array.isArray(data)
        ? { ...prev[section], ...data }
        : data;

      const updated = {
        ...prev,
        [section]: updatedSection,
      };
      setIsUnsaved(true);
      return updated as WebsiteCustomizationConfig;
    });
  };

  const handleSaveDraft = async (): Promise<boolean> => {
    const success = await CMSService.saveDraft(draftConfig);
    if (success) {
      setIsUnsaved(false);
    }
    return success;
  };

  const handlePublishChanges = async (): Promise<boolean> => {
    setIsPublishing(true);
    const success = await CMSService.publishConfig(draftConfig);
    if (success) {
      setPublishedConfig(draftConfig);
      setIsUnsaved(false);
    }
    setIsPublishing(false);
    return success;
  };

  const resetSection = <K extends keyof WebsiteCustomizationConfig>(section: K) => {
    const resetVal = DEFAULT_WEBSITE_CONFIG[section];
    setDraftConfig(prev => ({
      ...prev,
      [section]: resetVal,
    }));
    setIsUnsaved(true);
  };

  const resetAll = () => {
    setDraftConfig(DEFAULT_WEBSITE_CONFIG);
    setIsUnsaved(true);
  };

  return (
    <CMSContext.Provider
      value={{
        draftConfig,
        publishedConfig,
        activeConfig: publishedConfig,
        isUnsaved,
        isPublishing,
        previewDevice,
        setPreviewDevice,
        isPreviewModalOpen,
        setIsPreviewModalOpen,
        updateDraft,
        saveDraft: handleSaveDraft,
        publishChanges: handlePublishChanges,
        resetSection,
        resetAll,
        reloadCMS,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within a CMSProvider');
  return context;
};
