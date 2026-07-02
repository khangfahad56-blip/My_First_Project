import { body } from 'express-validator';

export const orderRules = [
    body('full_name').optional().isString().isLength({ min: 2, max: 160 }),
    body('name').optional().isString().isLength({ min: 2, max: 160 }),
    body('phone').isString().matches(/^(\+92|0092|92|0)?3\d{9}$/),
    body('whatsapp').optional({ nullable: true, checkFalsy: true }).isString().isLength({ max: 40 }),
    body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail(),
    body('address').optional({ nullable: true }).isString().isLength({ max: 1000 }),
    body('city').optional({ nullable: true }).isString().isLength({ max: 120 }),
    body('product_id').optional({ nullable: true, checkFalsy: true }).isUUID(),
    body('product_interest').optional().isString().isLength({ max: 1000 }),
    body('selected_product').optional().isString().isLength({ max: 1000 }),
    body('quantity').optional().isInt({ min: 1 }).toInt(),
    body('additional_notes').optional({ nullable: true }).isString().isLength({ max: 2000 }),
    body('special_instructions').optional({ nullable: true }).isString().isLength({ max: 2000 }),
    body('preferred_date').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate()
];

export const statusRules = [
    body('status').isIn(['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'])
];
