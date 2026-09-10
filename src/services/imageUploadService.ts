import { supabase } from '../lib/supabase';

const BUCKET_NAME = import.meta.env.VITE_STORAGE_BUCKET || 'product-images';
const MAX_FILE_SIZE_BYTES = parseInt(import.meta.env.VITE_STORAGE_FILE_SIZE_LIMIT || '5242880');

/**
 * Get the currently authenticated Supabase user.
 * Returns null if no active session (e.g. admin using only local auth).
 */
async function getSessionUser(): Promise<{ id: string; email?: string } | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export const ImageUploadService = {
  /**
   * Initialize the storage bucket if missing.
   * Note: listBuckets() requires service role key, not anon key
   */
  async ensureBucket(): Promise<boolean> {
    try {
      // Skip listBuckets check - requires service role key which client doesn't have
      // Bucket must exist in Supabase dashboard
      console.log(`Using bucket: "${BUCKET_NAME}" (must exist in Supabase)`);
      return true;
    } catch (err) {
      console.error('Error checking bucket:', err);
      return false;
    }
  },

  /**
   * Validate image file type and size.
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return { valid: false, error: 'Invalid file format. Please upload JPG, PNG, or WEBP images.' };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit. Please upload a smaller image.` };
    }
    return { valid: true };
  },

  /**
   * Legacy validator helper
   */
  isValidImageFile(file: File): boolean {
    return this.validateImageFile(file).valid;
  },

  /**
   * Upload a single file to Supabase Storage.
   * Returns genuine public URL or throws error if upload fails.
   */
  async uploadImage(file: File, productId: string): Promise<string> {
    const check = this.validateImageFile(file);
    if (!check.valid) {
      throw new Error(check.error || 'Invalid file.');
    }

    // ── Session guard ────────────────────────────────────────────────────────
    // RLS policies on storage.objects require an authenticated Supabase session.
    // If the admin is only locally authenticated (localStorage flag) but has no
    // Supabase JWT, every upload will be rejected with an RLS policy violation.
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      throw new Error(
        'Upload failed: Not signed in to Supabase. ' +
        'Please sign out and sign back in using your admin email and password. ' +
        'Local admin mode does not create a Supabase session — a real sign-in is required for Storage uploads.'
      );
    }
    console.log(`[ImageUpload] Session verified for user: ${sessionUser.email ?? sessionUser.id}`);
    // ─────────────────────────────────────────────────────────────────────────

    const timestamp = Date.now();
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    const filePath = `${productId}/${timestamp}_${safeName}`;

    try {
      console.log(`Uploading to bucket: ${BUCKET_NAME}, path: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        console.error('Supabase storage upload failed:', error);
        
        // RLS policy violation — most common cause for admins
        if (
          error.message.includes('row-level security') ||
          error.message.includes('policy') ||
          error.message.includes('403') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('security policy')
        ) {
          throw new Error(
            'Upload blocked by Supabase Storage RLS policy. ' +
            `Your profile (${sessionUser.email ?? sessionUser.id}) must have role="admin" and status="active" ` +
            'in the profiles table. Sign out, update your profile row in Supabase, then sign back in.'
          );
        }

        // Bucket missing
        if (
          error.message.includes('Bucket not found') ||
          error.message.includes('404') ||
          error.message.includes('not found')
        ) {
          throw new Error(
            `Storage bucket "${BUCKET_NAME}" does not exist. ` +
            `Create it in Supabase Dashboard → Storage → New bucket → name: "${BUCKET_NAME}" → Public ON.`
          );
        }
        
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase Storage.');
      }

      console.log('✅ Upload successful:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      throw err;
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
        const filePaths = files.map((f: any) => `${productId}/${f.name}`);
        await supabase.storage.from(BUCKET_NAME).remove(filePaths);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Create a local preview URL for instant UI feedback before upload.
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Revoke a blob preview URL to free browser memory.
   */
  revokePreviewUrl(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },
};

export async function handleImageFileUpload(file: File, folder = 'cms'): Promise<string> {
  return ImageUploadService.uploadImage(file, folder);
}
