import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = 'aicura') => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'auto',
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

