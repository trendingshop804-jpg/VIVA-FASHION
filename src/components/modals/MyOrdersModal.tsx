import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, CreditCard, Banknote, Calendar } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { useCart } from '../../context/CartContext';
import type { Order } from '../../types';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose }) => {
  const { currencySymbol } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      StoreService.fetchOrders().then(data => {
        setOrders(data);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden text-xs">
          
          {/* Header */}
          <div className="p-4 bg-[#F5EBE6] border-b border-[#EAE3D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#C27D6E]" />
              <h3 className="font-bold text-sm text-[#191E28] uppercase tracking-wider font-serif">
                My Orders & Purchase History
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-[#191E28] hover:bg-[#EAD7CD] rounded-full">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="text-center py-10 text-[#71717A] space-y-2">
                <ShoppingBag size={32} className="mx-auto text-[#DEC3B5]" />
                <p className="font-bold text-[#191E28]">No orders found</p>
                <p className="text-xs">Your past orders will appear here once placed.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#FAF4EC] pb-2">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#191E28]">{ord.orderNumber}</span>
                      <span className="text-[10px] text-[#71717A] block flex items-center gap-1 mt-0.5">
                        <Calendar size={11} /> {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {ord.paymentStatus === 'paid' ? 'PAID' : 'PENDING COD'}
                      </span>
                      <span className="text-[10px] font-bold text-[#2E5A44] block mt-0.5">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#555E6C]">
                      {ord.paymentMethod === 'cashfree' ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CreditCard size={12} /> Cashfree
                        </span>
                      ) : ord.paymentMethod === 'razorpay' ? (
                        <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          <CreditCard size={12} /> Razorpay
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Banknote size={12} /> Cash on Delivery
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#71717A] block font-medium">{ord.items.length} items</span>
                      <span className="text-sm font-bold text-[#191E28]">{currencySymbol}{ord.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#FAF4EC]">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-lg text-[11px]">
                        {it.image && <img src={it.image} alt={it.name} className="w-7 h-9 rounded object-cover" />}
                        <div className="line-clamp-1 flex-1">
                          <span className="font-semibold text-[#191E28] block">{it.name}</span>
                          <span className="text-[9px] text-[#71717A]">Size: {it.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
