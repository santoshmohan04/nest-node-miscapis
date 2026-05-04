import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

// Multer file interface
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// File filter for images
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Only image files are allowed (jpeg, jpg, png, gif, webp)'),
      false
    );
  }
  callback(null, true);
};

// Storage configuration for recipe images
export const recipeImageStorage = diskStorage({
  destination: './uploads/recipes',
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// Helper function to get file URL
export const getFileUrl = (filename: string): string => {
  return `/uploads/recipes/${filename}`;
};

// Storage configuration for meal images
export const mealImageStorage = diskStorage({
  destination: './uploads/images',
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// Helper function to get meal image URL
export const getMealImageUrl = (filename: string): string => {
  return `/uploads/images/${filename}`;
};
