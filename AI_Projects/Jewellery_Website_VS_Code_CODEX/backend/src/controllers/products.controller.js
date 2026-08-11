import { query } from '../config/database.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const listProducts = asyncHandler(async (req, res) => {
    const { rows } = await query(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         ORDER BY p.created_at DESC`
    );
    res.json({ success: true, data: rows });
});

export const createProduct = asyncHandler(async (req, res) => {
    const {
        category_id, name, description, metal_type, weight_grams, purity,
        price_note = 'Contact for Price', is_available = true, is_featured = false
    } = req.body;
    const slug = req.body.slug || slugify(name);
    const { rows } = await query(
        `INSERT INTO products
         (category_id, name, slug, description, metal_type, weight_grams, purity, price_note, is_available, is_featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [category_id || null, name, slug, description || null, metal_type || null, weight_grams || null, purity || null, price_note, is_available, is_featured]
    );

    await logActivity({ adminId: req.admin.id, action: 'product.create', entityType: 'product', entityId: rows[0].id, ipAddress: req.ip });
    res.status(201).json({ success: true, data: rows[0] });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const {
        category_id, name, description, metal_type, weight_grams, purity,
        price_note = 'Contact for Price', is_available = true, is_featured = false
    } = req.body;
    const slug = req.body.slug || slugify(name);
    const { rows } = await query(
        `UPDATE products
         SET category_id=$1, name=$2, slug=$3, description=$4, metal_type=$5, weight_grams=$6,
             purity=$7, price_note=$8, is_available=$9, is_featured=$10, updated_at=NOW()
         WHERE id=$11
         RETURNING *`,
        [category_id || null, name, slug, description || null, metal_type || null, weight_grams || null, purity || null, price_note, is_available, is_featured, req.params.id]
    );

    await logActivity({ adminId: req.admin.id, action: 'product.update', entityType: 'product', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true, data: rows[0] });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    await logActivity({ adminId: req.admin.id, action: 'product.delete', entityType: 'product', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true });
});
