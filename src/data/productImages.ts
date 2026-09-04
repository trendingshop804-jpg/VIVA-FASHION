// High-resolution Category-correct product images
// Every image genuinely represents Kurtis, Shawls/Dupattas, or Leggings

export const KURTI_IMAGES = {
  embroideredCotton: [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  ],
  floralPrinted: [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?auto=format&fit=crop&w=800&q=80',
  ],
  anarkali: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  ],
  straightCasual: [
    'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  ],
  defaultKurti: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
};

export const SHAWL_IMAGES = {
  kashmiriEmbroidered: [
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
  ],
  paisleySilk: [
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?auto=format&fit=crop&w=800&q=80',
  ],
  cottonDupatta: [
    'https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?auto=format&fit=crop&w=800&q=80',
  ],
  defaultShawl: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?auto=format&fit=crop&w=800&q=80',
};

export const LEGGING_IMAGES = {
  stretchAnkle: [
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
  ],
  churidar: [
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
  ],
  capri: [
    'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
  ],
  defaultLegging: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
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
