import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useCart();
  const { activeConfig } = useCMS();
  const footer = activeConfig?.footer;
  const social = activeConfig?.socialMedia;
  const general = activeConfig?.general;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warn');
      return;
    }
    showToast('Thank you for subscribing! Your 15% promo code is VIVA15', 'success');
    setEmail('');
  };

  const quickLinks = footer?.quickLinks && footer.quickLinks.length > 0
    ? footer.quickLinks
    : [
        { id: 'fl-1', label: 'About Us', url: '#about' },
        { id: 'fl-2', label: 'Contact', url: '#footer' },
        { id: 'fl-3', label: 'Kurtis Collection', url: '#featured-products' },
        { id: 'fl-4', label: 'Shipping & Returns', url: '#footer' },
      ];

  const bgColor = activeConfig?.colors?.footerBg || '#161A22';

  return (
    <footer
      style={{ backgroundColor: bgColor }}
      className="text-[#EAD7CD] pt-12 pb-20 md:pb-12 border-t border-[#28303F]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 border-b border-[#28303F]/60">
          
          {/* Column 1: Subscribe (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FAF7F2]">
              {footer?.newsletterTitle || 'SUBSCRIBE FOR 15% OFF'}
            </h4>
            <p className="text-xs text-[#DEC3B5]/80 leading-relaxed max-w-sm">
              {footer?.newsletterDescription ||
                'Be the first to receive updates on new ethnic arrivals, seasonal sales, and exclusive boutique styling notes.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#FAF7F2] text-[#191E28] placeholder-[#71717A] text-xs px-3.5 py-2.5 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#C27D6E]"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="bg-[#C27D6E] hover:bg-[#A66355] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-r-md transition-colors shrink-0"
              >
                Sign Up
              </button>
            </form>
            <p className="text-[10px] text-[#A66355] opacity-80 pt-1">
              By subscribing you agree to our Terms & Privacy Policy.
            </p>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FAF7F2]">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-[#DEC3B5]/80">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url || '#'}
                    onClick={(e) => {
                      if (link.url?.startsWith('#')) {
                        e.preventDefault();
                        const el = document.getElementById(link.url.replace('#', ''));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-[#FAF7F2] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media & Payment (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FAF7F2]">
              SOCIAL MEDIA
            </h4>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                { name: 'Instagram', label: 'IG', icon: '📷', url: social?.instagram },
                { name: 'Facebook', label: 'FB', icon: 'f', url: social?.facebook },
                { name: 'YouTube', label: 'YT', icon: '▶', url: social?.youtube },
                { name: 'Pinterest', label: 'PIN', icon: 'P', url: social?.pinterest },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url || '#'}
                  target={item.url ? '_blank' : '_self'}
                  rel="noreferrer"
                  onClick={(e) => { if (!item.url) e.preventDefault(); }}
                  className="w-7 h-7 rounded-full bg-[#FAF7F2] text-[#191E28] hover:bg-[#C27D6E] hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold shadow-sm"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            {/* Secured Payment badges */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-[#DEC3B5]/60 block mb-2">
                Secured Payments & UPI
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 bg-[#FAF7F2] text-[#191E28] rounded text-[10px] font-bold border border-white/20">RAZORPAY</span>
                <span className="px-2 py-1 bg-[#FAF7F2] text-[#191E28] rounded text-[10px] font-bold border border-white/20">UPI / GPAY</span>
                <span className="px-2 py-1 bg-[#FAF7F2] text-[#191E28] rounded text-[10px] font-bold border border-white/20">CASH ON DELIVERY</span>
                <span className="px-2 py-1 bg-[#FAF7F2] text-[#191E28] rounded text-[10px] font-bold border border-white/20">CARDS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#DEC3B5]/60">
          <p>{footer?.copyrightText || `© 2026 ${general?.storeName || 'VIVA FASHION ETHNIC'}. ALL RIGHTS RESERVED.`}</p>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
