// High-resolution Category-correct product images
// Only verified working Unsplash photo IDs

export const KURTI_IMAGES = {
  embroideredCotton: [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
  ],
  floralPrinted: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
  ],
  anarkali: [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
  ],
  straightCasual: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  ],
  defaultKurti: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
};

export const SHAWL_IMAGES = {
  kashmiriEmbroidered: [
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
  ],
  paisleySilk: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&q=80',
  ],
  cottonDupatta: [
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  ],
  defaultShawl: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&q=80',
};

export const LEGGING_IMAGES = {
  stretchAnkle: [
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
  ],
  churidar: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
  ],
  capri: [
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
  ],
  defaultLegging: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
};

// Get category-specific default image
export function getCategoryDefaultImage(category: string): string {
  switch (category) {
    case 'kurtis': return KURTI_IMAGES.defaultKurti;
    case 'shawls': return SHAWL_IMAGES.defaultShawl;
    case 'leggings': return LEGGING_IMAGES.defaultLegging;
    default: return KURTI_IMAGES.defaultKurti;
  }
}
