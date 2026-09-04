export type ProductCategory = 'kurtis' | 'shawls' | 'leggings';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  brand?: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  images?: string[];
  tag?: string;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  
  // Category-specific metadata
  fabric?: string;
  fit?: string;
  sleeveType?: string;
  length?: string;
  neckType?: string;
  pattern?: string;
  occasion?: string;
  stretch?: string;
  waistType?: string;
  workEmbroidery?: string;
  
  // Admin flags
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  title: string;
  slug: ProductCategory;
  buttonText: string;
  image: string;
  description?: string;
  itemCount?: number;
  isActive?: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  role?: string;
  location?: string;
  rating: number;
  text: string;
  image: string;
  productName?: string;
  status?: 'Approved' | 'Pending' | 'Hidden';
  date?: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface FilterState {
  category: string;
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cashfree' | 'razorpay' | 'cod';

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  unitPrice?: number;
  totalPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
  category?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  subtotal: number;
  discount: number;
  shippingCost: number;
  codFee: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  
  // Cashfree transaction fields
  cashfreeOrderId?: string;
  cashfreePaymentSessionId?: string;
  cashfreePaymentId?: string;

  // Razorpay transaction fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Payment audit
  paidAt?: string;
  paidBy?: string;
  refundStatus?: 'none' | 'requested' | 'processed';
  refundId?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'VIP';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  storeLogo?: string;
  storeDescription?: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  minOrderValue?: number;
  taxRate: number;
  supportEmail: string;
  supportPhone: string;
  address: string;
  shippingInfo?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;

  // Cashfree Payment settings
  isCashfreeEnabled: boolean;
  cashfreeAppId: string;
  cashfreeSecretKey?: string;
  cashfreeEnvironment: 'production' | 'sandbox';

  // Razorpay & COD settings
  isRazorpayEnabled: boolean;
  razorpayKeyId: string;
  isCodEnabled: boolean;
  codFee: number;
  minCodOrder: number;
  maxCodOrder: number;
}

export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
  productViews: number;
  categoryViews: number;
  addToCartEvents: number;
  wishlistEvents: number;
  orderEvents: number;
}

export interface VisitorActivity {
  id: string;
  timestamp: string;
  page: string;
  event: 'Page View' | 'Product View' | 'Category View' | 'Add to Cart' | 'Wishlist' | 'Order Placed';
  device: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentSettings {
  id: string;
  cashfreeEnabled: boolean;
  razorpayEnabled: boolean;
  codEnabled: boolean;
  codFee: number;
  minCodAmount: number;
  maxCodAmount: number;
  cashfreeAppId?: string;
  cashfreeEnvironment?: 'production' | 'sandbox';
  razorpayKeyId?: string;
  updatedAt?: string;
}

export interface PaymentAuditLog {
  id: string;
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  event: 'attempt' | 'success' | 'failure' | 'verification' | 'cod_received' | 'refund';
  amount: number;
  details?: string;
  timestamp: string;
}
