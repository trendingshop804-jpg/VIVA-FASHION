import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Trash2,
  Check,
  Star,
  ArrowLeft,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';
import type { Product, ProductCategory } from '../../types';
import { StoreService } from '../../services/storeService';
import { ImageUploadService } from '../../services/imageUploadService';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { getCategoryDefaultImage } from '../../data/productImages';

interface AdminProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const PRESET_COLORS = [
  { name: 'Mustard Gold', hex: '#DCA134' },
  { name: 'Sage Green', hex: '#7A8F73' },
  { name: 'Indigo Blue', hex: '#2A4A7F' },
  { name: 'Classic Black', hex: '#151515' },
  { name: 'Blush Pink', hex: '#D99A8C' },
  { name: 'Ivory Cream', hex: '#FAF4EC' },
  { name: 'Maroon Red', hex: '#8F263E' },
  { name: 'Emerald Green', hex: '#1E4D3E' },
  { name: 'Coral Pink', hex: '#E07A5F' },
  { name: 'Turquoise', hex: '#3E8B99' },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({ product, onClose, onSaved }) => {
  const { refreshProducts } = useAdmin();
  const { currencySymbol, showToast } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'kurtis',
    sku: '',
    brand: 'Viva Fashion',
    price: 1299,
    salePrice: 1599,
    stock: 25,
    description: '',
    image: '',
    images: [],
    colors: [{ name: 'Mustard Gold', hex: '#DCA134' }],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '',
    fit: '',
    sleeveType: '',
    length: '',
    neckType: '',
    pattern: '',
    occasion: '',
    stretch: '',
    waistType: '',
    workEmbroidery: '',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isSale: false,
    isActive: true,
  });

  // Local pending file uploads with blob previews before final saving
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    ImageUploadService.ensureBucket();

    if (product) {
      const existingImages = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : [getCategoryDefaultImage(product.category)]);

      setFormData({ ...product });
      setImageUrls(existingImages);
      setPrimaryImageIndex(0);
    } else {
      const defaultImg = getCategoryDefaultImage('kurtis');
      setImageUrls([defaultImg]);
      setPrimaryImageIndex(0);
    }
  }, [product]);

  // When category changes, update validation message and set category default if no custom upload exists
  const handleCategoryChange = (newCat: ProductCategory) => {
    setFormData(prev => ({
      ...prev,
      category: newCat,
      sizes: newCat === 'shawls' ? ['Free Size'] : ['S', 'M', 'L', 'XL', 'XXL'],
    }));

    if (pendingFiles.length === 0 && imageUrls.length <= 1) {
      const catDefault = getCategoryDefaultImage(newCat);
      setImageUrls([catDefault]);
      setPrimaryImageIndex(0);
    }
  };

  // Handle local File Selection (Click or Drag & Drop)
  const handleFileSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => ImageUploadService.isValidImageFile(f));
    if (fileArray.length === 0) {
      showToast('Please select valid JPG, PNG, or WEBP image files.', 'warn');
      return;
    }

    setUploadingFiles(true);
    try {
      const tempId = product?.id || `temp-${Date.now()}`;
      const newUrls = await ImageUploadService.uploadMultipleImages(fileArray, tempId);

      setImageUrls(prev => {
        const cleaned = prev.filter(u => !u.includes('unsplash.com') || prev.length > 1);
        return [...cleaned, ...newUrls];
      });

      setPendingFiles(prev => [...prev, ...fileArray]);
      showToast(`Uploaded ${newUrls.length} image(s)`, 'success');
    } catch {
      showToast('Error uploading image files', 'warn');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImageUrls(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const removeImage = async (index: number) => {
    const targetUrl = imageUrls[index];
    if (targetUrl && targetUrl.includes('supabase.co')) {
      await ImageUploadService.deleteImage(targetUrl);
    }

    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);

    if (primaryImageIndex >= updated.length) {
      setPrimaryImageIndex(Math.max(0, updated.length - 1));
    }
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= imageUrls.length) return;
    const updated = [...imageUrls];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setImageUrls(updated);

    if (primaryImageIndex === from) setPrimaryImageIndex(to);
    else if (primaryImageIndex === to) setPrimaryImageIndex(from);
  };

  const setAsPrimary = (index: number) => {
    setPrimaryImageIndex(index);
    const updated = [...imageUrls];
    const [primary] = updated.splice(index, 1);
    updated.unshift(primary);
    setImageUrls(updated);
    setPrimaryImageIndex(0);
  };

  const toggleSize = (size: string) => {
    const current = formData.sizes || [];
    const updated = current.includes(size)
      ? current.filter(s => s !== size)
      : [...current, size];
    setFormData({ ...formData, sizes: updated });
  };

  const toggleColor = (c: { name: string; hex: string }) => {
    const current = formData.colors || [];
    const exists = current.some(col => col.name === c.name);
    const updated = exists
      ? current.filter(col => col.name !== c.name)
      : [...current, c];
    setFormData({ ...formData, colors: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please enter Product Name and Price');
      return;
    }

    if (imageUrls.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const primaryUrl = imageUrls[primaryImageIndex] || imageUrls[0];
      const secondUrl = imageUrls[1] || undefined;

      const finalProduct: Partial<Product> = {
        ...formData,
        image: primaryUrl,
        secondaryImage: secondUrl,
        images: imageUrls,
      };

      await StoreService.saveProduct(finalProduct);
      await refreshProducts();
      showToast(product ? 'Product updated successfully' : 'Product added to catalog', 'success');
      onSaved();
      onClose();
    } catch {
      showToast('Failed to save product', 'warn');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryValidationHint = () => {
    switch (formData.category) {
      case 'kurtis':
        return 'Kurti Image Requirement: Upload images clearly showcasing a Kurti, Kurta, Anarkali, or Ethnic Tunic.';
      case 'shawls':
        return 'Shawl Image Requirement: Upload images clearly showcasing a Kashmiri Shawl, Dupatta, or Ethnic Stole.';
      case 'leggings':
        return 'Leggings Image Requirement: Upload images clearly showcasing Ankle, Churidar, or Capri Leggings.';
      default:
        return 'Upload high-resolution ethnic fashion product images.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden">
          
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-[#EAE3D9] flex items-center justify-between bg-[#F5EBE6]">
            <div>
              <h3 className="font-bold text-base text-[#191E28] uppercase tracking-wider font-serif flex items-center gap-2">
                <Sparkles size={16} className="text-[#C27D6E]" />
                <span>{product ? 'Edit Product' : 'Add New Ethnic Product'}</span>
              </h3>
              <p className="text-xs text-[#555E6C]">
                Configure product catalog details for Kurtis, Shawls, or Leggings.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#191E28] hover:bg-[#EAD7CD] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
            
            {/* Section 1: Basic Information */}
            <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-[#A66355] text-[11px] border-b border-[#EAE3D9] pb-1">
                1. General Product Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#191E28] block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Embroidered Cotton Kurti"
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Category *</label>
                  <select
                    value={formData.category || 'kurtis'}
                    onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs font-semibold uppercase focus:ring-1 focus:ring-[#C27D6E]"
                  >
                    <option value="kurtis">Kurtis (Kurtas / Tunics)</option>
                    <option value="shawls">Shawls (Shawls / Dupattas)</option>
                    <option value="leggings">Leggings (Ankle / Churidar)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Sale / Original Price</label>
                  <input
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock ?? 20}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. KUR-001"
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#191E28] block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand || 'Viva Fashion'}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Viva Artisans"
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#191E28] block mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe fabric, weave, embroidery details..."
                    className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Product Image Upload Area */}
            <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-1">
                <h4 className="font-bold uppercase tracking-wider text-[#A66355] text-[11px]">
                  2. Product Images (Drag & Drop or File Upload)
                </h4>
                <span className="text-[10px] text-[#71717A]">
                  Supported: JPG, JPEG, PNG, WEBP (Max 5MB)
                </span>
              </div>

              {/* Category Image Validation Banner */}
              <div className="bg-[#FAF4EC] p-3 rounded-lg border border-[#DEC3B5]/60 flex items-start gap-2.5 text-xs text-[#555E6C]">
                <Info size={16} className="text-[#C27D6E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#191E28] block">Category Image Rule ({formData.category?.toUpperCase()})</strong>
                  <span>{getCategoryValidationHint()}</span>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-[#C27D6E] bg-[#F5EBE6]' : 'border-[#DEC3B5] bg-[#FAF7F2] hover:border-[#191E28]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFileSelect(e.target.files);
                  }}
                />

                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#DEC3B5] flex items-center justify-center mx-auto mb-2 text-[#C27D6E]">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-[#191E28]">
                  + Click to Upload Images from Computer
                </p>
                <p className="text-[10px] text-[#71717A] mt-0.5">
                  or drag and drop multiple image files here
                </p>

                {uploadingFiles && (
                  <div className="mt-2 text-xs font-semibold text-[#C27D6E] animate-pulse">
                    Uploading files to Supabase Storage...
                  </div>
                )}
              </div>

              {/* URL Input Fallback */}
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste image URL (e.g. Unsplash or CDN URL)"
                  className="flex-1 bg-[#FAF7F2] border border-[#DEC3B5] rounded px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="bg-[#FAF4EC] hover:bg-[#EAD7CD] text-[#191E28] border border-[#DEC3B5] px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Add URL
                </button>
              </div>

              {/* Uploaded Images Gallery List with Reordering & Thumbnail selection */}
              <div>
                <label className="font-bold text-[#191E28] block mb-2">
                  Image Gallery ({imageUrls.length} images) — Click star to set primary thumbnail
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, idx) => {
                    const isPrimary = idx === primaryImageIndex;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 bg-gray-50 transition-all ${
                          isPrimary ? 'border-[#C27D6E] shadow-md ring-2 ring-[#C27D6E]/30' : 'border-[#DEC3B5]'
                        }`}
                      >
                        <div className="aspect-[3/4] relative">
                          <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />

                          {/* Primary Badge */}
                          {isPrimary && (
                            <span className="absolute top-1.5 left-1.5 bg-[#C27D6E] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                              Primary Thumbnail
                            </span>
                          )}

                          {/* Top Controls */}
                          <div className="absolute top-1.5 right-1.5 flex gap-1">
                            <button
                              type="button"
                              onClick={() => setAsPrimary(idx)}
                              className={`p-1 rounded-full shadow transition-colors ${
                                isPrimary ? 'bg-[#C27D6E] text-white' : 'bg-white/90 text-[#191E28] hover:bg-white'
                              }`}
                              title="Set as main thumbnail image"
                            >
                              <Star size={12} className={isPrimary ? 'fill-white' : ''} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-1 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white shadow transition-colors"
                              title="Remove image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Reorder Arrows */}
                          <div className="absolute bottom-1.5 inset-x-1.5 flex justify-between">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, idx - 1)}
                              className="p-1 bg-black/60 text-white rounded hover:bg-black disabled:opacity-30"
                              title="Move left"
                            >
                              <ArrowLeft size={11} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === imageUrls.length - 1}
                              onClick={() => moveImage(idx, idx + 1)}
                              className="p-1 bg-black/60 text-white rounded hover:bg-black disabled:opacity-30"
                              title="Move right"
                            >
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Category-Specific Dynamic Product Attributes */}
            <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-[#A66355] text-[11px] border-b border-[#EAE3D9] pb-1">
                3. Category Attributes ({formData.category?.toUpperCase()})
              </h4>

              {formData.category === 'kurtis' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Fabric</label>
                    <input
                      type="text"
                      value={formData.fabric || ''}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="100% Breathable Cotton"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Fit</label>
                    <input
                      type="text"
                      value={formData.fit || ''}
                      onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                      placeholder="Straight Cut / A-Line"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Sleeve Type</label>
                    <input
                      type="text"
                      value={formData.sleeveType || ''}
                      onChange={(e) => setFormData({ ...formData, sleeveType: e.target.value })}
                      placeholder="3/4th Sleeves"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Kurti Length</label>
                    <input
                      type="text"
                      value={formData.length || ''}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      placeholder="Calf Length (44&quot;)"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Neck Type</label>
                    <input
                      type="text"
                      value={formData.neckType || ''}
                      onChange={(e) => setFormData({ ...formData, neckType: e.target.value })}
                      placeholder="Round / Mandarin"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Pattern</label>
                    <input
                      type="text"
                      value={formData.pattern || ''}
                      onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                      placeholder="Floral Handblock"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold text-[#191E28] block mb-1">Work / Embroidery</label>
                    <input
                      type="text"
                      value={formData.workEmbroidery || ''}
                      onChange={(e) => setFormData({ ...formData, workEmbroidery: e.target.value })}
                      placeholder="Zari & Thread Needlework"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}

              {formData.category === 'shawls' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Fabric</label>
                    <input
                      type="text"
                      value={formData.fabric || ''}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="Fine Merino Wool Blend"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Length / Dimensions</label>
                    <input
                      type="text"
                      value={formData.length || ''}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      placeholder="Full Size (2.2m x 1m)"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Pattern</label>
                    <input
                      type="text"
                      value={formData.pattern || ''}
                      onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                      placeholder="Traditional Paisley Aari Motif"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold text-[#191E28] block mb-1">Embroidery / Work</label>
                    <input
                      type="text"
                      value={formData.workEmbroidery || ''}
                      onChange={(e) => setFormData({ ...formData, workEmbroidery: e.target.value })}
                      placeholder="Intricate Multi-color Aari Embroidery"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Occasion</label>
                    <input
                      type="text"
                      value={formData.occasion || ''}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      placeholder="Evening & Winter Festive"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}

              {formData.category === 'leggings' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Fabric</label>
                    <input
                      type="text"
                      value={formData.fabric || ''}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="95% Combed Cotton, 5% Lycra"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Stretch Type</label>
                    <input
                      type="text"
                      value={formData.stretch || ''}
                      onChange={(e) => setFormData({ ...formData, stretch: e.target.value })}
                      placeholder="4-Way High Stretch"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Waist Type</label>
                    <input
                      type="text"
                      value={formData.waistType || ''}
                      onChange={(e) => setFormData({ ...formData, waistType: e.target.value })}
                      placeholder="Mid-Rise Comfort Band"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#191E28] block mb-1">Leggings Length</label>
                    <input
                      type="text"
                      value={formData.length || ''}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      placeholder="Ankle Length (38&quot;)"
                      className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Available Sizes & Colors */}
            <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-[#A66355] text-[11px] border-b border-[#EAE3D9] pb-1">
                4. Available Sizes & Colors
              </h4>

              <div>
                <label className="font-bold text-[#191E28] block mb-1.5">Select Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => {
                    const isSelected = (formData.sizes || []).includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 rounded font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-[#191E28] text-white border-[#191E28]'
                            : 'bg-[#FAF7F2] text-[#191E28] border-[#DEC3B5]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#191E28] block mb-1.5">Select Colors</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = (formData.colors || []).some(col => col.name === c.name);
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => toggleColor(c)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] ${
                          isSelected
                            ? 'border-[#C27D6E] bg-[#F5EBE6] font-bold'
                            : 'border-[#DEC3B5] bg-white'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                        {isSelected && <Check size={11} className="text-[#C27D6E]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 5: Badges & Display Flags */}
            <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[#A66355] text-[11px] border-b border-[#EAE3D9] pb-1">
                5. Display Flags
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isBestSeller)}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-[#C27D6E]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isNewArrival)}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-[#C27D6E]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#C27D6E]"
                  />
                  <span>Featured in Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isSale)}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="accent-[#C27D6E]"
                  />
                  <span>On Sale Discount</span>
                </label>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-[#DEC3B5] text-xs font-semibold text-[#191E28] hover:bg-[#EAD7CD]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md disabled:opacity-75"
              >
                {isSubmitting ? 'Saving to Catalog...' : product ? 'Save Product Changes' : 'Publish Product'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
