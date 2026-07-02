import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getDashboard = asyncHandler(async (req, res) => {
    const [products, orders, pendingOrders, messages, recentOrders, recentMessages] = await Promise.all([
        query('SELECT COUNT(*)::int AS count FROM products'),
        query('SELECT COUNT(*)::int AS count FROM orders'),
        query("SELECT COUNT(*)::int AS count FROM orders WHERE status = 'Pending'"),
        query('SELECT COUNT(*)::int AS count FROM messages'),
        query(`SELECT o.id, o.status, o.selected_product, o.created_at, c.name AS customer_name, c.phone
               FROM orders o
               LEFT JOIN customers c ON c.id = o.customer_id
               ORDER BY o.created_at DESC
               LIMIT 8`),
        query('SELECT id, name, phone, subject, status, created_at FROM messages ORDER BY created_at DESC LIMIT 8')
    ]);

    res.json({
        success: true,
        data: {
            stats: {
                products: products.rows[0].count,
                orders: orders.rows[0].count,
                pendingOrders: pendingOrders.rows[0].count,
                messages: messages.rows[0].count
            },
            recentOrders: recentOrders.rows,
            recentMessages: recentMessages.rows
        }
    });
});
