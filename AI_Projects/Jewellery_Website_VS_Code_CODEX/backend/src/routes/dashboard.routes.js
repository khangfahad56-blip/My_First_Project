import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { requireAdmin } from '../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', requireAdmin, getDashboard);
