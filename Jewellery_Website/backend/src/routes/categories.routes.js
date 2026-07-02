import { Router } from 'express';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/categories.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { categoryRules, idParam } from '../validators/category.validators.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', listCategories);
categoriesRouter.post('/', requireAdmin, requireCsrf, sanitizeBody, categoryRules, validateRequest, createCategory);
categoriesRouter.put('/:id', requireAdmin, requireCsrf, sanitizeBody, idParam, categoryRules, validateRequest, updateCategory);
categoriesRouter.delete('/:id', requireAdmin, requireCsrf, idParam, validateRequest, deleteCategory);
