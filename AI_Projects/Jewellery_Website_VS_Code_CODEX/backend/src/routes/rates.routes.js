import { Router } from 'express';
import { getLatestRates, updateRates } from '../controllers/rates.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { rateRules } from '../validators/rate.validators.js';

export const ratesRouter = Router();

ratesRouter.get('/latest', getLatestRates);
ratesRouter.post('/', requireAdmin, requireCsrf, sanitizeBody, rateRules, validateRequest, updateRates);
