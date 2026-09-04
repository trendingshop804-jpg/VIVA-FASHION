import { useEffect } from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/home/HeroSection';
import { CategorySection } from './components/home/CategorySection';
import { PromoBanners } from './components/home/PromoBanners';
import { BestSellersSection } from './components/home/BestSellersSection';
import { CustomerLoves } from './components/home/CustomerLoves';
import { OurStory } from './components/home/OurStory';
import { AdditionalCustomerLove } from './components/home/AdditionalCustomerLove';
import { AboutSection } from './components/home/AboutSection';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { CartDrawer } from './components/modals/CartDrawer';
import { WishlistDrawer } from './components/modals/WishlistDrawer';
import { QuickViewModal } from './components/modals/QuickViewModal';
import { SearchModal } from './components/modals/SearchModal';
import { MyOrdersModal } from './components/modals/MyOrdersModal';
import { Toast } from './components/common/Toast';
import { CartProvider } from './context/CartContext';
import { UIProvider, useUI } from './context/UIContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { CMSProvider, useCMS } from './context/CMSContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/modals/AuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { VisitorAnalyticsService } from './services/visitorAnalytics';

export function AppContent() {
  const { isAdminMode } = useAdmin();
  const { isMyOrdersOpen, setIsMyOrdersOpen } = useUI();
  const { activeConfig } = useCMS();

  useEffect(() => {
    VisitorAnalyticsService.trackVisit();
  }, []);

  // Update document title dynamically from SEO config
  useEffect(() => {
    if (activeConfig?.seo?.metaTitle) {
      document.title = activeConfig.seo.metaTitle;
    }
  }, [activeConfig?.seo?.metaTitle]);

  if (isAdminMode) {
    return <AdminLayout />;
  }

  // Dynamic Section Rendering based on sectionsOrder
  const renderSectionById = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection key="sec-hero" />;
      case 'categories':
        return <CategorySection key="sec-categories" />;
      case 'promotions':
        return <PromoBanners key="sec-promotions" />;
      case 'bestsellers':
        return <BestSellersSection key="sec-bestsellers" />;
      case 'customerloves':
        return (
          <div key="sec-customerloves">
            <CustomerLoves />
            <AdditionalCustomerLove />
          </div>
        );
      case 'ourstory':
        return <OurStory key="sec-ourstory" />;
      case 'about':
        return <AboutSection key="sec-about" />;
      default:
        return null;
    }
  };

  const sectionsOrder = activeConfig?.sectionsOrder || [
    { id: 'hero', name: 'Hero Banner', isVisible: true, order: 1 },
    { id: 'categories', name: 'Featured Categories', isVisible: true, order: 2 },
    { id: 'promotions', name: 'Promotional Banners', isVisible: true, order: 3 },
    { id: 'bestsellers', name: 'Best Sellers', isVisible: true, order: 4 },
    { id: 'customerloves', name: 'Customer Loves', isVisible: true, order: 5 },
    { id: 'ourstory', name: 'Our Story', isVisible: true, order: 6 },
    { id: 'about', name: 'About Us', isVisible: true, order: 7 },
  ];

  return (
    <div className="min-h-screen bg-[#EAD8D0] py-0 sm:py-6 lg:py-10 px-0 sm:px-4 md:px-6 lg:px-8 flex justify-center">
      {/* Centered Website Container with soft rounded corners & luxury shadow */}
      <div className="w-full max-w-[1360px] bg-[#FAF7F2] sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border sm:border-[#DEC3B5]/60 flex flex-col relative">
        
        {/* 1. Announcement Bar */}
        <AnnouncementBar />

        {/* 2. Header & Desktop Navigation */}
        <Header />

        {/* Dynamic Main Content Sections in customized order */}
        <main className="flex-1">
          {sectionsOrder
            .filter((sec) => sec.isVisible !== false)
            .map((sec) => renderSectionById(sec.id))}
        </main>

        {/* 11. Dark Footer */}
        <Footer />

        {/* 12. Fixed Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Modals & Slide-out Drawers */}
        <MobileDrawer />
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
        <SearchModal />
        <AuthModal />
        <MyOrdersModal isOpen={isMyOrdersOpen} onClose={() => setIsMyOrdersOpen(false)} />
        <Toast />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CMSProvider>
          <CartProvider>
            <UIProvider>
              <AppContent />
            </UIProvider>
          </CartProvider>
        </CMSProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
