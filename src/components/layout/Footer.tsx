import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';
import { Logo } from '../common/Logo';

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
        { id: 'fl-1', label: 'Home', url: '#hero' },
        { id: 'fl-2', label: 'Women', url: '#featured-categories' },
        { id: 'fl-3', label: 'New Arrivals', url: '#featured-products' },
        { id: 'fl-4', label: 'Sale', url: '#featured-products' },
        { id: 'fl-5', label: 'About Us', url: '#about' },
        { id: 'fl-6', label: 'Contact', url: '#footer' },
      ];

  const customerCare = [
    { id: 'cc-1', label: 'Shipping Policy', url: '#' },
    { id: 'cc-2', label: 'Return & Exchange', url: '#' },
    { id: 'cc-3', label: 'Privacy Policy', url: '#' },
    { id: 'cc-4', label: 'Terms & Conditions', url: '#' },
    { id: 'cc-5', label: 'FAQs', url: '#' },
  ];

  return (
    <footer id="footer" className="bg-[#3A1F2E] text-white pt-12 pb-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-3 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-xs text-white/60 tracking-wider">
              Style • Comfort • Confidence
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
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
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              {customerCare.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white">
              Stay Connected
            </h4>
            <p className="text-xs text-white/60">
              Join our newsletter for exclusive offers
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs px-4 py-2.5 rounded-l-md focus:outline-none focus:border-[#C2185B]"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="bg-[#C2185B] hover:bg-[#A01348] text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-r-md transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { name: 'Facebook', url: social?.facebook, icon: 'f' },
                { name: 'Instagram', url: social?.instagram, icon: 'IG' },
                { name: 'YouTube', url: social?.youtube, icon: 'YT' },
                { name: 'Pinterest', url: social?.pinterest, icon: 'P' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url || '#'}
                  target={item.url ? '_blank' : '_self'}
                  rel="noreferrer"
                  onClick={(e) => { if (!item.url) e.preventDefault(); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C2185B] text-white flex items-center justify-center text-[10px] font-bold transition-colors"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-6 bg-[#5C3F51] py-3 text-center">
          <p className="text-[11px] text-white/70">
            {footer?.copyrightText || `© 2026 ${general?.storeName || 'VIVA FASHION'}. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};
