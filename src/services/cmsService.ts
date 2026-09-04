import { supabase } from '../lib/supabase';
import type { WebsiteCustomizationConfig } from '../types/cms';
import { DEFAULT_WEBSITE_CONFIG } from '../data/defaultCMSConfig';

const DRAFT_KEY = 'vf_cms_draft_config';
const PUBLISHED_KEY = 'vf_cms_published_config';

export const CMSService = {
  /**
   * Fetch live published configuration for storefront.
   * If local or remote data is missing, gracefully return DEFAULT_WEBSITE_CONFIG.
   */
  async getPublishedConfig(): Promise<WebsiteCustomizationConfig> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'published_config')
        .single();

      if (!error && data && data.config) {
        const merged = this.mergeWithDefault(data.config);
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {}

    const saved = localStorage.getItem(PUBLISHED_KEY);
    if (saved) {
      try {
        return this.mergeWithDefault(JSON.parse(saved));
      } catch {}
    }

    return DEFAULT_WEBSITE_CONFIG;
  },

  /**
   * Fetch draft configuration for admin editing workspace.
   */
  async getDraftConfig(): Promise<WebsiteCustomizationConfig> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'draft_config')
        .single();

      if (!error && data && data.config) {
        const merged = this.mergeWithDefault(data.config);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {}

    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        return this.mergeWithDefault(JSON.parse(saved));
      } catch {}
    }

    // Default draft equals published or default
    return await this.getPublishedConfig();
  },

  /**
   * Save draft changes to localStorage & Supabase
   */
  async saveDraft(config: WebsiteCustomizationConfig): Promise<boolean> {
    const sanitized = this.mergeWithDefault(config);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitized));

    try {
      await supabase.from('site_settings').upsert({
        id: 'draft_config',
        config: sanitized,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return true;
  },

  /**
   * Publish changes live to storefront
   */
  async publishConfig(config: WebsiteCustomizationConfig): Promise<boolean> {
    const sanitized = this.mergeWithDefault(config);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitized));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(sanitized));

    try {
      await supabase.from('site_settings').upsert({
        id: 'published_config',
        config: sanitized,
        updated_at: new Date().toISOString(),
      });
      await supabase.from('site_settings').upsert({
        id: 'draft_config',
        config: sanitized,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return true;
  },

  /**
   * Reset section to default configuration
   */
  resetSection<K extends keyof WebsiteCustomizationConfig>(
    currentConfig: WebsiteCustomizationConfig,
    section: K
  ): WebsiteCustomizationConfig {
    return {
      ...currentConfig,
      [section]: DEFAULT_WEBSITE_CONFIG[section],
    };
  },

  /**
   * Reset all sections to default
   */
  resetAll(): WebsiteCustomizationConfig {
    return DEFAULT_WEBSITE_CONFIG;
  },

  /**
   * Ensure missing or undefined fields gracefully fall back to DEFAULT_WEBSITE_CONFIG
   */
  mergeWithDefault(inputConfig: Partial<WebsiteCustomizationConfig> | null | undefined): WebsiteCustomizationConfig {
    if (!inputConfig) return DEFAULT_WEBSITE_CONFIG;

    return {
      general: { ...DEFAULT_WEBSITE_CONFIG.general, ...inputConfig.general },
      header: {
        logoSize: inputConfig.header?.logoSize || DEFAULT_WEBSITE_CONFIG.header.logoSize,
        navigationItems: Array.isArray(inputConfig.header?.navigationItems) && inputConfig.header.navigationItems.length > 0
          ? inputConfig.header.navigationItems
          : DEFAULT_WEBSITE_CONFIG.header.navigationItems,
      },
      hero: { ...DEFAULT_WEBSITE_CONFIG.hero, ...inputConfig.hero },
      categories: Array.isArray(inputConfig.categories) && inputConfig.categories.length > 0
        ? inputConfig.categories
        : DEFAULT_WEBSITE_CONFIG.categories,
      promotions: Array.isArray(inputConfig.promotions) && inputConfig.promotions.length > 0
        ? inputConfig.promotions
        : DEFAULT_WEBSITE_CONFIG.promotions,
      bestSellers: { ...DEFAULT_WEBSITE_CONFIG.bestSellers, ...inputConfig.bestSellers },
      customerLoves: {
        sectionTitle: inputConfig.customerLoves?.sectionTitle || DEFAULT_WEBSITE_CONFIG.customerLoves.sectionTitle,
        subtitle: inputConfig.customerLoves?.subtitle || DEFAULT_WEBSITE_CONFIG.customerLoves.subtitle,
        isVisible: inputConfig.customerLoves?.isVisible !== false,
        testimonials: Array.isArray(inputConfig.customerLoves?.testimonials) && inputConfig.customerLoves.testimonials.length > 0
          ? inputConfig.customerLoves.testimonials
          : DEFAULT_WEBSITE_CONFIG.customerLoves.testimonials,
      },
      ourStory: { ...DEFAULT_WEBSITE_CONFIG.ourStory, ...inputConfig.ourStory },
      aboutUs: { ...DEFAULT_WEBSITE_CONFIG.aboutUs, ...inputConfig.aboutUs },
      footer: {
        description: inputConfig.footer?.description || DEFAULT_WEBSITE_CONFIG.footer.description,
        copyrightText: inputConfig.footer?.copyrightText || DEFAULT_WEBSITE_CONFIG.footer.copyrightText,
        newsletterTitle: inputConfig.footer?.newsletterTitle || DEFAULT_WEBSITE_CONFIG.footer.newsletterTitle,
        newsletterDescription: inputConfig.footer?.newsletterDescription || DEFAULT_WEBSITE_CONFIG.footer.newsletterDescription,
        quickLinks: Array.isArray(inputConfig.footer?.quickLinks) && inputConfig.footer.quickLinks.length > 0
          ? inputConfig.footer.quickLinks
          : DEFAULT_WEBSITE_CONFIG.footer.quickLinks,
      },
      socialMedia: { ...DEFAULT_WEBSITE_CONFIG.socialMedia, ...inputConfig.socialMedia },
      colors: { ...DEFAULT_WEBSITE_CONFIG.colors, ...inputConfig.colors },
      typography: { ...DEFAULT_WEBSITE_CONFIG.typography, ...inputConfig.typography },
      sectionsOrder: Array.isArray(inputConfig.sectionsOrder) && inputConfig.sectionsOrder.length > 0
        ? inputConfig.sectionsOrder
        : DEFAULT_WEBSITE_CONFIG.sectionsOrder,
      seo: { ...DEFAULT_WEBSITE_CONFIG.seo, ...inputConfig.seo },
    };
  }
};
