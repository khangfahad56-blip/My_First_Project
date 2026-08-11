import { body } from 'express-validator';

export const galleryRules = [
    body('title').isString().isLength({ min: 2, max: 180 }),
    body('alt_text').isString().isLength({ min: 2, max: 220 }),
    body('image_url').optional({ nullable: true, checkFalsy: true }).isString().isLength({ max: 1000 }),
    body('product_id').optional({ nullable: true, checkFalsy: true }).isUUID(),
    body('category_id').optional({ nullable: true, checkFalsy: true }).isUUID(),
    body('is_featured').optional().customSanitizer((value) => value === true || value === 'true' || value === 'on').isBoolean().toBoolean(),
    body('sort_order').optional().isInt({ min: 0 }).toInt()
];
