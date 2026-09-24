import { uploadToCloudinary, deleteFromCloudinary, ImageCategory } from '@/lib/cloudinary';

export const UploadService = {
  async uploadImage(
    fileBuffer: Buffer,
    fileName?: string,
    mimeType: string = 'image/jpeg',
    category: ImageCategory = 'general'
  ): Promise<{ url: string; public_id: string }> {
    const isCloudinaryConfigured = Boolean(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (!isCloudinaryConfigured) {
      throw new Error(
        'Cloudinary credentials (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing in environment configuration.'
      );
    }

    try {
      const result = await uploadToCloudinary(fileBuffer, { category });
      return result;
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      throw new Error(`Cloudinary upload failed: ${err?.message || 'Unknown Cloudinary error'}`);
    }
  },

  async deleteImage(publicId: string): Promise<boolean> {
    const isCloudinaryConfigured = Boolean(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (!isCloudinaryConfigured) {
      console.warn('Cloudinary not fully configured, skipping Cloudinary API deletion call.');
      return false;
    }

    try {
      await deleteFromCloudinary(publicId);
      return true;
    } catch (err: any) {
      console.error('Cloudinary delete error:', err);
      throw new Error(`Cloudinary deletion failed: ${err?.message || 'Unknown Cloudinary error'}`);
    }
  },
};

