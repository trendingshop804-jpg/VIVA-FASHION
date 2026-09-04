import type { VisitorStats, VisitorActivity } from '../types';

const STORAGE_KEY = 'vf_visitor_stats';
const ACTIVITY_KEY = 'vf_visitor_activity';
const SESSION_KEY = 'vf_session_id';

export function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getDeviceType(): 'Desktop' | 'Mobile' | 'Tablet' {
  const w = window.innerWidth;
  if (w < 768) return 'Mobile';
  if (w < 1024) return 'Tablet';
  return 'Desktop';
}

function getStats(): VisitorStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    totalVisitors: 847,
    todayVisitors: 23,
    weekVisitors: 156,
    monthVisitors: 624,
    productViews: 1892,
    categoryViews: 543,
    addToCartEvents: 312,
    wishlistEvents: 187,
    orderEvents: 89,
  };
}

function saveStats(stats: VisitorStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function getActivities(): VisitorActivity[] {
  try {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  const now = Date.now();
  return [
    { id: 'act-1', timestamp: new Date(now - 120000).toISOString(), page: 'Embroidered Cotton Kurti', event: 'Product View', device: 'Mobile' },
    { id: 'act-2', timestamp: new Date(now - 300000).toISOString(), page: 'Kurtis Category', event: 'Category View', device: 'Desktop' },
    { id: 'act-3', timestamp: new Date(now - 480000).toISOString(), page: 'Kashmiri Embroidered Shawl', event: 'Add to Cart', device: 'Mobile' },
    { id: 'act-4', timestamp: new Date(now - 900000).toISOString(), page: 'Stretch Ankle Length Leggings', event: 'Product View', device: 'Tablet' },
    { id: 'act-5', timestamp: new Date(now - 1200000).toISOString(), page: 'Premium Floral Printed Kurti', event: 'Wishlist', device: 'Desktop' },
    { id: 'act-6', timestamp: new Date(now - 1800000).toISOString(), page: 'Shawls Category', event: 'Category View', device: 'Mobile' },
    { id: 'act-7', timestamp: new Date(now - 2400000).toISOString(), page: 'Leggings Category', event: 'Category View', device: 'Desktop' },
    { id: 'act-8', timestamp: new Date(now - 3600000).toISOString(), page: 'Order VF-10924', event: 'Order Placed', device: 'Mobile' },
    { id: 'act-9', timestamp: new Date(now - 5400000).toISOString(), page: 'Classic Cotton Churidar Leggings', event: 'Add to Cart', device: 'Desktop' },
    { id: 'act-10', timestamp: new Date(now - 7200000).toISOString(), page: 'Anarkali Flared Ethnic Kurti', event: 'Product View', device: 'Mobile' },
    { id: 'act-11', timestamp: new Date(now - 10800000).toISOString(), page: 'Paisley Printed Silk Blend Shawl', event: 'Wishlist', device: 'Tablet' },
    { id: 'act-12', timestamp: new Date(now - 14400000).toISOString(), page: 'Home Page', event: 'Page View', device: 'Desktop' },
  ];
}

function saveActivities(activities: VisitorActivity[]): void {
  const trimmed = activities.slice(0, 50);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(trimmed));
}

export const VisitorAnalyticsService = {
  trackVisit(): void {
    getSessionId(); // Initialize session ID
    const stats = getStats();
    const lastVisit = sessionStorage.getItem('vf_last_visit_tracked');
    if (!lastVisit) {
      stats.totalVisitors += 1;
      stats.todayVisitors += 1;
      stats.weekVisitors += 1;
      stats.monthVisitors += 1;
      saveStats(stats);
      sessionStorage.setItem('vf_last_visit_tracked', 'true');
    }
  },

  trackProductView(productName: string): void {
    const stats = getStats();
    stats.productViews += 1;
    saveStats(stats);

    const activities = getActivities();
    activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      page: productName,
      event: 'Product View',
      device: getDeviceType(),
    });
    saveActivities(activities);
  },

  trackCategoryView(categoryName: string): void {
    const stats = getStats();
    stats.categoryViews += 1;
    saveStats(stats);

    const activities = getActivities();
    activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      page: `${categoryName} Category`,
      event: 'Category View',
      device: getDeviceType(),
    });
    saveActivities(activities);
  },

  trackAddToCart(productName: string): void {
    const stats = getStats();
    stats.addToCartEvents += 1;
    saveStats(stats);

    const activities = getActivities();
    activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      page: productName,
      event: 'Add to Cart',
      device: getDeviceType(),
    });
    saveActivities(activities);
  },

  trackWishlist(productName: string): void {
    const stats = getStats();
    stats.wishlistEvents += 1;
    saveStats(stats);

    const activities = getActivities();
    activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      page: productName,
      event: 'Wishlist',
      device: getDeviceType(),
    });
    saveActivities(activities);
  },

  trackOrderPlaced(orderNumber: string): void {
    const stats = getStats();
    stats.orderEvents += 1;
    saveStats(stats);

    const activities = getActivities();
    activities.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      page: `Order ${orderNumber}`,
      event: 'Order Placed',
      device: getDeviceType(),
    });
    saveActivities(activities);
  },

  getStats(): VisitorStats {
    return getStats();
  },

  getActivities(): VisitorActivity[] {
    return getActivities();
  },
};
