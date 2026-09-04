import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="text-[#C27D6E] w-4 h-4 shrink-0" />,
    info: <Info className="text-[#191E28] w-4 h-4 shrink-0" />,
    warn: <AlertCircle className="text-[#DCA134] w-4 h-4 shrink-0" />,
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-bounce-in max-w-sm">
      <div className="bg-[#191E28] text-[#FDFBF7] px-4 py-3 rounded-xl shadow-2xl border border-[#C27D6E]/40 flex items-center gap-3">
        {icons[toastMessage.type]}
        <p className="text-xs md:text-sm font-medium leading-snug">
          {toastMessage.text}
        </p>
      </div>
    </div>
  );
};
