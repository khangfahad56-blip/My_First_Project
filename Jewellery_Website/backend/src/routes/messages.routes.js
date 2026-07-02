import { Router } from 'express';
import { createMessage, deleteMessage, listMessages, updateMessageStatus } from '../controllers/messages.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/security.js';
import { sanitizeBody, validateRequest } from '../middleware/validate.js';
import { idParam } from '../validators/category.validators.js';
import { messageRules, messageStatusRules } from '../validators/message.validators.js';

export const messagesRouter = Router();

messagesRouter.post('/', sanitizeBody, messageRules, validateRequest, createMessage);
messagesRouter.get('/', requireAdmin, listMessages);
messagesRouter.patch('/:id/status', requireAdmin, requireCsrf, sanitizeBody, idParam, messageStatusRules, validateRequest, updateMessageStatus);
messagesRouter.delete('/:id', requireAdmin, requireCsrf, idParam, validateRequest, deleteMessage);
