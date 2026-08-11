import { body, param } from 'express-validator';

export const idParam = [param('id').isUUID()];

export const categoryRules = [
    body('name').isString().isLength({ min: 2, max: 120 }),
    body('slug').optional().isString().isLength({ min: 2, max: 140 }),
    body('description').optional({ nullable: true }).isString().isLength({ max: 1000 }),
    body('is_active').optional().isBoolean().toBoolean(),
    body('sort_order').optional().isInt({ min: 0 }).toInt()
];
