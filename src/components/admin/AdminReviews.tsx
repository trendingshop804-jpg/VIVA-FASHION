import React from 'react';
import { CheckCircle, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../services/storeService';
import { StarRating } from '../common/StarRating';

export const AdminReviews: React.FC = () => {
  const { reviews, refreshReviews } = useAdmin();
  const { showToast } = useCart();

  const handleStatus = async (id: string, status: 'Approved' | 'Hidden') => {
    await StoreService.updateReviewStatus(id, status);
    await refreshReviews();
    showToast(`Review marked as ${status}`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
          Customer Reviews Moderation ({reviews.length})
        </h2>
        <p className="text-xs text-[#555E6C]">
          Moderate user photos and testimonials displayed on the storefront.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-[#DEC3B5]/60 overflow-hidden shadow-2xs flex flex-col justify-between p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <StarRating rating={r.rating} showCount={false} />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {r.status || 'Approved'}
                </span>
              </div>

              <p className="text-xs text-[#191E28] italic leading-relaxed">
                "{r.text}"
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img src={r.image} alt={r.author} className="w-12 h-14 rounded-lg object-cover border border-[#DEC3B5]" />
                <div className="text-xs">
                  <div className="font-bold text-[#191E28]">{r.author}</div>
                  <div className="text-[10px] text-[#A66355] font-semibold">{r.productName || 'Verified Buyer'}</div>
                  <div className="text-[9px] text-[#71717A]">{r.location || 'India'}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs">
              <button
                onClick={() => handleStatus(r.id, r.status === 'Approved' ? 'Hidden' : 'Approved')}
                className="text-[#C27D6E] font-semibold hover:underline flex items-center gap-1"
              >
                {r.status === 'Approved' ? <><EyeOff size={13} /> Hide from Store</> : <><CheckCircle size={13} /> Approve</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
