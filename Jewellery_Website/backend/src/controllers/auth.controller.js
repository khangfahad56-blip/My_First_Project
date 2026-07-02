import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { createCsrfToken } from '../middleware/security.js';
import { logActivity } from '../services/activity-log.service.js';

const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.nodeEnv === 'production'
};

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { rows } = await query(
        'SELECT id, name, email, password_hash, role, is_active FROM admins WHERE email = $1 LIMIT 1',
        [email]
    );
    const admin = rows[0];

    if (!admin || !admin.is_active || !(await bcrypt.compare(password, admin.password_hash))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const token = jwt.sign({ sub: admin.id, role: admin.role }, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn
    });
    const csrfToken = createCsrfToken();

    await query('UPDATE admins SET last_login_at = NOW() WHERE id = $1', [admin.id]);
    await logActivity({
        adminId: admin.id,
        action: 'admin.login',
        entityType: 'admin',
        entityId: admin.id,
        ipAddress: req.ip
    });

    res.cookie('adminToken', token, cookieOptions);
    res.cookie('csrfToken', csrfToken, {
        sameSite: 'strict',
        secure: env.nodeEnv === 'production'
    });
    res.json({
        success: true,
        data: {
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            csrfToken
        }
    });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('adminToken');
    res.clearCookie('csrfToken');
    res.json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: {
            admin: req.admin
        }
    });
});
