export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface HeroConfig {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  mobileImageUrl?: string;
  featuredProductName: string;
  featuredProductPrice: number;
  featuredCategory: 'kurtis' | 'shawls' | 'leggings';
  isVisible: boolean;
}

export interface FeaturedCategoryConfig {
  id: string;
  slug: 'kurtis' | 'shawls' | 'leggings' | string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export interface PromoBannerConfig {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  bgColor?: string;
  buttonText: string;
  buttonUrl: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
}

export interface TestimonialConfig {
  id: string;
  customerName: string;
  location: string;
  photoUrl: string;
  reviewText: string;
  rating: number;
  productName: string;
  isActive: boolean;
  order: number;
}

export interface SectionOrderConfig {
  id: 'hero' | 'categories' | 'promotions' | 'bestsellers' | 'customerloves' | 'ourstory' | 'about' | 'footer';
  name: string;
  isVisible: boolean;
  order: number;
}

export interface BrandColorsConfig {
  primary: string;       // e.g. #191E28 (Dark Charcoal)
  secondary: string;     // e.g. #C27D6E (Terracotta/Rose)
  accent: string;        // e.g. #A66355 (Muted Rust)
  background: string;    // e.g. #FAF7F2 (Warm Ivory)
  cardBackground: string;// e.g. #F5EBE6 (Soft Nude)
  textColor: string;     // e.g. #191E28
  footerBg: string;      // e.g. #191E28
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface WebsiteCustomizationConfig {
  general: {
    storeName: string;
    brandName: string;
    logoUrl: string;
    faviconUrl: string;
    storeDescription: string;
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    currencySymbol: string;
    freeShippingThreshold: number;
    announcementText: string;
    isAnnouncementVisible: boolean;
    announcementBgColor: string;
  };
  header: {
    logoSize: 'sm' | 'md' | 'lg';
    navigationItems: NavigationItem[];
  };
  hero: HeroConfig;
  categories: FeaturedCategoryConfig[];
  promotions: PromoBannerConfig[];
  bestSellers: {
    sectionTitle: string;
    subtitle: string;
    productCount: number;
    sortBy: 'bestseller' | 'newest' | 'price-asc' | 'price-desc';
    isVisible: boolean;
  };
  customerLoves: {
    sectionTitle: string;
    subtitle: string;
    testimonials: TestimonialConfig[];
    isVisible: boolean;
  };
  ourStory: {
    heading: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonUrl: string;
    isVisible: boolean;
  };
  aboutUs: {
    heading: string;
    description: string;
    additionalText: string;
    imageUrl: string;
    buttonText: string;
    buttonUrl: string;
    isVisible: boolean;
  };
  footer: {
    description: string;
    copyrightText: string;
    quickLinks: { id: string; label: string; url: string; order: number }[];
    newsletterTitle: string;
    newsletterDescription: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    youtube: string;
    pinterest: string;
    whatsapp: string;
  };
  colors: BrandColorsConfig;
  typography: {
    headingFont: string;
    bodyFont: string;
    serifFont: string;
  };
  sectionsOrder: SectionOrderConfig[];
  seo: SEOConfig;
}
