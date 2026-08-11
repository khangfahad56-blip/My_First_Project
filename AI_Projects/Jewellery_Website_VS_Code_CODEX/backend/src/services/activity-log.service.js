import { query } from '../config/database.js';

export const logActivity = async ({ adminId, action, entityType, entityId, metadata, ipAddress }) => {
    await query(
        `INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, metadata, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adminId || null, action, entityType || null, entityId || null, metadata || null, ipAddress || null]
    );
};
