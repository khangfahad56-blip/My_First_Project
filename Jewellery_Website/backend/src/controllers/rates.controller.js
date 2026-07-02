import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

export const getLatestRates = asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT * FROM gold_rates ORDER BY updated_at DESC LIMIT 1');
    res.json({ success: true, data: rows[0] || null });
});

export const updateRates = asyncHandler(async (req, res) => {
    const { gold_24k, gold_22k, gold_21k, gold_18k, silver, rate_date } = req.body;
    const { rows } = await query(
        `INSERT INTO gold_rates (gold_24k, gold_22k, gold_21k, gold_18k, silver, rate_date, updated_by)
         VALUES ($1,$2,$3,$4,$5,COALESCE($6, CURRENT_DATE),$7)
         RETURNING *`,
        [gold_24k, gold_22k, gold_21k || null, gold_18k, silver, rate_date || null, req.admin.id]
    );

    await logActivity({ adminId: req.admin.id, action: 'rates.update', entityType: 'gold_rates', entityId: rows[0].id, ipAddress: req.ip });
    res.status(201).json({ success: true, data: rows[0] });
});
