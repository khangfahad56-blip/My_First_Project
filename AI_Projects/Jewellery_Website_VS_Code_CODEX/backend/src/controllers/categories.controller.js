import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const listCategories = asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
    res.json({ success: true, data: rows });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name, description, is_active = true, sort_order = 0 } = req.body;
    const slug = req.body.slug || slugify(name);
    const { rows } = await query(
        `INSERT INTO categories (name, slug, description, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, slug, description || null, is_active, sort_order]
    );

    await logActivity({ adminId: req.admin.id, action: 'category.create', entityType: 'category', entityId: rows[0].id, ipAddress: req.ip });
    res.status(201).json({ success: true, data: rows[0] });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { name, description, is_active = true, sort_order = 0 } = req.body;
    const slug = req.body.slug || slugify(name);
    const { rows } = await query(
        `UPDATE categories
         SET name = $1, slug = $2, description = $3, is_active = $4, sort_order = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [name, slug, description || null, is_active, sort_order, req.params.id]
    );

    await logActivity({ adminId: req.admin.id, action: 'category.update', entityType: 'category', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true, data: rows[0] });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    await logActivity({ adminId: req.admin.id, action: 'category.delete', entityType: 'category', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true });
});
