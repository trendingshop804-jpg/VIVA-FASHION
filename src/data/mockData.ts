import type { Category, CustomerReview } from '../types';
import { KURTI_IMAGES, SHAWL_IMAGES, LEGGING_IMAGES } from './productImages';

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-kurtis',
    slug: 'kurtis',
    title: 'KURTIS',
    buttonText: 'Explore Kurtis',
    image: KURTI_IMAGES.embroideredCotton[0],
    description: 'Handcrafted pure breathable cotton & Chanderi silk kurtis.',
    itemCount: 4,
  },
  {
    id: 'cat-shawls',
    slug: 'shawls',
    title: 'SHAWLS',
    buttonText: 'Explore Shawls',
    image: SHAWL_IMAGES.kashmiriEmbroidered[0],
    description: 'Luxurious Kashmiri needlework & woven paisley stoles and dupattas.',
    itemCount: 3,
  },
  {
    id: 'cat-leggings',
    slug: 'leggings',
    title: 'LEGGINGS',
    buttonText: 'Shop Leggings',
    image: LEGGING_IMAGES.stretchAnkle[0],
    description: 'Buttery soft 4-way stretch ankle and churidar leggings.',
    itemCount: 3,
  },
];

export const CUSTOMER_REVIEWS_ROW1: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Pooja S.',
    location: 'Bengaluru, India',
    rating: 5,
    text: 'The mustard embroidered kurti is breathtaking! The craftsmanship is top notch and fabric stays so cool and crisp all day.',
    image: KURTI_IMAGES.embroideredCotton[0],
    productName: 'Embroidered Cotton Kurti',
  },
  {
    id: 'rev-2',
    author: 'Kavita M.',
    location: 'Mumbai, India',
    rating: 5,
    text: 'The Kashmiri Aari embroidery is authentic and soft as butter. Looks regal draped over my favorite kurtis.',
    image: SHAWL_IMAGES.kashmiriEmbroidered[0],
    productName: 'Kashmiri Embroidered Shawl',
  },
  {
    id: 'rev-3',
    author: 'Ritu P.',
    location: 'Ahmedabad, India',
    rating: 5,
    text: 'Never found leggings this buttery soft and completely opaque. Viva Fashion is my absolute go-to for ethnic basics.',
    image: LEGGING_IMAGES.stretchAnkle[0],
    productName: 'Stretch Ankle Length Leggings',
  },
];

export const CUSTOMER_REVIEWS_ROW2: CustomerReview[] = [
  {
    id: 'rev-4',
    author: 'Ananya S.',
    location: 'Kolkata, India',
    rating: 5,
    text: 'The Jaipur block printed dupatta is so lightweight! It adds elegance to every outfit.',
    image: SHAWL_IMAGES.cottonDupatta[0],
    productName: 'Lightweight Printed Cotton Dupatta',
  },
  {
    id: 'rev-5',
    author: 'Meera R.',
    location: 'Hyderabad, India',
    rating: 5,
    text: 'Great fit and stunning colors. The Anarkali flared kurti is perfect for wedding celebrations!',
    image: KURTI_IMAGES.anarkali[0],
    productName: 'Anarkali Flared Ethnic Kurti',
  },
];
