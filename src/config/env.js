// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',

};

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY    = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;