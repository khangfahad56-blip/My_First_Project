import { transaction, query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

export const listOrders = asyncHandler(async (req, res) => {
    const { rows } = await query(
        `SELECT o.*, c.name AS customer_name, c.phone, c.email
         FROM orders o
         LEFT JOIN customers c ON c.id = o.customer_id
         ORDER BY o.created_at DESC`
    );
    res.json({ success: true, data: rows });
});

export const createOrder = asyncHandler(async (req, res) => {
    const data = req.body;
    const order = await transaction(async (client) => {
        const customerResult = await client.query(
            `INSERT INTO customers (name, phone, whatsapp, email, address, city)
             VALUES ($1,$2,$3,$4,$5,$6)
             ON CONFLICT (phone, email)
             DO UPDATE SET name = EXCLUDED.name, whatsapp = EXCLUDED.whatsapp, address = EXCLUDED.address, city = EXCLUDED.city, updated_at = NOW()
             RETURNING *`,
            [data.full_name || data.name, data.phone, data.whatsapp || data.phone, data.email || null, data.address || null, data.city || null]
        );
        const orderResult = await client.query(
            `INSERT INTO orders
             (customer_id, product_id, selected_product, quantity, special_instructions, budget, metal_type, delivery_preference, preferred_date, preferred_time)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING *`,
            [
                customerResult.rows[0].id,
                data.product_id || null,
                data.product_interest || data.selected_product,
                Number(data.quantity || 1),
                data.additional_notes || data.special_instructions || null,
                data.budget || null,
                data.metal_type || null,
                data.delivery_preference || null,
                data.preferred_date || null,
                data.preferred_time || null
            ]
        );

        return orderResult.rows[0];
    });

    res.status(201).json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { rows } = await query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [req.body.status, req.params.id]
    );
    await logActivity({ adminId: req.admin.id, action: 'order.status_update', entityType: 'order', entityId: req.params.id, metadata: { status: req.body.status }, ipAddress: req.ip });
    res.json({ success: true, data: rows[0] });
});

export const deleteOrder = asyncHandler(async (req, res) => {
    await query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    await logActivity({ adminId: req.admin.id, action: 'order.delete', entityType: 'order', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true });
});
