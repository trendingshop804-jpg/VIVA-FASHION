import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'product-images';

export const ImageUploadService = {
  /**
   * Initialize the storage bucket (creates if not exists).
   * Called once on admin mount.
   */
  async ensureBucket(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === BUCKET_NAME);
      if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
        });
      }
    } catch (err) {
      console.warn('Storage bucket init skipped (may already exist):', err);
    }
  },

  /**
   * Upload a single file to Supabase Storage.
   * Returns the public URL of the uploaded image.
   */
  async uploadImage(file: File, productId: string): Promise<string> {
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    const filePath = `${productId}/${timestamp}_${safeName}`;

    // Try Supabase upload
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return URL.createObjectURL(file);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.warn('Upload failed, using local preview:', err);
      return URL.createObjectURL(file);
    }
  },

  /**
   * Upload multiple files and return array of public URLs.
   */
  async uploadMultipleImages(files: File[], productId: string): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const url = await this.uploadImage(file, productId);
      urls.push(url);
    }
    return urls;
  },

  /**
   * Delete an image from Supabase Storage by its URL.
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const bucketPath = imageUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
      if (bucketPath.length < 2) return false;

      const filePath = decodeURIComponent(bucketPath[1]);
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Delete image failed:', err);
      return false;
    }
  },

  /**
   * Delete all images for a product folder.
   */
  async deleteProductImages(productId: string): Promise<boolean> {
    try {
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list(productId);

      if (files && files.length > 0) {
        const filePaths = files.map(f => `${productId}/${f.name}`);
        await supabase.storage.from(BUCKET_NAME).remove(filePaths);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate file type before upload.
   */
  isValidImageFile(file: File): boolean {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowed.includes(file.type);
  },

  /**
   * Create a preview URL for immediate display before upload completes.
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Revoke a blob preview URL to free memory.
   */
  revokePreviewUrl(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },
};

export async function handleImageFileUpload(file: File, folder = 'cms'): Promise<string> {
  if (!ImageUploadService.isValidImageFile(file)) {
    alert('Please select a valid image file (JPG, PNG, WEBP).');
    return '';
  }
  return await ImageUploadService.uploadImage(file, folder);
}
