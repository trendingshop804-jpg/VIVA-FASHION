import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Banknote,
  AlertCircle,
  Tag,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { StoreService } from '../../services/storeService';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen } = useUI();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalCartPrice,
    hasFreeShipping,
    amountUntilFreeShipping,
    freeShippingThreshold,
    currencySymbol,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    processCheckout,
    lastOrder,
    isProcessingPayment,
    paymentErrorMessage,
    setPaymentErrorMessage,
    showToast
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const settings = StoreService.getSettings();

  // Address Form State
  const [formData, setFormData] = useState({
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    phone: '+91 98765 43210',
    address: '45 MG Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  });

  useEffect(() => {
    if (lastOrder && step === 'checkout') {
      setStep('success');
    }
  }, [lastOrder]);

  // Automatically select an active payment method if current one is turned OFF
  useEffect(() => {
    const isCf = Boolean(settings.isCashfreeEnabled);
    const isRzp = Boolean(settings.isRazorpayEnabled);
    const isCod = Boolean(settings.isCodEnabled);

    if (selectedPaymentMethod === 'cashfree' && !isCf) {
      if (isRzp) setSelectedPaymentMethod('razorpay');
      else if (isCod) setSelectedPaymentMethod('cod');
    } else if (selectedPaymentMethod === 'razorpay' && !isRzp) {
      if (isCf) setSelectedPaymentMethod('cashfree');
      else if (isCod) setSelectedPaymentMethod('cod');
    } else if (selectedPaymentMethod === 'cod' && !isCod) {
      if (isCf) setSelectedPaymentMethod('cashfree');
      else if (isRzp) setSelectedPaymentMethod('razorpay');
    }
  }, [settings.isCashfreeEnabled, settings.isRazorpayEnabled, settings.isCodEnabled, selectedPaymentMethod, setSelectedPaymentMethod]);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((totalCartPrice / freeShippingThreshold) * 100));

  // Costs Breakdown Calculation
  const shippingCost = hasFreeShipping ? 0 : 80;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((totalCartPrice * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const discountedSubtotal = Math.max(0, totalCartPrice - discountAmount);
  const tax = Math.round(discountedSubtotal * 0.05);

  const isCod = selectedPaymentMethod === 'cod';
  const codFee = (isCod && settings.isCodEnabled) ? (settings.codFee || 49) : 0;
  const grandTotal = discountedSubtotal + shippingCost + tax + codFee;

  const handleApplyCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCodeInput);
    setIsApplyingCoupon(false);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setStep('checkout');
    setPaymentErrorMessage(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      showToast('Please complete all required customer & shipping details.', 'warn');
      return;
    }

    const order = await processCheckout(formData);
    if (order) {
      setStep('success');
    }
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('cart');
      setPaymentErrorMessage(null);
    }, 300);
  };

  const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#191E28]/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#EAE3D9] flex items-center justify-between bg-[#F5EBE6]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#C27D6E]" />
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#191E28]">
              {step === 'checkout' ? 'Express Checkout' : step === 'success' ? 'Order Confirmed' : `Shopping Bag (${totalItemsCount})`}
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full text-[#191E28] hover:bg-[#EAD7CD] transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {step !== 'success' && (
          <div className="bg-[#FAF4EC] px-4 py-2.5 border-b border-[#EAE3D9]">
            <div className="flex items-center justify-between text-xs font-medium text-[#191E28] mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#C27D6E]" />
                {hasFreeShipping ? (
                  <span className="font-bold text-[#2E5A44]">
                    You qualified for FREE SHIPPING! 🎉
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#C27D6E]">{currencySymbol}{amountUntilFreeShipping.toLocaleString()}</strong> more for free delivery
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#A66355]">{progressPercent}%</span>
            </div>
            
            <div className="w-full bg-[#DEC3B5]/50 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  hasFreeShipping ? 'bg-[#2E5A44]' : 'bg-[#C27D6E]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            cart.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-[#555E6C]">
                <ShoppingBag size={36} className="mx-auto text-[#DEC3B5]" />
                <p className="text-sm font-semibold text-[#191E28]">Your bag is currently empty</p>
                <p className="text-xs text-[#71717A]">
                  Explore handcrafted Kurtis, luxury Shawls, and 4-way stretch Leggings.
                </p>
                <button
                  onClick={closeDrawer}
                  className="bg-[#191E28] text-white px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#C27D6E] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-white p-3 rounded-xl border border-[#DEC3B5]/50 shadow-2xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F5EBE6] shrink-0 border border-[#DEC3B5]/40">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#A66355] font-bold block">
                              {item.product.category}
                            </span>
                            <h4 className="text-xs font-semibold text-[#191E28] line-clamp-1">
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#8C93A0] hover:text-[#C27D6E] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#71717A] mt-0.5 space-x-2">
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Color: <strong>{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#DEC3B5] rounded-md bg-[#FAF7F2]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#EAD7CD] text-[#191E28] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#191E28]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#EAD7CD] text-[#191E28] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-[#191E28]">
                          {currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* STEP 2: CHECKOUT FORM & PAYMENT SELECTION */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              
              {/* Payment Error Alert Banner */}
              {paymentErrorMessage && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-700 flex items-start gap-2.5 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <div className="space-y-1">
                    <strong className="block text-[#191E28]">{paymentErrorMessage}</strong>
                    <div className="flex gap-3 text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => setPaymentErrorMessage(null)}
                        className="underline font-bold text-[#191E28]"
                      >
                        Try Again
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod('cod');
                          setPaymentErrorMessage(null);
                        }}
                        className="underline font-bold text-[#C27D6E]"
                      >
                        Switch to Cash on Delivery
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. Customer & Shipping Details */}
              <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A66355] border-b border-[#EAE3D9] pb-1.5 flex items-center justify-between">
                  <span>1. Customer & Shipping Address</span>
                  <span className="text-[10px] text-[#71717A] font-normal">All fields required</span>
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full border border-[#DEC3B5] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#C27D6E] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full border border-[#DEC3B5] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#C27D6E] text-xs bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full border border-[#DEC3B5] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#C27D6E] text-xs bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House/Flat No, Street Name"
                      className="w-full border border-[#DEC3B5] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#C27D6E] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full border border-[#DEC3B5] rounded-lg px-2.5 py-1.5 text-xs bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full border border-[#DEC3B5] rounded-lg px-2.5 py-1.5 text-xs bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#191E28] block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full border border-[#DEC3B5] rounded-lg px-2.5 py-1.5 text-xs bg-[#FAF7F2]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Coupon Discount Code Box */}
              <div className="bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#191E28]">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-[#C27D6E]" />
                    <span>Apply Coupon Code</span>
                  </span>
                  <span className="text-[10px] font-normal text-[#71717A]">Try: VIVAETHNIC15</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <div>
                      <span className="font-bold text-emerald-800 text-xs block">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-600">
                        {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-600 underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. VIVAETHNIC15"
                      className="flex-1 border border-[#DEC3B5] rounded-lg px-3 py-1.5 uppercase font-semibold text-xs"
                    />
                    <button
                      type="button"
                      disabled={isApplyingCoupon}
                      onClick={handleApplyCouponSubmit}
                      className="bg-[#FAF4EC] hover:bg-[#EAD7CD] text-[#191E28] border border-[#DEC3B5] px-4 py-1.5 rounded-lg font-bold text-xs"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Payment Method Selection (Cashfree, Razorpay, Cash on Delivery) */}
              {/* 3. Payment Method Selection (Cashfree, Razorpay, Cash on Delivery) */}
              <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A66355] border-b border-[#EAE3D9] pb-1.5 flex items-center justify-between">
                  <span>2. Payment Method</span>
                  <ShieldCheck size={16} className="text-[#C27D6E]" />
                </h4>

                <div className="space-y-2.5">
                  
                  {/* Option A: Cashfree Online Payment (Only if enabled) */}
                  {settings.isCashfreeEnabled && (
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPaymentMethod === 'cashfree'
                          ? 'border-[#C27D6E] bg-[#F5EBE6]/60 shadow-xs'
                          : 'border-[#DEC3B5]/60 bg-white hover:border-[#DEC3B5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cashfree"
                        checked={selectedPaymentMethod === 'cashfree'}
                        onChange={() => setSelectedPaymentMethod('cashfree')}
                        className="mt-1 accent-[#C27D6E]"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                            <CreditCard size={14} className="text-[#C27D6E]" />
                            <span>Cashfree Payments / Pay Online</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Instant Confirmation
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555E6C] leading-snug">
                          Pay securely online via UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and Wallets.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Option B: Razorpay (Only if enabled) */}
                  {settings.isRazorpayEnabled && (
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPaymentMethod === 'razorpay'
                          ? 'border-[#C27D6E] bg-[#F5EBE6]/60 shadow-xs'
                          : 'border-[#DEC3B5]/60 bg-white hover:border-[#DEC3B5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={selectedPaymentMethod === 'razorpay'}
                        onChange={() => setSelectedPaymentMethod('razorpay')}
                        className="mt-1 accent-[#C27D6E]"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                            <CreditCard size={14} className="text-[#C27D6E]" />
                            <span>Razorpay Gateway</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555E6C] leading-snug">
                          Pay securely via Razorpay payment gateway.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Option C: Cash on Delivery (Only if enabled) */}
                  {settings.isCodEnabled && (
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPaymentMethod === 'cod'
                          ? 'border-[#C27D6E] bg-[#F5EBE6]/60 shadow-xs'
                          : 'border-[#DEC3B5]/60 bg-white hover:border-[#DEC3B5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={() => setSelectedPaymentMethod('cod')}
                        className="mt-1 accent-[#C27D6E]"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#191E28] text-xs flex items-center gap-1.5">
                            <Banknote size={14} className="text-[#C27D6E]" />
                            <span>Cash on Delivery (COD)</span>
                          </span>
                          {settings.codFee > 0 && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              +{currencySymbol}{settings.codFee} Fee
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#555E6C] leading-snug">
                          Pay cash or UPI upon delivery at your doorstep. Order status will be set to Pending until delivery.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Fallback when all payment methods are OFF */}
                  {!settings.isCashfreeEnabled && !settings.isRazorpayEnabled && !settings.isCodEnabled && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-center space-y-1">
                      <strong className="block text-xs">Payment Methods Unavailable</strong>
                      <p className="text-[11px] text-amber-700">
                        Online payment is currently unavailable. Please try again later.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* 4. Complete Totals Summary */}
              <div className="bg-[#FAF4EC] p-3.5 rounded-xl border border-[#DEC3B5]/70 space-y-2">
                <div className="flex justify-between text-[#555E6C]">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-[#191E28]">{currencySymbol}{totalCartPrice.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{currencySymbol}{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#555E6C]">
                  <span>Shipping Fee</span>
                  <span>{shippingCost === 0 ? <strong className="text-[#2E5A44]">FREE</strong> : `${currencySymbol}${shippingCost}`}</span>
                </div>

                {isCod && codFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>Cash on Delivery Handling Fee</span>
                    <span>+{currencySymbol}{codFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#555E6C]">
                  <span>GST Tax (5%)</span>
                  <span>{currencySymbol}{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#191E28] pt-2 border-t border-[#DEC3B5]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#191E28]">{currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => setStep('cart')}
                  className="w-1/3 border border-[#DEC3B5] py-3 rounded-xl font-semibold text-[#191E28] hover:bg-[#EAD7CD]"
                >
                  Back to Bag
                </button>

                <button
                  type="submit"
                  disabled={isProcessingPayment || (!settings.isCashfreeEnabled && !settings.isRazorpayEnabled && !settings.isCodEnabled)}
                  className="w-2/3 bg-[#191E28] hover:bg-[#C27D6E] text-white py-3 rounded-xl font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : isCod ? (
                    <span>PLACE COD ORDER</span>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>PAY {currencySymbol}{grandTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === 'success' && lastOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#2E5A44]/10 text-[#2E5A44] rounded-full flex items-center justify-center mx-auto border border-[#2E5A44]/30 shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#191E28] font-serif">Order Confirmed!</h4>
                <p className="text-xs text-[#555E6C] mt-0.5">
                  Thank you for shopping with Viva Fashion Ethnic!
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-white p-4 rounded-xl border border-[#DEC3B5] text-xs text-left space-y-2 shadow-2xs">
                <div className="flex justify-between border-b border-[#FAF4EC] pb-2 font-bold text-[#191E28]">
                  <span>Order Number:</span>
                  <span className="font-mono text-sm text-[#C27D6E]">{lastOrder.orderNumber}</span>
                </div>

                <div className="flex justify-between text-[#555E6C]">
                  <span>Payment Method:</span>
                  <span className="font-bold text-[#191E28] uppercase">
                    {lastOrder.paymentMethod === 'cashfree' ? 'Cashfree Payments' : lastOrder.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'Cash on Delivery'}
                  </span>
                </div>

                <div className="flex justify-between text-[#555E6C]">
                  <span>Payment Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    lastOrder.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lastOrder.paymentStatus === 'paid' ? 'PAID' : 'PENDING (Pay on Delivery)'}
                  </span>
                </div>

                {lastOrder.cashfreePaymentId && (
                  <div className="flex justify-between text-[#71717A] text-[11px]">
                    <span>Cashfree Ref:</span>
                    <span className="font-mono">{lastOrder.cashfreePaymentId}</span>
                  </div>
                )}

                {lastOrder.razorpayPaymentId && (
                  <div className="flex justify-between text-[#71717A] text-[11px]">
                    <span>Razorpay Ref:</span>
                    <span className="font-mono">{lastOrder.razorpayPaymentId}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#555E6C] border-t border-[#FAF4EC] pt-2 font-bold text-[#191E28]">
                  <span>Grand Total:</span>
                  <span>{currencySymbol}{lastOrder.total.toLocaleString()}</span>
                </div>

                <div className="text-[11px] text-[#71717A] pt-1">
                  <strong>Shipping Address:</strong> {lastOrder.customerName}, {lastOrder.shippingAddress.address}, {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state} - {lastOrder.shippingAddress.pincode}
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-3 rounded-xl font-bold tracking-[0.14em] uppercase transition-colors shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>

        {/* Footer with Totals for Step 1 Cart */}
        {cart.length > 0 && step === 'cart' && (
          <div className="p-4 border-t border-[#EAE3D9] bg-[#FAF7F2] space-y-3">
            <div className="space-y-1.5 text-xs text-[#555E6C]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#191E28]">{currencySymbol}{totalCartPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#191E28]">
                  {hasFreeShipping ? <span className="text-[#2E5A44]">FREE</span> : `${currencySymbol}80`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#191E28] pt-1.5 border-t border-[#EAE3D9]">
                <span>Estimated Total</span>
                <span>{currencySymbol}{(totalCartPrice + (hasFreeShipping ? 0 : 80)).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-3 rounded-xl text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
