import { validationResult } from 'express-validator';
import { ApiError } from '../utils/api-error.js';
import { cleanObject } from '../utils/sanitize.js';

export const sanitizeBody = (req, res, next) => {
    req.body = cleanObject(req.body);
    next();
};

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation failed', errors.array());
    }

    next();
};
