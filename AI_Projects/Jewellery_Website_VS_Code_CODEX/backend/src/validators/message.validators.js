import { body } from 'express-validator';

export const messageRules = [
    body('name').isString().isLength({ min: 2, max: 160 }),
    body('phone').isString().matches(/^(\+92|0092|92|0)?3\d{9}$/),
    body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail(),
    body('subject').optional({ nullable: true }).isString().isLength({ max: 120 }),
    body('message').isString().isLength({ min: 5, max: 3000 })
];

export const messageStatusRules = [
    body('status').isIn(['Unread', 'Read', 'Archived'])
];
