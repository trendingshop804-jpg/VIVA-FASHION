import React, { useState } from 'react';
import { Save, Store, Mail, Globe, MessageCircle, Truck, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const { showToast } = useCart();
  const [formData, setFormData] = useState(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Store settings saved successfully', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif flex items-center gap-2">
          <Store size={20} className="text-[#C27D6E]" />
          <span>Store Details & Business Configuration</span>
        </h2>
        <p className="text-xs text-[#555E6C]">
          Configure storefront branding, contact information, shipping rules, Razorpay & Cash on Delivery payment gateways.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs space-y-6 text-xs">
        
        {/* Section 1: Payment Methods Configuration (Cashfree, Razorpay & COD) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
            <div>
              <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CreditCard size={14} />
                <span>1. Payment Gateways & Cash on Delivery (COD)</span>
              </h4>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                Turn payment options ON or OFF. Changes will immediately reflect in customer checkout.
              </p>
            </div>
          </div>

          {/* Cashfree Payment Gateway Options */}
          <div className={`p-4 rounded-xl border transition-all ${
            formData.isCashfreeEnabled !== false ? 'bg-[#FAF7F2] border-[#C27D6E]/60 shadow-xs' : 'bg-gray-50/80 border-gray-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCashfreeEnabled !== false}
                    onChange={(e) => setFormData({ ...formData, isCashfreeEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C27D6E]"></div>
                </div>
                <div>
                  <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#C27D6E]" /> Cashfree Payments (UPI, Cards, NetBanking, Wallets)
                  </span>
                  <span className="text-[10px] text-[#7A7A7A] block">Fast payments via GPay, PhonePe, Paytm, BHIM & Cards</span>
                </div>
              </label>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                  formData.isCashfreeEnabled !== false
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}>
                  {formData.isCashfreeEnabled !== false ? 'ON / ACTIVE' : 'OFF / DISABLED'}
                </span>
              </div>
            </div>

            {formData.isCashfreeEnabled !== false && (
              <div className="mt-4 pt-3 border-t border-[#DEC3B5]/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-[#191E28] block mb-1">Cashfree App ID (Client ID)</label>
                    <input
                      type="text"
                      value={formData.cashfreeAppId || ''}
                      onChange={(e) => setFormData({ ...formData, cashfreeAppId: e.target.value })}
                      placeholder="9365174848179fa9f2de2db31b715639"
                      className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Environment</label>
                    <select
                      value={formData.cashfreeEnvironment || 'production'}
                      onChange={(e) => setFormData({ ...formData, cashfreeEnvironment: e.target.value as 'production' | 'sandbox' })}
                      className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-bold"
                    >
                      <option value="production">Production (Live)</option>
                      <option value="sandbox">Sandbox (Test)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-[#DEC3B5]/60 flex items-start gap-2 text-[10px] text-[#555E6C]">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#191E28] block">Live Gateway Configured</strong>
                    <span>Cashfree Payments JS SDK v3 is integrated for seamless checkout redirect and webhook order confirmation.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Razorpay Options */}
          <div className={`p-4 rounded-xl border transition-all ${
            Boolean(formData.isRazorpayEnabled) ? 'bg-[#FAF7F2] border-[#C27D6E]/60 shadow-xs' : 'bg-gray-50/80 border-gray-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isRazorpayEnabled)}
                    onChange={(e) => setFormData({ ...formData, isRazorpayEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C27D6E]"></div>
                </div>
                <div>
                  <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#C27D6E]" /> Razorpay Gateway
                  </span>
                  <span className="text-[10px] text-[#7A7A7A] block">Accept online payments with Razorpay standard checkout</span>
                </div>
              </label>

              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                Boolean(formData.isRazorpayEnabled)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}>
                {Boolean(formData.isRazorpayEnabled) ? 'ON / ACTIVE' : 'OFF / DISABLED'}
              </span>
            </div>

            {Boolean(formData.isRazorpayEnabled) && (
              <div className="mt-4 pt-3 border-t border-[#DEC3B5]/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Razorpay Key ID (Public Client Key)</label>
                  <input
                    type="text"
                    value={formData.razorpayKeyId || ''}
                    onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                    placeholder="rzp_live_..."
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cash on Delivery Options */}
          <div className={`p-4 rounded-xl border transition-all ${
            Boolean(formData.isCodEnabled) ? 'bg-[#FAF7F2] border-[#C27D6E]/60 shadow-xs' : 'bg-gray-50/80 border-gray-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isCodEnabled)}
                    onChange={(e) => setFormData({ ...formData, isCodEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C27D6E]"></div>
                </div>
                <div>
                  <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                    <Banknote size={14} className="text-[#C27D6E]" /> Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] text-[#7A7A7A] block">Customers pay in cash upon doorstep package delivery</span>
                </div>
              </label>

              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                Boolean(formData.isCodEnabled)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}>
                {Boolean(formData.isCodEnabled) ? 'ON / ACTIVE' : 'OFF / DISABLED'}
              </span>
            </div>

            {Boolean(formData.isCodEnabled) && (
              <div className="mt-4 pt-3 border-t border-[#DEC3B5]/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">COD Handling Fee ({formData.currencySymbol || '₹'})</label>
                  <input
                    type="number"
                    value={formData.codFee ?? 49}
                    onChange={(e) => setFormData({ ...formData, codFee: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Min COD Order ({formData.currencySymbol || '₹'})</label>
                  <input
                    type="number"
                    value={formData.minCodOrder ?? 299}
                    onChange={(e) => setFormData({ ...formData, minCodOrder: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Max COD Order ({formData.currencySymbol || '₹'})</label>
                  <input
                    type="number"
                    value={formData.maxCodOrder ?? 10000}
                    onChange={(e) => setFormData({ ...formData, maxCodOrder: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DEC3B5] rounded p-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Store Identity & Branding */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1.5">
            <Globe size={14} />
            <span>2. Store Identity & Branding</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Store Name</label>
              <input
                type="text"
                required
                value={formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Store Logo URL</label>
              <input
                type="url"
                value={formData.storeLogo || ''}
                onChange={(e) => setFormData({ ...formData, storeLogo: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Store Description / Tagline</label>
            <textarea
              rows={2}
              value={formData.storeDescription || ''}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              placeholder="Artisanal ethnic fashion storefront..."
              className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1.5">
            <Mail size={14} />
            <span>3. Support & Contact Details</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Support Email</label>
              <input
                type="email"
                required
                value={formData.supportEmail || ''}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Customer Helpline / Phone</label>
              <input
                type="text"
                required
                value={formData.supportPhone || ''}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Physical Store Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>

        {/* Section 4: Currency, Shipping Rules & Thresholds */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1.5">
            <Truck size={14} />
            <span>4. Financial & Shipping Rules</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currencySymbol || '₹'}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs font-bold text-center"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Min Order Value ({formData.currencySymbol})</label>
              <input
                type="number"
                value={formData.minOrderValue || 299}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">Free Shipping Threshold ({formData.currencySymbol})</label>
              <input
                type="number"
                value={formData.freeShippingThreshold || 999}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs font-bold text-[#2E5A44]"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRate || 5}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#191E28] block mb-1">Shipping Policy Information</label>
            <input
              type="text"
              value={formData.shippingInfo || ''}
              onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
              placeholder="Complimentary Express Shipping over ₹999..."
              className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
            />
          </div>
        </div>

        {/* Section 5: Social Media & WhatsApp */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#A66355] uppercase tracking-wider text-[11px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1.5">
            <Globe size={14} />
            <span>5. Social Media & Communication</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-[#191E28] block mb-1">
                Instagram Handle / URL
              </label>
              <input
                type="text"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] block mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formData.facebook || ''}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-[#191E28] flex items-center gap-1 mb-1">
                <MessageCircle size={12} className="text-emerald-600" /> WhatsApp Support Number
              </label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded p-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#191E28] hover:bg-[#C27D6E] text-white px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md"
          >
            <Save size={14} />
            <span>Save Store & Payment Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
