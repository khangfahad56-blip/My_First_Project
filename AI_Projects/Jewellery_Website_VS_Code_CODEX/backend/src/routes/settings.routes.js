import { Router } from 'express';
import { listSettings, upsertSettings } from '../controllers/settings.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody } from '../middleware/validate.js';

export const settingsRouter = Router();

settingsRouter.get('/', listSettings);
settingsRouter.put('/', requireAdmin, requireCsrf, sanitizeBody, upsertSettings);
