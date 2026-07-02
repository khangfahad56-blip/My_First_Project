import { body } from 'express-validator';

export const productRules = [
    body('category_id').optional({ nullable: true, checkFalsy: true }).isUUID(),
    body('name').isString().isLength({ min: 2, max: 180 }),
    body('slug').optional().isString().isLength({ min: 2, max: 200 }),
    body('description').optional({ nullable: true }).isString().isLength({ max: 3000 }),
    body('metal_type').optional({ nullable: true }).isString().isLength({ max: 80 }),
    body('weight_grams').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).toFloat(),
    body('purity').optional({ nullable: true }).isString().isLength({ max: 40 }),
    body('price_note').optional().isString().isLength({ max: 120 }),
    body('is_available').optional().isBoolean().toBoolean(),
    body('is_featured').optional().isBoolean().toBoolean()
];
