import { supabase } from '../lib/supabase';
import type { Product, Order, Customer, Coupon, CustomerReview, StoreSettings, PaymentSettings, ProductCategory, OrderStatus, PaymentStatus } from '../types';
import { KURTI_IMAGES, SHAWL_IMAGES, LEGGING_IMAGES } from '../data/productImages';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'VIVA FASHION ETHNIC',
  storeLogo: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80',
  storeDescription: 'Premium artisanal ethnic fashion storefront specializing in handcrafted Kurtis, luxury Kashmiri Shawls, and 4-way stretch Leggings.',
  currencySymbol: '₹',
  currencyCode: 'INR',
  freeShippingThreshold: 999,
  minOrderValue: 299,
  taxRate: 5,
  supportEmail: 'care@vivafashionethnic.com',
  supportPhone: '+91 800-VIVA-ETHNIC',
  address: 'Artisan Square, MG Road, Bengaluru, Karnataka, 560001',
  shippingInfo: 'Complimentary Express Shipping across India for orders over ₹999. Standard delivery 3-5 business days.',
  instagram: 'https://instagram.com/vivafashionethnic',
  facebook: 'https://facebook.com/vivafashionethnic',
  whatsapp: '+91 98765 43210',

  // Payment settings
  isCashfreeEnabled: true,
  cashfreeAppId: '9365174848179fa9f2de2db31b715639',
  cashfreeEnvironment: 'production',
  isRazorpayEnabled: false,
  razorpayKeyId: 'rzp_test_51730000000000',
  isCodEnabled: true,
  codFee: 49,
  minCodOrder: 299,
  maxCodOrder: 10000,
};

// Initial Seed fallback ensuring EVERY image clearly matches KURTIS, SHAWLS, or LEGGINGS
export const INITIAL_PRODUCTS: Product[] = [
  // KURTIS
  {
    id: 'prod-kur-1',
    name: 'Embroidered Cotton Kurti',
    slug: 'embroidered-cotton-kurti',
    sku: 'KUR-001',
    brand: 'Viva Couture',
    category: 'kurtis',
    price: 1299,
    salePrice: 1599,
    originalPrice: 1599,
    stock: 35,
    rating: 4.9,
    reviewCount: 128,
    image: KURTI_IMAGES.embroideredCotton[0],
    secondaryImage: KURTI_IMAGES.embroideredCotton[1],
    images: KURTI_IMAGES.embroideredCotton,
    tag: 'Bestseller',
    colors: [
      { name: 'Mustard Gold', hex: '#DCA134' },
      { name: 'Blush Pink', hex: '#D99A8C' },
      { name: 'Ivory Cream', hex: '#FAF4EC' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pure breathable organic cotton kurti featuring intricate heritage zari embroidery on the yoke, paired with comfortable 3/4th sleeves for all-day elegance.',
    fabric: '100% Breathable Organic Cotton',
    fit: 'Straight Cut Regular Fit',
    sleeveType: '3/4th Sleeves',
    length: 'Calf Length (44")',
    neckType: 'Round with Notch',
    pattern: 'Embroidered Yoke',
    occasion: 'Festive / Everyday',
    workEmbroidery: 'Zari & Thread Needlework',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-kur-2',
    name: 'Premium Floral Printed Kurti',
    slug: 'premium-floral-printed-kurti',
    sku: 'KUR-002',
    brand: 'Viva Artisans',
    category: 'kurtis',
    price: 1499,
    salePrice: 1899,
    originalPrice: 1899,
    stock: 22,
    rating: 4.8,
    reviewCount: 86,
    image: KURTI_IMAGES.floralPrinted[0],
    secondaryImage: KURTI_IMAGES.floralPrinted[1],
    images: KURTI_IMAGES.floralPrinted,
    tag: 'New Arrival',
    colors: [
      { name: 'Sage Green', hex: '#7A8F73' },
      { name: 'Coral Pink', hex: '#E07A5F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Lustrous Chanderi cotton kurti adorned with botanical Jaipur handblock floral motifs and delicate gota trims.',
    fabric: 'Chanderi Cotton',
    fit: 'A-Line Silhouette',
    sleeveType: 'Full Sleeves',
    length: 'Calf Length (46")',
    neckType: 'Mandarin Collar',
    pattern: 'Floral Handblock Print',
    occasion: 'Celebration / Office',
    workEmbroidery: 'Gota Patti Accents',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isSale: false,
    isActive: true,
  },
  {
    id: 'prod-kur-3',
    name: 'Anarkali Flared Ethnic Kurti',
    slug: 'anarkali-flared-ethnic-kurti',
    sku: 'KUR-003',
    brand: 'Viva Royal',
    category: 'kurtis',
    price: 1899,
    salePrice: 2299,
    originalPrice: 2299,
    stock: 18,
    rating: 5.0,
    reviewCount: 42,
    image: KURTI_IMAGES.anarkali[0],
    secondaryImage: KURTI_IMAGES.anarkali[1],
    images: KURTI_IMAGES.anarkali,
    tag: 'Royal Couture',
    colors: [
      { name: 'Emerald Green', hex: '#1E4D3E' },
      { name: 'Maroon Red', hex: '#8F263E' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Majestic flared 32-kali Anarkali gown in rich silk blend with gold foil motifs and hand-embroidered borders.',
    fabric: 'Silk Blend with Pure Cotton Lining',
    fit: 'Flared Royal Anarkali',
    sleeveType: 'Elbow Length Sleeves',
    length: 'Floor Length (50")',
    neckType: 'Sweetheart Neck',
    pattern: 'Foil Ethnic Motif',
    occasion: 'Weddings & Festivities',
    workEmbroidery: 'Hand-embroidered Border',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-kur-4',
    name: 'Rayon Straight Casual Kurti',
    slug: 'rayon-straight-casual-kurti',
    sku: 'KUR-004',
    brand: 'Viva Basics',
    category: 'kurtis',
    price: 899,
    salePrice: 1199,
    originalPrice: 1199,
    stock: 45,
    rating: 4.6,
    reviewCount: 64,
    image: KURTI_IMAGES.straightCasual[0],
    secondaryImage: KURTI_IMAGES.straightCasual[1],
    images: KURTI_IMAGES.straightCasual,
    colors: [
      { name: 'Indigo Blue', hex: '#2A4A7F' },
      { name: 'Turquoise', hex: '#3E8B99' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Ultra-breathable 140 GSM modal rayon kurti with side slits and natural wooden buttons for daily ease.',
    fabric: '140 GSM Modal Rayon',
    fit: 'Comfort Straight Cut',
    sleeveType: '3/4th Sleeves',
    length: 'Knee Length (42")',
    neckType: 'V-Neck',
    pattern: 'Solid with Wooden Buttons',
    occasion: 'Daily Wear',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isSale: true,
    isActive: true,
  },

  // SHAWLS & DUPATTAS
  {
    id: 'prod-shw-1',
    name: 'Kashmiri Embroidered Shawl',
    slug: 'kashmiri-embroidered-shawl',
    sku: 'SHW-001',
    brand: 'Kashmir Weaves',
    category: 'shawls',
    price: 1899,
    salePrice: 2499,
    originalPrice: 2499,
    stock: 15,
    rating: 4.9,
    reviewCount: 94,
    image: SHAWL_IMAGES.kashmiriEmbroidered[0],
    secondaryImage: SHAWL_IMAGES.kashmiriEmbroidered[1],
    images: SHAWL_IMAGES.kashmiriEmbroidered,
    tag: 'Artisan Heritage',
    colors: [
      { name: 'Maroon Red', hex: '#671D28' },
      { name: 'Navy Charcoal', hex: '#191E28' },
      { name: 'Beige Gold', hex: '#D8CFC3' }
    ],
    sizes: ['Free Size'],
    description: 'Authentic Kashmiri Aari needlework shawl crafted from warm, feather-light fine merino wool blend with ornate paisley motifs.',
    fabric: 'Fine Merino Wool Blend',
    length: 'Full Size (2.2m x 1m)',
    pattern: 'Traditional Paisley Aari Motif',
    workEmbroidery: 'Intricate Multi-color Aari Embroidery',
    occasion: 'Evening & Winter Festive',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-shw-2',
    name: 'Paisley Printed Silk Blend Shawl',
    slug: 'paisley-printed-silk-blend-shawl',
    sku: 'SHW-002',
    brand: 'Viva Heritage',
    category: 'shawls',
    price: 1299,
    salePrice: 1699,
    originalPrice: 1699,
    stock: 28,
    rating: 4.8,
    reviewCount: 51,
    image: SHAWL_IMAGES.paisleySilk[0],
    secondaryImage: SHAWL_IMAGES.paisleySilk[1],
    images: SHAWL_IMAGES.paisleySilk,
    tag: 'Trending',
    colors: [
      { name: 'Mustard Ochre', hex: '#DCA134' },
      { name: 'Emerald Green', hex: '#2E5A44' }
    ],
    sizes: ['Free Size'],
    description: 'Silky soft reversible ethnic stole featuring royal Persian paisley medallions and delicate fringed borders.',
    fabric: 'Art Silk & Wool Weave',
    length: 'Stole (2.0m x 0.8m)',
    pattern: 'Persian Paisley Jacquard',
    workEmbroidery: 'Woven Jacquard with Tassels',
    occasion: 'Celebrations & Gifting',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    isSale: false,
    isActive: true,
  },
  {
    id: 'prod-shw-3',
    name: 'Lightweight Printed Cotton Dupatta',
    slug: 'lightweight-printed-cotton-dupatta',
    sku: 'SHW-003',
    brand: 'Jaipur Threads',
    category: 'shawls',
    price: 699,
    salePrice: 899,
    originalPrice: 899,
    stock: 40,
    rating: 4.7,
    reviewCount: 72,
    image: SHAWL_IMAGES.cottonDupatta[0],
    secondaryImage: SHAWL_IMAGES.cottonDupatta[1],
    images: SHAWL_IMAGES.cottonDupatta,
    colors: [
      { name: 'Blush Pink', hex: '#D99A8C' },
      { name: 'Ivory Cream', hex: '#FAF4EC' }
    ],
    sizes: ['Free Size'],
    description: 'Featherlight Mulmul cotton dupatta with delicate Bagru block print, flowing drape, and crochet lace trims.',
    fabric: '100% Mulmul Cotton',
    length: '2.4m Length',
    pattern: 'Handblock Geometric Bagru',
    workEmbroidery: 'Crochet Lace Border',
    occasion: 'Casual & Festive Pairing',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: false,
    isSale: true,
    isActive: true,
  },

  // LEGGINGS
  {
    id: 'prod-leg-1',
    name: 'Stretch Ankle Length Leggings',
    slug: 'stretch-ankle-length-leggings',
    sku: 'LEG-001',
    brand: 'Viva Flex',
    category: 'leggings',
    price: 499,
    salePrice: 649,
    originalPrice: 649,
    stock: 85,
    rating: 4.9,
    reviewCount: 210,
    image: LEGGING_IMAGES.stretchAnkle[0],
    secondaryImage: LEGGING_IMAGES.stretchAnkle[1],
    images: LEGGING_IMAGES.stretchAnkle,
    tag: 'Essential Staple',
    colors: [
      { name: 'Classic Black', hex: '#151515' },
      { name: 'Midnight Blue', hex: '#2A4A7F' },
      { name: 'Mustard Gold', hex: '#DCA134' },
      { name: 'Maroon Red', hex: '#8F263E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: '4-way ultra stretch biowashed combed cotton leggings engineered with a no-roll elastic waistband and dense, non-transparent knit.',
    fabric: '95% Combed Cotton, 5% Lycra',
    stretch: '4-Way High Stretch',
    waistType: 'Mid-Rise Comfort Band',
    length: 'Ankle Length (38")',
    fit: 'Snug Ankle Fit',
    occasion: 'Daily Ethnic Pairing',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-leg-2',
    name: 'Classic Cotton Churidar Leggings',
    slug: 'classic-cotton-churidar-leggings',
    sku: 'LEG-002',
    brand: 'Viva Basics',
    category: 'leggings',
    price: 549,
    salePrice: 699,
    originalPrice: 699,
    stock: 60,
    rating: 4.8,
    reviewCount: 145,
    image: LEGGING_IMAGES.churidar[0],
    secondaryImage: LEGGING_IMAGES.churidar[1],
    images: LEGGING_IMAGES.churidar,
    tag: 'Traditional Fit',
    colors: [
      { name: 'Blush Pink', hex: '#D99A8C' },
      { name: 'Off-White Cream', hex: '#FAF4EC' },
      { name: 'Classic Black', hex: '#151515' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Gathered churidar leggings with extra length for perfect graceful bangles at the ankle, crafted from super combed cotton.',
    fabric: '100% Super Combed Cotton Lycra',
    stretch: 'Flexible Stretch',
    waistType: 'High-Rise Elasticated',
    length: 'Churidar Length (46")',
    fit: 'Traditional Churidar Fit',
    occasion: 'Festive & Traditional Kurti Pairing',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isSale: false,
    isActive: true,
  },
  {
    id: 'prod-leg-3',
    name: 'Pastel Capri Leggings',
    slug: 'pastel-capri-leggings',
    sku: 'LEG-003',
    brand: 'Viva Flex',
    category: 'leggings',
    price: 449,
    salePrice: 599,
    originalPrice: 599,
    stock: 4,
    rating: 4.7,
    reviewCount: 58,
    image: LEGGING_IMAGES.capri[0],
    secondaryImage: LEGGING_IMAGES.capri[1],
    images: LEGGING_IMAGES.capri,
    tag: 'Low Stock',
    colors: [
      { name: 'Sage Green', hex: '#7A8F73' },
      { name: 'Dusty Rose', hex: '#D99A8C' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Breathable 3/4th length capri leggings in soothing summer pastel tones with flatlock anti-chafing seams.',
    fabric: '92% Organic Cotton, 8% Elastane',
    stretch: 'High Elasticity',
    waistType: 'Mid-Rise Snug Band',
    length: 'Capri Length (30")',
    fit: 'Cropped Capri Fit',
    occasion: 'Summer Casuals & Tunics',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isSale: true,
    isActive: true,
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'VF-10921',
    customerName: 'Pooja Sharma',
    customerEmail: 'pooja.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      address: '45 MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India',
    },
    subtotal: 2598,
    discount: 200,
    shippingCost: 0,
    codFee: 0,
    tax: 120,
    total: 2518,
    currency: 'INR',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Delivered',
    razorpayOrderId: 'rzp_ord_10921',
    razorpayPaymentId: 'pay_M89a01xK91',
    paidAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    items: [
      { productId: 'prod-kur-1', name: 'Embroidered Cotton Kurti', price: 1299, unitPrice: 1299, totalPrice: 1299, quantity: 1, size: 'M', color: 'Mustard Gold', image: KURTI_IMAGES.embroideredCotton[0], category: 'kurtis' },
      { productId: 'prod-shw-1', name: 'Kashmiri Embroidered Shawl', price: 1299, unitPrice: 1299, totalPrice: 1299, quantity: 1, size: 'Free Size', color: 'Maroon Red', image: SHAWL_IMAGES.kashmiriEmbroidered[0], category: 'shawls' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ord-2',
    orderNumber: 'VF-10922',
    customerName: 'Ritu Patel',
    customerEmail: 'ritu.patel@example.com',
    customerPhone: '+91 98123 45678',
    shippingAddress: {
      address: '12 Satellite Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      country: 'India',
    },
    subtotal: 1048,
    discount: 0,
    shippingCost: 0,
    codFee: 49,
    tax: 52,
    total: 1149,
    currency: 'INR',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'Shipped',
    items: [
      { productId: 'prod-leg-1', name: 'Stretch Ankle Length Leggings', price: 499, unitPrice: 499, totalPrice: 499, quantity: 1, size: 'L', color: 'Classic Black', image: LEGGING_IMAGES.stretchAnkle[0], category: 'leggings' },
      { productId: 'prod-leg-2', name: 'Classic Cotton Churidar Leggings', price: 549, unitPrice: 549, totalPrice: 549, quantity: 1, size: 'L', color: 'Blush Pink', image: LEGGING_IMAGES.churidar[0], category: 'leggings' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-3',
    orderNumber: 'VF-10923',
    customerName: 'Ananya Sengupta',
    customerEmail: 'ananya.s@example.com',
    customerPhone: '+91 99234 56789',
    shippingAddress: {
      address: '88 Salt Lake Sector V',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      country: 'India',
    },
    subtotal: 1899,
    discount: 150,
    shippingCost: 0,
    codFee: 0,
    tax: 87,
    total: 1836,
    currency: 'INR',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Processing',
    razorpayOrderId: 'rzp_ord_10923',
    razorpayPaymentId: 'pay_M90b02yL92',
    paidAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    items: [
      { productId: 'prod-kur-3', name: 'Anarkali Flared Ethnic Kurti', price: 1899, unitPrice: 1899, totalPrice: 1899, quantity: 1, size: 'M', color: 'Emerald Green', image: KURTI_IMAGES.anarkali[0], category: 'kurtis' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ord-4',
    orderNumber: 'VF-10924',
    customerName: 'Kavita Menon',
    customerEmail: 'kavita.m@example.com',
    customerPhone: '+91 97345 67890',
    shippingAddress: {
      address: '24 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020',
      country: 'India',
    },
    subtotal: 3198,
    discount: 300,
    shippingCost: 0,
    codFee: 49,
    tax: 145,
    total: 3092,
    currency: 'INR',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'Confirmed',
    items: [
      { productId: 'prod-shw-1', name: 'Kashmiri Embroidered Shawl', price: 1899, unitPrice: 1899, totalPrice: 1899, quantity: 1, size: 'Free Size', color: 'Navy Charcoal', image: SHAWL_IMAGES.kashmiriEmbroidered[0], category: 'shawls' },
      { productId: 'prod-kur-2', name: 'Premium Floral Printed Kurti', price: 1499, unitPrice: 1499, totalPrice: 1499, quantity: 1, size: 'S', color: 'Sage Green', image: KURTI_IMAGES.floralPrinted[0], category: 'kurtis' }
    ],
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'Pooja Sharma', email: 'pooja.sharma@example.com', phone: '+91 98765 43210', city: 'Bengaluru', state: 'Karnataka', totalOrders: 4, totalSpent: 8420, status: 'VIP', createdAt: '2025-11-10' },
  { id: 'c-2', name: 'Ritu Patel', email: 'ritu.patel@example.com', phone: '+91 98123 45678', city: 'Ahmedabad', state: 'Gujarat', totalOrders: 2, totalSpent: 2850, status: 'Active', createdAt: '2026-01-15' },
  { id: 'c-3', name: 'Ananya Sengupta', email: 'ananya.s@example.com', phone: '+91 99234 56789', city: 'Kolkata', state: 'West Bengal', totalOrders: 3, totalSpent: 5490, status: 'Active', createdAt: '2026-02-01' },
  { id: 'c-4', name: 'Kavita Menon', email: 'kavita.m@example.com', phone: '+91 97345 67890', city: 'Mumbai', state: 'Maharashtra', totalOrders: 5, totalSpent: 12600, status: 'VIP', createdAt: '2025-09-18' },
  { id: 'c-5', name: 'Meera Rao', email: 'meera.rao@example.com', phone: '+91 96456 78901', city: 'Hyderabad', state: 'Telangana', totalOrders: 1, totalSpent: 607, status: 'Active', createdAt: '2026-03-01' },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'coup-1', code: 'VIVAETHNIC15', discountType: 'percentage', discountValue: 15, minOrder: 999, maxDiscount: 500, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 500, timesUsed: 38, isActive: true },
  { id: 'coup-2', code: 'FESTIVE200', discountType: 'fixed', discountValue: 200, minOrder: 1499, maxDiscount: 200, startDate: '2026-08-01', endDate: '2026-10-31', usageLimit: 200, timesUsed: 19, isActive: true },
  { id: 'coup-3', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrder: 499, maxDiscount: 300, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 1000, timesUsed: 84, isActive: true },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Pooja Sharma',
    location: 'Bengaluru, India',
    rating: 5,
    text: 'The mustard embroidered kurti is breathtaking! The craftsmanship is top notch and fabric stays cool all day.',
    image: KURTI_IMAGES.embroideredCotton[0],
    productName: 'Embroidered Cotton Kurti',
    status: 'Approved',
    date: '2026-02-18',
  },
  {
    id: 'rev-2',
    author: 'Kavita Menon',
    location: 'Mumbai, India',
    rating: 5,
    text: 'The Kashmiri Aari embroidery is authentic and soft as butter. Looks regal draped over kurtis.',
    image: SHAWL_IMAGES.kashmiriEmbroidered[0],
    productName: 'Kashmiri Embroidered Shawl',
    status: 'Approved',
    date: '2026-02-25',
  },
  {
    id: 'rev-3',
    author: 'Ritu Patel',
    location: 'Ahmedabad, India',
    rating: 5,
    text: 'Never found leggings this buttery soft and completely opaque. Viva Fashion is my absolute favorite brand.',
    image: LEGGING_IMAGES.stretchAnkle[0],
    productName: 'Stretch Ankle Length Leggings',
    status: 'Approved',
    date: '2026-03-02',
  },
];

// Helper to enforce image matching category
function enforceCategoryImages(products: Product[]): Product[] {
  return products.map(p => {
    if (p.category === 'kurtis') {
      const isKurtiImg = p.image.includes('1617627143750') || p.image.includes('1583391733956') || p.image.includes('1610030469983') || p.image.includes('1594463750939');
      if (!isKurtiImg) {
        p.image = KURTI_IMAGES.defaultKurti;
        p.images = [KURTI_IMAGES.defaultKurti];
      }
    } else if (p.category === 'shawls') {
      const isShawlImg = p.image.includes('1601244005535') || p.image.includes('1609357605129') || p.image.includes('1612722432474');
      if (!isShawlImg) {
        p.image = SHAWL_IMAGES.defaultShawl;
        p.images = [SHAWL_IMAGES.defaultShawl];
      }
    } else if (p.category === 'leggings') {
      const isLeggingImg = p.image.includes('1506629082955') || p.image.includes('1552902865') || p.image.includes('1556909114');
      if (!isLeggingImg) {
        p.image = LEGGING_IMAGES.defaultLegging;
        p.images = [LEGGING_IMAGES.defaultLegging];
      }
    }
    return p;
  });
}

// Helper to map DB row to frontend Product type
function mapDbProductToProduct(row: any): Product {
  const defaultImg = KURTI_IMAGES.defaultKurti;
  const imgs = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : [row.image || defaultImg];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: row.sku || `SKU-${row.id.substring(0, 6)}`,
    brand: row.brand || 'Viva Fashion',
    category: row.category as ProductCategory,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    originalPrice: row.sale_price ? Number(row.sale_price) : undefined,
    stock: row.stock ?? 20,
    rating: Number(row.rating || 4.8),
    reviewCount: Number(row.review_count || 0),
    image: imgs[0],
    secondaryImage: imgs[1],
    images: imgs,
    tag: row.bestseller ? 'Bestseller' : (row.new_arrival ? 'New Arrival' : undefined),
    colors: Array.isArray(row.colors) ? row.colors : [{ name: 'Default', hex: '#191E28' }],
    sizes: Array.isArray(row.sizes) ? row.sizes : ['S', 'M', 'L', 'XL'],
    description: row.description || '',
    fabric: row.fabric,
    fit: row.fit,
    sleeveType: row.sleeve_type,
    length: row.length,
    neckType: row.neck_type,
    pattern: row.pattern,
    occasion: row.occasion,
    stretch: row.stretch,
    waistType: row.waist_type,
    workEmbroidery: row.work_embroidery,
    isBestSeller: Boolean(row.bestseller),
    isNewArrival: Boolean(row.new_arrival),
    isFeatured: Boolean(row.featured),
    isSale: Boolean(row.is_sale),
    isActive: row.is_active !== false,
  };
}

export const StoreService = {
  // Products
  async fetchProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = enforceCategoryImages(data.map(mapDbProductToProduct));
        localStorage.setItem('vf_products', JSON.stringify(mapped));
        return mapped;
      }
    } catch {}

    const saved = localStorage.getItem('vf_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const enforced = enforceCategoryImages(parsed);
        localStorage.setItem('vf_products', JSON.stringify(enforced));
        return enforced;
      } catch {}
    }
    
    localStorage.setItem('vf_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const isNew = !product.id || product.id.startsWith('temp-') || product.id.startsWith('prod-');
    const id = isNew ? `prod-${Date.now()}` : product.id!;

    const imagesList = product.images && product.images.length > 0
      ? product.images
      : [product.image || KURTI_IMAGES.defaultKurti];

    const newProduct: Product = {
      id,
      name: product.name || 'New Product',
      slug: product.slug || (product.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`,
      brand: product.brand || 'Viva Fashion',
      category: (product.category || 'kurtis') as ProductCategory,
      price: product.price || 999,
      salePrice: product.salePrice,
      originalPrice: product.salePrice || product.price,
      stock: product.stock ?? 20,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      image: imagesList[0],
      secondaryImage: imagesList[1],
      images: imagesList,
      tag: product.tag,
      colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Default', hex: '#191E28' }],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'],
      description: product.description || '',
      fabric: product.fabric,
      fit: product.fit,
      sleeveType: product.sleeveType,
      length: product.length,
      neckType: product.neckType,
      pattern: product.pattern,
      occasion: product.occasion,
      stretch: product.stretch,
      waistType: product.waistType,
      workEmbroidery: product.workEmbroidery,
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
      isFeatured: Boolean(product.isFeatured),
      isSale: Boolean(product.isSale),
      isActive: product.isActive !== false,
    };

    // Update local storage
    const currentProducts = await this.fetchProducts();
    const updated = isNew
      ? [newProduct, ...currentProducts]
      : currentProducts.map(p => p.id === id ? newProduct : p);

    localStorage.setItem('vf_products', JSON.stringify(updated));

    // Try Supabase insert/update
    try {
      await supabase.from('products').upsert({
        id: newProduct.id,
        name: newProduct.name,
        slug: newProduct.slug,
        sku: newProduct.sku,
        brand: newProduct.brand,
        category: newProduct.category,
        price: newProduct.price,
        sale_price: newProduct.salePrice,
        stock: newProduct.stock,
        description: newProduct.description,
        fabric: newProduct.fabric,
        fit: newProduct.fit,
        sleeve_type: newProduct.sleeveType,
        length: newProduct.length,
        neck_type: newProduct.neckType,
        pattern: newProduct.pattern,
        occasion: newProduct.occasion,
        stretch: newProduct.stretch,
        waist_type: newProduct.waistType,
        work_embroidery: newProduct.workEmbroidery,
        colors: newProduct.colors,
        sizes: newProduct.sizes,
        images: newProduct.images,
        featured: newProduct.isFeatured,
        bestseller: newProduct.isBestSeller,
        new_arrival: newProduct.isNewArrival,
        is_sale: newProduct.isSale,
        is_active: newProduct.isActive,
      });
    } catch {}

    return newProduct;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const currentProducts = await this.fetchProducts();
    const updated = currentProducts.filter(p => p.id !== productId);
    localStorage.setItem('vf_products', JSON.stringify(updated));

    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch {}

    return true;
  },

  // Orders
  async fetchOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped: Order[] = data.map((row: any) => ({
          id: row.id,
          orderNumber: row.order_number,
          userId: row.user_id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone,
          shippingAddress: row.shipping_address || {},
          subtotal: Number(row.subtotal),
          discount: Number(row.discount || 0),
          shippingCost: Number(row.shipping_cost || 0),
          codFee: Number(row.cod_fee || 0),
          tax: Number(row.tax || 0),
          total: Number(row.total),
          currency: row.currency || 'INR',
          paymentMethod: row.payment_method || 'cod',
          paymentStatus: row.payment_status || 'pending',
          orderStatus: row.order_status || 'Confirmed',
          items: Array.isArray(row.items) ? row.items : [],
          cashfreeOrderId: row.cashfree_order_id,
          cashfreePaymentSessionId: row.cashfree_payment_session_id,
          cashfreePaymentId: row.cashfree_payment_id,
          razorpayOrderId: row.razorpay_order_id,
          razorpayPaymentId: row.razorpay_payment_id,
          razorpaySignature: row.razorpay_signature,
          paidAt: row.paid_at,
          paidBy: row.paid_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        localStorage.setItem('vf_orders', JSON.stringify(mapped));
        return mapped;
      }
    } catch {}

    const saved = localStorage.getItem('vf_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = await this.fetchOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o);
    localStorage.setItem('vf_orders', JSON.stringify(updated));

    try {
      await supabase.from('orders').update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    } catch {}

    return true;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, extraDetails?: { paidAt?: string; paidBy?: string; razorpayPaymentId?: string; cashfreePaymentId?: string }): Promise<boolean> {
    const orders = await this.fetchOrders();
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus,
          paidAt: extraDetails?.paidAt || (paymentStatus === 'paid' ? new Date().toISOString() : o.paidAt),
          paidBy: extraDetails?.paidBy || o.paidBy,
          razorpayPaymentId: extraDetails?.razorpayPaymentId || o.razorpayPaymentId,
          cashfreePaymentId: extraDetails?.cashfreePaymentId || o.cashfreePaymentId,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    localStorage.setItem('vf_orders', JSON.stringify(updated));

    try {
      await supabase.from('orders').update({
        payment_status: paymentStatus,
        paid_at: extraDetails?.paidAt || (paymentStatus === 'paid' ? new Date().toISOString() : undefined),
        paid_by: extraDetails?.paidBy,
        razorpay_payment_id: extraDetails?.razorpayPaymentId,
        cashfree_payment_id: extraDetails?.cashfreePaymentId,
        updated_at: new Date().toISOString(),
      }).eq('id', orderId);
    } catch {}

    return true;
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const settings = this.getSettings();
    const isCod = orderData.paymentMethod === 'cod';

    // Strict validation: Reject disabled payment methods
    if (orderData.paymentMethod === 'cashfree' && !settings.isCashfreeEnabled) {
      throw new Error('Cashfree online payment is currently disabled by store administrator.');
    }
    if (orderData.paymentMethod === 'razorpay' && !settings.isRazorpayEnabled) {
      throw new Error('Razorpay online payment is currently disabled by store administrator.');
    }
    if (orderData.paymentMethod === 'cod' && !settings.isCodEnabled) {
      throw new Error('Cash on Delivery (COD) is currently disabled by store administrator.');
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `VF-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: orderData.userId,
      customerName: orderData.customerName || 'Guest Customer',
      customerEmail: orderData.customerEmail || 'guest@example.com',
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress || { address: '', city: '', state: '', pincode: '', country: 'India' },
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      codFee: orderData.codFee || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      currency: 'INR',
      paymentMethod: orderData.paymentMethod || 'cashfree',
      paymentStatus: orderData.paymentStatus || (isCod ? 'pending' : 'pending'),
      orderStatus: orderData.orderStatus || 'Confirmed',
      items: orderData.items || [],
      cashfreeOrderId: orderData.cashfreeOrderId,
      cashfreePaymentSessionId: orderData.cashfreePaymentSessionId,
      cashfreePaymentId: orderData.cashfreePaymentId,
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayPaymentId: orderData.razorpayPaymentId,
      razorpaySignature: orderData.razorpaySignature,
      paidAt: orderData.paymentStatus === 'paid' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock server-side/state-side for confirmed orders
    if (newOrder.items && newOrder.items.length > 0) {
      const allProds = await this.fetchProducts();
      const updatedProds = allProds.map(p => {
        const item = newOrder.items.find(i => i.productId === p.id || i.name === p.name);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      });
      localStorage.setItem('vf_products', JSON.stringify(updatedProds));
    }

    const orders = await this.fetchOrders();
    localStorage.setItem('vf_orders', JSON.stringify([newOrder, ...orders]));

    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        user_id: newOrder.userId,
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone,
        shipping_address: newOrder.shippingAddress,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        shipping_cost: newOrder.shippingCost,
        cod_fee: newOrder.codFee,
        tax: newOrder.tax,
        total: newOrder.total,
        currency: newOrder.currency,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        order_status: newOrder.orderStatus,
        items: newOrder.items,
        cashfree_order_id: newOrder.cashfreeOrderId,
        cashfree_payment_session_id: newOrder.cashfreePaymentSessionId,
        cashfree_payment_id: newOrder.cashfreePaymentId,
        razorpay_order_id: newOrder.razorpayOrderId,
        razorpay_payment_id: newOrder.razorpayPaymentId,
        razorpay_signature: newOrder.razorpaySignature,
        paid_at: newOrder.paidAt,
      });
    } catch {}

    return newOrder;
  },

  // Customers
  async fetchCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          city: c.city,
          state: c.state,
          totalOrders: c.total_orders,
          totalSpent: Number(c.total_spent),
          status: c.status,
          createdAt: c.created_at,
        }));
      }
    } catch {}

    const saved = localStorage.getItem('vf_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  },

  // Coupons
  async fetchCoupons(): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          code: c.code,
          discountType: c.discount_type,
          discountValue: Number(c.discount_value),
          minOrder: Number(c.min_order || 0),
          maxDiscount: c.max_discount ? Number(c.max_discount) : undefined,
          startDate: c.start_date,
          endDate: c.end_date,
          usageLimit: Number(c.usage_limit || 100),
          timesUsed: Number(c.times_used || 0),
          isActive: Boolean(c.is_active),
        }));
      }
    } catch {}

    const saved = localStorage.getItem('vf_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  },

  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const isNew = !coupon.id;
    const newCoupon: Coupon = {
      id: coupon.id || `coup-${Date.now()}`,
      code: (coupon.code || '').toUpperCase().trim(),
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      minOrder: coupon.minOrder || 0,
      maxDiscount: coupon.maxDiscount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit || 100,
      timesUsed: coupon.timesUsed || 0,
      isActive: coupon.isActive !== false,
    };

    const coupons = await this.fetchCoupons();
    const updated = isNew
      ? [newCoupon, ...coupons]
      : coupons.map(c => c.id === newCoupon.id ? newCoupon : c);

    localStorage.setItem('vf_coupons', JSON.stringify(updated));

    try {
      await supabase.from('coupons').upsert({
        code: newCoupon.code,
        discount_type: newCoupon.discountType,
        discount_value: newCoupon.discountValue,
        min_order: newCoupon.minOrder,
        max_discount: newCoupon.maxDiscount,
        start_date: newCoupon.startDate,
        end_date: newCoupon.endDate,
        usage_limit: newCoupon.usageLimit,
        times_used: newCoupon.timesUsed,
        is_active: newCoupon.isActive,
      }, { onConflict: 'code' });
    } catch {}

    return newCoupon;
  },

  async deleteCoupon(couponId: string): Promise<boolean> {
    const coupons = await this.fetchCoupons();
    const updated = coupons.filter(c => c.id !== couponId);
    localStorage.setItem('vf_coupons', JSON.stringify(updated));
    try {
      await supabase.from('coupons').delete().eq('id', couponId);
    } catch {}
    return true;
  },

  // Reviews
  async fetchReviews(): Promise<CustomerReview[]> {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          author: r.customer_name,
          rating: Number(r.rating || 5),
          text: r.comment,
          image: r.image_url || KURTI_IMAGES.defaultKurti,
          productName: r.product_name,
          status: r.status,
          date: r.created_at ? r.created_at.split('T')[0] : '2026-02-18',
        }));
      }
    } catch {}

    const saved = localStorage.getItem('vf_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  },

  async updateReviewStatus(reviewId: string, status: CustomerReview['status']): Promise<boolean> {
    const reviews = await this.fetchReviews();
    const updated = reviews.map(r => r.id === reviewId ? { ...r, status } : r);
    localStorage.setItem('vf_reviews', JSON.stringify(updated));
    try {
      await supabase.from('reviews').update({ status }).eq('id', reviewId);
    } catch {}
    return true;
  },

  // Settings & Payment Configuration
  async fetchPaymentSettings(): Promise<PaymentSettings> {
    try {
      const { data, error } = await supabase.from('payment_settings').select('*').eq('id', 'default').single();
      if (!error && data) {
        const ps: PaymentSettings = {
          id: data.id,
          cashfreeEnabled: Boolean(data.cashfree_enabled),
          razorpayEnabled: Boolean(data.razorpay_enabled),
          codEnabled: Boolean(data.cod_enabled),
          codFee: Number(data.cod_fee ?? 49),
          minCodAmount: Number(data.min_cod_amount ?? 299),
          maxCodAmount: Number(data.max_cod_amount ?? 10000),
          cashfreeAppId: data.cashfree_app_id,
          cashfreeEnvironment: data.cashfree_environment,
          razorpayKeyId: data.razorpay_key_id,
          updatedAt: data.updated_at,
        };

        // Sync with local StoreSettings
        const current = this.getSettings();
        const synced: StoreSettings = {
          ...current,
          isCashfreeEnabled: ps.cashfreeEnabled,
          isRazorpayEnabled: ps.razorpayEnabled,
          isCodEnabled: ps.codEnabled,
          codFee: ps.codFee,
          minCodOrder: ps.minCodAmount,
          maxCodOrder: ps.maxCodAmount,
          cashfreeAppId: ps.cashfreeAppId || current.cashfreeAppId,
          cashfreeEnvironment: ps.cashfreeEnvironment || current.cashfreeEnvironment,
          razorpayKeyId: ps.razorpayKeyId || current.razorpayKeyId,
        };
        localStorage.setItem('vf_settings', JSON.stringify(synced));
        return ps;
      }
    } catch {}

    const curr = this.getSettings();
    return {
      id: 'default',
      cashfreeEnabled: curr.isCashfreeEnabled,
      razorpayEnabled: curr.isRazorpayEnabled,
      codEnabled: curr.isCodEnabled,
      codFee: curr.codFee,
      minCodAmount: curr.minCodOrder,
      maxCodAmount: curr.maxCodOrder,
      cashfreeAppId: curr.cashfreeAppId,
      cashfreeEnvironment: curr.cashfreeEnvironment,
      razorpayKeyId: curr.razorpayKeyId,
    };
  },

  async savePaymentSettings(ps: Partial<PaymentSettings>): Promise<PaymentSettings> {
    const currentSettings = this.getSettings();
    const updatedSettings: StoreSettings = {
      ...currentSettings,
      isCashfreeEnabled: ps.cashfreeEnabled !== undefined ? ps.cashfreeEnabled : currentSettings.isCashfreeEnabled,
      isRazorpayEnabled: ps.razorpayEnabled !== undefined ? ps.razorpayEnabled : currentSettings.isRazorpayEnabled,
      isCodEnabled: ps.codEnabled !== undefined ? ps.codEnabled : currentSettings.isCodEnabled,
      codFee: ps.codFee !== undefined ? ps.codFee : currentSettings.codFee,
      minCodOrder: ps.minCodAmount !== undefined ? ps.minCodAmount : currentSettings.minCodOrder,
      maxCodOrder: ps.maxCodAmount !== undefined ? ps.maxCodAmount : currentSettings.maxCodOrder,
      cashfreeAppId: ps.cashfreeAppId !== undefined ? ps.cashfreeAppId : currentSettings.cashfreeAppId,
      cashfreeEnvironment: ps.cashfreeEnvironment !== undefined ? ps.cashfreeEnvironment : currentSettings.cashfreeEnvironment,
      razorpayKeyId: ps.razorpayKeyId !== undefined ? ps.razorpayKeyId : currentSettings.razorpayKeyId,
    };
    localStorage.setItem('vf_settings', JSON.stringify(updatedSettings));

    try {
      await supabase.from('payment_settings').upsert({
        id: 'default',
        cashfree_enabled: updatedSettings.isCashfreeEnabled,
        razorpay_enabled: updatedSettings.isRazorpayEnabled,
        cod_enabled: updatedSettings.isCodEnabled,
        cod_fee: updatedSettings.codFee,
        min_cod_amount: updatedSettings.minCodOrder,
        max_cod_amount: updatedSettings.maxCodOrder,
        cashfree_app_id: updatedSettings.cashfreeAppId,
        cashfree_environment: updatedSettings.cashfreeEnvironment,
        razorpay_key_id: updatedSettings.razorpayKeyId,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return {
      id: 'default',
      cashfreeEnabled: updatedSettings.isCashfreeEnabled,
      razorpayEnabled: updatedSettings.isRazorpayEnabled,
      codEnabled: updatedSettings.isCodEnabled,
      codFee: updatedSettings.codFee,
      minCodAmount: updatedSettings.minCodOrder,
      maxCodAmount: updatedSettings.maxCodOrder,
      cashfreeAppId: updatedSettings.cashfreeAppId,
      cashfreeEnvironment: updatedSettings.cashfreeEnvironment,
      razorpayKeyId: updatedSettings.razorpayKeyId,
    };
  },

  getSettings(): StoreSettings {
    const saved = localStorage.getItem('vf_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  },

  saveSettings(settings: StoreSettings): StoreSettings {
    localStorage.setItem('vf_settings', JSON.stringify(settings));
    // Also sync payment_settings in Supabase
    try {
      supabase.from('payment_settings').upsert({
        id: 'default',
        cashfree_enabled: settings.isCashfreeEnabled,
        razorpay_enabled: settings.isRazorpayEnabled,
        cod_enabled: settings.isCodEnabled,
        cod_fee: settings.codFee,
        min_cod_amount: settings.minCodOrder,
        max_cod_amount: settings.maxCodOrder,
        cashfree_app_id: settings.cashfreeAppId,
        cashfree_environment: settings.cashfreeEnvironment,
        razorpay_key_id: settings.razorpayKeyId,
        updated_at: new Date().toISOString(),
      }).then();
    } catch {}
    return settings;
  }
};
