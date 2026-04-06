// src/services/cloudinary.service.js
import cloudinary from '../config/cloudinary.js';
import { config } from '../config/env.js';

const ensureCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    const err = new Error(
      'La configuration Cloudinary est incomplète. Vérifiez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.'
    );
    err.statusCode = 500;
    throw err;
  }
};

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    stream.end(buffer);
  });

export const cloudinaryService = {
  uploadImage: async (file, folder) => {
    if (!file?.buffer) {
      return null;
    }

    ensureCloudinaryConfigured();

    const result = await uploadBuffer(file.buffer, folder);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  },

  deleteImage: async (publicId) => {
    if (!publicId) {
      return null;
    }

    ensureCloudinaryConfigured();

    return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  },
};
