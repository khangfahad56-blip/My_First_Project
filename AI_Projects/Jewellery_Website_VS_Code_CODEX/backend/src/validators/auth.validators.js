import { body } from 'express-validator';

export const loginRules = [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8 })
];
