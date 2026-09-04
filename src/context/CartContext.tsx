import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Order, PaymentMethod, Coupon } from '../types';
import { StoreService } from '../services/storeService';
import { loadRazorpayScript, getRazorpayKeyId, RazorpayServerService } from '../services/razorpayService';
import { CashfreeService, PaymentAuditService } from '../services/cashfreeService';
import { VisitorAnalyticsService } from '../services/visitorAnalytics';

interface CustomerAddressInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  currencySymbol: string;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  totalCartItems: number;
  totalCartPrice: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
  toastMessage: { text: string; type: 'success' | 'info' | 'warn' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warn') => void;
  
  // Payment & Checkout state
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  isProcessingPayment: boolean;
  paymentErrorMessage: string | null;
  setPaymentErrorMessage: (msg: string | null) => void;

  // Checkout Execution
  processCheckout: (customerInfo: CustomerAddressInfo) => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = StoreService.getSettings();
  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const currencySymbol = settings.currencySymbol || '₹';

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vf_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cashfree');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vf_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vf_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const chosenSize = size || product.sizes[0] || (product.category === 'shawls' ? 'Free Size' : 'M');
    const chosenColor = color || product.colors[0]?.name || 'Standard';
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: cartItemId,
          product,
          quantity,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
        }];
      }
    });

    showToast(`Added "${product.name}" (${chosenSize}) to bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from bag', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const coupons = await StoreService.fetchCoupons();
    const match = coupons.find(c => c.code.toLowerCase() === code.trim().toLowerCase() && c.isActive);
    if (match) {
      setAppliedCoupon(match);
      showToast(`Coupon "${match.code}" applied!`, 'success');
      return true;
    }
    showToast('Invalid or expired coupon code', 'warn');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - totalCartPrice);
  const hasFreeShipping = totalCartPrice >= freeShippingThreshold;

  // Process Checkout for Cashfree, Razorpay & COD
  const processCheckout = async (customerInfo: CustomerAddressInfo): Promise<Order | null> => {
    if (cart.length === 0) {
      showToast('Your shopping bag is empty', 'warn');
      return null;
    }

    setPaymentErrorMessage(null);
    setIsProcessingPayment(true);

    const storeSettings = StoreService.getSettings();
    const shippingCost = hasFreeShipping ? 0 : 80;
    
    // Discount calculation
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

    // COD Fee logic
    const isCod = selectedPaymentMethod === 'cod';
    const codFee = (isCod && storeSettings.isCodEnabled) ? (storeSettings.codFee || 49) : 0;
    const grandTotal = discountedSubtotal + shippingCost + tax + codFee;

    // Minimum & Maximum COD validation
    if (isCod) {
      if (!storeSettings.isCodEnabled) {
        setPaymentErrorMessage('Cash on Delivery is currently disabled.');
        setIsProcessingPayment(false);
        return null;
      }
      if (grandTotal < (storeSettings.minCodOrder || 299)) {
        setPaymentErrorMessage(`Minimum order for COD is ${currencySymbol}${storeSettings.minCodOrder || 299}`);
        setIsProcessingPayment(false);
        return null;
      }
      if (grandTotal > (storeSettings.maxCodOrder || 10000)) {
        setPaymentErrorMessage(`Maximum order for COD is ${currencySymbol}${storeSettings.maxCodOrder || 10000}. Please choose online payment.`);
        setIsProcessingPayment(false);
        return null;
      }
    }

    const orderItemsSnapshot = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
      price: item.product.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor,
      image: item.product.image,
      category: item.product.category,
    }));

    const orderNum = `VF-${Math.floor(10000 + Math.random() * 90000)}`;

    // ==========================================
    // OPTION 1: CASH ON DELIVERY (COD) FLOW
    // ==========================================
    if (isCod) {
      try {
        const createdOrder = await StoreService.createOrder({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          shippingAddress: {
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
            country: customerInfo.country || 'India',
          },
          subtotal: totalCartPrice,
          discount: discountAmount,
          shippingCost,
          codFee,
          tax,
          total: grandTotal,
          currency: 'INR',
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'Confirmed',
          items: orderItemsSnapshot,
        });

        PaymentAuditService.log({
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          paymentMethod: 'cod',
          event: 'success',
          amount: grandTotal,
          details: 'COD Order placed successfully (Pending Payment on delivery)',
        });

        VisitorAnalyticsService.trackOrderPlaced(createdOrder.orderNumber);

        clearCart();
        setAppliedCoupon(null);
        setLastOrder(createdOrder);
        setIsProcessingPayment(false);
        showToast(`Order ${createdOrder.orderNumber} placed via Cash on Delivery!`, 'success');
        return createdOrder;
      } catch (err: any) {
        setPaymentErrorMessage(err.message || 'Failed to place COD order.');
        setIsProcessingPayment(false);
        return null;
      }
    }

    // ==========================================
    // OPTION 2: CASHFREE ONLINE PAYMENT FLOW
    // ==========================================
    if (selectedPaymentMethod === 'cashfree') {
      try {
        // 1. Create Cashfree Order and fetch payment session ID
        const cfOrder = await CashfreeService.createOrder({
          orderId: `order_${orderNum}_${Date.now().toString().slice(-4)}`,
          amount: grandTotal,
          currency: 'INR',
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone || '9876543210',
        });

        if (!cfOrder.paymentSessionId) {
          throw new Error('Could not initiate Cashfree payment session.');
        }

        PaymentAuditService.log({
          orderId: cfOrder.orderId,
          orderNumber: orderNum,
          paymentMethod: 'cashfree',
          event: 'attempt',
          amount: grandTotal,
          details: `Cashfree Session Initiated: ${cfOrder.paymentSessionId}`,
        });

        // 2. Open Cashfree Modal Checkout
        const result = await CashfreeService.checkout(cfOrder.paymentSessionId);

        if (result.success) {
          // 3. Mark payment_status = "paid" and create confirmed order
          const createdOrder = await StoreService.createOrder({
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            shippingAddress: {
              address: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              pincode: customerInfo.pincode,
              country: customerInfo.country || 'India',
            },
            subtotal: totalCartPrice,
            discount: discountAmount,
            shippingCost,
            codFee: 0,
            tax,
            total: grandTotal,
            currency: 'INR',
            paymentMethod: 'cashfree',
            paymentStatus: 'paid',
            orderStatus: 'Confirmed',
            items: orderItemsSnapshot,
            cashfreeOrderId: cfOrder.orderId,
            cashfreePaymentSessionId: cfOrder.paymentSessionId,
            cashfreePaymentId: result.data?.paymentDetails?.paymentId || `cf_pay_${Date.now()}`,
          });

          PaymentAuditService.log({
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            paymentMethod: 'cashfree',
            event: 'success',
            amount: grandTotal,
            details: `Cashfree Payment Confirmed. Order: ${cfOrder.orderId}`,
          });

          VisitorAnalyticsService.trackOrderPlaced(createdOrder.orderNumber);

          clearCart();
          setAppliedCoupon(null);
          setLastOrder(createdOrder);
          setIsProcessingPayment(false);
          showToast(`Cashfree payment successful! Order ${createdOrder.orderNumber} confirmed.`, 'success');
          return createdOrder;
        } else {
          setPaymentErrorMessage(result.error || 'Payment was cancelled or could not be verified.');
          setIsProcessingPayment(false);
          PaymentAuditService.log({
            orderId: 'failed',
            orderNumber: orderNum,
            paymentMethod: 'cashfree',
            event: 'failure',
            amount: grandTotal,
            details: result.error || 'Cashfree payment failed/dismissed',
          });
          return null;
        }
      } catch (err: any) {
        setPaymentErrorMessage(err.message || 'Cashfree gateway error.');
        setIsProcessingPayment(false);
        return null;
      }
    }

    // ==========================================
    // OPTION 3: RAZORPAY ONLINE PAYMENT FLOW
    // ==========================================
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentErrorMessage('Failed to load payment gateway script. Please check connection.');
      setIsProcessingPayment(false);
      return null;
    }

    try {
      const serverRazorpayOrder = await RazorpayServerService.createServerOrder({
        amountInRupees: grandTotal,
        receipt: orderNum,
        notes: { customerName: customerInfo.name, customerEmail: customerInfo.email },
      });

      const keyId = storeSettings.razorpayKeyId || getRazorpayKeyId();

      return new Promise<Order | null>((resolve) => {
        const options: any = {
          key: keyId,
          amount: serverRazorpayOrder.amount,
          currency: 'INR',
          name: storeSettings.storeName || 'VIVA FASHION ETHNIC',
          description: `Ethnic Fashion Order #${orderNum}`,
          image: storeSettings.storeLogo || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80',
          order_id: serverRazorpayOrder.id,
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone || '',
          },
          theme: {
            color: '#191E28',
          },
          handler: async function (response: any) {
            try {
              const isValidSignature = await RazorpayServerService.verifyServerSignature({
                razorpayOrderId: response.razorpay_order_id || serverRazorpayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature || 'verified',
              });

              if (!isValidSignature) {
                setPaymentErrorMessage('Payment signature verification failed.');
                setIsProcessingPayment(false);
                resolve(null);
                return;
              }

              const createdOrder = await StoreService.createOrder({
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone,
                shippingAddress: {
                  address: customerInfo.address,
                  city: customerInfo.city,
                  state: customerInfo.state,
                  pincode: customerInfo.pincode,
                  country: customerInfo.country || 'India',
                },
                subtotal: totalCartPrice,
                discount: discountAmount,
                shippingCost,
                codFee: 0,
                tax,
                total: grandTotal,
                currency: 'INR',
                paymentMethod: 'razorpay',
                paymentStatus: 'paid',
                orderStatus: 'Confirmed',
                items: orderItemsSnapshot,
                razorpayOrderId: response.razorpay_order_id || serverRazorpayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              PaymentAuditService.log({
                orderId: createdOrder.id,
                orderNumber: createdOrder.orderNumber,
                paymentMethod: 'razorpay',
                event: 'success',
                amount: grandTotal,
                details: `Razorpay Payment ID: ${response.razorpay_payment_id}`,
              });

              VisitorAnalyticsService.trackOrderPlaced(createdOrder.orderNumber);

              clearCart();
              setAppliedCoupon(null);
              setLastOrder(createdOrder);
              setIsProcessingPayment(false);
              showToast(`Payment successful! Order ${createdOrder.orderNumber} confirmed.`, 'success');
              resolve(createdOrder);
            } catch (err: any) {
              setPaymentErrorMessage('Order creation failed. Please contact support.');
              setIsProcessingPayment(false);
              resolve(null);
            }
          },

          modal: {
            ondismiss: function () {
              setPaymentErrorMessage('Payment cancelled.');
              setIsProcessingPayment(false);
              resolve(null);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setPaymentErrorMessage(`Payment failed: ${response.error?.description || 'Declined'}.`);
          setIsProcessingPayment(false);
          resolve(null);
        });
        rzp.open();
      });

    } catch (err: any) {
      setPaymentErrorMessage(err.message || 'Payment gateway initialization failed.');
      setIsProcessingPayment(false);
      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        currencySymbol,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalCartItems,
        totalCartPrice,
        freeShippingThreshold,
        amountUntilFreeShipping,
        hasFreeShipping,
        toastMessage,
        showToast,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        lastOrder,
        setLastOrder,
        isProcessingPayment,
        paymentErrorMessage,
        setPaymentErrorMessage,
        processCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
