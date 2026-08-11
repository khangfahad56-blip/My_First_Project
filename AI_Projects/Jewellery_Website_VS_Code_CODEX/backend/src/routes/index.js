import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { categoriesRouter } from './categories.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { galleryRouter } from './gallery.routes.js';
import { messagesRouter } from './messages.routes.js';
import { ordersRouter } from './orders.routes.js';
import { productsRouter } from './products.routes.js';
import { ratesRouter } from './rates.routes.js';
import { settingsRouter } from './settings.routes.js';

export const router = Router();

router.get('/health', (req, res) => {
    res.json({ success: true, status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/gallery', galleryRouter);
router.use('/orders', ordersRouter);
router.use('/messages', messagesRouter);
router.use('/rates', ratesRouter);
router.use('/settings', settingsRouter);
