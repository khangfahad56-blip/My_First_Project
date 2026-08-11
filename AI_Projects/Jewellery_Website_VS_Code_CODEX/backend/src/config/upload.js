import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from './env.js';
import { ApiError } from '../utils/api-error.js';

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, env.uploadDir),
    filename: (req, file, callback) => {
        const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        callback(null, `${Date.now()}-${safeName}`);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: env.maxUploadMb * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowed.includes(file.mimetype)) {
            return callback(new ApiError(400, 'Only JPG, PNG, and WebP images are allowed'));
        }

        callback(null, true);
    }
});

export const publicUploadPath = (filename) => `/uploads/${path.basename(filename)}`;
