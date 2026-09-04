import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';

export const AnnouncementBar: React.FC = () => {
  const { currencySymbol, freeShippingThreshold } = useCart();
  const { activeConfig } = useCMS();
  const general = activeConfig?.general;

  if (general && general.isAnnouncementVisible === false) {
    return null;
  }

  const bgColor = general?.announcementBgColor || '#B87B6F';
  const customMessage = general?.announcementText;

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="text-[#FDFBF7] py-1.5 px-3 sm:px-4 text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors select-none flex items-center justify-between"
    >
      <div className="hidden sm:flex items-center gap-1 opacity-80 text-[9px] w-1/4">
        <Sparkles size={11} />
        <span>Authentic Ethnic Handcrafted</span>
      </div>

      <div className="flex-1 text-center font-bold tracking-[0.18em] px-2 truncate">
        <span>
          {customMessage || `FREE SHIPPING ON ORDERS OVER ${currencySymbol}${freeShippingThreshold} | CODE: VIVAETHNIC15`}
        </span>
      </div>

      <div className="hidden sm:block w-1/4" />
    </div>
  );
};
