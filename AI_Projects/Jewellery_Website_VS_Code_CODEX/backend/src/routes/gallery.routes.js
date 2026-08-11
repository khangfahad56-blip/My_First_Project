import { Router } from 'express';
import { createGalleryImage, deleteGalleryImage, listGallery } from '../controllers/gallery.controller.js';
import { upload } from '../config/upload.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { idParam } from '../validators/category.validators.js';
import { galleryRules } from '../validators/gallery.validators.js';

export const galleryRouter = Router();

galleryRouter.get('/', listGallery);
galleryRouter.post('/', requireAdmin, requireCsrf, upload.single('image'), sanitizeBody, galleryRules, validateRequest, createGalleryImage);
galleryRouter.delete('/:id', requireAdmin, requireCsrf, idParam, validateRequest, deleteGalleryImage);
