import crypto from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

export const securityMiddleware = [
    helmet({
        contentSecurityPolicy: false
    }),
    cors({
        origin: env.appOrigin,
        credentials: true
    })
];

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
});

export const createCsrfToken = () => crypto.randomBytes(32).toString('hex');

export const requireCsrf = (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies?.csrfToken;
    const headerToken = req.get('x-csrf-token');

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        throw new ApiError(403, 'Invalid CSRF token');
    }

    next();
};
