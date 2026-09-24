import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export type ImageCategory = 'package' | 'banner' | 'icon' | 'prescription' | 'general';

export interface UploadOptions {
  category?: ImageCategory;
  folder?: string;
  resource_type?: 'image' | 'raw' | 'auto';
}

/**
 * Uploads an image buffer to Cloudinary with category-specific transformation rules:
 * - 'package': Resized (max 800x800) + WebP auto-format + quality compression for lightweight, fast-loading cards.
 * - 'banner': Preserves high resolution (up to 2560px) + auto:best quality for sharp banners and hero slides.
 * - 'icon': Preserves transparency and sharp edges for graphic cutouts.
 * - 'prescription': Retains full original document/image fidelity.
 * - 'general': Balanced auto-optimization.
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  options: UploadOptions | string = 'aicura'
) => {
  const opts: UploadOptions = typeof options === 'string' ? { folder: options } : options;
  const category = opts.category || 'general';
  const folder = opts.folder || (category === 'package'
    ? 'aicura-diagnostics/packages'
    : category === 'banner'
    ? 'aicura-diagnostics/banners'
    : category === 'icon'
    ? 'aicura-diagnostics/icons'
    : category === 'prescription'
    ? 'aicura-diagnostics/prescriptions'
    : 'aicura-diagnostics');

  let transformation: any[] | undefined = undefined;

  switch (category) {
    case 'package':
      // Optimized for package cards: limit width to 800px, auto-format to WebP, good quality compression
      transformation = [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ];
      break;
    case 'banner':
      // High-definition banner: keep up to 2560px width, crisp best quality, auto-format to WebP
      transformation = [
        {
          width: 2560,
          height: 1440,
          crop: 'limit',
          quality: 'auto:best',
          fetch_format: 'auto',
        },
      ];
      break;
    case 'icon':
      // Transparent cutouts and icons
      transformation = [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto:best',
          fetch_format: 'auto',
        },
      ];
      break;
    case 'prescription':
      // Raw documents/prescriptions - no lossy transformation
      transformation = undefined;
      break;
    default:
      // General balanced transformation
      transformation = [
        {
          width: 1920,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ];
      break;
  }

  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: opts.resource_type || (category === 'prescription' ? 'auto' : 'image'),
          transformation,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return new Promise<{ result: string }>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || !result) {
        return reject(error || new Error('Cloudinary delete failed'));
      }
      resolve(result);
    });
  });
};

/**
 * Utility to inject dynamic Cloudinary delivery transformations (WebP / AVIF auto-format and quality)
 * into any Cloudinary URL on the fly.
 */
export function getOptimizedCloudinaryUrl(
  url: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number;
    format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
    crop?: 'limit' | 'fill' | 'fit' | 'thumb' | 'scale';
  }
): string {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('res.cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const afterUpload = url.substring(uploadIndex + 8);
  // If URL already has explicit transformation parameters, return original
  if (
    afterUpload.startsWith('f_') ||
    afterUpload.startsWith('q_') ||
    afterUpload.startsWith('w_') ||
    afterUpload.startsWith('c_')
  ) {
    return url;
  }

  const quality = options?.quality || 'auto';
  const format = options?.format || 'auto';
  const crop = options?.crop || 'limit';

  const transformations: string[] = [`f_${format}`, `q_${quality}`];

  if (options?.width) {
    transformations.push(`w_${options.width}`);
    transformations.push(`c_${crop}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }

  return `${url.substring(0, uploadIndex + 8)}${transformations.join(',')}/${afterUpload}`;
}

