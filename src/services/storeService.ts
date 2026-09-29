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

  // Payment settings (Razorpay + COD enabled; Cashfree stays wired but off until real keys are added to .env)
  isCashfreeEnabled: false,
  cashfreeAppId: '9365174848179fa9f2de2db31b715639',
  cashfreeEnvironment: 'production',
  isRazorpayEnabled: true,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51730000000000',
  isCodEnabled: true,
  codFee: 49,
  minCodOrder: 299,
  maxCodOrder: 10000,
};

// Initial Seed fallback ensuring EVERY image clearly matches KURTIS, SHAWLS, or LEGGINGS
export const INITIAL_PRODUCTS: Product[] = [
  // REFERENCE-DESIGN BEST SELLERS (assets extracted from the approved design)
  {
    id: 'prod-ref-1',
    name: 'Cotton Printed Kurti',
    slug: 'cotton-printed-kurti',
    sku: 'REF-001',
    brand: 'Viva Fashion',
    category: 'kurtis',
    price: 799,
    salePrice: 1299,
    originalPrice: 1299,
    stock: 50,
    rating: 4.8,
    reviewCount: 214,
    image: '/assets/prod-1.png',
    secondaryImage: '/assets/prod-2.png',
    images: ['/assets/prod-1.png'],
    tag: 'New',
    colors: [
      { name: 'Ivory Green', hex: '#E4EFE6' },
      { name: 'Sea Green', hex: '#7BA69B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Lightweight cotton kurti with a fresh botanical print, soft round neck and 3/4th sleeves — an everyday essential.',
    fabric: '100% Cotton',
    fit: 'Straight Cut Regular Fit',
    sleeveType: '3/4th Sleeves',
    length: 'Calf Length',
    neckType: 'Round Neck',
    pattern: 'Floral Print',
    occasion: 'Everyday / Office',
    workEmbroidery: 'Digital Print',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-ref-2',
    name: 'Rayon Salwar Suit',
    slug: 'rayon-salwar-suit',
    sku: 'REF-002',
    brand: 'Viva Fashion',
    category: 'kurtis',
    price: 1299,
    salePrice: 1899,
    originalPrice: 1899,
    stock: 40,
    rating: 4.7,
    reviewCount: 168,
    image: '/assets/prod-2.png',
    secondaryImage: '/assets/prod-3.png',
    images: ['/assets/prod-2.png'],
    tag: 'Bestseller',
    colors: [
      { name: 'Magenta', hex: '#C2185B' },
      { name: 'Deep Maroon', hex: '#7A1F3D' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Elegant rayon salwar suit set with delicate embroidery and a flowing silhouette — perfect for festive gatherings.',
    fabric: 'Rayon Blend',
    fit: 'Comfort Regular Fit',
    sleeveType: 'Full Sleeves',
    length: 'Ankle Length',
    neckType: 'V Neck',
    pattern: 'Embroidered',
    occasion: 'Festive / Party',
    workEmbroidery: 'Thread Work',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-ref-3',
    name: 'Anarkali Kurti',
    slug: 'anarkali-kurti',
    sku: 'REF-003',
    brand: 'Viva Fashion',
    category: 'kurtis',
    price: 1099,
    salePrice: 1699,
    originalPrice: 1699,
    stock: 45,
    rating: 4.6,
    reviewCount: 152,
    image: '/assets/prod-3.png',
    secondaryImage: '/assets/prod-4.png',
    images: ['/assets/prod-3.png'],
    tag: 'New',
    colors: [
      { name: 'Mustard Yellow', hex: '#E3B23C' },
      { name: 'Golden Amber', hex: '#D9A441' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Flowy Anarkali kurti with a flattering flare and subtle contrast detailing — made for celebrations.',
    fabric: 'Cotton Blend',
    fit: 'Flared Anarkali Fit',
    sleeveType: '3/4th Sleeves',
    length: 'Calf Length',
    neckType: 'Round Neck',
    pattern: 'Solid with Border',
    occasion: 'Festive / Wedding',
    workEmbroidery: 'Gotta Patti',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
  {
    id: 'prod-ref-4',
    name: 'Printed Dupatta',
    slug: 'printed-dupatta',
    sku: 'REF-004',
    brand: 'Viva Fashion',
    category: 'shawls',
    price: 499,
    salePrice: 799,
    originalPrice: 799,
    stock: 60,
    rating: 4.5,
    reviewCount: 96,
    image: '/assets/prod-4.png',
    secondaryImage: '/assets/cat-shawls.png',
    images: ['/assets/prod-4.png'],
    tag: 'Bestseller',
    colors: [
      { name: 'Indigo Blue', hex: '#33528C' },
      { name: 'Powder Blue', hex: '#8FA9C8' }
    ],
    sizes: ['Free Size'],
    description: 'Airy printed dupatta with an all-over motif — an easy pick to elevate any kurti or suit set.',
    fabric: 'Chiffon Blend',
    fit: 'Regular Drape',
    sleeveType: 'N/A',
    length: '2.5 Meters',
    neckType: 'N/A',
    pattern: 'Printed',
    occasion: 'Everyday / Festive',
    workEmbroidery: 'Print with Lace',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isSale: true,
    isActive: true,
  },
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

function isUuid(id?: string): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to ensure fallback default images only if missing or broken
function enforceCategoryImages(products: Product[]): Product[] {
  return products.map(p => {
    if (!p.image || p.image === '' || p.image === 'undefined' || p.image === 'null') {
      if (p.category === 'kurtis') p.image = KURTI_IMAGES.defaultKurti;
      else if (p.category === 'shawls') p.image = SHAWL_IMAGES.defaultShawl;
      else if (p.category === 'leggings') p.image = LEGGING_IMAGES.defaultLegging;
    }
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
      p.images = [p.image];
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

// ---------------------------------------------------------------------------
// Orders — Supabase is the SOURCE OF TRUTH.
// localStorage only ever holds a cache of rows that came from Supabase (plus
// this device's own guest orders in vf_my_orders). Every Supabase failure is
// logged in full and surfaced to the caller — never silently replaced with
// local data.
// ---------------------------------------------------------------------------
const ORDERS_CACHE_KEY = 'vf_orders';
const MY_ORDERS_CACHE_KEY = 'vf_my_orders';

function readLocalOrders(key: string): Order[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch (err) {
    console.error('[Orders] Local cache could not be read:', err);
    return [];
  }
}

function writeLocalOrders(key: string, orders: Order[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(orders));
  } catch (err) {
    console.error('[Orders] Local cache could not be written:', err);
  }
}

/** Patch an order in both local caches (best effort — caches only). */
function patchLocalOrder(orderId: string, patch: Partial<Order>): void {
  for (const key of [ORDERS_CACHE_KEY, MY_ORDERS_CACHE_KEY]) {
    const list = readLocalOrders(key);
    const idx = list.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch };
      writeLocalOrders(key, list);
    }
  }
}

/** Cache a freshly created order on this device (general + "my orders"). */
function prependLocalOrder(order: Order): void {
  for (const key of [ORDERS_CACHE_KEY, MY_ORDERS_CACHE_KEY]) {
    const list = readLocalOrders(key).filter(o => o.id !== order.id);
    writeLocalOrders(key, [order, ...list]);
  }
}

/** Map an orders table row → frontend Order (canonical field mapping, used by fetch, realtime payloads and caches alike). */
export function mapOrderRow(row: any): Order {
  return {
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
  };
}

interface OrdersColumnSupport {
  /** orders.user_id exists (migration SECTION 6) */
  userId: boolean;
  /** orders.paid_at + orders.paid_by exist (migration SECTION 6) */
  paidAudit: boolean;
}

let ordersColumnSupport: OrdersColumnSupport | null = null;

function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  return error.code === '42703' || /does not exist/i.test(error.message || '');
}

/**
 * Detect once per session whether the optional audit columns exist, so the
 * checkout keeps working before SECTION 6 of the migration is applied and
 * starts writing them automatically afterwards. Only a confirmed
 * "column does not exist" error marks a column missing; other errors stay
 * optimistic (a broken connection will fail the write anyway).
 */
async function getOrdersColumnSupport(): Promise<OrdersColumnSupport> {
  if (ordersColumnSupport) return ordersColumnSupport;

  const probe = async (columns: string): Promise<{ present: boolean; problem?: string }> => {
    const { error } = await supabase.from('orders').select(columns).limit(1);
    if (!error) return { present: true };
    if (isMissingColumnError(error)) return { present: false };
    return { present: true, problem: error.message };
  };

  const userIdProbe = await probe('id,user_id');
  const paidProbe = await probe('id,paid_at,paid_by');

  ordersColumnSupport = { userId: userIdProbe.present, paidAudit: paidProbe.present };

  if (!ordersColumnSupport.userId || !ordersColumnSupport.paidAudit) {
    const missing = [
      !ordersColumnSupport.userId ? 'user_id' : null,
      !ordersColumnSupport.paidAudit ? 'paid_at/paid_by' : null,
    ].filter(Boolean).join(', ');
    console.error(
      `[Orders] Supabase orders table is missing column(s): ${missing}. ` +
      'Run SECTION 6 of supabase-migration.sql in the Supabase SQL editor. ' +
      'Orders still save — just without those audit fields.'
    );
  }
  if (userIdProbe.problem) console.warn('[Orders] Could not verify orders.user_id:', userIdProbe.problem);
  if (paidProbe.problem) console.warn('[Orders] Could not verify orders.paid_at/paid_by:', paidProbe.problem);

  return ordersColumnSupport;
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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

    const saved = localStorage.getItem('vf_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const enforced = enforceCategoryImages(parsed);
        localStorage.setItem('vf_products', JSON.stringify(enforced));
        return enforced;
      } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }
    }
    
    localStorage.setItem('vf_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const isNew = !product.id || !isUuid(product.id);
    const id = isNew ? generateUuid() : product.id!;

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
      price: Number(product.price || 999),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      originalPrice: product.salePrice ? Number(product.salePrice) : Number(product.price || 999),
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

    // Database payload using exact schema columns (omitting 'brand' column which does not exist in DB)
    const dbPayload = {
      id: newProduct.id,
      name: newProduct.name,
      slug: newProduct.slug,
      sku: newProduct.sku,
      category: newProduct.category,
      price: newProduct.price,
      sale_price: newProduct.salePrice || null,
      stock: newProduct.stock,
      description: newProduct.description || '',
      fabric: newProduct.fabric || null,
      fit: newProduct.fit || null,
      sleeve_type: newProduct.sleeveType || null,
      length: newProduct.length || null,
      neck_type: newProduct.neckType || null,
      pattern: newProduct.pattern || null,
      occasion: newProduct.occasion || null,
      stretch: newProduct.stretch || null,
      waist_type: newProduct.waistType || null,
      work_embroidery: newProduct.workEmbroidery || null,
      colors: newProduct.colors,
      sizes: newProduct.sizes,
      images: newProduct.images,
      featured: newProduct.isFeatured,
      bestseller: newProduct.isBestSeller,
      new_arrival: newProduct.isNewArrival,
      is_sale: newProduct.isSale,
      is_active: newProduct.isActive,
    };

    const { error } = await supabase.from('products').upsert(dbPayload);
    if (error) {
      console.error('Supabase saveProduct error:', error);
      throw new Error(`Failed to save product to database: ${error.message}`);
    }

    // Update local cache after database write succeeds
    const currentProducts = await this.fetchProducts();
    const updated = isNew
      ? [newProduct, ...currentProducts]
      : currentProducts.map(p => (p.id === id ? newProduct : p));

    localStorage.setItem('vf_products', JSON.stringify(updated));
    return newProduct;
  },

  async deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return { success: false, error: error.message };
    }

    const currentProducts = await this.fetchProducts();
    const updated = currentProducts.filter(p => p.id !== productId);
    localStorage.setItem('vf_products', JSON.stringify(updated));
    return { success: true };
  },

  // Orders
  /**
   * Global/admin order list. Supabase is the only source: on success the rows
   * are cached locally (optional cache only), on failure the complete error is
   * logged and THROWN — the admin panel must never display stale local rows
   * as if they were real database orders.
   */
  async fetchOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Orders] Failed to load orders from Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Could not load orders from the database: ${error.message}`);
    }

    const mapped: Order[] = (data ?? []).map(mapOrderRow);
    // Only refresh the cache when we actually got rows back: a successful
    // empty read (e.g. a guest session with no visible rows) must not wipe
    // orders cached earlier on this device.
    if (mapped.length > 0) writeLocalOrders(ORDERS_CACHE_KEY, mapped);
    return mapped;
  },

  /** The authenticated Supabase auth user id, or null for guest checkout. Never invented. */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user?.id ?? null;
    } catch (err) {
      console.error('[Orders] Could not read the authenticated session:', (err as Error).message);
      return null;
    }
  },

  /**
   * Customer "My Orders".
   * - Signed in: fetch only the caller's own rows from Supabase (linked
   *   user_id, or the email their profile/order uses).
   * - Guest: there is deliberately no anon SELECT policy on orders, so guests
   *   see the orders they placed on this device from the local cache.
   */
  async fetchMyOrders(): Promise<Order[]> {
    const userId = await this.getCurrentUserId();

    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .maybeSingle();
      if (profileError) {
        console.error('[My Orders] Failed to load the profile email:', {
          message: profileError.message,
          code: profileError.code,
        });
      }
      const email = ((profile as any)?.email || '').trim();

      const support = await getOrdersColumnSupport();
      const filters: string[] = [];
      if (support.userId) filters.push(`user_id.eq.${userId}`);
      // PostgREST .or() splits on commas — strip them defensively.
      if (email) filters.push(`customer_email.eq.${email.replace(/[(),]/g, '')}`);

      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (filters.length > 0) query = query.or(filters.join(','));

      const { data, error } = await query;
      if (error) {
        console.error('[My Orders] Failed to load orders from Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Could not load your orders: ${error.message}`);
      }

      const mapped: Order[] = (data ?? []).map(mapOrderRow);
      // Same cache rule as fetchOrders: never wipe on an empty read.
      if (mapped.length > 0) writeLocalOrders(MY_ORDERS_CACHE_KEY, mapped);
      return mapped;
    }

    // Guest path: seed the split cache once from the legacy shared cache so
    // orders placed before this change remain visible on this device.
    try {
      if (localStorage.getItem(MY_ORDERS_CACHE_KEY) === null) {
        const legacy = readLocalOrders(ORDERS_CACHE_KEY);
        if (legacy.length > 0) writeLocalOrders(MY_ORDERS_CACHE_KEY, legacy);
      }
    } catch (err) {
      console.warn('[My Orders] Legacy local cache could not be migrated:', err);
    }
    return readLocalOrders(MY_ORDERS_CACHE_KEY);
  },

  /**
   * Persist an order status change. Returns true ONLY when Supabase actually
   * confirmed the write; otherwise throws with the real error.
   *
   * - Legacy local-only ids ("ord-2") never existed server-side → local cache.
   * - Guest sessions cannot UPDATE rows (RLS has no anon UPDATE policy, by
   *   design) → clear error instead of a fake local-only success.
   * - Admin sessions → direct UPDATE, verified with RETURNING.
   * - Signed-in customers → SECURITY DEFINER RPC (migration SECTION 5) that
   *   validates ownership/transitions; falls back to a verified direct UPDATE
   *   while the function is not deployed yet.
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const nowIso = new Date().toISOString();

    // Legacy localStorage-only orders use ids like "ord-2" that aren't UUIDs and
    // don't exist server-side; syncing them sends an invalid id filter (HTTP 400).
    if (!isUuid(orderId)) {
      patchLocalOrder(orderId, { orderStatus: status, updatedAt: nowIso });
      console.warn(
        `[Orders] "${orderId}" is a local-only legacy order — the status change was kept in the local cache (this order is not in Supabase).`
      );
      return true;
    }

    const userId = await this.getCurrentUserId();
    if (!userId) {
      // Anonymous browsers have no UPDATE policy on orders (otherwise anyone
      // could cancel anyone's order), so a local-only "success" would silently
      // diverge from the database. Refuse honestly instead.
      throw new Error('Please sign in with the account you ordered with to cancel or return this order.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) {
      console.warn('[Orders] Could not read caller role, assuming customer path:', profileError.message);
    }
    const isAdmin = (profile as any)?.role === 'admin';

    if (isAdmin) {
      const { data: updated, error } = await supabase
        .from('orders')
        .update({ order_status: status, updated_at: nowIso })
        .eq('id', orderId)
        .select('id');
      if (error) {
        console.error('[Orders] Supabase UPDATE failed', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          orderId,
          status,
        });
        throw new Error(`Could not update the order status: ${error.message}`);
      }
      if (!updated || updated.length === 0) {
        throw new Error('The order status was not updated: order not found or blocked by row-level security.');
      }
      patchLocalOrder(orderId, { orderStatus: status, updatedAt: nowIso });
      return true;
    }

    // Customer path: RPC validates ownership + allowed transitions.
    const { error: rpcError } = await supabase.rpc('customer_order_status_change', {
      p_order_id: orderId,
      p_new_status: status,
    });
    if (!rpcError) {
      patchLocalOrder(orderId, { orderStatus: status, updatedAt: nowIso });
      return true;
    }
    if (rpcError.code !== 'PGRST202') {
      // Function exists but rejected the change (not your order / bad transition).
      console.error('[Orders] customer_order_status_change rejected', {
        message: rpcError.message,
        details: rpcError.details,
        code: rpcError.code,
        orderId,
        status,
      });
      throw new Error(rpcError.message || 'The order could not be updated.');
    }

    // PGRST202 = the RPC is not deployed yet → try a direct UPDATE and make
    // sure a row was actually changed before claiming success.
    console.error(
      "[Orders] The customer_order_status_change RPC is missing — run SECTION 5 of supabase-migration.sql. Falling back to a direct UPDATE."
    );
    const { data: updated, error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: nowIso })
      .eq('id', orderId)
      .select('id');
    if (error) {
      console.error('[Orders] Supabase UPDATE failed', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        orderId,
        status,
      });
      throw new Error(`Could not update the order status: ${error.message}`);
    }
    if (!updated || updated.length === 0) {
      throw new Error(
        'The order status was not updated: no database permission. Run SECTION 5 of supabase-migration.sql (customer cancel/return).'
      );
    }
    patchLocalOrder(orderId, { orderStatus: status, updatedAt: nowIso });
    return true;
  },

  /**
   * Persist a payment status change (payment_status, paid_at, paid_by,
   * gateway payment ids, updated_at) to Supabase. Returns true ONLY after the
   * database confirmed the write; rejects with the real error otherwise.
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    extraDetails?: { paidAt?: string; paidBy?: string; razorpayPaymentId?: string; cashfreePaymentId?: string }
  ): Promise<boolean> {
    const nowIso = new Date().toISOString();

    // Same non-UUID guard as updateOrderStatus: legacy local orders stay local-only.
    if (!isUuid(orderId)) {
      const localPatch: Partial<Order> = { paymentStatus, updatedAt: nowIso };
      if (paymentStatus === 'paid' || extraDetails?.paidAt) localPatch.paidAt = extraDetails?.paidAt || nowIso;
      if (extraDetails?.paidBy) localPatch.paidBy = extraDetails.paidBy;
      if (extraDetails?.razorpayPaymentId) localPatch.razorpayPaymentId = extraDetails.razorpayPaymentId;
      if (extraDetails?.cashfreePaymentId) localPatch.cashfreePaymentId = extraDetails.cashfreePaymentId;
      patchLocalOrder(orderId, localPatch);
      console.warn(
        `[Orders] "${orderId}" is a local-only legacy order — the payment change was kept in the local cache (this order is not in Supabase).`
      );
      return true;
    }

    const support = await getOrdersColumnSupport();

    const row: Record<string, unknown> = {
      payment_status: paymentStatus,
      updated_at: nowIso,
    };
    if (extraDetails?.razorpayPaymentId) row.razorpay_payment_id = extraDetails.razorpayPaymentId;
    if (extraDetails?.cashfreePaymentId) row.cashfree_payment_id = extraDetails.cashfreePaymentId;

    if (support.paidAudit) {
      if (paymentStatus === 'paid') row.paid_at = extraDetails?.paidAt || nowIso;
      else if (extraDetails?.paidAt) row.paid_at = extraDetails.paidAt;
      if (extraDetails?.paidBy) row.paid_by = extraDetails.paidBy;
    } else if (paymentStatus === 'paid') {
      console.error(
        '[Orders] orders.paid_at/paid_by columns are missing — run SECTION 6 of supabase-migration.sql. The payment status was saved without the audit fields.'
      );
    }

    const { data: updated, error } = await supabase
      .from('orders')
      .update(row)
      .eq('id', orderId)
      .select('id');

    if (error) {
      console.error('[Orders] Supabase payment UPDATE failed', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        orderId,
        paymentStatus,
      });
      throw new Error(`Could not update the payment status: ${error.message}`);
    }
    if (!updated || updated.length === 0) {
      throw new Error('The payment status was not updated: order not found or blocked by row-level security.');
    }

    const localPatch: Partial<Order> = { paymentStatus, updatedAt: nowIso };
    if (typeof row.paid_at === 'string') localPatch.paidAt = row.paid_at;
    if (typeof row.paid_by === 'string') localPatch.paidBy = row.paid_by;
    if (extraDetails?.razorpayPaymentId) localPatch.razorpayPaymentId = extraDetails.razorpayPaymentId;
    if (extraDetails?.cashfreePaymentId) localPatch.cashfreePaymentId = extraDetails.cashfreePaymentId;
    patchLocalOrder(orderId, localPatch);

    return true;
  },

  /**
   * Create an order with Supabase as the source of truth.
   *
   * Sequence: validate → resolve the real auth user id → duplicate-check the
   * gateway transaction → INSERT into Supabase → only after the database
   * confirms the row, update local caches/stock and return the order.
   * If the INSERT fails the complete Supabase error is logged and THROWN —
   * the caller must never show "order placed successfully" in that case.
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const settings = this.getSettings();

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

    const nowIso = new Date().toISOString();

    // Ownership: prefer the explicitly passed user id, otherwise the live
    // authenticated Supabase session. Guests get null (never an invented id).
    const sessionUserId = await this.getCurrentUserId();
    const userId = orderData.userId ?? sessionUserId ?? undefined;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderNumber: orderData.orderNumber || `VF-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
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
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: orderData.orderStatus || 'Confirmed',
      items: orderData.items || [],
      cashfreeOrderId: orderData.cashfreeOrderId,
      cashfreePaymentSessionId: orderData.cashfreePaymentSessionId,
      cashfreePaymentId: orderData.cashfreePaymentId,
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayPaymentId: orderData.razorpayPaymentId,
      razorpaySignature: orderData.razorpaySignature,
      paidAt: orderData.paymentStatus === 'paid' ? nowIso : undefined,
      createdAt: nowIso,
    };

    // ---- Idempotency (A payment callback can fire more than once) ----------
    const gatewayFilters: string[] = [];
    if (orderData.razorpayPaymentId) gatewayFilters.push(`razorpay_payment_id.eq.${orderData.razorpayPaymentId}`);
    if (orderData.cashfreePaymentId) gatewayFilters.push(`cashfree_payment_id.eq.${orderData.cashfreePaymentId}`);
    if (orderData.razorpayOrderId) gatewayFilters.push(`razorpay_order_id.eq.${orderData.razorpayOrderId}`);
    if (orderData.cashfreeOrderId) gatewayFilters.push(`cashfree_order_id.eq.${orderData.cashfreeOrderId}`);

    const findExistingByGateway = async (): Promise<Order | null> => {
      if (gatewayFilters.length === 0) return null;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(gatewayFilters.join(','))
        .limit(1);
      if (error) {
        // Note: guests have no anon SELECT policy, so this legitimately
        // returns [] for them — only real errors are logged.
        console.error('[Orders] Duplicate-check query failed', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return null;
      }
      return data && data.length > 0 ? mapOrderRow(data[0]) : null;
    };

    if (gatewayFilters.length > 0) {
      const existing = await findExistingByGateway();
      if (existing) {
        console.warn(
          `[Orders] Duplicate payment callback ignored — ${existing.orderNumber} already exists for this gateway transaction.`
        );
        return existing;
      }
    }

    // ---- Build the database row (canonical snake_case field names) ---------
    const support = await getOrdersColumnSupport();
    const row: Record<string, unknown> = {
      id: newOrder.id,
      order_number: newOrder.orderNumber,
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
      created_at: nowIso,
      updated_at: nowIso,
    };
    if (support.userId) row.user_id = userId ?? null;
    if (support.paidAudit) {
      if (newOrder.paymentStatus === 'paid') {
        row.paid_at = (orderData as any).paidAt || nowIso;
        row.paid_by = (orderData as any).paidBy || 'gateway';
      } else if (newOrder.paidAt) {
        row.paid_at = newOrder.paidAt;
      }
    }

    // ---- INSERT FIRST: the customer only sees success after this ----------
    const { error: insertError } = await supabase.from('orders').insert(row);

    if (insertError) {
      // 23505 = unique violation: the same gateway transaction was already
      // saved (a racing/re-fired callback) — never create a second order.
      if (insertError.code === '23505') {
        const existing = await findExistingByGateway();
        if (existing) {
          console.warn(
            `[Orders] Duplicate insert blocked by the database — returning existing ${existing.orderNumber}.`
          );
          prependLocalOrder(existing);
          return existing;
        }
        console.error('[Orders] Supabase INSERT failed (duplicate transaction)', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
          orderNumber: newOrder.orderNumber,
        });
        throw new Error(
          'This payment transaction has already been recorded for an order. Do not pay again — check My Orders or contact support with your payment reference.'
        );
      }

      // Log the COMPLETE Supabase error, then fail loudly: no fake local order.
      console.error('[Orders] Supabase INSERT failed', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
        orderNumber: newOrder.orderNumber,
        paymentMethod: newOrder.paymentMethod,
      });
      throw new Error(
        `Order ${newOrder.orderNumber} could not be saved to the database: ${insertError.message}`
      );
    }

    // ---- Confirmed insert: update local caches + stock only now ------------
    prependLocalOrder(newOrder);

    // Best-effort: upsert a customer record so the admin customer directory
    // shows every person who has ever placed an order. A failure here never
    // blocks the order (the order itself is already confirmed above).
    try {
      await supabase.from('customers').upsert({
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone || null,
        address: newOrder.shippingAddress,
      }, { onConflict: 'email' });
    } catch (custErr) {
      console.warn('[Orders] Customer record upsert failed (non-blocking):', (custErr as Error).message);
    }

    // Deduct stock cache for confirmed orders
    if (newOrder.items && newOrder.items.length > 0) {
      try {
        const allProds = await this.fetchProducts();
        const updatedProds = allProds.map(p => {
          const item = newOrder.items.find(i => i.productId === p.id || i.name === p.name);
          if (item) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity) };
          }
          return p;
        });
        localStorage.setItem('vf_products', JSON.stringify(updatedProds));
      } catch (err) {
        console.error('[Orders] Product stock cache update failed:', err);
      }
    }

    return newOrder;
  },

  // Customers — derived from profiles + orders data
  /**
   * Build the admin customer directory from `profiles` (real registered users)
   * combined with order aggregation. The old `customers` table had different
   * columns (no city/state/total_orders/total_spent/status), so the fetch
   * always fell through to seed data. This approach uses the source of truth.
   */
  async fetchCustomers(): Promise<Customer[]> {
    try {
      // 1. Fetch all customer profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('[Customers] Failed to load profiles:', profilesError.message);
      }

      // 2. Fetch all orders for aggregation
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('customer_email, customer_name, customer_phone, shipping_address, total, created_at');

      if (ordersError) {
        console.error('[Customers] Failed to load orders for aggregation:', ordersError.message);
      }

      // 3. Build order stats by email
      const orderStats: Record<string, { count: number; spent: number; city?: string; state?: string }> = {};
      if (allOrders) {
        for (const o of allOrders) {
          const email = (o.customer_email || '').toLowerCase().trim();
          if (!email) continue;
          if (!orderStats[email]) {
            orderStats[email] = { count: 0, spent: 0 };
          }
          orderStats[email].count += 1;
          orderStats[email].spent += Number(o.total || 0);
          // Extract city/state from shipping address if available
          const addr = o.shipping_address as any;
          if (addr?.city && !orderStats[email].city) {
            orderStats[email].city = addr.city;
            orderStats[email].state = addr.state;
          }
        }
      }

      // 4. Build customer list from profiles
      const customerMap = new Map<string, Customer>();

      if (profiles && profiles.length > 0) {
        for (const p of profiles) {
          // Skip admin profiles from customer directory
          if (p.role === 'admin') continue;
          const email = (p.email || '').toLowerCase().trim();
          const stats = orderStats[email] || { count: 0, spent: 0 };
          const customer: Customer = {
            id: p.id,
            name: p.name || p.full_name || email.split('@')[0] || 'Customer',
            email: email,
            phone: p.phone,
            city: stats.city,
            state: stats.state,
            totalOrders: stats.count,
            totalSpent: stats.spent,
            status: stats.spent >= 5000 ? 'VIP' : (stats.count > 0 ? 'Active' : 'Active'),
            createdAt: p.created_at || new Date().toISOString(),
          };
          customerMap.set(email, customer);
        }
      }

      // 5. Also include customers from orders who may not have a profile
      if (allOrders) {
        for (const o of allOrders) {
          const email = (o.customer_email || '').toLowerCase().trim();
          if (!email || customerMap.has(email)) continue;
          const stats = orderStats[email] || { count: 0, spent: 0 };
          const customer: Customer = {
            id: `order-customer-${email}`,
            name: o.customer_name || email.split('@')[0],
            email: email,
            phone: o.customer_phone,
            city: stats.city,
            state: stats.state,
            totalOrders: stats.count,
            totalSpent: stats.spent,
            status: stats.spent >= 5000 ? 'VIP' : 'Active',
            createdAt: o.created_at || new Date().toISOString(),
          };
          customerMap.set(email, customer);
        }
      }

      const result = Array.from(customerMap.values());
      if (result.length > 0) {
        localStorage.setItem('vf_customers', JSON.stringify(result));
        return result;
      }
    } catch (err) {
      console.error('[Customers] Failed to build customer directory:', err);
    }

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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

    return newCoupon;
  },

  async deleteCoupon(couponId: string): Promise<boolean> {
    const coupons = await this.fetchCoupons();
    const updated = coupons.filter(c => c.id !== couponId);
    localStorage.setItem('vf_coupons', JSON.stringify(updated));
    try {
      await supabase.from('coupons').delete().eq('id', couponId);
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }
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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

    const saved = localStorage.getItem('vf_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  },

  async updateReviewStatus(reviewId: string, status: CustomerReview['status']): Promise<boolean> {
    const reviews = await this.fetchReviews();
    const updated = reviews.map(r => r.id === reviewId ? { ...r, status } : r);
    localStorage.setItem('vf_reviews', JSON.stringify(updated));
    try {
      await supabase.from('reviews').update({ status }).eq('id', reviewId);
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }
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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }

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
    } catch (err) {
      console.error('[StoreService] Supabase read failed, falling back to local cache:', err);
    }
    return settings;
  }
};
