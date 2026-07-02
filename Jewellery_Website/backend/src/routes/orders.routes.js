import { Router } from 'express';
import { createOrder, deleteOrder, listOrders, updateOrderStatus } from '../controllers/orders.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { idParam } from '../validators/category.validators.js';
import { orderRules, statusRules } from '../validators/order.validators.js';

export const ordersRouter = Router();

ordersRouter.post('/', sanitizeBody, orderRules, validateRequest, createOrder);
ordersRouter.get('/', requireAdmin, listOrders);
ordersRouter.patch('/:id/status', requireAdmin, requireCsrf, sanitizeBody, idParam, statusRules, validateRequest, updateOrderStatus);
ordersRouter.delete('/:id', requireAdmin, requireCsrf, idParam, validateRequest, deleteOrder);
