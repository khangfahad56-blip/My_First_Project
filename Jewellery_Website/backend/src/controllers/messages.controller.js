import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

export const listMessages = asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
});

export const createMessage = asyncHandler(async (req, res) => {
    const { name, phone, email, subject, message } = req.body;
    const { rows } = await query(
        `INSERT INTO messages (name, phone, email, subject, message)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [name, phone, email || null, subject || null, message]
    );
    res.status(201).json({ success: true, data: rows[0] });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
    const { rows } = await query(
        'UPDATE messages SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [req.body.status, req.params.id]
    );
    await logActivity({ adminId: req.admin.id, action: 'message.status_update', entityType: 'message', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true, data: rows[0] });
});

export const deleteMessage = asyncHandler(async (req, res) => {
    await query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    await logActivity({ adminId: req.admin.id, action: 'message.delete', entityType: 'message', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true });
});
