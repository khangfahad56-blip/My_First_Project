import { Router } from 'express';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../controllers/products.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { idParam } from '../validators/category.validators.js';
import { productRules } from '../validators/product.validators.js';

export const productsRouter = Router();

productsRouter.get('/', listProducts);
productsRouter.post('/', requireAdmin, requireCsrf, sanitizeBody, productRules, validateRequest, createProduct);
productsRouter.put('/:id', requireAdmin, requireCsrf, sanitizeBody, idParam, productRules, validateRequest, updateProduct);
productsRouter.delete('/:id', requireAdmin, requireCsrf, idParam, validateRequest, deleteProduct);
