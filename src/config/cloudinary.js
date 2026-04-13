// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './env.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryImage = async (url) => {
  if (!url) return;
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    if (matches?.[1]) {
      await cloudinary.uploader.destroy(matches[1]);
    }
  } catch {
    console.error(`[Cloudinary] Impossible de supprimer : ${url}`);
  }
};

export default cloudinary;
