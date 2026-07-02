import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { authLimiter, requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { loginRules } from '../validators/auth.validators.js';

export const authRouter = Router();

authRouter.post('/login', authLimiter, sanitizeBody, loginRules, validateRequest, login);
authRouter.post('/logout', requireCsrf, logout);
authRouter.get('/me', requireAdmin, me);
