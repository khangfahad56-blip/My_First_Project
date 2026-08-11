import { body } from 'express-validator';

export const rateRules = [
    body('gold_24k').isFloat({ min: 0 }).toFloat(),
    body('gold_22k').isFloat({ min: 0 }).toFloat(),
    body('gold_21k').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).toFloat(),
    body('gold_18k').isFloat({ min: 0 }).toFloat(),
    body('silver').isFloat({ min: 0 }).toFloat(),
    body('rate_date').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate()
];
