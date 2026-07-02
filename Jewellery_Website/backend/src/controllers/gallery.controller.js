import fs from 'fs/promises';
import path from 'path';
import { query } from '../config/database.js';
import { publicUploadPath } from '../config/upload.js';
import { asyncHandler } from '../utils/async-handler.js';
import { logActivity } from '../services/activity-log.service.js';

export const listGallery = asyncHandler(async (req, res) => {
    const { rows } = await query(
        `SELECT g.*, c.name AS category_name, c.slug AS category_slug, p.name AS product_name
         FROM gallery_images g
         LEFT JOIN categories c ON c.id = g.category_id
         LEFT JOIN products p ON p.id = g.product_id
         ORDER BY g.sort_order ASC, g.created_at DESC`
    );
    res.json({ success: true, data: rows });
});

export const createGalleryImage = asyncHandler(async (req, res) => {
    const imageUrl = req.file ? publicUploadPath(req.file.filename) : req.body.image_url;
    const storageKey = req.file ? req.file.path : null;
    const { title, alt_text, product_id, category_id, is_featured = false, sort_order = 0 } = req.body;
    const { rows } = await query(
        `INSERT INTO gallery_images (title, alt_text, image_url, storage_key, product_id, category_id, is_featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [title, alt_text, imageUrl, storageKey, product_id || null, category_id || null, is_featured, sort_order]
    );

    await logActivity({ adminId: req.admin.id, action: 'gallery.create', entityType: 'gallery_image', entityId: rows[0].id, ipAddress: req.ip });
    res.status(201).json({ success: true, data: rows[0] });
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
    const { rows } = await query('DELETE FROM gallery_images WHERE id = $1 RETURNING storage_key', [req.params.id]);

    if (rows[0]?.storage_key) {
        await fs.unlink(path.resolve(rows[0].storage_key)).catch(() => null);
    }

    await logActivity({ adminId: req.admin.id, action: 'gallery.delete', entityType: 'gallery_image', entityId: req.params.id, ipAddress: req.ip });
    res.json({ success: true });
});
