import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';

export const requireAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;

        if (!token) {
            throw new ApiError(401, 'Authentication required');
        }

        const payload = jwt.verify(token, env.jwtSecret);
        const { rows } = await query(
            'SELECT id, name, email, role, is_active FROM admins WHERE id = $1 LIMIT 1',
            [payload.sub]
        );

        if (!rows[0] || !rows[0].is_active) {
            throw new ApiError(401, 'Invalid admin account');
        }

        req.admin = rows[0];
        next();
    } catch (error) {
        next(error.statusCode ? error : new ApiError(401, 'Invalid or expired session'));
    }
};
