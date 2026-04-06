// src/middlewares/upload.js
import multer from 'multer';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    const err = new Error('Seuls les fichiers JPEG et PNG sont autorisés.');
    err.statusCode = 400;
    return cb(err, false);
  }

  return cb(null, true);
};

export const uploadSingleImage = (fieldName) =>
  multer({
    storage,
    limits: { fileSize: MAX_IMAGE_SIZE },
    fileFilter,
  }).single(fieldName);

export { MAX_IMAGE_SIZE, ALLOWED_IMAGE_MIME_TYPES };
