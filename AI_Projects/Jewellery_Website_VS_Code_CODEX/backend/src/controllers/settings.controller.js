import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

export const listSettings = asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT setting_key, setting_value, value_type FROM website_settings ORDER BY setting_key ASC');
    res.json({ success: true, data: rows });
});

export const upsertSettings = asyncHandler(async (req, res) => {
    const entries = Object.entries(req.body.settings || {});

    for (const [key, value] of entries) {
        await query(
            `INSERT INTO website_settings (setting_key, setting_value, updated_by)
             VALUES ($1, $2, $3)
             ON CONFLICT (setting_key)
             DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
            [key, String(value), req.admin.id]
        );
    }

    await logActivity({ adminId: req.admin.id, action: 'settings.update', entityType: 'website_settings', ipAddress: req.ip });
    res.json({ success: true });
});
